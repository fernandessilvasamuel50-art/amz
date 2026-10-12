/* Batch-specific regression: real local records, no retailer test clicks. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const base=process.env.PICKPOP_TEST_URL||'http://127.0.0.1:8082';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({reducedMotion:'reduce'});
 const page=await context.newPage(),errors=[],external=[],audits=[];
 page.on('pageerror',e=>errors.push(e.message));
 context.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url());});
 const ready=()=>page.waitForFunction(()=>document.querySelector('#product-search')&&!document.querySelector('#product-search').disabled);
 const axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 const batchFile=process.env.PICKPOP_BATCH_FILE||'batch-02.json';
 assert(/^batch-0[23]\.json$/.test(batchFile));
 const label=batchFile.replace('.json','');
 const batch=JSON.parse(await fs.readFile(path.join(__dirname,'../../docs/catalog-batches',batchFile),'utf8'));
 try{
  for(const item of batch.items){
   await page.goto(base+'/find/?q='+encodeURIComponent(item.brand)+'&category=kitchen&budget=5');await ready();
   const favorite=page.locator(`[data-product-id="${item.id}"]`);
   assert.equal(await favorite.count(),1);
   assert((await page.locator('#budget-help').textContent()).includes('not excluded'));
   await favorite.click();await page.reload();await ready();
   assert.equal(await favorite.getAttribute('aria-pressed'),'true');
   await favorite.click();assert.equal(await favorite.getAttribute('aria-pressed'),'false');
   await page.locator(`[data-compare-id="${item.id}"]`).click();
   assert((await page.locator('#comparison').textContent()).includes(item.brand));
   for(const width of [360,768,1440]){
    await page.setViewportSize({width,height:900});await page.goto(base+'/ideas/'+item.id+'/');
    await page.locator('img[src="'+item.image.src+'"]').evaluate(img=>img.decode());
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    const link=page.locator('[data-placement="detail-intro"]');
    assert.equal(await link.getAttribute('href'),item.affiliateUrl);
    assert((await link.getAttribute('rel')).includes('sponsored'));
    assert((await page.locator('.photo-credit').textContent()).includes(item.image.author));
    assert((await page.locator('.photo-credit').textContent()).includes(item.image.license));
    assert((await page.textContent('body')).includes('As an Amazon Associate I earn from qualifying purchases.'));
    await page.evaluate(axe);
    const audit=await page.evaluate(async()=>window.axe.run(document,{preload:false,runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
    audits.push({id:item.id,width,violations:audit.violations.map(v=>v.id)});
    assert.equal(audit.violations.length,0);
    await page.screenshot({path:path.join(__dirname,`artifacts/${label}-${item.id}-${width}.png`),fullPage:true});
   }
  }
  const choices={
   'aeropress-go':['modern','small-spaces'],
   'kuhn-rikon-swiss-peeler-blue':['modern','small-spaces'],
   'baratza-encore-black':['minimalist','everyday-convenience'],
   'fellow-stagg-ekg-pro-walnut':['modern','aesthetic-design'],
   'victorinox-fibrox-chef':['minimalist','small-spaces']
  };
  for(const item of batch.items){
   const [style,priority]=choices[item.id];
   assert(item.styles.includes(style)&&item.priorities.includes(priority));
   await page.goto(base+'/');await ready();
   for(const [name,value] of [['category',item.category],['budget','50'],['style',style],['priority',priority]]){
    await page.locator(`[name="quiz-${name}"][value="${value}"]`).check();await page.locator('#quiz-next').click();
   }
   const recommendations=(await page.locator('#quiz-app .product-copy').allTextContents()).join(' ');
   assert(recommendations.includes(item.brand));
   assert((await page.locator('#quiz-app .why-match').allTextContents()).every(reason=>reason.includes('priority')));
  }
  assert.equal((await page.request.get(base+'/ideas/instant-rio-mini-black/')).status(),404);
  assert.equal((await page.request.get(base+'/assets/products/instant-rio-mini-black.webp')).status(),404);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  await fs.writeFile(path.join(__dirname,`artifacts/${label}.json`),JSON.stringify({status:'passed',base,ids:batch.items.map(i=>i.id),audits,errors,unexpectedExternalRequests:external},null,2));
  console.log(`PASS: ${batch.items.length} additions search, budget, favorites, comparison, individual quiz matches, photo/affiliate credit, ${audits.length} responsive accessibility audits; RIO remains held. No external requests.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
