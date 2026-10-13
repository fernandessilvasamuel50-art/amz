"""Local publication checks. Evidence must be researched by a human; no network calls."""
import hashlib
import re
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

CC_LICENSES = {
    'https://creativecommons.org/licenses/by/2.0',
    'https://creativecommons.org/licenses/by/4.0',
    'https://creativecommons.org/licenses/by-sa/2.0',
    'https://creativecommons.org/licenses/by-sa/3.0',
    'https://creativecommons.org/licenses/by-sa/4.0',
    'https://creativecommons.org/publicdomain/zero/1.0',
    'https://creativecommons.org/publicdomain/zero/1.0/deed.en',
}
CATEGORIES = {'kitchen', 'home', 'organization', 'tech', 'pets', 'gifts'}
STYLES = {'minimalist', 'modern', 'cozy', 'budget-friendly', 'space-saving', 'gift-ideas'}
PRIORITIES = {'saving-money', 'small-spaces', 'everyday-convenience', 'aesthetic-design', 'gift-giving'}

# Owner-confirmed account mapping, not inferred from the ambiguous '-20' suffix.
US_ASSOCIATE_TAG = 'pickpop-20'


def validate_affiliate_config(config):
    affiliate = config.get('affiliate', {})
    if (affiliate.get('marketplace') != 'US' or
            affiliate.get('retailerHost') != 'www.amazon.com' or
            affiliate.get('associateTag') != US_ASSOCIATE_TAG):
        raise ValueError('Amazon.com requires the confirmed US account tag pickpop-20; Brazil pickpop03-20 is not valid here')


def https_url(value):
    if not isinstance(value, str) or any(c.isspace() for c in value):
        return False
    try:
        url = urlparse(value)
        return url.scheme == 'https' and bool(url.hostname) and not url.username and not url.password
    except ValueError:
        return False


def valid_date(value):
    try:
        return isinstance(value, str) and date.fromisoformat(value).isoformat() == value and date.fromisoformat(value) <= date.today()
    except (ValueError, TypeError):
        return False


def strings(value, nonempty=True):
    return isinstance(value, list) and (bool(value) or not nonempty) and all(isinstance(v, str) and v.strip() for v in value)


def webp_dimensions(data):
    if len(data) < 30 or data[:4] != b'RIFF' or data[8:12] != b'WEBP' or int.from_bytes(data[4:8], 'little') != len(data) - 8:
        return None
    kind = data[12:16]
    if kind == b'VP8X':
        return 1 + int.from_bytes(data[24:27], 'little'), 1 + int.from_bytes(data[27:30], 'little')
    if kind == b'VP8 ' and data[23:26] == b'\x9d\x01\x2a':
        return int.from_bytes(data[26:28], 'little') & 0x3fff, int.from_bytes(data[28:30], 'little') & 0x3fff
    if kind == b'VP8L' and data[20] == 0x2f:
        bits = int.from_bytes(data[21:25], 'little')
        return (bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1
    return None


def item_errors(item, root, tag, permissions=None, require_evidence=False):
    errors = []
    if tag != US_ASSOCIATE_TAG:
        errors.append('Amazon.com requires the confirmed US tag pickpop-20')
    if not isinstance(item, dict):
        return ['Product must be an object']
    for field in ['id', 'name', 'brand', 'model', 'description', 'tags', 'search', 'chip', 'emoji', 'retailerName']:
        if not isinstance(item.get(field), str) or not item[field].strip():
            errors.append('Missing text: ' + field)
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', str(item.get('id', ''))):
        errors.append('Invalid product ID')
    if item.get('category') not in CATEGORIES or not re.fullmatch(r'#[0-9a-fA-F]{6}', str(item.get('color', ''))):
        errors.append('Invalid category or color')
    for field, allowed in [('styles', STYLES), ('priorities', PRIORITIES)]:
        values = item.get(field)
        if not strings(values, False) or not all(v in allowed for v in values):
            errors.append('Invalid ' + field)
    for field in ['benefits', 'features', 'considerations']:
        if not strings(item.get(field)):
            errors.append('Missing factual/editorial list: ' + field)
    if item.get('price') is not None or item.get('planningBudget') is not None:
        errors.append('No authorized current price source is configured')
    asin = item.get('asin')
    destination = 'https://www.amazon.com/dp/' + str(asin)
    if not isinstance(asin, str) or not re.fullmatch(r'[A-Z0-9]{10}', asin):
        errors.append('Invalid ASIN')
    if item.get('productUrl') != destination:
        errors.append('Amazon URL must match the ASIN exactly')
    if item.get('affiliateUrl') != destination + '?tag=' + tag:
        errors.append('Affiliate URL must match the ASIN and configured tag')
    review = item.get('verification') if isinstance(item.get('verification'), dict) else {}
    if review.get('status') != 'verified' or not valid_date(review.get('reviewedAt')) or not strings(review.get('sources')) or not all(https_url(s) for s in review.get('sources', [])) or destination not in review.get('sources', []):
        errors.append('Missing verified identity sources or valid review date')
    paid = item.get('affiliateVerification') if isinstance(item.get('affiliateVerification'), dict) else {}
    if paid.get('status') not in ['owner-provided', 'owner-tag-confirmed'] or not valid_date(paid.get('reviewedAt')) or not paid.get('method'):
        errors.append('Missing affiliate review record')
    image = item.get('image') if isinstance(item.get('image'), dict) else {}
    if image.get('type') != 'photo' or image.get('authorized') is not True or image.get('variantReviewed') is not True:
        errors.append('A licensed photograph of the exact variant is required')
    for field in ['author', 'license', 'licenseUrl', 'source', 'originalUrl', 'changes', 'alt']:
        if not isinstance(image.get(field), str) or not image[field].strip():
            errors.append('Missing photo field: ' + field)
    for field in ['source', 'licenseUrl', 'originalUrl']:
        if not https_url(image.get(field)):
            errors.append('Invalid photo URL: ' + field)
    if any(not isinstance(image.get(k), int) or isinstance(image.get(k), bool) or image[k] < 1 for k in ['width', 'height']):
        errors.append('Invalid photo dimensions')
    src = image.get('src', '')
    asset = None
    if not isinstance(src, str) or not re.fullmatch(r'/assets/products/[a-z0-9-]+\.webp', src):
        errors.append('Unsafe or unsupported photo path')
    else:
        asset = Path(root) / src.lstrip('/')
        if not asset.resolve().is_relative_to(Path(root).resolve()) or not asset.is_file():
            errors.append('Photo file is missing')
        else:
            data = asset.read_bytes()
            if webp_dimensions(data) != (image.get('width'), image.get('height')):
                errors.append('Photo must be a WebP with the recorded dimensions')
    permission_id = image.get('permissionId')
    if permission_id:
        grant = (permissions or {}).get('permissions', {}).get(str(permission_id), {})
        approved = grant.get('assets', {}).get(src, {})
        if grant.get('status') != 'reviewed' or grant.get('affiliateUseAuthorized') is not True or not grant.get('affiliateUseEvidence') or grant.get('scope') != 'editorial-coverage' or not valid_date(grant.get('reviewedAt')) or image.get('licenseUrl') != grant.get('source') or image.get('author') != grant.get('attribution') or approved.get('source') != image.get('source') or not approved.get('variantEvidence') or not asset or not asset.is_file() or hashlib.sha256(asset.read_bytes()).hexdigest() != approved.get('sha256'):
            errors.append('Photo is not bound to a reviewed permission and exact approved asset')
    elif image.get('licenseUrl', '').rstrip('/') not in CC_LICENSES:
        errors.append('Unsupported image license; noncommercial/unknown licenses cannot be published')
    if require_evidence:
        evidence = review.get('identityEvidence') if isinstance(review.get('identityEvidence'), dict) else {}
        for field in ['amazonTitle', 'manufacturerModel', 'variantMatch', 'photoMatch']:
            if not isinstance(evidence.get(field), str) or not evidence[field].strip():
                errors.append('Missing researched identity evidence: ' + field)
        if evidence.get('amazonTitle') != item.get('retailerName'):
            errors.append('Amazon identity evidence must match the recorded retailer title')
    return errors


def validate_catalog(data, root, tag, permissions=None):
    if tag != US_ASSOCIATE_TAG:
        raise ValueError('Amazon.com requires the confirmed US tag pickpop-20')
    if data.get('schemaVersion') != 1 or not isinstance(data.get('items'), list):
        raise ValueError('Unsupported catalog')
    ids, asins = set(), set()
    for item in data['items']:
        if not isinstance(item, dict) or not isinstance(item.get('verification'), dict):
            raise ValueError('Invalid catalog record or verification')
        if item['verification'].get('status') != 'verified':
            continue  # Existing prototype validation remains in the build and browser.
        image = item.get('image') if isinstance(item.get('image'), dict) else {}
        errors = item_errors(item, root, tag, permissions, bool(image.get('permissionId')))
        if (isinstance(item.get('id'), str) and item['id'] in ids) or (isinstance(item.get('asin'), str) and item['asin'] in asins):
            errors.append('Duplicate product ID or ASIN')
        if errors:
            raise ValueError(str(item.get('id', '?')) + ': ' + '; '.join(errors))
        ids.add(item['id'])
        asins.add(item['asin'])
