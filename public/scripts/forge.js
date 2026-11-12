(() => {
  'use strict';
  const challenges = [
    {title:'یک اصطکاک را حذف کن.',copy:'کاری را پیدا کن که هر روز بی‌دلیل وقتت را می‌گیرد. ساده‌ترین راه حذف یک مرحله را طراحی کن.',type:'SYSTEM DESIGN',time:'25 MIN'},
    {title:'با یک محدودیت خلق کن.',copy:'یک ایده انتخاب کن و فقط با سه ابزار یا سه قانون اجراش کن. محدودیت را به سبک تبدیل کن.',type:'CREATIVITY',time:'30 MIN'},
    {title:'چیزی را از نو ببین.',copy:'به یک شیء معمولی نگاه کن؛ سه کاربرد تازه برایش پیدا کن که قبلاً به ذهنت نرسیده بود.',type:'OBSERVATION',time:'15 MIN'},
    {title:'یک نسخه‌ی ناقص بساز.',copy:'به‌جای برنامه‌ریزی طولانی، کوچک‌ترین نمونه‌ی قابل‌استفاده از ایده‌ات را همین امروز بساز.',type:'PROTOTYPE',time:'40 MIN'},
    {title:'یک سؤال سخت بپرس.',copy:'باوری را که همیشه بدیهی فرض کرده‌ای انتخاب کن. چه مدرکی می‌تواند آن را تغییر دهد؟',type:'CRITICAL THINKING',time:'20 MIN'},
    {title:'چیزی را مستند کن.',copy:'یک مهارت یا فرایند را که بلدی در پنج قدم بنویس؛ طوری که یک نفر دیگر بتواند تکرارش کند.',type:'KNOWLEDGE',time:'25 MIN'}
  ];
  const $ = (id) => document.getElementById(id);
  const title=$('challenge-title'),copy=$('challenge-copy'),type=$('challenge-type'),time=$('challenge-time');
  if(!title||!copy||!type||!time)return;
  let last=-1;
  const roll=()=>{let n=Math.floor(Math.random()*challenges.length);if(challenges.length>1&&n===last)n=(n+1)%challenges.length;last=n;const c=challenges[n];title.textContent=c.title;copy.textContent=c.copy;type.textContent=c.type;time.textContent=c.time;};
  $('forge-roll')?.addEventListener('click',roll);
  const note=$('forge-note'),count=$('forge-count'),list=$('forge-list'),total=$('forge-total'),status=$('forge-status');
  const KEY='godhand-forge-notes-v1';
  const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v.filter(x=>x&&typeof x.text==='string'&&typeof x.date==='string').slice(0,100):[]}catch{return[]}};
  const render=()=>{const items=read();total.textContent=items.length+' ثبت';list.replaceChildren();if(!items.length){const p=document.createElement('p');p.className='forge-empty';p.textContent='هنوز ردی ثبت نشده. اولین جرقه منتظر توست.';list.append(p);return;}items.forEach(item=>{const article=document.createElement('article');article.className='forge-entry';const timeEl=document.createElement('time');timeEl.textContent=new Date(item.date).toLocaleString('fa-IR');const p=document.createElement('p');p.textContent=item.text;article.append(timeEl,p);list.append(article);});};
  note?.addEventListener('input',()=>{count.textContent=note.value.length.toLocaleString('fa-IR')+' / ۱۲۰۰';});
  $('forge-save')?.addEventListener('click',()=>{const value=note.value.trim();if(!value){status.textContent='اول یک ردپا بنویس.';return;}try{const items=read();items.unshift({text:value,date:new Date().toISOString()});localStorage.setItem(KEY,JSON.stringify(items.slice(0,100)));note.value='';count.textContent='۰ / ۱۲۰۰';status.textContent='ردپایت روی همین دستگاه ثبت شد.';render();}catch{status.textContent='ذخیره‌سازی در این مرورگر در دسترس نیست.';}});
  const date=$('forge-date');if(date)date.textContent=new Date().toLocaleDateString('fa-IR',{year:'numeric',month:'long',day:'numeric'});
  render();
})();