/* Crawlable directory QA; retailer navigation is forbidden. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const base=process.env.PICKPOP_TEST_URL||'http://127.0.0.1:8082';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.route(/https:\/\/(www\.)?amazon\.com\//,()=>{throw new Error('Retailer navigation is forbidden during discovery QA');});
 const page=await context.newPage();
 const catalog=JSON.parse(await fs.readFile(path.join(__dirname,'../data/catalog.json'),'utf8'));
 const axe=await fs.readFile(require.resolve('axe-core/axe.min.js'),'utf8');
 let audits=0;
 try{
  for(const width of [360,768,1440]){
   await page.setViewportSize({width,height:900});
   for(const route of ['/collections/','/collections/coffee-corner/','/collections/small-kitchen/']){
    assert.equal((await page.goto(base+route)).status(),200);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    if(route==='/collections/'){
     const directory=page.locator('section[aria-labelledby="catalog-heading"]');
     const urls=await directory.locator('li a').evaluateAll(links=>links.map(link=>link.getAttribute('href')));
     assert.deepEqual(urls,catalog.items.map(item=>'/ideas/'+item.id+'/'));
     if(width===360){
      await fs.mkdir(path.join(__dirname,'artifacts'),{recursive:true});
      await directory.screenshot({path:path.join(__dirname,'artifacts/seo-directory-360.png')});
     }
    }
    await page.evaluate(axe);
    const audit=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
    assert.deepEqual(audit.violations.map(value=>value.id),[]);audits++;
   }
  }
  // axe uses JavaScript timers; run the separate browsing check with JS disabled.
  const staticContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:900}});
  await staticContext.route(/https:\/\/(www\.)?amazon\.com\//,()=>{throw new Error('Retailer navigation is forbidden during discovery QA');});
  const staticPage=await staticContext.newPage();
  await staticPage.goto(base+'/collections/');
  assert.equal(await staticPage.locator('section[aria-labelledby="catalog-heading"] li a').count(),11);
  const link=staticPage.locator('#catalog-heading').locator('..').getByRole('link',{name:'KONG Classic Stuffable Dog Toy — Medium, Red',exact:true});
  await link.focus();await staticPage.keyboard.press('Enter');await staticPage.waitForURL('**/ideas/kong-classic-medium/');
  assert.equal(await staticPage.locator('h1').textContent(),'KONG Classic Stuffable Dog Toy — Medium, Red');
  console.log(`PASS: ${audits} responsive/accessibility audits; 11 directory links and no-JavaScript keyboard navigation to KONG; no retailer requests.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
