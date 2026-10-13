"""Import already researched records. Default is dry-run; no scraping or network access."""
import argparse
from collections import Counter
import hashlib
import json
import os
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from catalog_validation import item_errors, validate_catalog, validate_affiliate_config


def plan(existing, batch, root, tag, permissions):
    if batch.get('schemaVersion') != 1 or not isinstance(batch.get('items'), list):
        raise ValueError('Batch must contain schemaVersion 1 and an items array')
    validate_catalog(existing, root, tag, permissions)
    ids = {p['id'] for p in existing['items']}
    asins = {p.get('asin') for p in existing['items'] if p.get('asin')}
    batch_ids = Counter(p.get('id') for p in batch['items'] if isinstance(p, dict) and isinstance(p.get('id'), str))
    batch_asins = Counter(p.get('asin') for p in batch['items'] if isinstance(p, dict) and isinstance(p.get('asin'), str))
    accepted, rejected = [], []
    for item in batch['items']:
        errors = item_errors(item, root, tag, permissions, require_evidence=True)
        if isinstance(item, dict):
            if isinstance(item.get('id'), str) and (item.get('id') in ids or batch_ids[item.get('id')] > 1):
                errors.append('Duplicate ID in existing catalog or batch')
            if isinstance(item.get('asin'), str) and (item.get('asin') in asins or batch_asins[item.get('asin')] > 1):
                errors.append('Duplicate ASIN in existing catalog or batch')
        if errors:
            rejected.append({'id': item.get('id') if isinstance(item, dict) else None, 'errors': errors})
        else:
            accepted.append(item)
    return accepted, rejected


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('batch', type=Path)
    parser.add_argument('--apply', action='store_true', help='Append only accepted records atomically')
    parser.add_argument('--report', type=Path, required=True, help='JSON report outside the public site data directory')
    args = parser.parse_args()
    catalog_path = ROOT / 'data/catalog.json'
    config = json.loads((ROOT / 'data/site.json').read_text(encoding='utf-8'))
    validate_affiliate_config(config)
    permissions_path = ROOT / 'data/image-permissions.json'
    permissions = json.loads(permissions_path.read_text(encoding='utf-8')) if permissions_path.exists() else {}
    original = catalog_path.read_bytes()
    existing = json.loads(original)
    batch = json.loads(args.batch.read_text(encoding='utf-8-sig'))
    accepted, rejected = plan(existing, batch, ROOT, config['affiliate']['associateTag'], permissions)
    if ROOT in args.report.resolve().parents:
        raise ValueError('Save import reports outside the published site directory')
    if args.report.resolve() == args.batch.resolve():
        raise ValueError('Report must not overwrite the researched batch')
    report = {'mode': 'applied' if args.apply else 'dry-run', 'catalogBefore': len(existing['items']), 'accepted': [p['id'] for p in accepted], 'rejected': rejected, 'catalogAfter': len(existing['items']) + (len(accepted) if args.apply else 0), 'originalSha256': hashlib.sha256(original).hexdigest(), 'note': 'Technical validation only. Source facts, ASIN identity and photo permission require documented editorial review; this does not confirm Amazon commission attribution.'}
    if args.apply and accepted:
        updated = {**existing, 'items': existing['items'] + accepted}
        validate_catalog(updated, ROOT, config['affiliate']['associateTag'], permissions)
        backup = ROOT.parent / 'operations/private/catalog-backups' / (report['originalSha256'] + '.json')
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            backup.write_bytes(original)
        temp = catalog_path.with_suffix('.json.tmp')
        try:
            temp.write_text(json.dumps(updated, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
            if catalog_path.read_bytes() != original:
                raise ValueError('Catalog changed during import; retry against the current file')
            os.replace(temp, catalog_path)
        finally:
            if temp.exists():
                temp.unlink()
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(json.dumps({'mode': report['mode'], 'accepted': len(accepted), 'rejected': len(rejected), 'catalogAfter': report['catalogAfter']}))
    return 2 if rejected else 0


if __name__ == '__main__':
    sys.exit(main())
