"""Original PickPop planning illustrations. No downloaded product images.
Generate HTML masters and editorial manifest; render with render.cjs.
"""
import csv
import html
import json
from datetime import date, timedelta
from pathlib import Path
from urllib.parse import urlencode

ROOT = Path(__file__).resolve().parent
PINS = [
    ('Coffee station ideas for a small kitchen', 'A coffee corner.\nRoom to cook.', 'Keep a prep zone clear|Group only daily gear|Give cleanup its own spot', 'coffee station ideas for small kitchens', '/guides/coffee-station.html', 'Coffee station', 'plan'),
    ('Before you buy a coffee maker for your apartment', 'Choose your\nmorning routine.', 'Manual or automatic?|Count the supporting gear|Check space and cleanup', 'coffee maker for small apartment', '/guides/coffee-maker-small-apartment.html', 'Coffee buying guide', 'paths'),
    ('Small kitchen organization starts with one clear counter', 'Clear space.\nBetter prep.', 'Choose one prep zone|Move occasional tools away|Test before buying storage', 'small kitchen organization', '/guides/small-kitchen.html', 'Kitchen organization', 'counter'),
    ('Kitchen essentials for small apartments: start with tasks', 'One task.\nOne useful tool.', 'List what you cook|Check what you already own|Measure before adding more', 'kitchen essentials for small apartments', '/guides/small-apartment-kitchen-essentials.html', 'Kitchen essentials', 'tools'),
    ('Coffee corner collection: plan the complete setup', 'Coffee needs\na little planning.', 'Brewer + compatible filters|A way to heat water|A place to rinse and dry', 'small kitchen coffee corner', '/collections/coffee-corner/', 'Coffee collection', 'brew'),
    ('Kitchen cabinet organization: measure first', 'Your cabinet.\nYour dimensions.', 'Measure usable shelf space|Leave room to lift items|Keep daily tools reachable', 'kitchen cabinet organization', '/guides/kitchen-cabinet-organization.html', 'Cabinet organization', 'cabinet'),
    ('Food storage containers: choose for the job', 'Match storage\nto the meal.', 'Check material and care|Read heating instructions|Count lids as storage too', 'food storage container buying guide', '/guides/food-storage-containers.html', 'Food storage', 'storage'),
    ('Coffee mugs and drinkware: the everyday checklist', 'A mug that fits\nyour day.', 'Capacity is not cup count|Check the handle and fit|Read the care instructions', 'coffee mug buying guide', '/guides/drinkware-buying-guide.html', 'Drinkware', 'mug'),
    ('Spice storage ideas: start with the location', 'A better home\nfor your spices.', 'Read each storage label|Choose a practical location|Keep names easy to find', 'spice storage ideas', '/guides/spice-storage.html', 'Spice organization', 'spice'),
    ('Small kitchen collection: buy for a routine', 'Useful picks.\nSpace checks first.', 'Start with a real job|Check dimensions and weight|Confirm current price on Amazon', 'kitchen tools for small spaces', '/collections/small-kitchen/', 'Kitchen collection', 'ruler'),
    ('Practical gifts for home lovers: ask three questions', 'A useful gift.\nA personal fit.', 'Do they want this routine?|Will it fit their space?|Are extra supplies needed?', 'practical gifts for home lovers', '/guides/smart-gifts.html', 'Practical gifts', 'gift'),
    ('Counter, tray, or cabinet? Plan your coffee station', 'Three setups.\nYour everyday fit.', 'Counter: easy daily access|Tray: group portable tools|Cabinet: check clearance', 'coffee station organization ideas', '/guides/coffee-station.html', 'Coffee organization', 'compare'),
]


def artwork(kind, accent):
    """Different original, schematic compositions; never photos of exact products."""
    base = f'<svg viewBox="0 0 800 420" role="img" aria-label="Original {kind} planning illustration"><g stroke="#252331" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">'
    rect = lambda x,y,w,h,fill: f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" fill="{fill}"/>'
    label = lambda x,y,t: f'<text x="{x}" y="{y}" stroke="none" fill="#252331" font-family="sans-serif" font-size="26" font-weight="700">{t}</text>'
    if kind in ['plan','counter']:
        s=rect(80,70,640,280,'#fffdf5')+rect(110,100,190,215,accent)+rect(320,100,280,215,'#eef3cf')
        s+=label(133,157,'DAILY GEAR')+label(350,208,'PREP SPACE')+'<path d="M630 135v140m-24-110h48m-48 45h48"/>'
        if kind=='counter': s+='<path d="M112 355h585"/>'+label(260,395,'KEEP THIS CLEAR')
    elif kind=='paths':
        s=rect(65,70,290,245,'#fffdf5')+rect(445,70,290,245,accent)+label(133,115,'MANUAL')+label(474,115,'AUTOMATIC')+'<path d="M140 145h155l-75 120z" fill="#eef3cf"/><path d="M493 150h147v120H493z" fill="#fffdf5"/><path d="M510 170h100m-100 40h100m-110 108h150"/>'
    elif kind in ['brew','tools']:
        s=rect(80,95,170,225,accent)+rect(315,95,170,225,'#fffdf5')+rect(550,95,170,225,'#eef3cf')
        s+='<path d="M110 145h110l-25 45 32 80H104l31-80z" fill="#fffdf5"/><path d="M340 155h120l-60 100z" fill="#e3d6ff"/><path d="M585 160h85v100h-85z" fill="#fffdf5"/><path d="M670 180h25v50h-25"/>'+label(105,365,'CHOOSE')+label(334,365,'CHECK')+label(571,365,'PLAN')
        if kind=='tools': s=rect(60,60,680,290,'#fffdf5')+'<ellipse cx="215" cy="220" rx="100" ry="70" fill="'+accent+'"/><path d="M300 215h135v30H300z" fill="#e3d6ff"/><path d="M580 100v170m-45-160h90v70h-90z" fill="#eef3cf"/>'+label(140,385,'COOK')+label(535,385,'BASTE')
    elif kind=='cabinet':
        s=rect(145,35,510,345,'#fffdf5')+'<path d="M145 190h510M400 35v345"/>'+rect(175,65,115,85,accent)+rect(445,65,175,85,'#eef3cf')+rect(185,230,165,100,'#e3d6ff')+rect(470,230,90,100,accent)
    elif kind=='storage':
        s=rect(105,215,250,125,accent)+rect(110,190,240,30,'#fffdf5')+rect(445,165,230,175,'#eef3cf')+rect(435,140,250,30,'#e3d6ff')+rect(465,65,190,30,'#fffdf5')+'<path d="M580 103v30"/>'+label(92,392,'CONTAINER + LID SPACE')
    elif kind=='mug':
        s='<path d="M230 65h280v210a80 80 0 0 1-80 80H310a80 80 0 0 1-80-80z" fill="'+accent+'"/><path d="M510 125h60a60 60 0 0 1 0 120h-60" fill="none"/><path d="M275 125h190"/>'+label(275,237,'CHECK FIT')+'<path d="M680 65v290m-20-290h40m-40 290h40"/>'
    elif kind=='spice':
        s='<path d="M95 350h610"/>'
        for x,h,c in [(125,160,accent),(335,200,'#e3d6ff'),(545,130,'#eef3cf')]:
            s+=rect(x,350-h,130,h,'#fffdf5')+rect(x-3,330-h,136,30,c)+rect(x+20,385-h,90,55,c)
    elif kind=='ruler':
        s=rect(95,140,610,130,accent)
        for x in range(125,690,40): s+=f'<path d="M{x} 145v{60 if x%80==45 else 35}"/>'
        s+=label(150,330,'DIMENSIONS BEFORE DECISIONS')
    elif kind=='gift':
        s=rect(180,170,440,180,accent)+rect(160,115,480,65,'#e3d6ff')+'<path d="M365 115v235h70V115" fill="#fffdf5"/><path d="M400 115C185 105 250-70 400 115c140-185 215-10 0 0" fill="#eef3cf"/>'
    else:
        s=''
        for i,(text,col) in enumerate([('COUNTER',accent),('TRAY','#e3d6ff'),('CABINET','#eef3cf')]):
            x=25+i*265;s+=rect(x,80,245,230,col)+label(x+22,135,text)+'<path d="M'+str(x+32)+' 240h180"/>'
    return base+s+'</g></svg>'


def main():
    (ROOT/'masters').mkdir(parents=True,exist_ok=True)
    manifest=[]
    palettes=[('#f9eee0','#ff927f'),('#eee5fa','#b5d857'),('#ecf3d4','#c9b4f3'),('#fff0cd','#ff927f')]
    for i,(title,headline,tips,keyword,path,category,kind) in enumerate(PINS,1):
        bg,accent=palettes[(i-1)%4]; slug=f'pin-{i:02d}'; destination='https://pickpop.netlify.app'+path+'?'+urlencode({'utm_source':'pinterest','utm_medium':'organic_social','utm_campaign':'first_sales_14d','utm_content':slug})
        description=f'{title}. {tips.replace("|", ". ")}. Read the practical PickPop guide and check fit, care, and current retailer details before buying. The destination includes affiliate links; qualifying purchases may support PickPop.'
        record={'id':slug,'status':'draft-not-scheduled','title':title,'description':description,'primaryKeyword':keyword,'image':slug+'.png','destination':destination,'category':category,'suggestedDate':(date(2026,10,12)+timedelta(days=i-1 if i<12 else 10)).isoformat(),'alt':headline.replace('\n',' ')+'. '+tips.replace('|','. '),'rights':'Original PickPop vector illustration and typography. No Amazon product photos. Outfit and DM Sans fonts under repository OFL licenses.'}
        manifest.append(record)
        items=''.join(f'<li><span>{n:02d}</span>{html.escape(t)}</li>' for n,t in enumerate(tips.split('|'),1))
        body=f'''<!doctype html><html lang="en-US"><meta charset="utf-8"><title>{html.escape(title)}</title><style>
@font-face{{font-family:Outfit;src:url('../../../pickpop-site/assets/fonts/outfit.woff2')}}@font-face{{font-family:DM;src:url('../../../pickpop-site/assets/fonts/dm-sans.woff2')}}*{{box-sizing:border-box}}body{{margin:0;width:1000px;height:1500px;background:{bg};color:#252331;font-family:DM,sans-serif;overflow:hidden}}main{{padding:66px 70px;height:100%;display:flex;flex-direction:column}}header{{display:flex;justify-content:space-between;align-items:center;font-family:Outfit;font-size:46px;font-weight:800}}header span{{font-family:DM;font-size:19px;letter-spacing:2px;text-transform:uppercase;max-width:330px}}h1{{font-family:Outfit;font-size:94px;line-height:1.03;letter-spacing:-3px;margin:54px 0 20px;font-weight:750;min-height:194px}}.art{{margin:15px -12px 10px}}svg{{width:100%;height:430px}}ul{{list-style:none;padding:0;margin:6px 0;display:grid;gap:23px}}li{{font-size:31px;display:flex;gap:20px;align-items:center;line-height:1.25}}li span{{border:2px solid #252331;border-radius:50%;font-size:21px;font-weight:700;display:grid;place-items:center;width:49px;height:49px;flex-shrink:0}}footer{{margin-top:auto;background:#252331;color:#fffdf5;border-radius:24px;padding:29px 32px;display:flex;justify-content:space-between;align-items:center}}footer strong{{font:650 31px Outfit}}footer small{{display:block;margin-top:6px;font-size:19px;color:#eee5fa}}footer b{{font:44px Outfit;color:{accent}}}.fine{{margin-top:20px;font-size:19px;letter-spacing:1px;text-transform:uppercase}}
</style><main><header>pickpop<span>{html.escape(category)}</span></header><h1>{html.escape(headline).replace(chr(10),'<br>')}</h1><div class="art">{artwork(kind,accent)}</div><ul>{items}</ul><footer><div><strong>Make room for a good find.</strong><small>Read the guide at pickpop.netlify.app</small></div><b aria-hidden="true">&#8599;</b></footer><div class="fine">Good finds. Better budgets.</div></main></html>'''
        (ROOT/'masters'/f'{slug}.html').write_text(body,encoding='utf-8')
    (ROOT/'pins.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
    with (ROOT/'pins.csv').open('w',newline='',encoding='utf-8-sig') as f:
        writer=csv.DictWriter(f,fieldnames=manifest[0]);writer.writeheader();writer.writerows(manifest)
    print('12 original HTML masters and publication drafts prepared. Nothing published or scheduled.')

if __name__=='__main__': main()
