(function(){
 const s=window.HAWASSA_SETTINGS||{};
 const t=(key,fallback)=>translations[window.hawassaLanguage]?.[key]||fallback;
 const email=(typeof s.contactEmail==='string' && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(s.contactEmail))?s.contactEmail:'abeldbase@gmail.com';
 function safeUrl(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch(e){return null;}}
 function updateContacts(){
  document.querySelectorAll('[data-email-contact]').forEach(a=>{a.href='mailto:'+email+'?subject='+encodeURIComponent(t('contactSubject','Hawassa Hub business enquiry'));});
  document.querySelectorAll('[data-event-email]').forEach(a=>{a.href='mailto:'+email+'?subject='+encodeURIComponent('Hawassa Hub event listing');});
  const phone=String(s.whatsappNumber||'').replace(/[^0-9]/g,'');
  document.querySelectorAll('[data-whatsapp-contact]').forEach(a=>{if(/^[1-9][0-9]{7,14}$/.test(phone)){a.href='https://wa.me/'+phone+'?text='+encodeURIComponent(t('contactSubject','Hawassa Hub business enquiry'));a.hidden=false;}else{a.hidden=true;a.removeAttribute('href');}});
 }
 function renderSponsors(){
  const box=document.getElementById('sponsor-list');if(!box)return;
  const sponsors=(Array.isArray(s.sponsors)?s.sponsors:[]).filter(x=>x&&typeof x.name==='string'&&x.name.trim());
  if(!sponsors.length)return;
  box.replaceChildren();
  sponsors.forEach(item=>{
   const wrap=document.createElement('div');wrap.className='sponsor-entry';
   const badge=document.createElement('span');badge.className='sponsor-badge';badge.textContent=t('sponsorTag','Sponsored');wrap.appendChild(badge);
   const p=document.createElement('p');const url=safeUrl(item.url);
   if(url){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='sponsored noopener noreferrer';a.textContent=item.name;p.appendChild(a);}else p.textContent=item.name;
   wrap.appendChild(p);box.appendChild(wrap);
  });
 }
 function renderEvents(){
  const box=document.getElementById('owner-events');if(!box)return;
  box.replaceChildren();
  const now=Date.now();
  const events=(Array.isArray(s.events)?s.events:[]).filter(e=>e&&typeof e.name==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(e.date||''));
  events.forEach(e=>{
   const end=new Date(e.date+'T23:59:59+03:00');if(Number.isNaN(end.getTime())||end.getTime()<now)return;
   const article=document.createElement('article');article.className='event-card';
   const date=document.createElement('span');date.className='event-date';date.textContent=e.date+(e.location?' · '+e.location:'');article.appendChild(date);
   const h=document.createElement('h3');h.textContent=e.name;article.appendChild(h);
   if(e.description){const p=document.createElement('p');p.textContent=e.description;article.appendChild(p);}
   const url=safeUrl(e.url);if(url){const a=document.createElement('a');a.className='text-link';a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=t('eventNameOwner','Event information')+' ↗';article.appendChild(a);}
   box.appendChild(article);
  });
 }
 function render(){updateContacts();renderSponsors();renderEvents();}
 const forum=document.getElementById('sidama-forum');if(forum)forum.hidden=Date.now()>Date.parse('2026-11-08T23:59:59+03:00');
 window.addEventListener('hawassa-language-change',render);render();
})();
