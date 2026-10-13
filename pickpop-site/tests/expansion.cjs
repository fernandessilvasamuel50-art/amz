/* Focused checks for newly imported products; no Amazon navigation is sent. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const base=process.env.PICKPOP_TEST_URL||'http://127.0.0.1:8082';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));
 context.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url());});
 const ready=()=>page.waitForFunction(()=>document.querySelector('#product-search')&&!document.querySelector('#product-search').disabled);
 const axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 const reports=[];
 try{
  const catalog=JSON.parse(await fs.readFile(path.join(__dirname,'../data/catalog.json'),'utf8'));
  if(!catalog.items.some(item=>item.id==='instant-rio-mini-black')){
   await page.goto(base+'/find/');await ready();
   assert.equal(await page.locator('#product-grid .product-card').count(),catalog.items.length);
   assert.equal((await page.request.get(base+'/ideas/instant-rio-mini-black/')).status(),404);
   assert.equal((await page.request.get(base+'/assets/products/instant-rio-mini-black.webp')).status(),404);
   const heldFellow=JSON.parse(await fs.readFile(path.join(__dirname,'../../docs/catalog-batches/held-fellow-20261012.json'),'utf8'));
   assert.equal(heldFellow.item.image.variantReviewed,false);
   assert(!catalog.items.some(item=>item.id===heldFellow.item.id));
   assert.equal((await page.request.get(base+'/ideas/'+heldFellow.item.id+'/')).status(),404);
   assert.equal((await page.request.get(base+heldFellow.item.image.src)).status(),404);
   await page.locator('#product-search').fill('Fellow');
   assert.equal(await page.locator('#product-grid .product-card').count(),0);
   assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
   await fs.writeFile(path.join(__dirname,'artifacts/expansion.json'),JSON.stringify({status:'passed',base,heldProducts:['instant-rio-mini-black',heldFellow.item.id],heldProductPages:404,heldPhotos:404,errors,unexpectedExternalRequests:external},null,2));
   console.log('PASS: held RIO and Fellow, unconfirmed permission/variant photographs excluded from search, detail routes and public assets. No external requests.');
   return;
  }
  await page.goto(base+'/find/?q=pressure%20cooker&category=kitchen&budget=5');await ready();
  assert((await page.locator('#product-grid').textContent()).includes('RIO Mini'));
  const favorite=page.locator('[data-product-id="instant-rio-mini-black"]');await favorite.click();
  await page.reload();await ready();assert.equal(await favorite.getAttribute('aria-pressed'),'true');
  await favorite.click();assert.equal(await favorite.getAttribute('aria-pressed'),'false');
  await page.locator('[data-compare-id="instant-rio-mini-black"]').click();
  assert((await page.locator('#comparison').textContent()).includes('RIO Mini'));
  assert((await page.locator('#product-grid').textContent()).includes('As an Amazon Associate I earn from qualifying purchases.'));
  assert((await page.locator('#budget-help').textContent()).includes('not excluded'));
  await page.goto(base+'/');await ready();
  for(const [name,value] of [['category','kitchen'],['budget','50'],['style','modern'],['priority','small-spaces']]){
   await page.locator(`[name="quiz-${name}"][value="${value}"]`).check();await page.locator('#quiz-next').click();
  }
  assert((await page.locator('#quiz-app .product-copy').allTextContents()).some(t=>t.includes('RIO Mini')));
  assert((await page.locator('#quiz-app .why-match').textContent()).includes('priority'));
  for(const width of [360,768,1440]){
   await page.setViewportSize({width,height:900});await page.goto(base+'/ideas/instant-rio-mini-black/');
   await page.locator('img[src="/assets/products/instant-rio-mini-black.webp"]').evaluate(img=>img.decode());
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   const link=page.locator('[data-placement="detail-intro"]');
   assert.equal(await link.getAttribute('href'),'https://www.amazon.com/dp/B0F9B923NC?tag=pickpop-20');
   assert((await link.getAttribute('rel')).includes('sponsored'));
   assert((await page.locator('.photo-credit').textContent()).includes('manufacturer permission'));
   await page.evaluate(axe);const audit=await page.evaluate(async()=>window.axe.run(document,{preload:false,runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
   reports.push({width,violations:audit.violations.map(v=>v.id),incomplete:audit.incomplete.map(v=>v.id)});
   assert.equal(audit.violations.length,0);
   await page.screenshot({path:path.join(__dirname,`artifacts/expansion-detail-${width}.png`),fullPage:true});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  await fs.writeFile(path.join(__dirname,'artifacts/expansion.json'),JSON.stringify({status:'passed',reports,errors,unexpectedExternalRequests:external},null,2));
  console.log('PASS: new product search, honest budget, persistent favorites, comparison, matching quiz, photo/affiliate credits and three responsive WCAG audits. No Amazon or other external requests.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
