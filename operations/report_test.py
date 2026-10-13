"""Protect the distinction between hosting, browser QA and official Amazon data."""
import copy,json,unittest
from pathlib import Path
from report import render

class Observations(unittest.TestCase):
    def setUp(self):
        self.data=json.loads((Path(__file__).parent/'observations.json').read_text(encoding='utf-8'))
        self.record={'value':3,'source':'SYNTHETIC Amazon Associates TEST FIXTURE','observedAt':'2026-10-12','window':{'start':'2026-10-12','end':'2026-10-18','timezone':'dashboard display'}}

    def test_missing_is_not_zero(self):
        html=render(self.data)
        self.assertIn('Indisponível',html)
        self.assertIn('Cliques registrados pela Amazon Associates',html)

    def test_owner_amazon_baseline_is_separate_from_current_sprint(self):
        summary=json.loads((Path(__file__).parent/'amazon-associates-status.json').read_text(encoding='utf-8'))
        output=render(self.data, amazon=summary)
        self.assertIn('3 cliques · 0 pedidos · US$ 0.00', output)
        self.assertIn('Não pertence à janela atual', output)
        self.assertIn('Não foi conferido diretamente', output)
        for field, value in [('trackingId','pickpop03-20'),('marketplace','BR'),('clicks',True),('commissionUSD',float('nan'))]:
            changed=copy.deepcopy(summary); changed[field]=value
            with self.subTest(field=field),self.assertRaises(ValueError):render(self.data, amazon=changed)

    def test_pinterest_counts_cannot_come_from_hosting_or_be_negative(self):
        for key in ['pinterestImpressions','pinterestSaves','pinterestPinClicks','pinterestOutboundClicks']:
            self.data[key]={**self.record,'source':'Netlify analytics'}
            with self.assertRaises(ValueError):render(self.data)
            self.data[key]={**self.record,'source':'SYNTHETIC Pinterest Analytics TEST FIXTURE','value':-1}
            with self.assertRaises(ValueError):render(self.data)
            self.data[key]['value']=5
            self.assertIn('Cliques de saída Pinterest',render(self.data))

    def test_qa_cannot_populate_business_report(self):
        self.data['scope']='this-browser-qa-only'
        with self.assertRaises(ValueError):render(self.data)

    def test_official_clicks_are_distinct_from_browser_outbound(self):
        for key in ['amazonReportedClicks','amazonOrders','amazonCommissionUSD','amazonOrderedItems','amazonShippedItems']:
            data=copy.deepcopy(self.data);data[key]={**self.record,'source':'Netlify hosting'}
            with self.assertRaises(ValueError):render(data)
            data[key]=self.record;self.assertIn('dashboard display',render(data))
        for source in ['Netlify hosting','Amazon Associates report']:
            self.data['amazonClicks']={**self.record,'source':source}
            with self.assertRaises(ValueError):render(self.data)

    def test_invalid_counts_and_ambiguous_windows(self):
        for value in [-1,True,float('nan'),2.5]:
            self.data['amazonReportedClicks']={**self.record,'value':value}
            with self.assertRaises(ValueError):render(self.data)
        self.data['amazonReportedClicks']={**self.record,'window':{'start':'2026-10-12'}}
        with self.assertRaises(ValueError):render(self.data)
        self.data['amazonReportedClicks']=dict(self.record);self.data['amazonReportedClicks'].pop('window')
        self.assertIn('Janela/fuso não informados',render(self.data))

    def test_historical_hosting_does_not_claim_current_acquisition(self):
        self.data['period']={'start':'2026-10-12','end':'2026-10-18'}
        hosting=json.loads((Path(__file__).parent/'hosting-analytics-status.json').read_text(encoding='utf-8'))
        self.assertIn('não pertence à janela atual',render(self.data,hosting))

if __name__=='__main__':unittest.main()
