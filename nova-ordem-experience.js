/* NOVA ORDEM — agency experience layer. Preserves original routes and content. */
(function(){
 'use strict';
 if(window.__NO_AGENCY_EXPERIENCE__) return;
 window.__NO_AGENCY_EXPERIENCE__=true;
 var groups=[
  {label:'CENTRAL',items:[['overview','Início','⌂'],['lore','Cosmologia','◉'],['agency','A Agência','⌘'],['organizations','Organizações','▣']]},
  {label:'PARTICIPAÇÃO',items:[['characters','Personagens','♙'],['protocol','Protocolo','▤']]},
  {label:'SISTEMAS',items:[['systems','Índice de sistemas','▦'],['power','Power System','ϟ'],['combat','Combate','⚔'],['progression','Progressão','↗'],['races','Raças','◇'],['equipment','Equipamentos','⬡'],['crafting','Criação e crafting','⌁'],['economy','Economia','¤'],['ranks','Ranks e hierarquia','⌖']]}
 ];
 var descriptions={
  overview:'CENTRAL DE CONSULTA',lore:'ARQUIVO DE COSMOLOGIA',agency:'DIRETORIA INSTITUCIONAL',
  organizations:'REGISTRO DE ORGANIZAÇÕES',characters:'CADASTRO DE PERSONAGENS',
  protocol:'DIRETRIZES DE PARTICIPAÇÃO',systems:'CATÁLOGO DE SISTEMAS',power:'MATRIZ DE PODER',
  combat:'PROTOCOLO DE CONFRONTO',progression:'REGISTRO DE PROGRESSÃO',races:'CATÁLOGO BIOLÓGICO',
  equipment:'ARSENAL E EQUIPAMENTOS',crafting:'OFICINA E PRODUÇÃO',economy:'REGISTRO ECONÔMICO',
  ranks:'HIERARQUIA INSTITUCIONAL',honor:'REGISTRO DE CONDUTA',karma:'REGISTRO DE OCORRÊNCIAS'
 };
 var marks={overview:'00',lore:'01',agency:'02',organizations:'03',characters:'04',protocol:'05',systems:'06',power:'07',combat:'08',progression:'09',races:'10',equipment:'11',crafting:'12',economy:'13',ranks:'14',honor:'15',karma:'16'};
 var current='overview', originalGo=window.go;
 function buildNavigation(){
  var nav=document.getElementById('nav'); if(!nav)return;
  nav.innerHTML=groups.map(function(group){return '<div class="no-nav-group">'+group.label+'</div>'+group.items.map(function(item){return '<button type="button" data-id="'+item[0]+'" data-mark="'+item[2]+'" class="'+(item[0]===current?'active':'')+'">'+item[1]+'</button>';}).join('');}).join('');
 }
 function decoratePage(id){
  current=id||current;
  var content=document.getElementById('content'), heading=document.querySelector('.heading');
  if(!content||!heading)return;
  content.setAttribute('data-route',current);
  var old=document.querySelector('.no-page-context'); if(old)old.remove();
  if(current!=='overview'){
   var rail=document.createElement('div'); rail.className='no-page-context';
   rail.innerHTML='<span><strong>'+((descriptions[current]||'ARQUIVO INSTITUCIONAL'))+'</strong> / CONSULTA DE REGISTRO</span><span>NO · FILE '+(marks[current]||'--')+'</span>';
   heading.parentNode.insertBefore(rail,content);
  }
  buildNavigation();
  var dock=document.getElementById('no-mobile-nav');if(dock)dock.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b.dataset.id===current)});
  document.body.setAttribute('data-no-route',current);
 }

 function installMobileNav(){
  if(document.getElementById('no-mobile-nav'))return;
  var dock=document.createElement('nav');dock.id='no-mobile-nav';dock.setAttribute('aria-label','Navegação principal');
  dock.innerHTML='<button type="button" data-id="overview"><b>⌂</b><span>Início</span></button><button type="button" data-id="lore"><b>◉</b><span>Cosmologia</span></button><button type="button" data-id="systems"><b>▦</b><span>Sistemas</span></button><button type="button" data-id="characters"><b>♙</b><span>Personagens</span></button>';
  document.body.appendChild(dock);
 }
 function routeFromButton(ev){
  var btn=ev.target.closest('#nav button[data-id], #no-mobile-nav button[data-id]');
  if(btn){ev.preventDefault();ev.stopImmediatePropagation();if(typeof window.go==='function')window.go(btn.dataset.id);}
 }
 document.addEventListener('click',routeFromButton,true);
 if(typeof originalGo==='function'){
  window.go=function(id,fromHistory){var result=originalGo.call(window,id,fromHistory);var normalized=(id==='chi'||id==='talents')?'power':((id==='missions'||id==='honor'||id==='karma')?'progression':id);decoratePage(normalized);return result;};
 }
 document.addEventListener('DOMContentLoaded',function(){
  var title=document.querySelector('.brand b');
  var sub=document.querySelector('.brand small');
  installMobileNav();
  if(title)title.textContent='NOVA ORDEM';
  if(sub)sub.textContent='AGÊNCIA INTERDIMENSIONAL';
  var navtitle=document.querySelector('.navtitle');if(navtitle)navtitle.textContent='ÍNDICE DE ACESSO';
  var foot=document.querySelector('.sidefoot');if(foot)foot.innerHTML='<i></i> SISTEMA OPERACIONAL<br><span style="display:block;margin:8px 0 0 14px">ARQUIVOS PÚBLICOS · V8</span>';
  if(typeof window.go==='function')window.go('overview',true);else decoratePage('overview');
 });
 if(document.readyState!=='loading'){
  installMobileNav();
  if(typeof window.go==='function')window.go('overview',true);else decoratePage('overview');
 }
})();

/* NOVA ORDEM — experiência espacial cinematográfica (test branch).
   A camada visual envolve a navegação existente; não substitui renderizadores,
   rotas, autenticação, formulários ou integrações do RPG. */
(function () {
  'use strict';
  if (window.__NO_SPACE_NAV__) return;
  window.__NO_SPACE_NAV__ = true;

  var routes = [
    ['overview','Galáxia','CENTRAL DE NAVEGAÇÃO','O ponto de partida da Agência. Escolha um destino e inicie a travessia.'],
    ['lore','Cosmologia','ARQUIVO DE ORIGEM','A estrutura do universo, suas entidades e os registros que moldam a realidade.'],
    ['agency','A Agência','COMANDO CENTRAL','A estrutura institucional, suas instalações e operações interdimensionais.'],
    ['organizations','Organizações','SISTEMAS DE ALIANÇAS','As organizações que disputam influência, protegem territórios e movem o mundo.'],
    ['characters','Personagens','REGISTRO DE INDIVÍDUOS','Fichas, origens, trajetórias e registros dos habitantes deste universo.'],
    ['protocol','Protocolo','DIRETRIZES DE ACESSO','As regras de participação e os procedimentos de navegação pela Nova Ordem.'],
    ['systems','Sistemas','NÚCLEO DE REGRAS','Todos os módulos que sustentam as mecânicas do RPG.'],
    ['power','Power System','MATRIZ DE ENERGIA','Chi, Talentos, especializações, classes e limites de manifestação.'],
    ['combat','Combate','SIMULAÇÃO TÁTICA','Regras de confronto, ações, defesas e resolução de interações.'],
    ['progression','Progressão','EVOLUÇÃO E MISSÕES','Treinamento, missões, eventos e desenvolvimento dos personagens.'],
    ['races','Raças','CATÁLOGO BIOLÓGICO','Humanos, Híbridos, Químios e Ciborgues.'],
    ['equipment','Equipamentos','ARSENAL E TECNOLOGIA','Trajes, armamentos, recursos e equipamentos disponíveis.'],
    ['crafting','Criação e crafting','OFICINA DE PRODUÇÃO','Materiais, fabricação e desenvolvimento de projetos.'],
    ['economy','Economia','REDE DE RECURSOS','Moeda, trabalho, remuneração, compras e patrimônio.'],
    ['ranks','Ranks e hierarquia','HIERARQUIA','Níveis, patentes, Lords, Pilares e critérios de reconhecimento.'],
    ['honor','Honra','REGISTRO DE CONDUTA','Reconhecimento e registros de conduta.'],
    ['karma','Karma','REGISTRO DE OCORRÊNCIAS','Ocorrências, consequências e classificações.']
  ];
  var aliases = {chi:'power',talents:'power',missions:'progression'};
  var activeRoute = 'overview';
  var stage = null, canvas = null, ctx = null, stars = [], raf = 0, resizeObserver = null;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getRoute(id) { return aliases[id] || id || 'overview'; }
  function getMeta(id) {
    var key = getRoute(id);
    for (var i=0;i<routes.length;i++) if (routes[i][0] === key) return {data:routes[i],index:i};
    return {data:routes[0],index:0};
  }
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }

  function buildStage() {
    if (stage || !document.querySelector('.main')) return;
    stage = document.createElement('section');
    stage.className = 'no-space-stage';
    stage.setAttribute('aria-label','Navegação espacial da Nova Ordem');
    stage.innerHTML =
      '<canvas class="no-space-canvas" aria-hidden="true"></canvas>' +
      '<div class="no-space-nebula no-space-nebula-a"></div><div class="no-space-nebula no-space-nebula-b"></div>' +
      '<div class="no-space-grid"></div><div class="no-space-scanline"></div>' +
      '<div class="no-space-hud"><div class="no-space-brand"><span class="no-space-brand-mark">NO</span><span><b>AGÊNCIA INTERDIMENSIONAL</b><small>DEEP SPACE NAVIGATION · 07.41.Ω</small></span></div><div class="no-space-status"><i></i> SISTEMA DE NAVEGAÇÃO ONLINE <span>·</span> <b>SETOR 07</b></div></div>' +
      '<div class="no-space-copy"><div class="no-space-kicker"><span class="no-space-index">00</span><span class="no-space-line"></span><span class="no-space-category">CENTRAL DE NAVEGAÇÃO</span></div><h1 class="no-space-title">NOVA <em>ORDEM</em></h1><p class="no-space-description">O ponto de partida da Agência. Escolha um destino e inicie a travessia.</p><div class="no-space-coordinates">COORDENADAS <b>00.000 / 00.000</b><span>·</span> DESTINO <b class="no-space-destination">GALÁXIA</b></div></div>' +
      '<div class="no-space-orbit" aria-hidden="true"><div class="no-space-orbit-ring ring-one"></div><div class="no-space-orbit-ring ring-two"></div><div class="no-space-planet"><div class="no-space-planet-clouds"></div><div class="no-space-planet-atmosphere"></div></div><div class="no-space-moon"></div></div>' +
      '<div class="no-space-ship" aria-hidden="true"><svg viewBox="0 0 180 90" role="presentation"><defs><linearGradient id="noShipMetal" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f0f7ff"/><stop offset=".42" stop-color="#8199ad"/><stop offset="1" stop-color="#26394d"/></linearGradient><linearGradient id="noShipGlass"><stop stop-color="#9af0ff"/><stop offset="1" stop-color="#17628c"/></linearGradient></defs><path d="M12 45 48 28 124 20 165 45 124 70 48 62Z" fill="url(#noShipMetal)" stroke="#d9efff" stroke-width="1.2"/><path d="m48 28 25-17 34 8-20 13Zm0 34 25 17 34-8-20-13Z" fill="#526d83" stroke="#b7d4e8"/><path d="m105 29 27 16-27 16-18-16Z" fill="url(#noShipGlass)" stroke="#c7f4ff"/><path d="m13 45-12-7v14Z" fill="#9cb2c5"/><path d="M3 40 -18 34 -5 45 -18 56 3 50Z" fill="#69dfff" opacity=".9"/><path d="m48 35 28 10-28 10-16-10Z" fill="#283f54" stroke="#8daabd"/><path d="m139 33 22 12-22 12-13-12Z" fill="#25394d"/><circle cx="100" cy="45" r="4" fill="#b5f2ff"/></svg><span class="no-space-engine"></span></div>' +
      '<div class="no-space-side-readout"><span>VESSEL / CARGUEIRO</span><b>NO–07</b><span>VELOCIDADE</span><b class="no-space-speed">0.82 C</b><span>INTEGRIDADE</span><b class="no-space-integrity">100%</b></div>' +
      '<div class="no-space-bottom"><div class="no-space-route-label"><span>ROTAS DISPONÍVEIS</span><small>SELECIONE UM DESTINO</small></div><div class="no-space-destinations" role="navigation" aria-label="Destinos da Agência"></div><button class="no-space-next" type="button" aria-label="Próximo destino">→</button></div>' +
      '<div class="no-space-warp-flash"></div>';
    var main = document.querySelector('.main');
    var top = main.querySelector('.top');
    if (top && top.nextSibling) main.insertBefore(stage, top.nextSibling); else main.insertBefore(stage, main.firstChild);
    var nav = stage.querySelector('.no-space-destinations');
    nav.innerHTML = routes.map(function(r,i){
      return '<button type="button" data-space-id="'+r[0]+'" class="'+(i===0?'active':'')+'" aria-label="Viajar para '+escapeHTML(r[1])+'"><span class="no-space-dot dot-'+(i%6)+'"></span><b>'+escapeHTML(r[1])+'</b><small>'+String(i).padStart(2,'0')+'</small></button>';
    }).join('');
    stage.querySelector('.no-space-next').addEventListener('click',function(){
      var next=(getMeta(activeRoute).index+1)%routes.length; navigate(routes[next][0]);
    });
    nav.addEventListener('click',function(ev){
      var btn=ev.target.closest('button[data-space-id]');
      if(btn) navigate(btn.getAttribute('data-space-id'));
    });
    canvas = stage.querySelector('canvas');
    ctx = canvas.getContext('2d',{alpha:true});
    setupStars();
    updateStage(activeRoute,false);
    if (!reduced) animateStars();
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(stage);
    } else window.addEventListener('resize',resizeCanvas,{passive:true});
    resizeCanvas();
    document.querySelectorAll('.hero').forEach(function(el){el.classList.add('no-space-hidden-hero');});
  }

  function setupStars() {
    var count = window.innerWidth < 700 ? 100 : 230;
    stars = [];
    for (var i=0;i<count;i++) stars.push({
      x:Math.random(),y:Math.random(),z:.15+Math.random()*.85,
      r:.35+Math.random()*1.25,phase:Math.random()*Math.PI*2,
      hue:Math.random()>.86?190:Math.random()>.93?35:210
    });
  }
  function resizeCanvas() {
    if(!canvas||!stage||!ctx)return;
    var rect=stage.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.7);
    canvas.width=Math.max(1,Math.floor(rect.width*dpr));
    canvas.height=Math.max(1,Math.floor(rect.height*dpr));
    canvas.style.width=rect.width+'px';canvas.style.height=rect.height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  var lastFrame=0,laserAt=0,lasers=[];
  function animateStars(t) {
    if(!ctx||!stage)return;
    raf=requestAnimationFrame(animateStars);
    if(t-lastFrame<32)return;
    lastFrame=t;
    var w=stage.clientWidth,h=stage.clientHeight;
    ctx.clearRect(0,0,w,h);
    var pointerX=(window.__noSpacePointerX||0),pointerY=(window.__noSpacePointerY||0);
    stars.forEach(function(s){
      var twinkle=.55+Math.sin(t*.0008+s.phase)*.35;
      var x=(s.x*w+(pointerX*s.z*12)+w)%w,y=(s.y*h+(pointerY*s.z*8)+h)%h;
      ctx.beginPath();ctx.arc(x,y,s.r*s.z,0,Math.PI*2);
      ctx.fillStyle='hsla('+s.hue+',85%,85%,'+(twinkle*s.z)+')';ctx.fill();
    });
    if(t>laserAt){laserAt=t+2600+Math.random()*2400;lasers.push({x:Math.random()*w*.8+w*.1,y:Math.random()*h*.62,dx:(Math.random()>.5?1:-1)*(70+Math.random()*130),dy:(Math.random()-.5)*55,life:0,max:20});}
    lasers=lasers.filter(function(l){return l.life<l.max;});
    lasers.forEach(function(l){
      l.life++;var a=1-l.life/l.max;
      ctx.beginPath();ctx.moveTo(l.x,l.y);ctx.lineTo(l.x+l.dx*a,l.y+l.dy*a);
      ctx.strokeStyle=(l.life%2?'rgba(88,231,172,':'rgba(255,87,107,')+(a*.9)+')';
      ctx.lineWidth=1.4;ctx.shadowBlur=12;ctx.shadowColor=l.life%2?'#58e7ac':'#ff576b';ctx.stroke();ctx.shadowBlur=0;
    });
  }

  function updateStage(id,warp) {
    if(!stage)return;
    var meta=getMeta(id),r=meta.data;
    activeRoute=r[0];
    stage.setAttribute('data-route',r[0]);
    stage.querySelector('.no-space-index').textContent=String(meta.index).padStart(2,'0');
    stage.querySelector('.no-space-category').textContent=r[2];
    stage.querySelector('.no-space-title').innerHTML=r[0]==='overview'?'NOVA <em>ORDEM</em>':escapeHTML(r[1]).replace(/(Power|System)/g,'<em>$1</em>');
    stage.querySelector('.no-space-description').textContent=r[3];
    stage.querySelector('.no-space-destination').textContent=r[1].toUpperCase();
    stage.querySelectorAll('.no-space-destinations button').forEach(function(b){b.classList.toggle('active',b.dataset.spaceId===r[0]);});
    stage.querySelector('.no-space-speed').textContent=warp?'1.00 C':'0.82 C';
    stage.querySelector('.no-space-integrity').textContent='100%';
    if(warp){
      stage.classList.remove('is-warping');void stage.offsetWidth;stage.classList.add('is-warping');
      window.setTimeout(function(){if(stage)stage.classList.remove('is-warping');},1450);
    }
  }

  function navigate(id) {
    if(typeof window.go==='function') window.go(id);
  }
  var previousGo=window.go;
  if(typeof previousGo==='function'){
    window.go=function(id,fromHistory){
      var next=getRoute(id),changed=next!==activeRoute;
      if(changed&&stage) updateStage(next,true);
      var result=previousGo.apply(this,arguments);
      activeRoute=next;
      if(stage) updateStage(next,changed&&!fromHistory);
      return result;
    };
  }

  function installIntro() {
    if(reduced||!stage)return;
    try { if(window.sessionStorage.getItem('no-space-intro-seen')) return; window.sessionStorage.setItem('no-space-intro-seen','1'); } catch(e) {}
    var intro=document.createElement('div');
    intro.className='no-space-intro';
    intro.innerHTML='<div class="no-intro-stars"></div><div class="no-intro-horizon"></div><div class="no-intro-ship"><svg viewBox="0 0 180 90" aria-hidden="true"><path d="M12 45 48 28 124 20 165 45 124 70 48 62Z" fill="#a9c0d2" stroke="#effaff" stroke-width="1.5"/><path d="m105 29 27 16-27 16-18-16Z" fill="#53bde8" stroke="#d5f7ff"/><path d="M3 40 -30 30 -5 45 -30 60 3 50Z" fill="#79e5ff"/></svg></div><div class="no-intro-copy"><span>AGÊNCIA INTERDIMENSIONAL · TRANSPORTE AUTORIZADO</span><h2>SALTO <em>ESPACIAL</em></h2><p>Preparando navegação de longo alcance</p><div class="no-intro-progress"><i></i></div></div><button type="button" class="no-intro-skip">PULAR INTRODUÇÃO ↗</button>';
    document.body.appendChild(intro);
    function dismiss(){if(!intro.isConnected)return;intro.classList.add('is-leaving');window.setTimeout(function(){intro.remove();},850);}
    intro.querySelector('.no-intro-skip').addEventListener('click',dismiss);
    window.setTimeout(dismiss,5600);
  }

  function onPointer(ev) {
    if(!stage)return;
    var rect=stage.getBoundingClientRect();
    window.__noSpacePointerX=((ev.clientX-rect.left)/rect.width-.5);
    window.__noSpacePointerY=((ev.clientY-rect.top)/rect.height-.5);
    stage.style.setProperty('--pointer-x',window.__noSpacePointerX.toFixed(3));
    stage.style.setProperty('--pointer-y',window.__noSpacePointerY.toFixed(3));
  }
  document.addEventListener('DOMContentLoaded',function(){
    buildStage();
    if(stage){
      stage.addEventListener('pointermove',onPointer,{passive:true});
      installIntro();
    }
  });
  if(document.readyState!=='loading'){
    buildStage();
    if(stage){stage.addEventListener('pointermove',onPointer,{passive:true});installIntro();}
  }
})();
