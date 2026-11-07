(function(){
 const s=window.HAWASSA_SETTINGS||{};
 const counter=document.getElementById('view-count');
 const status=document.getElementById('view-status');
 let state='loading',value=null;
 function display(){
  const lang=window.hawassaLanguage||'en',words=translations[lang]||{};
  const defaults={loading:'Loading…',pending:'Starts when the site is public',unavailable:'Temporarily unavailable',off:'Counter disabled'};
  const keys={loading:'viewsLoading',pending:'viewsPending',unavailable:'viewsUnavailable',off:'viewsOff'};
  if(counter)counter.textContent=Number.isFinite(value)?new Intl.NumberFormat(lang==='fr'?'fr-FR':lang==='am'?'am-ET':'en-US').format(value):'—';
  if(status)status.textContent=state==='ready'?'':(words[keys[state]]||defaults[state]);
 }
 window.addEventListener('hawassa-language-change',display);
 if(s.counterEnabled!==true||!/^[a-z0-9_-]{4,120}$/i.test(s.counterKey||'')){state='off';display();return;}
 const host=location.hostname.toLowerCase();
 const live=location.protocol==='https:'&&!host.endsWith('.chatgpt.site')&&host!=='localhost'&&host!=='terminal.local';
 if(!live&&!s.allowLocalCounterTest){state='pending';display();return;}
 fetch('https://countapi.mileshilliard.com/api/v1/hit/'+encodeURIComponent(s.counterKey),{cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'})
  .then(r=>{if(!r.ok)throw Error('Counter unavailable');return r.json();})
  .then(data=>{const n=Number(data.value);if(!Number.isSafeInteger(n)||n<0)throw Error('Invalid counter');value=n;state='ready';display();})
  .catch(()=>{state='unavailable';display();});
 display();
})();
