(function(){
 const list=document.getElementById('place-list');if(!list)return;
 const count=document.getElementById('result-count'),empty=document.getElementById('empty'),search=document.getElementById('search');
 const filters=[...document.querySelectorAll('.filter')],interestLinks=[...document.querySelectorAll('[data-interest]')];
 const settings=window.HAWASSA_SETTINGS||{};
 const ownerBusinesses=Array.isArray(settings.businesses)?settings.businesses:[];
 ownerBusinesses.filter(p=>p&&typeof p.name==='string'&&typeof p.category==='string').forEach((p,i)=>places.push({id:'owner_'+i,category:p.category,zone:'Hawassa',name:p.name,description:p.description||'A local listing submitted by the business.',note:'Contact the business directly to confirm its details.',source:p.url||'',sourceLabel:'Business information',search:[p.name,p.address,p.category].join(' '),address:p.address?{en:p.address,am:p.address,fr:p.address}:null}));
 let current='All',interest=null;
 const interestIds={top:['lake','market','amora','tabor','gabriel'],museums:['sidamamuseum'],film:[],music:['hall'],parks:['amora']};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function validUrl(value){try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)?u.href:null;}catch(e){return null;}}
 function render(){
  const lang=window.hawassaLanguage||'en',words=translations[lang]||{},q=search.value.trim().toLowerCase();
  const found=places.filter(p=>{
   const allLocales=[...Object.values(placeLocales).flatMap(locale=>locale[p.id]||[]),...Object.values(p.locales||{}).flatMap(v=>v||[])];
   const address=p.address||addressDetails[p.id]||{};
   return (current==='All'||p.category===current)&&(!interest||(interestIds[interest]||[]).includes(p.id)||(Array.isArray(p.interests)&&p.interests.includes(interest)))&&(!q||[p.name,p.description,p.search,p.zone,p.category,...Object.values(address),...allLocales].join(' ').toLowerCase().includes(q));
  });
  list.innerHTML=found.map(p=>{
   const local=p.locales?.[lang]||placeLocales[lang]?.[p.id]||[p.name,p.description,p.note];
   const category=categoryLocales[lang]?.[p.category]||p.category,zone=zoneLocales[lang]?.[p.zone]||p.zone;
   const source=sourceLocales[lang]?.[p.sourceLabel]||p.sourceLabel;
   const a=p.address||addressDetails[p.id],address=a?(a[lang]||a.en):'';
   const addressLine=address?`<p class="place-address"><strong>${esc(words.addressLabel||'Address')}:</strong> ${esc(address)}</p>`:'';
   const mapQuery=(p.mapQuery||p.name+' '+(a?.en||'Hawassa Ethiopia')).trim();
   const mapLink=address?`<a class="map-link" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(mapQuery)}" target="_blank" rel="noopener noreferrer">${esc(words.mapSearch||'Find on map')} ↗</a>`:'';
   const src=validUrl(p.source);
   const sourceLink=src?`<a class="card-source" href="${esc(src)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(words.sourceFor||'Source for')} ${esc(local[0])}: ${esc(source)}"><span>${esc(source)}</span><span aria-hidden="true">↗</span></a>`:'';
   return `<article class="place-card"><div class="card-top"><span class="category-label">${esc(category)}</span><span class="zone">${esc(zone)}</span></div><h3>${esc(local[0])}</h3><p>${esc(local[1])}</p>${addressLine}<p class="note">${esc(local[2])}</p>${mapLink}${sourceLink}</article>`;
  }).join('');
  count.textContent=lang==='en'?(found.length===1?'1 place to explore':`${found.length} places to explore`):(found.length===1?words.placeCountOne:words.placeCountMany.replace('{n}',found.length));
  empty.hidden=found.length!==0;
  empty.textContent=(interest==='film'&&!q)?(words.emptyFilm||'No film or theater listings yet. Contact us to suggest one.'):(words.empty||'No places match that search. Try another word or category.');
 }
 function setCategory(value){current=value;interest=null;interestLinks.forEach(a=>a.classList.remove('active'));filters.forEach(f=>{const active=f.dataset.category===current;f.classList.toggle('active',active);f.setAttribute('aria-pressed',String(active));});render();}
 filters.forEach(f=>f.addEventListener('click',()=>setCategory(f.dataset.category)));
 document.querySelectorAll('[data-set-category]').forEach(el=>el.addEventListener('click',()=>{search.value='';setCategory(el.dataset.setCategory);}));
 interestLinks.forEach(a=>a.addEventListener('click',()=>{interest=a.dataset.interest;current='All';search.value='';interestLinks.forEach(x=>x.classList.toggle('active',x===a));filters.forEach(f=>{const active=f.dataset.category==='All';f.classList.toggle('active',active);f.setAttribute('aria-pressed',String(active));});render();}));
 search.addEventListener('input',render);window.addEventListener('hawassa-language-change',render);
 const toggle=document.querySelector('.menu-toggle'),nav=document.getElementById('mobile-nav');
 if(toggle&&nav){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));toggle.setAttribute('aria-label',open?(translations[window.hawassaLanguage]?.menuOpen||'Open menu'):(translations[window.hawassaLanguage]?.menuClose||'Close menu'));nav.hidden=open;});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',translations[window.hawassaLanguage]?.menuOpen||'Open menu');}));}
 render();
})();
