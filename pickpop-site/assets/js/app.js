/* pickpop starter catalog
 * Items and planning budgets are illustrative, NOT live Amazon products or prices.
 * Add independently verified recommendations and retailer-provided approved links before launch.
 */
(() => {
  'use strict';
  const products = [
    {id:'mug',name:'Everyday ceramic mug',category:'kitchen',emoji:'☕',budget:18,color:'#f3e4bd',chip:'Little ritual',description:'A cheerful cup for your morning pause.',tags:'coffee cup mug ceramic drink tea gifts minimal cozy',search:'ceramic coffee mug'},
    {id:'frother',name:'Handheld milk frother',category:'kitchen',emoji:'🥛',budget:16,color:'#e8dfff',chip:'Small joy',description:'A tiny upgrade for homemade lattes.',tags:'coffee milk frother cappuccino kitchen tool',search:'handheld milk frother'},
    {id:'spice',name:'Space-saving spice jars',category:'kitchen',emoji:'🫙',budget:25,color:'#fce0db',chip:'Tidy favorite',description:'Make a small shelf work beautifully.',tags:'jars organizer kitchen storage spices',search:'glass spice jars set'},
    {id:'glass',name:'Glass food containers',category:'kitchen',emoji:'🥗',budget:30,color:'#d9eecf',chip:'Everyday hero',description:'A little order for meal-prep days.',tags:'glass containers kitchen meal prep storage food box',search:'glass meal prep containers'},
    {id:'basket',name:'Woven storage basket',category:'home',emoji:'🧺',budget:28,color:'#f5e6ca',chip:'Cozy pick',description:'A softer way to hide the clutter.',tags:'home baskets storage organization cozy laundry',search:'woven storage basket'},
    {id:'lamp',name:'Cozy bedside lamp',category:'home',emoji:'💡',budget:39,color:'#ece4ff',chip:'Soft glow',description:'Warm up a nook or nightstand.',tags:'lamp home bedside light lighting bedroom desk',search:'small bedside lamp warm light'},
    {id:'plant',name:'Mini indoor planter',category:'home',emoji:'🪴',budget:19,color:'#dbeed7',chip:'Fresh energy',description:'A green touch for shelves and desks.',tags:'home planter pot plants greenery indoor',search:'small indoor planter pot'},
    {id:'candle',name:'Home candle set',category:'home',emoji:'🕯️',budget:22,color:'#ffe1c7',chip:'Reset moment',description:'Set the mood for a quieter evening.',tags:'home candle gifts cozy decor fragrance',search:'decorative candle set'},
    {id:'cables',name:'Desk cable organizer',category:'tech',emoji:'🔌',budget:14,color:'#d7e9fa',chip:'Less clutter',description:'Keep chargers from running wild.',tags:'cable desk computer gadget tech wire organizer office',search:'desktop cable organizer'},
    {id:'stand',name:'Adjustable phone stand',category:'tech',emoji:'📱',budget:18,color:'#e2dcf4',chip:'Work smarter',description:'Hands-free help wherever you sit.',tags:'phone stand gadget tech desk table smartphone',search:'adjustable phone stand desk'},
    {id:'headset',name:'Over-ear headphones',category:'tech',emoji:'🎧',budget:75,color:'#d8ddfb',chip:'Daily essential',description:'Find a listening setup that suits you.',tags:'tech headphone audio music bluetooth wireless',search:'wireless over ear headphones'},
    {id:'speaker',name:'Compact Bluetooth speaker',category:'tech',emoji:'🔊',budget:45,color:'#fbdbc9',chip:'Good sound',description:'Bring playlists from room to room.',tags:'music sound speaker bluetooth portable gadget tech',search:'compact bluetooth speaker'},
    {id:'bowl',name:'Slow-feeder pet bowl',category:'pets',emoji:'🐶',budget:17,color:'#feebba',chip:'Pet favorite',description:'A thoughtful addition to mealtime.',tags:'dog cat pet bowl slow feeder food',search:'slow feeder dog bowl'},
    {id:'toy',name:'Interactive cat toy',category:'pets',emoji:'🐈',budget:23,color:'#e9dafa',chip:'Playtime pick',description:'Make space for more daily play.',tags:'cat kitten pets pet toy interactive',search:'interactive cat toy'},
    {id:'leash',name:'Everyday dog leash',category:'pets',emoji:'🐕',budget:24,color:'#d5eddd',chip:'Walk ready',description:'Find an easy everyday walking setup.',tags:'dog pet leash collar walking outdoors',search:'durable dog leash'},
    {id:'fountain',name:'Pet water fountain',category:'pets',emoji:'💧',budget:38,color:'#d3e8fc',chip:'Daily care',description:'A handy idea for a pet-friendly home.',tags:'pet cat dog water fountain bowl drink',search:'cat water fountain'},
    {id:'blender',name:'Compact personal blender',category:'kitchen',emoji:'🍓',budget:65,color:'#fde0dc',chip:'Fresh start',description:'Small-batch smoothies and easy mornings.',tags:'blender kitchen smoothie appliance juice small compact',search:'personal blender for smoothies'},
    {id:'airfryer',name:'Countertop air fryer',category:'kitchen',emoji:'🍟',budget:115,color:'#e8e3da',chip:'Kitchen helper',description:'Explore compact countertop cooking.',tags:'air fryer kitchen appliance cooking oven',search:'compact air fryer'},
    {id:'rack',name:'Over-sink drying rack',category:'kitchen',emoji:'🍽️',budget:48,color:'#e3e8ee',chip:'Smart space',description:'A helpful idea for smaller counters.',tags:'kitchen rack drying dishes organization over sink',search:'over sink drying rack'},
    {id:'monitor',name:'Desk monitor riser',category:'tech',emoji:'🖥️',budget:55,color:'#dce7ec',chip:'Desk refresh',description:'Create a little breathing room below.',tags:'monitor riser stand desk tech office home',search:'wooden monitor riser desk'}
  ];
  const $ = id => document.getElementById(id);
  const grid=$('product-grid'); if(!grid) return;
  const search=$('product-search'), range=$('budget-range'), budgetText=$('budget-value'), summary=$('results-summary');
  const empty=$('empty-state'), fallback=$('amazon-fallback'), sort=$('sort-order'), savedToggle=$('saved-toggle'), savedCount=$('saved-count');
  let category='all', savedOnly=false;
  const storageStatus=$('saved-status');
  const productIds=new Set(products.map(p=>p.id));
  function readSaved(raw){
    try {const ids=JSON.parse(raw||'[]');return Array.isArray(ids)?[...new Set(ids.filter(id=>typeof id==='string'&&productIds.has(id)))]:[];} catch{return [];}
  }
  let saved=[];
  try {saved=readSaved(localStorage.getItem('pickpop-saved'));} catch{
    storageStatus.textContent='Browser storage is unavailable. Saved ideas will last only for this visit.';
  }
  let amount=Number(range.value);
  const startingParams=new URLSearchParams(location.search);
  const incomingQuery=startingParams.get('q');
  const incomingBudget=Number(startingParams.get('budget'));
  if(incomingQuery)search.value=incomingQuery.slice(0,120);
  if(startingParams.has('budget')&&Number.isFinite(incomingBudget)&&incomingBudget>=5&&incomingBudget<=300) {range.value=String(incomingBudget);amount=Number(range.value);}
  const AmazonSearch=q=>'https://www.amazon.com/s?k='+encodeURIComponent(q);
  const saveStore=()=>{try{localStorage.setItem('pickpop-saved',JSON.stringify(saved));storageStatus.textContent='';}catch{storageStatus.textContent='Browser storage is unavailable. Saved ideas will last only for this visit.';}};
  function budgetDisplay(){budgetText.textContent='$'+amount;range.setAttribute('aria-valuetext',`Up to ${amount} US dollars, illustrative planning budget`);const pct=((amount-5)/(300-5))*100;range.style.background=`linear-gradient(90deg, var(--coral) ${pct}%, #efece7 ${pct}%)`;document.querySelectorAll('[data-budget]').forEach(b=>{b.classList.toggle('active',Number(b.dataset.budget)===amount);b.setAttribute('aria-pressed',String(Number(b.dataset.budget)===amount))});}
  const normalize=text=>text.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  function getMatches(){
    const words=normalize(search.value).split(/\s+/).filter(Boolean);
    const filtered=products.filter(p=>{
      const haystack=normalize(p.name+' '+p.tags+' '+p.category+' '+p.description);
      return p.budget<=amount&&(category==='all'||p.category===category)&&(!savedOnly||saved.includes(p.id))&&(!words.length||words.every(word=>haystack.includes(word)));
    });
    if(sort.value==='asc') filtered.sort((a,b)=>a.budget-b.budget);
    else if(sort.value==='desc') filtered.sort((a,b)=>b.budget-a.budget);
    return filtered;
  }
  function render(){
    const matches=getMatches();
    grid.replaceChildren();empty.hidden=matches.length>0;
    savedCount.textContent=String(saved.length);
    savedToggle.setAttribute('aria-pressed',String(savedOnly));
    const n=matches.length;
    const context=[category==='all'?'all categories':category,search.value.trim()?`matching “${search.value.trim()}”`:''].filter(Boolean).join(', ');
    summary.textContent=`${n} ${savedOnly?'saved':'example'} idea${n===1?'':'s'} up to $${amount} · ${context}.`;
    $('empty-title').textContent=savedOnly?(saved.length?'Your saved ideas are outside these filters.':'Your next favorite is waiting.'):'No match in our starter collection.';
    $('empty-description').textContent=savedOnly?(saved.length?'Clear your filters to see every saved idea.':'Tap the heart on an idea to save it here. Browse the starter collection to find a little inspiration.'):'Try another keyword, raise your planning budget, or browse all example ideas. Amazon searches open separately and do not apply your PickPop budget.';
    $('reset-filters').textContent=savedOnly&&saved.length?'Show all saved ideas →':'See all ideas →';
    fallback.hidden=savedOnly;
    matches.forEach(p=>{
      const card=document.createElement('article');card.className='product-card';
      const visual=document.createElement('div');visual.className='product-visual';visual.style.background=p.color;
      const chip=document.createElement('span');chip.className='product-chip';chip.textContent=p.chip;
      const icon=document.createElement('span');icon.className='product-icon';icon.textContent=p.emoji;icon.setAttribute('aria-hidden','true');
      const heart=document.createElement('button');heart.className='heart-button'+(saved.includes(p.id)?' active':'');heart.type='button';heart.textContent=saved.includes(p.id)?'♥':'♡';heart.setAttribute('aria-label',(saved.includes(p.id)?'Remove from':'Save to')+' favorites: '+p.name);heart.setAttribute('aria-pressed',String(saved.includes(p.id)));
      heart.dataset.productId=p.id;
      heart.addEventListener('click',()=>{
        const hearts=[...grid.querySelectorAll('.heart-button')];
        const index=hearts.indexOf(heart);
        saved=saved.includes(p.id)?saved.filter(id=>id!==p.id):[...saved,p.id];saveStore();render();
        const remaining=[...grid.querySelectorAll('.heart-button')];
        const next=remaining.find(button=>button.dataset.productId===p.id)||remaining[Math.min(index,remaining.length-1)]||savedToggle;
        next.focus({preventScroll:true});
      });
      visual.append(chip,icon,heart);
      const copy=document.createElement('div');copy.className='product-copy';
      const c=document.createElement('div');c.className='product-category';c.textContent=p.category+' idea';
      const h=document.createElement('h3');h.textContent=p.name;
      const d=document.createElement('p');d.textContent=p.description;
      const pr=document.createElement('div');pr.className='product-price';const price=document.createElement('strong');price.textContent='$'+p.budget;const note=document.createElement('span');note.textContent='illustrative budget';pr.append(price,note);
      const link=document.createElement('a');link.className='product-cta';link.target='_blank';link.rel='noopener noreferrer nofollow';link.href=AmazonSearch(p.search);link.textContent='Search on Amazon';link.setAttribute('aria-label',`Search Amazon for ${p.name} (opens in a new tab; budget not applied)`);const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');link.append(arrow);
      copy.append(c,h,d,pr,link);card.append(visual,copy);grid.append(card);
    });
    if(!n){const input=search.value.trim();fallback.href=AmazonSearch(input||(category==='all'?'shopping ideas':category));}
  }
  function scrollToResults(){render();summary.focus({preventScroll:true});$('results').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
  search.addEventListener('input',render);
  search.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();scrollToResults();}});
  $('search-button').addEventListener('click',scrollToResults);
  $('find-button').addEventListener('click',scrollToResults);
  range.addEventListener('input',()=>{amount=Number(range.value);budgetDisplay();render();});
  document.querySelectorAll('[data-budget]').forEach(b=>b.addEventListener('click',()=>{amount=Number(b.dataset.budget);range.value=String(amount);budgetDisplay();render();}));
  document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});render();}));
  sort.addEventListener('change',render);
  savedToggle.addEventListener('click',()=>{savedOnly=!savedOnly;render();});
  function clearFilters(budget,keepSaved){category='all';savedOnly=keepSaved;search.value='';amount=budget;range.value=String(budget);sort.value='featured';document.querySelectorAll('[data-category]').forEach(x=>{const yes=x.dataset.category==='all';x.classList.toggle('active',yes);x.setAttribute('aria-pressed',String(yes))});budgetDisplay();render();}
  $('clear-filters').addEventListener('click',()=>clearFilters(50,false));
  $('reset-filters').addEventListener('click',()=>{clearFilters(300,savedOnly&&saved.length>0);summary.focus({preventScroll:true});});
  window.addEventListener('storage',event=>{if(event.key==='pickpop-saved'||event.key===null){saved=readSaved(event.newValue);render();}});
  document.querySelectorAll('[data-category]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===category)));
  budgetDisplay();render();
  if(incomingQuery&&!location.hash) document.querySelector('#finder')?.scrollIntoView({block:'start'});
})();
