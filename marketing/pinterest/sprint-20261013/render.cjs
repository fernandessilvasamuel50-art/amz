/* Local artwork generation/QA only; never contacts Pinterest or Amazon. */
const {chromium}=require('playwright');
const fs=require('node:fs/promises');const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const pins=JSON.parse(await fs.readFile(path.join(__dirname,'pins.json'),'utf8'));
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1000,height:1500},deviceScaleFactor:1});
 try{for(const pin of pins){
  await page.goto(pathToFileURL(path.join(__dirname,'masters',pin.id+'.html')).href);
  await page.evaluate(()=>document.fonts.ready);
  const issues=await page.evaluate(()=>[...document.querySelectorAll('main, main *')].filter(el=>{const r=el.getBoundingClientRect();return r.bottom>1500||r.right>1000||r.left<0;}).map(el=>el.tagName));
  if(issues.length)throw Error(pin.id+' overflow: '+issues);
  if(!await page.evaluate(()=>document.fonts.check('30px Outfit')&&document.fonts.check('30px DM')))throw Error('Fonts missing');
  await page.screenshot({path:path.join(__dirname,pin.image)});
 }
 console.log('PASS: four 1000×1500 PNGs; local fonts and bounds verified. Nothing published.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
