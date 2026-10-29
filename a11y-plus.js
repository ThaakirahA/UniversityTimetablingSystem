/* Inclusive UniTime – accessibility add-on. Add <script src="a11y-plus.js"></script> before </body>. */
(()=>{
const KEY='ut-a11y',root=document.documentElement,$=s=>document.querySelector(s);
const D={font:'',ls:'',lh:'',tone:'',cursor:'',links:'',focus:'',simple:'',ruler:'',hover:'',notify:'on',rate:'1',voice:''};
let S={...D};try{Object.assign(S,JSON.parse(localStorage.getItem(KEY)))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const synth=window.speechSynthesis,FULL={Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday'};

/* ---------- CSS ---------- */
const css=`
.a-sr{position:absolute;left:-999px}
#a11y-dock{position:fixed;right:1rem;bottom:1rem;z-index:8;display:flex;align-items:center;gap:.4rem;background:#142a52;color:#fff;padding:.4rem;border-radius:99px;box-shadow:0 14px 30px -10px rgba(0,0,0,.55)}
#a11y-dock button,#a11y-dock select{font:inherit;font-size:.9rem;font-weight:700;display:inline-flex;align-items:center;gap:.4rem;border:0;border-radius:99px;padding:.5rem .9rem;cursor:pointer;background:rgba(255,255,255,.14);color:#fff}
#a11y-dock select option{color:#000}
#a11y-dock #aListen{background:#ffb000;color:#1a1200}
#a11y-dock button:hover{filter:brightness(1.15)}
.a-msg{font-size:.8rem;max-width:14rem;padding:0 .5rem}.a-msg:empty{display:none}
#a11y-more .row{flex-wrap:wrap}#a11y-more h3{margin-top:.4rem}
#a11y-more select{width:auto;max-width:100%}
#a11y-ruler{display:none;position:fixed;left:0;top:0;width:100%;height:2.5rem;pointer-events:none;z-index:7;border-top:3px solid #ffb000;border-bottom:3px solid #ffb000;box-shadow:0 0 0 100vmax rgba(0,0,0,.5)}
html[data-a-ruler=on] #a11y-ruler{display:block}
html[data-a-font=lexend] body{font-family:Lexend,"Atkinson Hyperlegible",sans-serif}
html[data-a-font=arial] body{font-family:Arial,Helvetica,sans-serif}
html[data-a-ls="1"] body{letter-spacing:.06em;word-spacing:.12em}
html[data-a-ls="2"] body{letter-spacing:.12em;word-spacing:.22em}
html[data-a-lh="1"] body{line-height:1.8}html[data-a-lh="2"] body{line-height:2.2}
html[data-a-tone=sepia]{--bg:#f4ecd8;--card:#fbf6e9;--tint:#f1e7cc;--sky:#efe2bd;--line:#d9c9a0;--text:#2b2416;--muted:#5b5036}
html[data-a-tone=sepia] body{background:var(--bg)}
html[data-a-tone=grey]{filter:grayscale(1)}
html[data-a-tone=invert]{filter:invert(1) hue-rotate(180deg)}
html[data-a-cursor=on],html[data-a-cursor=on] *{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M5 3l22 14-10 2-5 10z' fill='black' stroke='white' stroke-width='2'/%3E%3C/svg%3E") 5 3,auto!important}
html[data-a-links=on] :is(a,button,select,input,textarea,[role=switch]){outline:3px dashed var(--blue);outline-offset:2px}
html[data-a-focus=on] :focus-visible{outline:5px solid #ff6a00!important;outline-offset:4px;box-shadow:0 0 0 9px rgba(255,255,255,.9)}
html[data-a-simple=on] .stats,html[data-a-simple=on] .hero::before,html[data-a-simple=on] .hero::after{display:none}
html[data-a-simple=on] body{background:var(--bg)}
@media(max-width:860px){#a11y-dock{bottom:5.4rem;right:.6rem}#a11y-dock span:not(.a-msg),#a11y-dock select{display:none}#a11y-dock button{padding:.6rem}}`;
document.head.insertAdjacentHTML('beforeend',`<style>${css}</style>`);

/* ---------- Speech ---------- */
const ic=p=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const IC={spk:'<path d="M11 5 6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',pause:'<path d="M8 5v14M16 5v14"/>',play:'<path d="M7 4v16l13-8z"/>',stop:'<rect x="6" y="6" width="12" height="12" rx="2"/>'};
let q=[],qi=0,speaking=false,paused=false,tok=0,msgT;
const msg=t=>{const m=$('.a-msg');m.textContent=t;clearTimeout(msgT);msgT=setTimeout(()=>m.textContent='',5000)};
const voices=()=>synth?synth.getVoices():[];
const pick=()=>{const v=voices();return v.find(x=>x.voiceURI===S.voice)||v.find(x=>x.lang.startsWith((root.lang||'en')))||null};
const clean=t=>t.replace(/\b(Mon|Tue|Wed|Thu|Fri)\b/g,m=>FULL[m])
 .replace(/(\d{1,2}):(\d\d)\s*[–-]\s*(\d{1,2}):(\d\d)/g,(a,h1,m1,h2,m2)=>`${+h1}${m1==='00'?'':' '+m1} to ${+h2}${m2==='00'?'':' '+m2}`).replace(/·/g,',');
function run(){const my=tok;if(qi>=q.length){speaking=false;return ui()}
 const u=new SpeechSynthesisUtterance(q[qi]),v=pick();if(v){u.voice=v;u.lang=v.lang}u.rate=+S.rate;
 u.onend=()=>{if(my===tok){qi++;run()}};u.onerror=e=>{if(my===tok&&!/interrupted|canceled/.test(e.error)){speaking=false;ui()}};
 synth.speak(u);ui()}
function say(t){if(!synth)return msg('Speech is not supported in this browser.');stop();
 q=clean(t).replace(/\s+/g,' ').split(/(?<=[.!?])\s+/).filter(s=>s.trim());if(!q.length)return;qi=0;speaking=true;run()}
function stop(){tok++;speaking=paused=false;q=[];synth&&synth.cancel();ui()}
function pause(){if(!speaking)return;paused?synth.resume():synth.pause();paused=!paused;ui()}
function ui(){$('#aListen').innerHTML=ic(speaking?IC.stop:IC.spk)+`<span>${speaking?'Stop':'Listen'}</span>`;
 const p=$('#aPause');p.hidden=!speaking;p.innerHTML=ic(paused?IC.play:IC.pause);p.setAttribute('aria-label',paused?'Resume reading':'Pause reading')}
function textOf(el){const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.textContent.trim()&&!n.parentElement.closest('[hidden],[aria-hidden=true],.mini,.btn,.switch,select,option,script,style,svg,.badge')?1:2});
 const o=[];while(w.nextNode())o.push(w.currentNode.textContent.trim().replace(/[.!?]+$/,''));return o.join('. ')}
function pageText(){const sel=String(getSelection()).trim();if(sel)return sel;
 const s=document.querySelector('[data-view]:not([hidden])');if(!s)return '';
 if(s.id==='v-timetable'){const it=[...document.querySelectorAll('#cardList li')].map(li=>[...li.childNodes].filter(n=>n.nodeName!=='BUTTON'&&n.textContent.trim()).map(n=>n.textContent.trim()).join(', '));
  return 'My timetable. '+$('#count').textContent+' '+it.join('. ')}
 return textOf(s)}
const readPage=()=>speaking?stop():say(pageText());

/* ---------- Dock + ruler ---------- */
document.body.insertAdjacentHTML('beforeend',`<div id="a11y-dock" role="region" aria-label="Read aloud controls">
<button id="aListen" type="button"></button><button id="aPause" type="button" hidden></button>
<label><span class="a-sr">Speech speed</span><select id="aRate"><option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option></select></label>
<span class="a-msg" role="status" aria-live="polite"></span></div><div id="a11y-ruler" aria-hidden="true"></div>`);
$('#aListen').onclick=readPage;$('#aPause').onclick=pause;
$('#aRate').onchange=e=>{S.rate=e.target.value;save();sync()};

/* ---------- Settings card ---------- */
const OO=[['','Off'],['on','On']];
const G1=[['font','Reading font',[['','Default'],['lexend','Lexend'],['arial','Arial']]],['ls','Letter & word spacing',[['','Normal'],['1','Wide'],['2','Wider']]],
['lh','Line height',[['','Normal'],['1','Relaxed'],['2','Extra']]],['tone','Colour tone',[['','Default'],['sepia','Soft cream'],['grey','Greyscale'],['invert','Inverted']]],
['cursor','Large cursor',OO],['links','Outline all controls',OO],['focus','Strong focus ring',OO],['ruler','Reading ruler',OO],['simple','Simple layout',OO]];
const G2=[['rate','Speech speed',[['0.75','Slow'],['1','Normal'],['1.25','Fast'],['1.5','Faster']]],['hover','Read aloud on hover / focus',OO],
['notify','Read new notifications aloud',[['on','On'],['','Off']]],['mic','Voice commands',OO]];
const row=([k,l,o])=>`<div class="row"><span id="al-${k}">${l}</span><div class="seg" role="group" aria-labelledby="al-${k}">${o.map(([v,t])=>`<button type="button" data-a="${k}" data-v="${v}" aria-pressed="false">${t}</button>`).join('')}</div></div>`;
const card=document.createElement('div');card.className='card';card.id='a11y-more';
card.innerHTML=`<h3>Reading &amp; display</h3>${G1.map(row).join('')}<h3>Listening</h3>
<div class="row"><label for="aVoice">Voice</label><select id="aVoice"></select></div>${G2.map(row).join('')}
<div class="row"><span>Try the voice</span><button class="btn alt" id="aTest" type="button">Test speech</button></div>
<p class="sub" style="margin:1rem 0 0">Shortcuts: <b>Alt+R</b> read page or selected text · <b>Alt+P</b> pause · <b>Alt+V</b> voice commands · <b>Esc</b> stop. Voice commands: “timetable”, “notifications”, “next class”, “read page”, “bigger text”, “dark mode”, “stop”.</p>`;
$('#v-accessibility').appendChild(card);
function fillVoices(){const s=$('#aVoice');s.innerHTML='<option value="">Automatic</option>'+voices().map(x=>`<option value="${x.voiceURI}">${x.name} (${x.lang})</option>`).join('');s.value=S.voice}
$('#aVoice').onchange=e=>{S.voice=e.target.value;save()};
if(synth){fillVoices();synth.onvoiceschanged=fillVoices}
$('#aTest').onclick=()=>say('Hello, this is how I sound. Your next class starts soon.');

function apply(){['font','ls','lh','tone','cursor','links','focus','simple','ruler'].forEach(k=>S[k]?root.setAttribute('data-a-'+k,S[k]):root.removeAttribute('data-a-'+k));
 if(S.font==='lexend'&&!$('#a-lexend'))document.head.insertAdjacentHTML('beforeend','<link id="a-lexend" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap">')}
function sync(){document.querySelectorAll('[data-a]').forEach(b=>{const k=b.dataset.a;b.setAttribute('aria-pressed',k==='mic'?String(listening===(b.dataset.v==='on')):S[k]===b.dataset.v)});$('#aRate').value=S.rate}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');
 if(b){const k=b.dataset.a;if(k==='mic')b.dataset.v==='on'?voiceOn():voiceOff();else{S[k]=b.dataset.v;save();apply()}sync()}
 if(e.target.closest('#resetBtn'))try{localStorage.removeItem(KEY)}catch(_){}},true);

/* ---------- Hover / focus read-aloud ---------- */
let ht,lastT=null;const TGT='.cls,.cards li,.notes li,.tile,.stat,.hero,nav button,.btn,.mini,h2,h3,label,.row';
['focusin','mouseover'].forEach(ev=>document.addEventListener(ev,e=>{if(S.hover!=='on')return;const t=e.target.closest&&e.target.closest(TGT);
 if(!t||t===lastT||t.closest('#a11y-dock'))return;clearTimeout(ht);ht=setTimeout(()=>{lastT=t;say(t.getAttribute('aria-label')||textOf(t)||t.textContent.trim())},ev==='focusin'?150:450)}));
document.addEventListener('mouseout',()=>lastT=null);

/* ---------- Read new notifications ---------- */
let seen=($('#notes li')||{}).textContent||'';
new MutationObserver(()=>{const li=$('#notes li');if(!li)return;const t=li.textContent;
 if(t!==seen){seen=t;if(S.notify==='on'&&!li.classList.contains('read'))say('New notification. '+textOf(li))}}).observe($('#notes'),{childList:true});

/* ---------- Reading ruler ---------- */
const ruler=$('#a11y-ruler'),mv=y=>ruler.style.transform=`translateY(${y-20}px)`;
document.addEventListener('mousemove',e=>{if(S.ruler==='on')mv(e.clientY)});
document.addEventListener('focusin',e=>{if(S.ruler==='on'){const r=e.target.getBoundingClientRect();mv(r.top+r.height/2)}});

/* ---------- Voice commands ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec,listening=false;
const nav=v=>{const b=document.querySelector(`#nav button[data-v="${v}"]`);b&&b.click()};
const textStep=d=>{const bs=[...document.querySelectorAll('.seg button[data-text]')],i=Math.max(0,Math.min(2,bs.findIndex(b=>b.getAttribute('aria-pressed')==='true')+d));bs[i].click()};
const CMDS=[[/timetable/,()=>nav('timetable')],[/notif/,()=>nav('notifications')],[/dashboard|home|staff/,()=>document.querySelector('#nav button').click()],
[/access/,()=>nav('accessibility')],[/next class/,()=>{document.querySelector('#nav button').click();setTimeout(()=>say(textOf($('#hero'))),150)}],
[/read/,()=>say(pageText())],[/stop|quiet|silence/,stop],[/pause/,pause],[/dark|light mode/,()=>$('#themeBtn').click()],
[/bigger|larger|zoom in/,()=>textStep(1)],[/smaller|zoom out/,()=>textStep(-1)],[/contrast/,()=>document.querySelector('[data-contrast="high"]').click()]];
function voiceOn(){if(!SR){msg('Voice commands need Chrome or Edge.');return}
 rec=new SR();rec.continuous=true;rec.lang='en-ZA';
 rec.onresult=e=>{const t=e.results[e.results.length-1][0].transcript.toLowerCase();const c=CMDS.find(([r])=>r.test(t));msg(c?`Heard: “${t.trim()}”`:`Didn't understand “${t.trim()}”`);c&&c[1]()};
 rec.onend=()=>{if(listening)try{rec.start()}catch(_){}};rec.onerror=e=>{if(e.error==='not-allowed'){listening=false;msg('Microphone permission was blocked.');sync()}};
 try{rec.start();listening=true;msg('Listening for commands…')}catch(_){}}
function voiceOff(){listening=false;rec&&rec.stop();msg('Voice commands off.')}

/* ---------- Shortcuts ---------- */
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&speaking)stop();
 if(!e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.code==='KeyR'){e.preventDefault();readPage()}
 if(e.code==='KeyP'){e.preventDefault();pause()}
 if(e.code==='KeyV'){e.preventDefault();listening?voiceOff():voiceOn();sync()}});

apply();ui();sync();
})();
