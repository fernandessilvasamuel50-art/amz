"""Local, offline operational report from explicitly sourced aggregate observations.
No service, account, tracking request, visitor identifier or API access.
Usage: python operations/report.py [operations/private/observations.json]
Each populated metric must be {value: number or summary, source: report name, observedAt: YYYY-MM-DD}.
Keep real account exports in ignored operations/private/, not the public repository.
"""
import html
import json
import re
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent
FIELDS = {'visitors':'Visitantes','countries':'Países','pages':'Páginas mais acessadas','searchTopics':'Temas buscados no Good Finder','productClicks':'Cliques em produtos','amazonClicks':'Cliques de saída para Amazon','trafficSources':'Origem do tráfego','googleImpressions':'Impressões no Google','googleClicks':'Cliques do Google','googleQueries':'Consultas no Google','amazonOrders':'Pedidos qualificados — Amazon','amazonCommissionUSD':'Comissões USD — Amazon'}

def render(data, hosting=None):
    if data.get('scope') != 'business-observations-only':
        raise ValueError('Only sourced business observations are accepted; never QA exports')
    rows=[]
    for key,label in FIELDS.items():
        record=data.get(key)
        if record is None:
            value,source='Indisponível','Nenhum relatório disponível'
        else:
            if not isinstance(record,dict) or not record.get('source') or not re.fullmatch(r'\d{4}-\d{2}-\d{2}',record.get('observedAt','')) or record.get('value') is None:
                raise ValueError('A populated metric requires value, source and date: '+key)
            if key in ['amazonOrders','amazonCommissionUSD'] and 'amazon associates' not in record['source'].lower():
                raise ValueError('Orders and commissions require an Amazon Associates report')
            value=str(record['value']);source=record['source']+' · '+record['observedAt']
        rows.append('<tr><th scope="row">'+html.escape(label)+'</th><td>'+html.escape(value)+'</td><td>'+html.escape(source)+'</td></tr>')
    period=data['period']
    hosting_html=''
    if hosting is not None:
        if hosting.get('scope') != 'unfiltered-hosting-aggregate-not-qualified-business-traffic' or not hosting.get('source') or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', hosting.get('observedAt','')):
            raise ValueError('Hosting snapshot needs its own unfiltered scope, source and date')
        for key in ['pageviews','uniqueIpEstimate']:
            if type(hosting.get(key)) is not int or hosting[key] < 0:
                raise ValueError('Invalid observed hosting count: '+key)
        hosting_html='<section><h2>Hospedagem — contagens sem filtro comercial</h2><p>'+html.escape(hosting['source']+' · '+hosting['observedAt']+' · '+hosting['periodDisplay'])+'</p><p><strong>'+str(hosting['pageviews'])+' páginas servidas · '+str(hosting['uniqueIpEstimate'])+' estimativa de IPs únicos</strong></p><p>'+html.escape(hosting['note'])+'</p><p>Não equivalem a compradores reais, pessoas verificadas ou resultados da divulgação. As métricas comerciais abaixo permanecem separadas.</p></section>'
    return '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PickPop — operação</title><style>body{font:17px system-ui;background:#faf3e7;color:#252331;margin:0;padding:32px}main{max-width:1100px;margin:auto}h1{font-size:38px}table{border-collapse:collapse;width:100%;background:white}th,td{text-align:left;padding:16px;border-bottom:1px solid #ddd}th{width:35%}p{line-height:1.6}.scroll{overflow:auto}small{color:#444}</style><main><h1>PickPop — painel operacional</h1><p>Período: '+html.escape(period['start']+' a '+period['end'])+' · Marketing: R$ '+str(data.get('marketingSpendBRL',0))+'</p><p>Dados ausentes aparecem como indisponíveis. Eventos de testes não representam visitantes, vendas ou comissões. Este arquivo local não rastreia pessoas e não envia dados.</p>'+hosting_html+'<div class="scroll"><table><thead><tr><th>Indicador</th><th>Observação real</th><th>Fonte / data</th></tr></thead><tbody>'+''.join(rows)+'</tbody></table></div><p>'+html.escape(data.get('notes',''))+'</p><small>Atualize apenas com relatórios legítimos e agregados. Guarde exportações reais em operations/private/.</small></main></html>'

if __name__=='__main__':
    target=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'observations.json'
    data=json.loads(target.read_text(encoding='utf-8'))
    output=target.parent/'dashboard.html'
    hosting_path=target.parent/'hosting-analytics-status.json'
    hosting=json.loads(hosting_path.read_text(encoding='utf-8')) if hosting_path.exists() else None
    output.write_text(render(data, hosting),encoding='utf-8')
    print('Offline report generated. Available metrics: '+str(sum(data.get(key) is not None for key in FIELDS)))
