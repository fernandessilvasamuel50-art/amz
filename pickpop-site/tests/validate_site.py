"""Validate the generated production artifact without external services."""
import json
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'


class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags, self.ids, self.schemas, self.schema_text = [], set(), [], None
        self.feed(text)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        self.tags.append((tag, attrs))
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f'Duplicate ID: {attrs["id"]}'
            self.ids.add(attrs['id'])
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.schema_text = ''

    def handle_data(self, value):
        if self.schema_text is not None:
            self.schema_text += value

    def handle_endtag(self, tag):
        if tag == 'script' and self.schema_text is not None:
            self.schemas.append(json.loads(self.schema_text))
            self.schema_text = None


def target(url):
    path = unquote(urlparse(url).path).lstrip('/')
    if not path or path.endswith('/'):
        path += 'index.html'
    result = (DIST / path).resolve()
    assert result.is_relative_to(DIST.resolve()), 'Internal link outside artifact'
    return result


def validate():
    pages = list(DIST.rglob('*.html'))
    titles, canonicals = set(), set()
    origin = json.loads((ROOT / 'data/site.json').read_text())['origin']
    link_count = 0
    for page in pages:
        text = page.read_text(encoding='utf-8')
        document = Document(text)
        assert text.lower().startswith('<!doctype html>'), page
        assert sum(tag == 'h1' for tag, attrs in document.tags) == 1, page
        assert any(tag == 'html' and attrs.get('lang') == 'en-US' for tag, attrs in document.tags), page
        title = text.split('<title>')[1].split('</title>')[0]
        assert title not in titles, f'Duplicate title: {title}'
        titles.add(title)
        canonical = [attrs['href'] for tag, attrs in document.tags if tag == 'link' and attrs.get('rel') == 'canonical']
        assert len(canonical) == 1 and canonical[0].startswith(origin + '/') and canonical[0] not in canonicals, page
        canonicals.add(canonical[0])
        descriptions = [attrs.get('content') for tag, attrs in document.tags if tag == 'meta' and attrs.get('name') == 'description']
        assert len(descriptions) == 1 and descriptions[0], page
        assert any(tag == 'meta' and attrs.get('property') == 'og:image' and attrs.get('content') == origin + '/assets/social-card.png' for tag, attrs in document.tags), page
        for schema in document.schemas:
            assert schema['@type'] in ['WebSite', 'Article', 'BreadcrumbList'], page
            assert schema.get('inLanguage', 'en-US') == 'en-US', page
        for tag, attrs in document.tags:
            for attribute in ['href', 'src']:
                value = attrs.get(attribute, '')
                if value.startswith('/'):
                    assert target(value).is_file(), f'Broken {attribute} on {page}: {value}'
                    link_count += 1
                if value.startswith('javascript:'):
                    raise AssertionError('Unsafe link')
            if tag == 'a' and attrs.get('target') == '_blank':
                assert 'noopener' in attrs.get('rel', ''), page
    locations = [element.text for element in ET.parse(DIST / 'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    assert len(locations) == len(set(locations))
    assert all('/ideas/' not in url and '/find/' not in url and '/contact/' not in url for url in locations)
    assert all(target(url).is_file() for url in locations)
    assert 'Sitemap: ' + origin + '/sitemap.xml' in (DIST / 'robots.txt').read_text()
    assert (DIST / 'assets/social-card.png').read_bytes().startswith(b'\x89PNG')
    for forbidden in ['build.py', 'serve.py', 'README.md', 'templates', 'tests', 'node_modules', 'package.json', 'start-local.ps1']:
        assert not (DIST / forbidden).exists(), f'Development files in public artifact: {forbidden}'
    print(f'PASS: {len(pages)} pages, unique titles/canonicals, {len(locations)} sitemap URLs, {link_count} local references, factual schemas, share image, and no development files in dist/.')


if __name__ == '__main__':
    validate()
