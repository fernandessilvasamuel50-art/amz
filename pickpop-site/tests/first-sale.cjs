/* Buyer-journey QA. All Amazon navigation is fulfilled locally, never sent. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');const path=require('node:path');
const base=process.env.PICKPOP_TEST_URL||'http://127.0.0.1:8082';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[],external=[],records=[];
 page.on('pageerror',e=>errors.push(e.message));
 context.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url());});
 const catalog=JSON.parse(await fs.readFile(path.join(__dirname,'../data/catalog.json'),'utf8'));
 const queue=JSON.parse(await fs.readFile(path.join(__dirname,'../../marketing/pinterest/distribution-queue.json'),'utf8'));
 const axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 const expected={
  'coffee-station.html':['chemex-six-cup','baratza-encore-black'],
  'coffee-maker-small-apartment.html':['chemex-six-cup','aeropress-go'],
  'small-apartment-kitchen-essentials.html':['victorinox-fibrox-chef']
 };
 try{
  for(const width of [360,768,1440]){
   await page.setViewportSize({width,height:900});
   for(const [route,ids] of Object.entries(expected)){
    await page.goto(base+'/guides/'+route);
    const links=page.locator('.buyer-shortlist a[data-placement="article-shortlist"]');
    assert.equal(await links.count(),ids.length);
    assert.deepEqual(await links.evaluateAll(els=>els.map(el=>el.dataset.productId)),ids);
    const y=await links.first().evaluate(el=>el.getBoundingClientRect().top);
    assert(y<1300,`Early purchase choice missing at ${width}: ${route}, y=${y}`);
    for(const id of ids){
     const item=catalog.items.find(p=>p.id===id);const link=page.locator(`.buyer-shortlist a[data-product-id="${id}"]`);
     assert.equal(await link.getAttribute('href'),item.affiliateUrl);
     assert((await link.getAttribute('rel')).includes('sponsored'));
     assert((await link.getAttribute('aria-label')).includes(item.name));
    }
    assert((await page.locator('.buyer-shortlist').textContent()).includes('As an Amazon Associate I earn from qualifying purchases.'));
    assert.equal(await page.locator('#related-picks').count(),1);
    for(const img of await page.locator('.buyer-shortlist img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.evaluate(axe);const audit=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
    assert.deepEqual(audit.violations.map(v=>v.id),[]);
    records.push({route,width,firstAmazonButtonY:y,accessibility:'passed'});
   }
  }
  for(const item of catalog.items){
   await page.goto(base+'/ideas/'+item.id+'/');
   assert((await page.locator('.idea-copy').textContent()).includes(item.model));
   assert.equal(await page.locator('[data-placement="detail-intro"]').getAttribute('href'),item.affiliateUrl);
   if(item.buyingGuide){
    assert.equal(await page.locator('.buying-guidance').count(),1);
    const guideHref=await page.locator('.buying-guidance a').getAttribute('href');
    assert([item.buyingGuide.guide,item.buyingGuide.guide.replace(/\.html$/,'')].includes(guideHref));
    const guideResponse=await page.request.get(base+guideHref);
    assert.equal(guideResponse.status(),200);
    assert((await guideResponse.text()).includes(`href="https://pickpop.netlify.app${item.buyingGuide.guide}"`));
    assert.equal(await page.locator('meta[name="description"]').getAttribute('content'),item.buyingGuide.metaDescription);
    for(const width of [360,768,1440]){
     await page.setViewportSize({width,height:900});
     assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
     await page.evaluate(axe);const audit=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
     assert.deepEqual(audit.violations.map(v=>v.id),[]);
     assert((await page.locator('[data-placement="detail-intro"]').evaluate(el=>el.getBoundingClientRect().top))<1300);
    }
   }
  }
  for(const pin of queue.pins.slice(0,10)){
   const url=new URL(pin.destination);assert.equal(url.origin,'https://pickpop.netlify.app');
   const response=await page.goto(base+url.pathname+url.search);
   assert.equal(response.status(),200);assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),url.origin+url.pathname);
   assert.equal(url.searchParams.get('utm_content'),pin.id);
   assert((await page.locator('main').textContent()).trim().length>500);
   assert.equal(await page.locator('#local-diagnostics:visible').count(),0);
  }
  await page.goto(base+'/find/');await page.waitForFunction(()=>!document.querySelector('#product-search').disabled);
  assert.equal(await page.locator('#local-diagnostics').isVisible(),false);
  assert.equal(catalog.items.filter(p=>p.verification.status==='demo').length,0);
  assert.equal(await page.locator('#product-grid .product-card').count(),11);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  // Verify a keyboard-only outbound activation against an intercepted fixture.
  let outgoing;
  await context.route('https://www.amazon.com/**',async route=>{
   outgoing={url:route.request().url(),headers:await route.request().allHeaders()};
   await route.fulfill({status:200,contentType:'text/html',body:'<title>Local QA fixture</title>'});
  });
  await page.setViewportSize({width:360,height:900});await page.goto(base+'/guides/coffee-station.html');
  const link=page.locator('.buyer-shortlist a[data-product-id="chemex-six-cup"]');
  await link.focus();assert.equal(await link.evaluate(el=>el===document.activeElement),true);
  const popupPromise=context.waitForEvent('page');await page.keyboard.press('Enter');const popup=await popupPromise;await popup.waitForLoadState();
  assert.equal(outgoing.url,catalog.items.find(p=>p.id==='chemex-six-cup').affiliateUrl);
  assert.equal(outgoing.headers.referer,base+'/');await popup.close();
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(__dirname,'artifacts/first-sale-mobile.png')});
  await page.setViewportSize({width:1440,height:1000});await page.reload();
  await page.screenshot({path:path.join(__dirname,'artifacts/first-sale-desktop.png')});
  await fs.writeFile(path.join(__dirname,'artifacts/first-sale.json'),JSON.stringify({status:'passed',base,observedAt:new Date().toISOString(),activeProducts:11,pinDestinations:10,records,amazonNavigation:'intercepted-not-a-real-click',errors,unexpectedExternalRequests:external.filter(url=>!url.startsWith('https://www.amazon.com/'))},null,2));
  console.log('PASS: early choices in 3 guides/18 responsive accessibility audits; 11 models/links; 3 product decision blocks; 10 Pin destinations; hidden QA/no demos; keyboard outbound intercepted. '+JSON.stringify(records.filter(r=>r.width===360)));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
