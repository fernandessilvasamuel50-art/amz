"""Validate existing assets and prepare local review files. Never posts or schedules.
Run with Python + Pillow from the repository root. Dates use the owner's client date.
"""
import csv
import hashlib
import html
import json
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen

from PIL import Image

ROOT = Path(__file__).resolve().parent
REVIEW_DATE = '2026-10-10'
ORIGIN = 'https://pickpop.netlify.app'


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = None
        self.h1 = []
        self.in_h1 = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs.get('href')
        if tag == 'h1':
            self.in_h1 = True

    def handle_endtag(self, tag):
        if tag == 'h1':
            self.in_h1 = False

    def handle_data(self, text):
        if self.in_h1:
            self.h1.append(text)


def review(pin):
    url = urlparse(pin['destination'])
    assert url.scheme == 'https' and url.netloc == 'pickpop.netlify.app'
    params = parse_qs(url.query)
    assert params == {'utm_source': ['pinterest'], 'utm_medium': ['organic_social'],
                      'utm_campaign': ['first_sales_14d'], 'utm_content': [pin['id']]}
    assert 0 < len(pin['title']) <= 100 and 0 < len(pin['description']) <= 800
    assert pin['status'] == 'draft-not-scheduled', 'Do not overwrite a live publication record'
    image = ROOT / pin['image']
    assert image.parent == ROOT and image.stat().st_size < 20_000_000
    with Image.open(image) as asset:
        assert asset.format == 'PNG' and asset.size == (1000, 1500)
        asset.verify()
    request = Request(pin['destination'], headers={'User-Agent': 'PickPop-Pin-Destination-Review/1.0'})
    with urlopen(request, timeout=30) as response:
        status, final_url = response.status, response.url
        body = response.read().decode('utf-8')
    assert status == 200 and urlparse(final_url).netloc == 'pickpop.netlify.app'
    page = Page()
    page.feed(body)
    assert page.canonical == ORIGIN + url.path, 'Canonical must point to the original content, without UTMs'
    assert page.h1 and len(body) > 5000, 'Destination must contain published editorial content'
    return {'id': pin['id'], 'reviewedAt': REVIEW_DATE, 'httpStatus': status,
            'destination': pin['destination'], 'resolvedUrl': final_url,
            'canonical': page.canonical, 'heading': ''.join(page.h1).strip(),
            'imageSha256': hashlib.sha256(image.read_bytes()).hexdigest(),
            'imageBytes': image.stat().st_size, 'dimensions': [1000, 1500],
            'titleLength': len(pin['title']), 'descriptionLength': len(pin['description']),
            'status': 'passed-local-and-public-destination-review'}


def main():
    queue_path = ROOT / 'distribution-queue.json'
    if queue_path.exists():
        existing = json.loads(queue_path.read_text(encoding='utf-8'))
        if existing.get('accountVerified') or existing.get('batchApproval') != 'pending' or any(p.get('pinUrl') or p.get('scheduledAt') or p.get('publishedAt') for p in existing.get('pins', [])):
            raise ValueError('Preserve account approvals and actual publication history; do not regenerate this queue')
    pins = json.loads((ROOT / 'pins.json').read_text(encoding='utf-8'))
    assert len(pins) == 12 and len({p['id'] for p in pins}) == 12
    with ThreadPoolExecutor(max_workers=4) as pool:
        reviews = list(pool.map(review, pins))
    queue = []
    for i, pin in enumerate(pins):
        time = '20:00' if i == 11 else '18:00'
        assert date.fromisoformat(pin['suggestedDate']) > date.fromisoformat(REVIEW_DATE)
        board = 'Coffee Station Ideas' if i in [0, 1, 4, 11] else 'Small Kitchen Organization' if i in [2, 5, 6, 8] else 'Everyday Kitchen Essentials'
        queue.append({**pin, 'batch': 1 if i < 10 else 2,
                      'plannedDate': pin['suggestedDate'], 'plannedTime': time,
                      'plannedTimeZone': 'America/New_York',
                      'plannedAt': pin['suggestedDate'] + 'T' + time + ':00-04:00',
                      'ownerTimeZone': 'America/Manaus', 'ownerLocalTime': time,
                      'proposedBoard': board, 'boardId': None,
                      'accountTimeZoneVerified': False,
                      'executionStatus': 'awaiting-business-login-and-batch-approval',
                      'pinUrl': None, 'scheduledAt': None, 'publishedAt': None,
                      'platformEvidence': None, 'impressions': None, 'outboundClicks': None,
                      'metricsObservedAt': None})
    manifest = {'reviewedAt': REVIEW_DATE, 'method': 'Pinterest native Create Pin only',
                'accountVerified': False, 'batchApproval': 'pending',
                'existingScheduledCount': None, 'accountProfileUrl': None,
                'note': 'Proposed dates, not scheduled. Verify account timezone and remaining queue slots before requesting batch approval. Original PNGs unchanged. No optimal posting time claim.',
                'pins': queue}
    (ROOT / 'distribution-queue.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    (ROOT / 'destination-review.json').write_text(json.dumps(reviews, indent=2) + '\n', encoding='utf-8')
    with (ROOT / 'distribution-queue.csv').open('w', newline='', encoding='utf-8-sig') as stream:
        writer = csv.DictWriter(stream, fieldnames=queue[0])
        writer.writeheader()
        writer.writerows(queue)
    cards = []
    for pin in queue:
        esc = lambda key: html.escape(str(pin[key]), quote=True)
        cards.append(f'<article><img src="{esc("image")}" alt="{esc("alt")}" width="1000" height="1500"><div><p class="status">{esc("id")} · Lote {esc("batch")} · Aguardando conta e autorização</p><h2>{esc("title")}</h2><p><b>Proposta:</b> {esc("plannedDate")} às {esc("plannedTime")} America/New_York (mesmo horário em Manaus nessas datas).</p><p><b>Pasta sugerida:</b> {esc("proposedBoard")} — existência ainda não conferida.</p><h3>Descrição</h3><p>{esc("description")}</p><h3>Texto alternativo</h3><p>{esc("alt")}</p><p><b>Keyword editorial:</b> {esc("primaryKeyword")}</p><p><a href="{esc("destination")}" target="_blank" rel="noopener noreferrer">Abrir destino validado</a></p><code>{esc("destination")}</code></div></article>')
    review_html = '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PickPop — revisão do lote Pinterest</title><style>body{margin:0;background:#faf3e7;color:#252331;font:17px system-ui;line-height:1.6}main{max-width:1100px;margin:auto;padding:28px}h1{line-height:1.1;font-size:36px}article{background:white;border:2px solid #252331;border-radius:20px;padding:22px;display:grid;grid-template-columns:220px 1fr;gap:28px;margin:28px 0}img{width:100%;height:auto;border-radius:12px}h2{line-height:1.2}h3{margin-bottom:0}code{display:block;overflow-wrap:anywhere;font-size:13px}.status{background:#eef3cf;padding:8px;border-radius:8px}a{color:#373075}aside{border-left:6px solid #f88;padding:12px 18px;background:white}@media(max-width:700px){main{padding:16px}article{grid-template-columns:1fr;padding:16px}img{max-width:240px}}</style><main><h1>PickPop — lote Pinterest pronto para revisão</h1><p>Revisão em 10/10/2026. Primeiros 10: 12–21/10, um por dia às 18h Eastern. Próxima rodada: Pins 11/12 em 22/10, às 18h e 20h. Horários propostos para consistência, sem alegação de pico de audiência.</p><aside><b>Nenhum Pin publicado ou agendado.</b> Ainda precisamos verificar a conta Business, pastas, fuso e espaço na fila. A autorização será solicitada antes de confirmar qualquer publicação ou agendamento. Dois Pins ficam reservados para quando houver espaço no limite de 10.</aside>' + ''.join(cards) + '</main></html>'
    (ROOT / 'queue-review.html').write_text(review_html, encoding='utf-8')
    print('PASS: 12 unchanged PNGs, title/description limits, 12 published destinations and canonical URLs. Two local batches prepared; nothing posted or scheduled.')


if __name__ == '__main__':
    main()
