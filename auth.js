/* Inclusive UniTime – demo sign-in guard. Add <script src="auth.js"></script> before </body> in index.html. */
(()=>{
let u=null;try{u=JSON.parse(localStorage.getItem('ut-user'))}catch(e){}
if(!u||!u.role){location.replace('index.html');return}
const $=s=>document.querySelector(s);

// Apply the role chosen on the login page
const sel=$('#role');sel.value=u.role;sel.dispatchEvent(new Event('change'));
$('.who').hidden=true;

// Show the person's name instead of the hard-coded demo names
const hello=$('#hello'),fix=()=>{if(hello.textContent.includes('Alex'))hello.textContent=hello.textContent.replace('Alex',u.name)};
fix();new MutationObserver(fix).observe(hello,{childList:true,characterData:true,subtree:true});
$('#staffHello').textContent='Welcome, '+u.name;

// Sign out: header button (always visible) + sidebar item (desktop)
const OUT='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>';
const signOut=e=>{if(e)e.stopPropagation();try{localStorage.removeItem('ut-user')}catch(_){}location.replace('index.html')};
const label=`Sign out ${u.name}, ${u.role==='staff'?'Lecturer / Admin':'Student'}`;
document.head.insertAdjacentHTML('beforeend','<style>.a-who{font-size:.85rem;opacity:.9;padding:0 .3rem;white-space:nowrap;max-width:10rem;overflow:hidden;text-overflow:ellipsis}.out-li{margin-top:.6rem;padding-top:.6rem;border-top:1px solid var(--line)}@media(max-width:860px){.out-li,.a-who{display:none}}</style>');
const who=document.createElement('span');who.className='a-who';who.textContent=u.name;$('.tools').appendChild(who);
const b=document.createElement('button');b.type='button';b.className='chip';b.id='outBtn';b.innerHTML=OUT+'<span>Sign out</span>';b.setAttribute('aria-label',label);b.onclick=signOut;$('.tools').appendChild(b);
const li=document.createElement('li');li.className='out-li';li.innerHTML='<button type="button">'+OUT+'<span>Sign out</span></button>';li.firstChild.onclick=signOut;$('#nav').appendChild(li);
})();
