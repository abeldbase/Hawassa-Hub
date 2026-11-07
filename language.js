(function(){
 const textNodes=[...document.querySelectorAll('[data-i18n]')].map(el=>({el,value:el.textContent}));
 const htmlNodes=[...document.querySelectorAll('[data-i18n-html]')].map(el=>({el,value:el.innerHTML}));
 const ariaNodes=[...document.querySelectorAll('[data-i18n-aria]')].map(el=>({el,value:el.getAttribute('aria-label')}));
 const placeholderNodes=[...document.querySelectorAll('[data-i18n-placeholder]')].map(el=>({el,value:el.getAttribute('placeholder')}));
 let lang='en';
 try {const saved=localStorage.getItem('hawassahub-language');if(['en','am','fr'].includes(saved))lang=saved;} catch(e){}
 function setLanguage(next){
   if(!['en','am','fr'].includes(next))next='en';lang=next;window.hawassaLanguage=lang;
   document.documentElement.lang=lang;
   const words=translations[lang]||{};
   textNodes.forEach(({el,value})=>{el.textContent=words[el.dataset.i18n]||value;});
   htmlNodes.forEach(({el,value})=>{el.innerHTML=words[el.dataset.i18nHtml]||value;});
   placeholderNodes.forEach(({el,value})=>{el.setAttribute('placeholder',words[el.dataset.i18nPlaceholder]||value);});
   ariaNodes.forEach(({el,value})=>{el.setAttribute('aria-label',words[el.dataset.i18nAria]||value);});
   const menu=document.querySelector('.menu-toggle[aria-expanded]');if(menu)menu.setAttribute('aria-label',menu.getAttribute('aria-expanded')==='true'?(words.menuClose||'Close menu'):(words.menuOpen||'Open menu'));
   document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===lang)));
   document.querySelectorAll('[data-lang-block]').forEach(el=>{el.hidden=el.dataset.langBlock!==lang;});
   document.querySelectorAll('[data-anchor]').forEach(el=>{const section=el.closest('[data-lang-block]');if(section&&section.dataset.langBlock===lang)el.id=el.dataset.anchor;else el.removeAttribute('id');});
   const title=document.body.dataset.page==='research'?{en:'Research & sources — Hawassa Hub',am:'ጥናትና ምንጮች — ሐዋሳ ሀብ',fr:'Recherches et sources — Hawassa Hub'}:{en:'Hawassa Hub — Your guide to the lakeside city',am:'ሐዋሳ ሀብ — የከተማዋ መመሪያ',fr:'Hawassa Hub — Guide de la ville au bord du lac'};
   document.title=title[lang];
   try {localStorage.setItem('hawassahub-language',lang);}catch(e){}
   window.dispatchEvent(new CustomEvent('hawassa-language-change',{detail:{language:lang}}));
 }
 document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.language)));
 window.hawassaSetLanguage=setLanguage;setLanguage(lang);
 if(location.hash){requestAnimationFrame(()=>document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView());}
})();
