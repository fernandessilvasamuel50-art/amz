"""Audit crawlable HTML links without executing JavaScript or visiting retailers."""
import argparse
import json
from collections import deque
from datetime import datetime, timezone
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

from validate_site import ROOT, DIST, Document, target


def audit(public=False):
    origin = json.loads((ROOT / 'data/site.json').read_text())['origin']
    def read(route):
        if not public:
            return target(route).read_text(encoding='utf-8'), {}
        with urlopen(Request(origin + route, headers={'User-Agent': 'PickPop-public-SEO-QA/1.0'}), timeout=30) as response:
            assert response.status == 200, route
            return response.read().decode('utf-8'), dict(response.headers.items())
    xml, headers = read('/sitemap.xml')
    if public:
        assert 'xml' in next((v for k, v in headers.items() if k.lower() == 'content-type'), ''), headers
    routes = {urlparse(element.text).path for element in ET.fromstring(xml).findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
    graph = {}
    for route in sorted(routes):
        text, headers = read(route)
        document = Document(text)
        assert not any('noindex' in value.lower() for key, value in headers.items() if key.lower() == 'x-robots-tag'), route
        assert not any(tag == 'meta' and attrs.get('name') == 'robots' and 'noindex' in attrs.get('content', '') for tag, attrs in document.tags), route
        assert [attrs.get('href') for tag, attrs in document.tags if tag == 'link' and attrs.get('rel') == 'canonical'] == [origin + route], route
        links = set()
        for tag, attrs in document.tags:
            if tag != 'a' or not attrs.get('href') or 'nofollow' in attrs.get('rel', '').split():
                continue
            url = urlparse(urljoin(origin + route, attrs['href']))
            if url.netloc != urlparse(origin).netloc:
                continue
            path = url.path
            # Netlify Pretty URLs may rewrite /guides/name.html to /guides/name.
            if path not in routes and path + '.html' in routes:
                path += '.html'
            if path in routes and path != route:
                links.add(path)
        graph[route] = links
    distances = {'/': 0}
    pending = deque(['/'])
    while pending:
        route = pending.popleft()
        for linked in graph[route]:
            if linked not in distances:
                distances[linked] = distances[route] + 1
                pending.append(linked)
    catalog = json.loads((ROOT / 'data/catalog.json').read_text(encoding='utf-8'))
    important = sorted(['/ideas/' + item['id'] + '/' for item in catalog['items']] + [route for route in routes if route.startswith('/guides/') and route.endswith('.html')])
    rows = [{'route': route, 'htmlInboundPages': sum(route in links for links in graph.values()), 'depthFromHome': distances.get(route)} for route in important]
    report = {'observedAt': datetime.now(timezone.utc).isoformat(), 'source': 'public HTML QA' if public else 'local production artifact', 'sitemapUrls': len(routes), 'importantPages': rows, 'googleProcessingConfirmed': False, 'googleIndexedCount': None}
    print(json.dumps(report, indent=2))
    assert all(row['depthFromHome'] is not None and row['depthFromHome'] <= 3 and row['htmlInboundPages'] > 0 for row in rows), 'Products and articles must be reachable through indexable HTML pages without JavaScript'
    robots, _ = read('/robots.txt')
    assert 'Sitemap: ' + origin + '/sitemap.xml' in robots
    print('PASS: all active products and articles are crawlable from Home without JavaScript; this is not Google index confirmation.')
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--public', action='store_true')
    audit(parser.parse_args().public)
