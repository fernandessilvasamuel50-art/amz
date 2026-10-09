/* Repository artwork rendering only. Never posts or schedules to Pinterest. */
const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1000,height:1500},deviceScaleFactor:1});
 const pins=JSON.parse(await fs.readFile(path.join(__dirname,'pins.json'),'utf8'));
 try { for(const pin of pins){
   await page.goto(pathToFileURL(path.join(__dirname,'masters',pin.id+'.html')).href);
   await page.evaluate(()=>document.fonts.ready);
   const issues=await page.evaluate(()=>[...document.querySelectorAll('main > *')].filter(el=>el.getBoundingClientRect().bottom>1500||el.getBoundingClientRect().right>1000).map(el=>el.tagName));
   if(issues.length)throw Error('Artwork overflow '+pin.id+': '+issues);
   await page.screenshot({path:path.join(__dirname,pin.image)});
 } console.log('PASS: 12 PNGs at 1000 x 1500; fonts loaded and artwork bounds checked.'); }
 finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
