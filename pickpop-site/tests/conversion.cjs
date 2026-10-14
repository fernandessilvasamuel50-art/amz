/* Home shortcuts, complete photo credits and buyer-journey regression checks. */
const {chromium}=require('playwright');const assert=require('node:assert/strict');
const fs=require('node:fs/promises');const path=require('node:path');
const base=process.env.PICKPOP_TEST_URL||'http://127.0.0.1:8082';
const priority=['chemex-six-cup','baratza-encore-black','victorinox-fibrox-chef'];
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.route('https://www.amazon.com/**',route=>route.abort());
 const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 const catalog=JSON.parse(await fs.readFile(path.join(__dirname,'../data/catalog.json'),'utf8'));
 const axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');let audits=0;
 try{
  for(const width of [360,768,1440]){
   await page.setViewportSize({width,height:900});await page.goto(base+'/');
   const links=page.locator('.home-routine-shortcuts a');
   assert.deepEqual(await links.evaluateAll(elements=>elements.map(el=>el.getAttribute('href'))),priority.map(id=>'/ideas/'+id+'/'));
   if(width===360)for(const link of await links.all())assert(await link.evaluate(el=>el.getBoundingClientRect().bottom<800),'Mobile shortcut too far down');
   assert.equal(await page.locator('#local-diagnostics:visible').count(),0);
   await page.evaluate(axe);
   assert.deepEqual((await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);audits++;
   for(const id of priority){
    await page.goto(base+'/ideas/'+id+'/');const item=catalog.items.find(product=>product.id===id);
    const credit=page.locator('#product-photo-credit');assert.equal(await credit.count(),1);
    assert((await credit.textContent()).includes(item.image.author));assert((await credit.textContent()).includes(item.image.changes));
    assert.equal(await credit.locator('a').nth(0).getAttribute('href'),item.image.source);
    assert.equal(await credit.locator('a').nth(1).getAttribute('href'),item.image.licenseUrl);
    assert.equal(await page.locator('figcaption a').getAttribute('href'),'#product-photo-credit');
    assert.equal(await page.locator('[data-placement="detail-intro"]').getAttribute('href'),item.affiliateUrl);
    assert((await page.locator('[data-placement="detail-intro"]').getAttribute('rel')).includes('sponsored'));
    if(width===360)assert(await page.locator('[data-placement="detail-intro"]').evaluate(el=>el.getBoundingClientRect().top<1200));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);audits++;
   }
  }
  const staticContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:900}});
  const staticPage=await staticContext.newPage();await staticPage.goto(base+'/');
  const shortcut=staticPage.locator('.home-routine-shortcuts a').first();await shortcut.focus();await staticPage.keyboard.press('Enter');await staticPage.waitForURL('**/ideas/chemex-six-cup/');
  await staticPage.locator('figcaption a').click();assert(await staticPage.locator('#product-photo-credit').isVisible());
  assert.deepEqual(errors,[]);console.log(`PASS: ${audits} responsive/accessibility audits, 3 early Home paths, preserved full credits and sponsored URLs; keyboard journey without JavaScript; no retailer navigation.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
