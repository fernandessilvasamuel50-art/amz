const {chromium}=require('playwright');
const fs=require('node:fs/promises');const path=require('node:path');const assert=require('node:assert/strict');
const base=process.env.PICKPOP_TEST_URL||'http://127.0.0.1:8082';
(async()=>{
 const catalog=JSON.parse(await fs.readFile(path.join(__dirname,'../data/catalog.json'),'utf8'));
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({viewport:{width:360,height:900},acceptDownloads:true});const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try {
  for(const route of ['/guides/coffee-station.html','/guides/coffee-maker-small-apartment.html','/guides/small-apartment-kitchen-essentials.html','/guides/small-kitchen.html','/guides/smart-gifts.html']){
   await page.goto(base+route);assert(await page.locator('.article-picks a[href^="https://www.amazon.com/dp/"]').count()>0);
   assert.equal(await page.locator('meta[name="google-site-verification"]').count(),1);
   assert((await page.locator('.article-picks').textContent()).includes('As an Amazon Associate I earn from qualifying purchases.'));
  }
  for(const item of catalog.items){
   await page.goto(base+'/ideas/'+item.id+'/');
   const link=page.locator('a[data-placement="detail-intro"]');assert.equal(await link.count(),1);
   assert.equal(await link.getAttribute('href'),item.affiliateUrl);assert((await link.getAttribute('rel')).includes('sponsored'));
   assert(!(await link.getAttribute('rel')).includes('noreferrer'));assert.equal(await link.getAttribute('referrerpolicy'),'strict-origin-when-cross-origin');
   const y=await link.evaluate(el=>el.getBoundingClientRect().top);assert(y<1300,'CTA appears early on mobile');
  }
  let outgoing;
  await context.route('https://www.amazon.com/**',async route=>{outgoing={url:route.request().url(),headers:await route.request().allHeaders()};await route.fulfill({status:200,contentType:'text/html',body:'<title>Local navigation fixture</title>'});});
  const popupPromise=context.waitForEvent('page');await page.locator('a[data-placement="detail-intro"]').click();const popup=await popupPromise;await popup.waitForLoadState();
  assert.equal(new URL(outgoing.url).searchParams.get('tag'),'pickpop03-20');assert.equal(outgoing.headers.referer,base+'/');await popup.close();
  // Outbound navigation intercepted: no Amazon request or test click is sent to the account.
  await page.goto(base+'/find/');await page.waitForFunction(()=>!document.querySelector('#product-search').disabled);
  assert.equal(await page.locator('#local-diagnostics').isVisible(),false);
  await page.goto(base+'/find/?diagnostics=1');await page.waitForFunction(()=>!document.querySelector('#product-search').disabled);
  await page.locator('#local-diagnostics summary').click();await page.locator('#diagnostic-start').click();
  await page.locator('#product-search').fill('coffee person@example.com');await page.locator('#product-search').press('Enter');
  const downloadPromise=page.waitForEvent('download');await page.locator('#diagnostic-export').click();const download=await downloadPromise;
  const data=JSON.parse(await fs.readFile(await download.path(),'utf8'));assert.equal(data.businessTraffic,false);assert.equal(data.scope,'this-browser-qa-only');
  assert(!JSON.stringify(data).includes('person@example.com'));assert(data.events.some(e=>e.name==='search'&&e.values.queryTopic==='coffee'));
  await page.locator('#diagnostic-stop').click();assert((await page.locator('#diagnostic-status').textContent()).includes('cleared'));
  await page.goto(base+'/guides/small-apartment-kitchen-essentials.html');
  for(const photo of await page.locator('img[src^="/assets/products/"]').all()){
   await photo.scrollIntoViewIfNeeded();
   await page.waitForFunction(src=>{const img=document.querySelector(`img[src="${src}"]`);return img?.complete&&img.naturalWidth>0;},await photo.getAttribute('src'));
   await photo.evaluate(async img=>{try{await img.decode();}catch(error){throw Error(img.src+' complete='+img.complete+' width='+img.naturalWidth+': '+error.message);}});
  }
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(__dirname,'artifacts/growth-mobile.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/find/?q=OXO');await page.waitForFunction(()=>!document.querySelector('#product-search').disabled);
  assert.equal(await page.locator('#product-grid .product-card').count(),1);
  await page.locator('#product-grid img').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{const img=document.querySelector('#product-grid img');return img?.complete&&img.naturalWidth>0;});
  await page.locator('#product-grid img').evaluate(img=>img.decode());
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(__dirname,'artifacts/growth-desktop.png'),fullPage:true});
  assert.deepEqual(errors,[]);console.log('PASS: 5 commercial guides, all direct product CTAs, correct origin-only affiliate navigation (intercepted), opt-in QA export and OXO search. No page errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
