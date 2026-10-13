"""Prepare four original editorial graphics. No account access or publication."""
import csv, html, json
from pathlib import Path
from urllib.parse import urlencode

ROOT = Path(__file__).resolve().parent
PINS = [
    ('pin-13', 'Coffee makers for small apartments: one cup or a shared pot?', 'One cup.\nOr a shared pot?', 'SERVINGS FIRST', ['AeroPress Go: an 8 fl oz chamber', 'CHEMEX six-cup: 30 fl oz capacity', 'Both need a complete manual routine'], 'coffee makers for small apartments', 'coffee-maker-small-apartment.html', 'Coffee Station Ideas', 'Compare a small manual coffee routine with a shared pour-over setup. PickPop explains supporting gear, space, and cleanup, with source-reviewed CHEMEX and AeroPress options. Capacity is not a promise of your finished drink size. Read the guide before choosing.'),
    ('pin-14', 'Coffee station essentials: a grinder is not a brewer', 'Two jobs.\nOne coffee station.', 'GRIND + BREW', ['A grinder prepares coffee beans', 'A brewer turns grounds into coffee', 'Plan space for filters and cleanup'], 'coffee station essentials', 'coffee-station.html', 'Coffee Station Ideas', 'Planning a coffee station? A Baratza Encore grinder and a CHEMEX brewer do different jobs. Use PickPop’s guide to compare your routine, supporting supplies, and cleanup space. You may already have part of the setup; buy for a missing task, not a matching look.'),
    ('pin-15', 'Small-space kitchen tools: start with the meals you cook', 'Prep dinner.\nSkip the clutter.', 'A TASK, THEN A TOOL', ['Choose for meals you already cook', 'Check blade size and safe storage', 'Add a specialty tool for a real task'], 'kitchen tools for small spaces', 'small-apartment-kitchen-essentials.html', 'Everyday Kitchen Essentials', 'Before adding kitchen tools to a small apartment, list the prep tasks you actually repeat. PickPop’s guide discusses useful tools, including a source-reviewed Victorinox Fibrox chef’s knife, with size and storage considerations. A full-size knife will not suit every space or user.'),
    ('pin-16', 'Before buying a cabinet organizer, check these three spaces', 'Will the\norganizer fit?', 'MEASURE THE ACCESS', ['Inside width and usable shelf depth', 'Clearance above your tallest item', 'Door opening and pull-out space'], 'kitchen cabinet organizer buying checklist', 'kitchen-cabinet-organization.html', 'Small Kitchen Organization', 'A cabinet organizer can fit inside and still be awkward to reach. Measure shelf depth, clearance, and the door opening before comparing a bin, shelf insert, or turntable. PickPop’s practical cabinet guide helps you try the layout first and buy for a specific access problem.'),
]

def diagram(index):
    start = '<svg viewBox="0 0 860 410" aria-label="Original editorial planning diagram" role="img"><g stroke="#252331" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">'
    rect = lambda x,y,w,h,c: f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="24" fill="{c}"/>'
    label = lambda x,y,t: f'<text x="{x}" y="{y}" fill="#252331" stroke="none" font-family="Outfit,sans-serif" font-size="27" font-weight="650">{t}</text>'
    if index == 0:
        body = rect(15,22,395,350,'#e3d6ff') + rect(450,22,395,350,'#dceb9c')
        body += label(50,70,'SINGLE SERVING') + label(482,70,'SHARED ROUTINE')
        body += '<path d="M120 145h145v115a38 38 0 0 1-38 38h-69a38 38 0 0 1-38-38z" fill="#fffdf5"/><path d="M265 175h35a30 30 0 0 1 0 60h-35" fill="none"/>'
        body += '<path d="M548 128h194l-97 122z" fill="#fffdf5"/>'
        for x in [505,625,745]: body += f'<path d="M{x} 280h75v40h-75z" fill="#fffdf5"/>'
    elif index == 1:
        body = rect(15,42,355,300,'#ff927f') + rect(490,42,355,300,'#e3d6ff')
        body += label(60,95,'PREPARE THE BEANS') + label(540,95,'BREW THE COFFEE')
        body += '<ellipse cx="195" cy="209" rx="76" ry="43" transform="rotate(-25 195 209)" fill="#fffdf5"/><path d="M160 170q60 50 65 75"/><path d="M389 195h78m-25-25 25 25-25 25"/><path d="M580 145h170l-85 145z" fill="#dceb9c"/>'
    elif index == 2:
        body = rect(55,45,750,300,'#fffdf5')
        for x,y,t,col in [(85,75,'MEAL','#e3d6ff'),(350,145,'TASK','#dceb9c'),(615,215,'TOOL','#ff927f')]:
            body += rect(x,y,160,90,col) + label(x+28,y+56,t)
        body += '<path d="m255 115 66 40m-22-35 22 35-42 4m200 60 66 40m-22-35 22 35-42 4" fill="none"/>'
    else:
        body = rect(100,30,560,345,'#fffdf5') + '<path d="M100 195h560m-315 0v150"/>'
        body += rect(130,220,180,120,'#e3d6ff') + rect(385,270,140,60,'#dceb9c')
        body += '<path d="M130 95h490m-490-12v24m490-24v24M565 208v60m-12-60h24m-24 60h24M685 280h135m-28-25 28 25-28 25" fill="none"/>'
        body += label(237,145,'USABLE WIDTH') + label(375,245,'CLEARANCE') + label(675,340,'ACCESS')
    return start + body + '</g></svg>'

def main():
    (ROOT / 'masters').mkdir(parents=True, exist_ok=True)
    manifest=[]
    for index,(pid,title,headline,kicker,tips,keyword,guide,board,description) in enumerate(PINS):
        destination='https://pickpop.netlify.app/guides/'+guide+'?'+urlencode({'utm_source':'pinterest','utm_medium':'organic_social','utm_campaign':'growth_sprint_20261013','utm_content':pid})
        disclosure=' This PickPop guide contains Amazon affiliate links. PickPop may earn a commission from qualifying purchases.'
        record={'id':pid,'status':'prepared-awaiting-owner-approval','title':title,'description':description+disclosure,'primaryKeyword':keyword,'image':pid+'.png','destination':destination,'proposedBoard':board,'boardCreationNeeded':False,'suggestedDate':None,'scheduledAt':None,'pinUrl':None,'publishedAt':None,'alt':headline.replace('\n',' ')+'. '+'. '.join(tips)+'. Original planning illustration, not a photograph of a specific product.','rights':'Original PickPop SVG illustrations and typography authored for this sprint; no external photos or Amazon images. Outfit and DM Sans under repository OFL licenses.','editorialPurpose':['Compare serving needs; no fake prices or machine testing.','Distinguish complementary equipment and avoid unnecessary bundles.','Choose prep tools by meal and storage needs.','Choose storage by access dimensions; no unsupported organizer recommendations.'][index],'metrics':{'impressions':None,'outboundClicks':None},'approval':'not-requested-or-granted','scheduleConstraint':'Do not alter Pins 01–10 or reserved Pins 11–12. Use the official scheduler only after specific owner approval.'}
        manifest.append(record)
        bg=['#f7eee1','#eee5fa','#ecf3d4','#fff0cd'][index]
        bullets=''.join(f'<li><b>{i:02}</b><span>{html.escape(t)}</span></li>' for i,t in enumerate(tips,1))
        content=f'''<!doctype html><html lang="en-US"><meta charset="utf-8"><title>{html.escape(title)}</title><style>
@font-face{{font-family:Outfit;src:url('../../../../pickpop-site/assets/fonts/outfit.woff2')}}@font-face{{font-family:DM;src:url('../../../../pickpop-site/assets/fonts/dm-sans.woff2')}}*{{box-sizing:border-box}}body{{margin:0;background:{bg};color:#252331;width:1000px;height:1500px;font-family:DM,sans-serif}}main{{height:1500px;padding:64px 70px;display:flex;flex-direction:column}}header{{display:flex;justify-content:space-between;align-items:center;font:800 46px Outfit}}header small{{font:700 18px DM;letter-spacing:2px}}.kicker{{font:650 22px DM;letter-spacing:2px;margin:46px 0 10px}}h1{{font:750 87px/1.03 Outfit;letter-spacing:-3px;margin:0;min-height:185px}}.art{{margin:32px -10px 12px}}svg{{width:100%;height:410px}}ul{{list-style:none;margin:12px 0;padding:0;display:grid;gap:24px}}li{{display:flex;align-items:center;gap:18px;font-size:30px;line-height:1.25}}li b{{border:2px solid;border-radius:50%;width:46px;height:46px;display:grid;place-items:center;flex-shrink:0;font-size:21px}}footer{{margin-top:auto;background:#252331;color:#fffdf5;padding:30px 32px;border-radius:26px;display:flex;justify-content:space-between;align-items:center}}footer strong{{font:650 32px Outfit}}footer small{{display:block;font-size:19px;margin-top:7px;color:#e3d6ff}}footer span{{font:50px Outfit;color:#dceb9c}}.fine{{font-size:19px;margin-top:19px;letter-spacing:1px}}
</style><main><header>pickpop<small>THE GOOD EDIT</small></header><p class="kicker">{kicker}</p><h1>{html.escape(headline).replace(chr(10),'<br>')}</h1><div class="art">{diagram(index)}</div><ul>{bullets}</ul><footer><div><strong>Compare the routine. Then choose.</strong><small>Read the guide · pickpop.netlify.app</small></div><span aria-hidden="true">↗</span></footer><div class="fine">GOOD FINDS. BETTER BUDGETS.</div></main></html>'''
        (ROOT/'masters'/f'{pid}.html').write_text(content,encoding='utf-8')
    (ROOT/'pins.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    with (ROOT/'pins.csv').open('w',newline='',encoding='utf-8-sig') as f:
        keys=['id','status','title','description','primaryKeyword','image','destination','proposedBoard','alt','rights']
        writer=csv.DictWriter(f,fieldnames=keys,extrasaction='ignore');writer.writeheader();writer.writerows(manifest)
    cards=''.join(f'<article><img src="{p["image"]}" alt="{html.escape(p["alt"],quote=True)}"><h2>{html.escape(p["title"])}</h2><p>{html.escape(p["description"])}</p><p><b>Board:</b> {p["proposedBoard"]}</p><a href="{html.escape(p["destination"],quote=True)}">Review the destination</a></article>' for p in manifest)
    (ROOT/'review.html').write_text('<!doctype html><html lang="en-US"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PickPop — four draft Pins</title><style>body{background:#faf3e7;color:#252331;font:17px system-ui;margin:24px}main{max-width:1200px;margin:auto}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}article{background:white;padding:20px;border-radius:20px}img{width:100%;height:auto}p{line-height:1.6}h1{font-size:32px}</style><main><h1>Four new Pins · Ready for review</h1><p>Prepared only. Not published or scheduled. Existing Pins 01–12 are preserved.</p><div class="grid">'+cards+'</div></main></html>',encoding='utf-8')
    print('Four original draft masters and copy prepared; nothing uploaded or scheduled.')

if __name__ == '__main__': main()
