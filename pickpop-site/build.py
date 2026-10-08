"""Generate crawlable pages and a clean static artifact. Python standard library only."""
import html
import json
import re
import shutil
from pathlib import Path
from urllib.parse import urlencode, urlparse

ROOT = Path(__file__).resolve().parent
TEMPLATES = ROOT / 'templates'
DIST = ROOT / 'dist'
CONFIG = json.loads((ROOT / 'data/site.json').read_text(encoding='utf-8'))
CATALOG = json.loads((ROOT / 'data/catalog.json').read_text(encoding='utf-8'))
ORIGIN = CONFIG['origin'].rstrip('/')
PAGES = {}
INDEXABLE = []
ESC = html.escape
LABELS = {'minimalist': 'Minimalist', 'modern': 'Modern', 'cozy': 'Cozy', 'budget-friendly': 'Budget-friendly', 'space-saving': 'Space-saving', 'gift-ideas': 'Gift ideas'}


def source(name):
    return (TEMPLATES / name).read_text(encoding='utf-8')


def validate():
    if urlparse(ORIGIN).scheme != 'https' or CONFIG['locale'] != 'en-US':
        raise ValueError('Configure an HTTPS canonical origin and en-US locale')
    email = CONFIG.get('contactEmail')
    if email and not re.fullmatch(r'[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+', email):
        raise ValueError('Invalid public contact email')
    affiliate = CONFIG['affiliate']
    if affiliate['enabled'] and (not affiliate['approved'] or not affiliate['associateTag']):
        raise ValueError('Affiliate mode requires confirmed approval and an owner-provided tag')
    if CONFIG['amazonContent']['enabled']:
        raise ValueError('Live Amazon content is disabled until a server-side adapter is implemented')
    if CONFIG['analytics']['enabled']:
        raise ValueError('External analytics needs an approved consent-aware adapter')
    if CATALOG['schemaVersion'] != 1 or not isinstance(CATALOG['items'], list):
        raise ValueError('Invalid catalog version')
    ids = set()
    for item in CATALOG['items']:
        if not re.fullmatch(r'[a-z0-9-]+', item['id']) or item['id'] in ids:
            raise ValueError('Invalid or duplicate catalog ID')
        ids.add(item['id'])
        if item['category'] not in ['kitchen', 'home', 'tech', 'pets', 'gifts'] or not re.fullmatch(r'#[0-9a-fA-F]{6}', item['color']):
            raise ValueError('Invalid catalog presentation')
        if not all(style in LABELS for style in item['styles']):
            raise ValueError('Invalid style tag')
        if item['verification']['status'] not in ['demo', 'verified']:
            raise ValueError('Invalid verification status')
        if item['verification']['status'] == 'demo' and any(item.get(key) for key in ['price', 'asin', 'productUrl', 'affiliateUrl', 'benefits', 'features']):
            raise ValueError('Demo items must not claim real product data')
        if item['verification']['status'] == 'verified' and (not item['verification']['sources'] or not item['verification']['reviewedAt']):
            raise ValueError('Verified items require factual sources and review date')


def safe_destination(item):
    if item['verification']['status'] == 'verified':
        for key in ['affiliateUrl', 'productUrl']:
            value = item.get(key)
            if not value:
                continue
            url = urlparse(value)
            if url.scheme != 'https' or url.hostname not in ['amazon.com', 'www.amazon.com', 'amzn.to'] or url.username or url.password:
                raise ValueError('Invalid Amazon destination')
            paid = key == 'affiliateUrl'
            if paid and CONFIG['affiliate']['enabled'] and item.get('affiliateVerification', {}).get('status') == 'owner-provided':
                from urllib.parse import parse_qs
                if url.hostname == 'amzn.to' or parse_qs(url.query).get('tag') == [CONFIG['affiliate']['associateTag']]:
                    return value, True, 'View on Amazon'
            if not paid and url.hostname != 'amzn.to' and 'tag=' not in url.query:
                return value, False, 'View on Amazon'
    return 'https://www.amazon.com/s?' + urlencode({'k': item['search']}), False, 'Search on Amazon'


def intro(title, description, overline='THE GOOD STUFF', extra=''):
    return f'<section class="shell page-shell page-intro"><p class="overline">{ESC(overline)}</p><h1>{title}</h1><p>{description}</p>{extra}</section>'


def page(route, title, description, content, interactive=False, index=True, kind='website', schema=None):
    canonical = ORIGIN + route
    metadata = [schema] if schema else []
    if route == '/':
        metadata.append({'@context': 'https://schema.org', '@type': 'WebSite', 'name': 'PickPop', 'url': ORIGIN + '/', 'inLanguage': 'en-US'})
    if route != '/' and index:
        metadata.append({'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': ORIGIN + '/'},
            {'@type': 'ListItem', 'position': 2, 'name': title.split(' | ')[0], 'item': canonical}
        ]})
    structured = '\n'.join('<script type="application/ld+json">' + json.dumps(value, ensure_ascii=False).replace('<', '\\u003c') + '</script>' for value in metadata)
    script = '<script type="module" src="/assets/js/app.js"></script>' if interactive else '<script type="module" src="/assets/js/page-events.js"></script>'
    document = f'''<!doctype html>
<html lang="en-US"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#fffaf3">
<title>{ESC(title)}</title><meta name="description" content="{ESC(description, quote=True)}">
<link rel="canonical" href="{ESC(canonical, quote=True)}"><meta name="robots" content="{'index,follow' if index else 'noindex,follow'}">
<meta property="og:title" content="{ESC(title, quote=True)}"><meta property="og:description" content="{ESC(description, quote=True)}"><meta property="og:type" content="{kind}"><meta property="og:url" content="{canonical}"><meta property="og:locale" content="en_US"><meta property="og:site_name" content="PickPop">
<meta property="og:image" content="{ORIGIN}/assets/social-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="PickPop. Good finds. Better budgets."><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="/assets/fonts/outfit.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/dm-sans.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/styles.css"><link rel="stylesheet" href="/assets/css/platform.css">
<script defer src="/assets/js/navigation.js"></script>{script}{structured}
</head><body><a class="skip-link" href="#main">Skip to content</a><div class="topline"><span>✷ YOUR TASTE. YOUR SPACE. YOUR BUDGET.</span><span class="topline-right">GOOD FINDS START WITH YOU ↗</span></div>
{source('header.html')}<main id="main">{content}</main>{source('footer.html')}</body></html>'''
    path = 'index.html' if route == '/' else route.lstrip('/') + ('index.html' if route.endswith('/') else '')
    PAGES[path] = document
    if index:
        INDEXABLE.append(canonical)


def static_card(item):
    return f'''<article class="collection-idea"><span class="collection-icon" aria-hidden="true">{ESC(item['emoji'])}</span><div><span class="product-category">Example {ESC(item['category'])} idea</span><h3><a href="/ideas/{item['id']}/">{ESC(item['name'])}</a></h3><p>{ESC(item['description'])}</p><a class="text-link" href="/ideas/{item['id']}/">What to consider →</a></div></article>'''


def generate():
    finder, results, quiz = source('finder.html'), source('results.html'), source('quiz.html')
    home = source('home.html').replace('<!-- FINDER -->', finder).replace('<!-- RESULTS -->', results).replace('<!-- QUIZ -->', quiz)
    page('/', 'PickPop — Good finds. Better budgets.', 'Discover thoughtful shopping ideas, match your style and budget, and explore useful guides for home, kitchen, tech, pets, and gifts.', home, interactive=True)
    page('/find/', 'Find Products by Style & Budget | PickPop', 'Search the PickPop idea catalog by keywords, category, style, and budget preference. Save and compare a thoughtful shortlist.', intro('Find your <em>thing.</em>', 'A little inspiration. A few good filters. A shortlist that makes sense for you.') + finder + results, interactive=True, index=False)

    guides = []
    for file in sorted((TEMPLATES / 'articles').glob('*.html')):
        raw = file.read_text(encoding='utf-8')
        title = re.search(r'<title>(.*?)</title>', raw).group(1).replace('pickpop.', 'PickPop')
        description = re.search(r'<meta name="description" content="(.*?)"', raw).group(1)
        body = re.search(r'<main id="main">(.*?)</main>', raw, re.S).group(1)
        body = body.replace('href="/#guides"', 'href="/guides/"').replace('href="/#finder"', 'href="/find/"').replace('href="/?q=', 'href="/find/?q=')
        route = '/guides/' + file.name
        schema = {'@context': 'https://schema.org', '@type': 'Article', 'headline': html.unescape(title.split(' | ')[0]), 'description': html.unescape(description), 'inLanguage': 'en-US', 'mainEntityOfPage': ORIGIN + route, 'author': {'@type': 'Organization', 'name': 'PickPop'}, 'publisher': {'@type': 'Organization', 'name': 'PickPop'}}
        page(route, title, html.unescape(description), body, kind='article', schema=schema)
        icon = '☕' if 'kitchen' in file.name or 'coffee' in file.name else '🎁' if 'gift' in file.name else '💻'
        guides.append(f'<article class="editorial-tile"><span aria-hidden="true">{icon}</span><div><p class="overline">THE GOOD EDIT</p><h2><a href="{route}">{ESC(html.unescape(title.split(" | ")[0]))}</a></h2><p>{description}</p><a class="text-link" href="{route}">Read the guide →</a></div></article>')
    page('/guides/', 'The Good Edit — Home & Kitchen Guides | PickPop', 'Practical guides for small kitchens, thoughtful gifts, coffee corners, and everyday spaces. Choose with intention and keep your budget in view.', intro('Ideas worth <em>opening.</em>', 'Useful reads for real decisions. No invented hands-on tests, product ratings, or pressure to buy.', 'THE GOOD EDIT') + '<div class="shell editorial-grid">' + ''.join(guides) + '</div>')

    collections = [
        ('small-kitchen', 'Small kitchen, big intention.', 'Make the most of a small space.', 'Choose an idea that solves a daily annoyance before adding another object to the counter. Measure your available space, check care instructions, and consider storage between uses.', ['spice', 'glass', 'rack', 'blender'], '/guides/small-kitchen.html'),
        ('coffee-corner', 'Your little coffee corner.', 'A small ritual, thoughtfully chosen.', 'Start with how you actually drink coffee. The following concepts are shopping prompts, not tested products or guaranteed bargains. Think about cleanup, storage, and what you already own.', ['mug', 'frother'], '/guides/coffee-maker-small-apartment.html'),
        ('feel-good-home', 'A feel-good kind of home.', 'Personality without the extra clutter.', 'Pick one space you use every day and one problem to improve. Check dimensions and materials rather than buying everything that fits a look.', ['basket', 'lamp', 'plant', 'candle'], '/guides/smart-gifts.html')
    ]
    collection_tiles = []
    by_id = {item['id']: item for item in CATALOG['items']}
    for slug, title, subtitle, editorial, ids, guide in collections:
        route = '/collections/' + slug + '/'
        content = intro(ESC(title), ESC(subtitle), 'A PICKPOP COLLECTION') + f'<div class="shell collection-body"><p>{ESC(editorial)}</p><p class="results-disclaimer">These are illustrative concepts, not verified products or current offers. No retailer prices are displayed.</p><div class="collection-grid">' + ''.join(static_card(by_id[id]) for id in ids) + f'</div><a class="btn btn-dark" href="{guide}">Read the related guide →</a><a class="text-link" href="/find/">Make your own shortlist →</a></div>'
        page(route, title + ' | PickPop', subtitle + ' Explore editorial shopping prompts and practical considerations before choosing a specific product.', content)
        collection_tiles.append(f'<article class="collection-tile"><span aria-hidden="true">✳</span><p class="overline">THE INTENTIONAL EDIT</p><h2><a href="{route}">{ESC(title)}</a></h2><p>{ESC(subtitle)}</p><a class="text-link" href="{route}">Explore the collection →</a></article>')
    page('/collections/', 'Thoughtful Shopping Collections | PickPop', 'Explore small-kitchen ideas, coffee-corner inspiration, and feel-good home concepts with practical editorial guidance.', intro('A few good <em>directions.</em>', 'Thoughtful edits for the corners of life you care about. Browse a theme, then make it yours.', 'COLLECTIONS') + '<div class="shell collections-grid">' + ''.join(collection_tiles) + '</div>')

    for item in CATALOG['items']:
        url, paid, label = safe_destination(item)
        demo = item['verification']['status'] == 'demo'
        status = 'Example concept · no specific product verified' if demo else 'Source-reviewed recommendation'
        facts = '<p>No product specifications, reviews, prices, or availability have been verified for this concept.</p>' if demo else '<ul>' + ''.join('<li>' + ESC(str(fact)) + '</li>' for fact in item['benefits'] + item['features']) + '</ul>'
        disclosure = '<p class="affiliate-note">Paid link. As an Amazon Associate I earn from qualifying purchases.</p>' if paid else '<p class="p-small">No paid affiliate link is active for this idea.</p>'
        tags = ', '.join(LABELS[style] for style in item['styles'])
        content = f'''<div class="shell page-shell"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/collections/">Collections</a> / {ESC(item['name'])}</nav><div class="idea-layout"><div class="idea-illustration" style="background:{item['color']}" role="img" aria-label="Illustrative symbol for {ESC(item['name'], quote=True)}"><span aria-hidden="true">{ESC(item['emoji'])}</span></div><article class="idea-copy"><p class="overline">{ESC(status)}</p><h1>{ESC(item['name'])}</h1><p>{ESC(item['description'])}</p><h2>Why explore this idea?</h2><p>Our catalog associates this concept with {ESC(tags.lower())}. These are editorial discovery tags, not manufacturer claims.</p><h2>Before you choose</h2><ul>{''.join('<li>'+ESC(text)+'</li>' for text in item['considerations'])}</ul><h2>What we know</h2>{facts}{disclosure}<a class="btn btn-coral" href="{ESC(url, quote=True)}" target="_blank" rel="noopener noreferrer {'sponsored' if paid else 'nofollow'}">{label} ↗</a><p class="p-small">Opens Amazon in a new tab. Check the specific product, final price, taxes, delivery, and returns there. PickPop does not sell or fulfill orders.</p><a class="text-link" href="/find/?{ESC(urlencode({'q': item['name']}), quote=True)}#finder">Back to the finder →</a></article></div></div>'''
        page('/ideas/' + item['id'] + '/', item['name'] + ' — What to Consider | PickPop', 'Explore this ' + ('example shopping concept' if demo else 'sourced recommendation') + ' and practical questions to ask before choosing: ' + item['name'] + '.', content, index=not demo)

    page('/about.html', 'About PickPop — Thoughtful Shopping Discovery', 'Learn how PickPop matches shopping ideas to your needs, style, and budget without pretending to have live retailer data.', source('about.html'))
    privacy = source('privacy.html').replace('This helps you see saved items on return visits.', 'You can turn off “Remember my favorites” in the finder. This removes stored favorite IDs; current-tab favorites remain only for that visit. A small preference key, pickpop-persistence, remembers your choice. Clearing site data resets the choice.').replace('No public contact address has been configured in this demo yet. Add a real business contact method before public launch.', 'See our <a href="/contact/">contact page</a> for the current contact status. No contact form or third-party submission service is active.')
    privacy = privacy.replace('newsletter subscriptions, or server-side data collection', 'newsletter subscriptions, or application-level server-side data collection')
    page('/privacy.html', 'Privacy Policy | PickPop', 'How PickPop handles browser favorites, optional persistence, hosting, and retailer links. No external analytics is enabled.', privacy)
    enabled = CONFIG['affiliate']['enabled']
    disclosure = '<p class="affiliate-note">As an Amazon Associate I earn from qualifying purchases.</p><p>Some Amazon links are paid affiliate links. They are labeled near the recommendation. A qualifying purchase may earn PickPop a commission.</p>' if enabled else '<p><strong>No paid affiliate links are active.</strong> Current Amazon buttons open ordinary retailer searches. PickPop does not claim Amazon Associates approval or commissions.</p>'
    page('/disclosure/', 'Affiliate Disclosure & Editorial Standards | PickPop', 'Understand PickPop retailer links, affiliate status, and the distinction between example concepts and verified product information.', intro('A little <em>transparency.</em>', 'Good decisions deserve clear information.', 'AFFILIATE DISCLOSURE') + '<div class="shell policy-body">' + disclosure + '<h2>Where a purchase happens</h2><p>Links take you to Amazon. PickPop does not collect payments, manage inventory, or fulfill purchases. Retailer prices, sellers, taxes, shipping, and return terms should be checked there.</p><h2>Ideas and information</h2><p>Example concepts are labeled throughout the finder. Editorial tags and planning targets are shopping prompts, not product tests, ratings, current prices, or guarantees. We do not use offer or review markup for them.</p><h2>Our editorial standard</h2><p>We explain why an idea matches your selected filters and what to check before choosing a specific item. No personal testing is claimed. Verified recommendations will require source records and a review date.</p><a class="text-link" href="/about.html">More about PickPop →</a></div>')
    email = CONFIG.get('contactEmail')
    contact = f'<a class="btn btn-coral" href="mailto:{ESC(email, quote=True)}">Email {ESC(email)} ↗</a><p>Your email is sent through your own email app. PickPop has no contact-form backend.</p>' if email else '<div class="article-callout"><strong>Our public inbox is not open yet.</strong><p>A business contact address has not been provided. We will publish a real address here when it is configured; this page does not collect messages.</p></div>'
    page('/contact/', 'Contact PickPop | PickPop', 'Find the current PickPop contact status and where to direct questions about Amazon orders, sellers, or returns.', intro('Say <em>hello.</em>', 'Questions about an idea, an editorial correction, or the way PickPop works?', 'CONTACT') + '<div class="shell policy-body">' + contact + '<h2>Questions about an Amazon purchase?</h2><p>For orders, delivery, returns, seller issues, or payment questions, use the support options on Amazon. PickPop does not have access to your Amazon orders.</p><h2>Before you share</h2><p>Do not send passwords, payment information, or account credentials. Read our <a href="/privacy.html">privacy policy</a> for details about this site.</p></div>', index=bool(email))
    page('/404.html', 'Page Not Found | PickPop', 'This page could not be found. Return to PickPop discovery and editorial guides.', source('404.html'), index=False)


def write():
    DIST.mkdir(exist_ok=True)
    manifest = DIST / '.pickpop-generated.json'
    if manifest.exists():
        for relative in json.loads(manifest.read_text(encoding='utf-8')):
            target = (DIST / relative).resolve()
            if not target.is_relative_to(DIST.resolve()):
                raise ValueError('Build manifest outside artifact')
            if target.is_file():
                target.unlink()
    files = []
    for relative, document in PAGES.items():
        for base in [ROOT, DIST]:
            target = base / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(document, encoding='utf-8')
        files.append(relative)
    for folder in ['assets', 'data']:
        for file in (ROOT / folder).rglob('*'):
            if file.is_file():
                relative = file.relative_to(ROOT)
                target = DIST / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(file, target)
                files.append(str(relative))
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join('<url><loc>' + ESC(url) + '</loc></url>' for url in INDEXABLE) + '</urlset>\n'
    robots = 'User-agent: *\nAllow: /\nSitemap: ' + ORIGIN + '/sitemap.xml\n'
    headers = '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; font-src \'self\'; img-src \'self\' data:; connect-src \'self\'; object-src \'none\'; base-uri \'self\'; frame-ancestors \'none\'; form-action \'self\'\n/find/*\n  X-Robots-Tag: noindex, follow\n/ideas/*\n  X-Robots-Tag: noindex, follow\n'
    headers = headers.replace('/ideas/*\n  X-Robots-Tag: noindex, follow\n', ''.join('/ideas/' + item['id'] + '/*\n  X-Robots-Tag: noindex, follow\n' for item in CATALOG['items'] if item['verification']['status'] == 'demo'))
    for name, text in [('sitemap.xml', sitemap), ('robots.txt', robots), ('_headers', headers)]:
        for base in [ROOT, DIST]:
            (base / name).write_text(text, encoding='utf-8')
        files.append(name)
    manifest.write_text(json.dumps(files), encoding='utf-8')
    print(f'Built {len(PAGES)} static pages, {len(INDEXABLE)} sitemap URLs, and a dist/ artifact. No deploy performed.')


if __name__ == '__main__':
    validate()
    generate()
    write()
