const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
// menú móvil
const bg=$('#burger'),mm=$('#mm');
bg.onclick=()=>{const o=mm.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.firstElementChild.innerHTML=`<use href="#${o?'x':'menu'}"/>`};
$$('#mm a').forEach(a=>a.onclick=()=>bg.click());
// pasos / terminal
const steps=$$('.step'),terms=$$('.tm');
steps.forEach((s,i)=>s.onclick=()=>{steps.forEach((x,j)=>x.classList.toggle('on',i===j));terms.forEach((t,j)=>t.classList.toggle('on',i===j))});
// carrera
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.6});
$$('[data-race]').forEach(b=>io.observe(b));
// nav activa
const links=$$('#anchors a'),secs=links.map(a=>$(a.getAttribute('href')));
secs.forEach(s=>new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach((a,i)=>a.classList.toggle('on',secs[i]===e.target))}),{rootMargin:'-40% 0px -55% 0px'}).observe(s));
// widget
const w=$('#widget'),succ=$('#succ'),rb=$('#reboot'),conv=$('#conv'),rxl=$('#rxl');
$('#more').onclick=()=>w.classList.add('open');
$('#tryDiag').onclick=()=>{w.classList.add('open');rb.focus({preventScroll:true})};
rb.onclick=()=>{rb.disabled=true;rb.innerHTML='<svg class="ic spin"><use href="#load"/></svg>Reiniciando…';succ.classList.add('hide');rxl.className='';rxl.textContent='> Reiniciando ONT vía API…';
  setTimeout(()=>{rb.disabled=false;rb.textContent='Reiniciar ONT remotamente (API)';rxl.className='ok';rxl.textContent='> Potencia óptica RX: -19.8 dBm (óptima)';succ.classList.remove('hide')},1800)};
$('#chat').onsubmit=e=>{e.preventDefault();const i=$('#chatIn'),v=i.value.trim();if(!v)return;
  const u=document.createElement('div');u.className='bub u';u.textContent=v;conv.insertBefore(u,succ);i.value='';
  setTimeout(()=>{const j=document.createElement('div');j.className='bub j';j.textContent='Entendido. Reviso tu ONT y tu enlace; si hace falta, escalo a un asesor con folio.';conv.insertBefore(j,succ);conv.scrollTop=conv.scrollHeight},700)};
// copiar
$('#copy').onclick=async function(){try{await navigator.clipboard.writeText($('#snip').textContent);this.textContent='¡Copiado!'}catch(_){this.textContent='Selecciona y copia'}setTimeout(()=>this.textContent='Copiar',1800)};
// formulario
const F=$('#form'),free=/@(gmail|hotmail|outlook|yahoo|icloud|live|proton|protonmail|aol)\./i;
const bad=(el,on)=>{const f=el.closest('.fld');f.classList.toggle('bad',on);const s=$('small',f);if(s&&s.id!=='h4')s.hidden=!on};
F.onsubmit=async e=>{e.preventDefault();const n=$('#f1'),em=$('#f2'),m=$('#f4'),ok=[];
  ok.push(!!n.value.trim());bad(n,!ok[0]);ok.push(!!em.value.trim());bad(em,!ok[1]);
  const r=!!$('input[name=s]:checked');ok.push(r);bad($('#f3'),!r);
  const mv=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m.value)&&!free.test(m.value);ok.push(mv);bad(m,!mv);$('#h4').textContent=mv||!m.value?'Sin correos gratuitos':'Usa un correo corporativo válido';
  if(ok.includes(false)){$('.bad input',F)?.focus();return}
  const b=$('#send'),er=$('.ferr',F),lbl=b.innerHTML;er.hidden=true;b.disabled=true;b.innerHTML='<svg class="ic spin"><use href="#load"/></svg>Agendando…';
  try{const res=await fetch('/api/demo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(F)))});if(!res.ok)throw 0;F.classList.add('sent')}
  catch(_){er.textContent='No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos a contacto@juno.network.';er.hidden=false;b.disabled=false;b.innerHTML=lbl}};
$$('#form input').forEach(i=>i.addEventListener('input',()=>bad(i,false)));

document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mm.classList.contains('open'))bg.click()});
