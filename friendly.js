/* Inclusive UniTime – friendliness add-on: quick filters, toasts, help & tips, print. Loaded by app.html. */
(()=>{
const $=s=>document.querySelector(s),DAYS=['Mon','Tue','Wed','Thu','Fri'];

document.head.insertAdjacentHTML('beforeend',`<style>
.quick{display:flex;flex-wrap:wrap;gap:.5rem;margin:0 0 1rem}
.quick button{font:inherit;font-weight:700;border:2px solid var(--line);background:var(--card);color:var(--navy);border-radius:99px;padding:.45rem 1.05rem;cursor:pointer;transition:border-color .15s,transform .15s}
.quick button:hover{border-color:var(--blue);transform:translateY(-1px)}
#toasts{position:fixed;left:1rem;bottom:1rem;z-index:20;display:grid;gap:.5rem;max-width:min(380px,90vw)}
.toast{background:#142a52;color:#fff;padding:.8rem 1.1rem;border-radius:14px;font-weight:700;box-shadow:0 14px 30px -10px rgba(0,0,0,.5);border-left:5px solid #ffb000;animation:tIn .3s both}
@keyframes tIn{from{opacity:0;transform:translateY(10px)}}
.tips{list-style:none;margin:0;padding:0;display:grid;gap:.7rem}
.tips li{display:flex;gap:.8rem;align-items:flex-start}.tips .e{font-size:1.4rem;line-height:1.2}
#help .lead{margin:0;color:var(--muted)}
@media(max-width:860px){#toasts{bottom:5.4rem;left:.6rem}}
@media print{header,nav,.skip,#a11y-dock,#a11y-ruler,.quick,#filters,.head button,#toasts,.tools{display:none!important}
 .app{display:block;padding:0}body{background:#fff}.tbl{display:block!important;box-shadow:none}.cards{display:none!important}}
</style>`);

document.body.insertAdjacentHTML('beforeend',`<div id="toasts" aria-hidden="true"></div>
<dialog id="help" aria-labelledby="hT"><form method="dialog"><h3 id="hT">Welcome to Inclusive UniTime 👋</h3>
<p class="lead">A few things that make this easier:</p><ul class="tips" id="tips"></ul>
<div class="actions"><button class="btn">Got it</button></div></form></dialog>`);

const toast=t=>{const d=document.createElement('div');d.className='toast';d.textContent=t;$('#toasts').appendChild(d);setTimeout(()=>d.remove(),4500)};

/* Toast feedback for staff actions (the on-page status messages stay for screen readers) */
['#mStatus','#uStatus'].forEach(s=>{const e=$(s);new MutationObserver(()=>{const t=e.textContent.trim();if(t)toast('✓ '+t)}).observe(e,{childList:true,characterData:true,subtree:true})});

/* Quick filters on the timetable */
$('#filters').insertAdjacentHTML('beforebegin',`<div class="quick" role="group" aria-label="Quick filters">
<button type="button" data-q="0">Today</button><button type="button" data-q="1">Tomorrow</button>
<button type="button" data-q="am">Mornings</button><button type="button" data-q="pm">Afternoons</button><button type="button" data-q="all">Show everything</button></div>`);
const fire=el=>el.dispatchEvent(new Event('change',{bubbles:true}));
$('.quick').onclick=e=>{const b=e.target.closest('button');if(!b)return;const q=b.dataset.q;
 if(q==='all'){$('#filters').reset();return toast('Showing the full week')}
 if(q==='am'||q==='pm'){$('#fTime').value=q;return fire($('#fTime'))}
 const d=new Date();d.setDate(d.getDate()+ +q);const i=(d.getDay()+6)%7;
 $('#fDay').value=i<5?DAYS[i]:'';fire($('#fDay'));
 if(i>4)toast(`No classes ${q==='0'?'today':'tomorrow'} – enjoy the weekend! 🎉`)};

/* Print button */
$('#icsBtn').insertAdjacentHTML('afterend','<button class="btn alt" id="prBtn" type="button">Print</button>');
$('#prBtn').onclick=()=>print();

/* Help & first-visit tips */
$('.tools').insertAdjacentHTML('afterbegin','<button class="chip" id="helpBtn" type="button" aria-label="Help and tips"><b aria-hidden="true">?</b><span>Help</span></button>');
function openHelp(){const staff=$('#role').value==='staff';
 const T=[['🔊','Press <b>Listen</b> (bottom right) or <b>Alt+R</b> to hear any page read aloud.'],
  ['🔍','Press <b>Ctrl+K</b> to search for a module, venue or day.'],
  ['♿','Open <b>Accessibility</b> to change text size, contrast, spacing, fonts and colours.'],
  staff?['✏️','Edit, add or cancel classes under <b>Staff dashboard</b>. Students are notified automatically.']
       :['📅','Use <b>Export to calendar</b> on the timetable to add your classes to Google, Outlook or Apple Calendar.']];
 $('#tips').innerHTML=T.map(([e,t])=>`<li><span class="e" aria-hidden="true">${e}</span><span>${t}</span></li>`).join('');$('#help').showModal()}
$('#helpBtn').onclick=openHelp;
$('#help').addEventListener('close',()=>{try{localStorage.setItem('ut-welcomed','1')}catch(e){}});
try{if(!localStorage.getItem('ut-welcomed'))setTimeout(openHelp,600)}catch(e){}
})();
