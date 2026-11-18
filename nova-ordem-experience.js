/* NOVA ORDEM — cinematic 3D navigation / test branch
   Three.js scene, procedural PBR worlds, cargo vessel and continuous camera travel.
   The existing RPG renderer, routes, forms, authentication and integrations remain intact. */
(function () {
  'use strict';
  if (window.__NO_CINEMATIC_3D__) return;
  window.__NO_CINEMATIC_3D__ = true;

  var ROUTES = [
    {id:'overview',name:'Galáxia',kicker:'CENTRAL DE NAVEGAÇÃO',description:'O ponto de partida da Agência. Escolha um destino e inicie a travessia.',palette:['#102d50','#2f7091','#8cbbba','#d6d9c8']},
    {id:'lore',name:'Cosmologia',kicker:'ARQUIVO DE ORIGEM',description:'A estrutura do universo, suas entidades e os registros que moldam a realidade.',palette:['#18172f','#574274','#b08eaa','#e0c7d8']},
    {id:'agency',name:'A Agência',kicker:'COMANDO CENTRAL',description:'A estrutura institucional, suas instalações e operações interdimensionais.',palette:['#202c3a','#667c8d','#a8b9b6','#d7e2dc']},
    {id:'organizations',name:'Organizações',kicker:'SISTEMAS DE ALIANÇAS',description:'As organizações que disputam influência, protegem territórios e movem o mundo.',palette:['#39241f','#9b5e42','#c49a6a','#e9d0a4']},
    {id:'characters',name:'Personagens',kicker:'REGISTRO DE INDIVÍDUOS',description:'Fichas, origens, trajetórias e registros dos habitantes deste universo.',palette:['#153a3b','#397d70','#91b49b','#d7e2c2']},
    {id:'protocol',name:'Protocolo',kicker:'DIRETRIZES DE ACESSO',description:'As regras de participação e os procedimentos de navegação pela Nova Ordem.',palette:['#202a3e','#536f94','#a4b5c9','#dbe1e8']},
    {id:'systems',name:'Sistemas',kicker:'NÚCLEO DE REGRAS',description:'Todos os módulos que sustentam as mecânicas do RPG.',palette:['#102b42','#28658b','#72a6b4','#c6e0e3']},
    {id:'power',name:'Power System',kicker:'MATRIZ DE ENERGIA',description:'Chi, Talentos, especializações, classes e limites de manifestação.',palette:['#382719','#9b6b32','#c9a75e','#f0dfb3']},
    {id:'combat',name:'Combate',kicker:'SIMULAÇÃO TÁTICA',description:'Regras de confronto, ações, defesas e resolução de interações.',palette:['#341b27','#8c394a','#bc7470','#e9c2ad']},
    {id:'progression',name:'Progressão',kicker:'EVOLUÇÃO E MISSÕES',description:'Treinamento, missões, eventos e desenvolvimento dos personagens.',palette:['#152d4b','#426b9a','#8fa9c3','#d4dce5']},
    {id:'races',name:'Raças',kicker:'CATÁLOGO BIOLÓGICO',description:'Humanos, Híbridos, Químios e Ciborgues.',palette:['#1d3327','#4f7953','#98ae78','#dbe0ba']},
    {id:'equipment',name:'Equipamentos',kicker:'ARSENAL E TECNOLOGIA',description:'Trajes, armamentos, recursos e equipamentos disponíveis.',palette:['#1c2935','#526a7d','#9eabb1','#dce1df']},
    {id:'crafting',name:'Criação e crafting',kicker:'OFICINA DE PRODUÇÃO',description:'Materiais, fabricação e desenvolvimento de projetos.',palette:['#34291d','#87633d','#b9a06a','#e8d7b2']},
    {id:'economy',name:'Economia',kicker:'REDE DE RECURSOS',description:'Moeda, trabalho, remuneração, compras e patrimônio.',palette:['#302b18','#7e7137','#b4a25a','#e6d9a5']},
    {id:'ranks',name:'Ranks e hierarquia',kicker:'HIERARQUIA INSTITUCIONAL',description:'Níveis, patentes, Lords, Pilares e critérios de reconhecimento.',palette:['#28213b','#69518b','#b29bc6','#e1d6e9']}
  ];
  var GROUPS = [
    {label:'CENTRAL',items:[['overview','Início'],['lore','Cosmologia'],['agency','A Agência'],['organizations','Organizações']]},
    {label:'PARTICIPAÇÃO',items:[['characters','Personagens'],['protocol','Protocolo']]},
    {label:'SISTEMAS',items:[['systems','Índice de sistemas'],['power','Power System'],['combat','Combate'],['progression','Progressão'],['races','Raças'],['equipment','Equipamentos'],['crafting','Criação e crafting'],['economy','Economia'],['ranks','Ranks e hierarquia']]}
  ];
  var ALIASES = {chi:'power',talents:'power',missions:'progression',honor:'progression',karma:'progression'};
  var current = 'overview';
  var originalGo = window.go;
  var stage, canvas, renderer, scene, camera, planetGroup, planetMesh, cloudMesh, atmosphereMesh, ship, starField, dustField, routeNav, topicList;
  var THREE = null, clock, transition = null, landed = false, reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raycaster, pointer = {x:0,y:0}, pointerTarget = {x:0,y:0}, laserTimer = 0, lasers = [], introTimer = 0;
  var palettes = {};

  var ECOLOGIES = {
    lore:{type:'crystal',floraForm:'crystal',sky:0x87739f,ground:[.13,.075,.20],rock:[.39,.27,.51],flora:0x8650a5,floraLight:0xc08bd6,trunk:0x33243e,water:0x586eaa,accent:0xb78cdb,sun:0xffd7f2,fill:0x7768ad,terrainTint:0xcfc0dc,rockTint:0x8e77a2,cloud:'rgba(190,155,225,.30)',cloudRGB:[186,150,220],surface:['#19152c','#53366b','#a77ab9','#e5d8ee'],wet:true},
    agency:{type:'coast',floraForm:'broadleaf',sky:0x91b7bd,ground:[.075,.18,.16],rock:[.30,.43,.41],flora:0x4b9b8b,floraLight:0x91c9b5,trunk:0x34483e,water:0x317f91,accent:0x70c9d0,sun:0xffe4c1,fill:0x72a9b5,terrainTint:0xc5d9d0,rockTint:0x708e88,cloud:'rgba(165,218,218,.28)',cloudRGB:[160,212,214],surface:['#102c38','#286d70','#76b9a4','#d7e9d9'],wet:true},
    organizations:{type:'badlands',floraForm:'fern',sky:0xa77a70,ground:[.29,.085,.075],rock:[.59,.25,.20],flora:0x9d3542,floraLight:0xe06b58,trunk:0x4a2828,water:0x713d4a,accent:0xd75d58,sun:0xffd0aa,fill:0xa35a55,terrainTint:0xe0b5a2,rockTint:0x98605a,cloud:'rgba(224,145,120,.22)',cloudRGB:[214,132,112],surface:['#351b25','#8c343d','#c66a58','#edc0a0'],wet:false},
    characters:{type:'temperate',floraForm:'broadleaf',sky:0x92b29a,ground:[.065,.17,.085],rock:[.28,.39,.26],flora:0x43834b,floraLight:0x9fbd62,trunk:0x493b2c,water:0x397d70,accent:0x86b875,sun:0xffe6bd,fill:0x76a88a,terrainTint:0xc8d6b4,rockTint:0x6c8260,cloud:'rgba(181,218,182,.24)',cloudRGB:[174,212,176],surface:['#102b29','#2e6d4d','#82a96d','#d9e2bb'],wet:true},
    protocol:{type:'glacier',floraForm:'needle',sky:0x9bbdce,ground:[.27,.40,.49],rock:[.70,.80,.86],flora:0x5c9caf,floraLight:0xb4e6ed,trunk:0x405b69,water:0x4c91b5,accent:0x9de5f1,sun:0xe7f6ff,fill:0x7dbbd4,terrainTint:0xd5e7ed,rockTint:0x9bbac8,cloud:'rgba(211,239,250,.32)',cloudRGB:[202,230,244],surface:['#203d54','#608da8','#a9d5e1','#edf8fb'],wet:true},
    systems:{type:'volcanic',floraForm:'fern',sky:0x77666b,ground:[.075,.045,.05],rock:[.29,.13,.15],flora:0x792b3c,floraLight:0xd04a45,trunk:0x282329,water:0x5a2635,accent:0xff6845,sun:0xffa477,fill:0x824451,terrainTint:0xb98c83,rockTint:0x68444a,cloud:'rgba(218,115,92,.20)',cloudRGB:[210,104,82],surface:['#17151d','#57252f','#a84439','#d38b6c'],wet:false},
    power:{type:'desert',floraForm:'succulent',sky:0xb99a6d,ground:[.39,.25,.10],rock:[.70,.49,.24],flora:0xa77b28,floraLight:0xe3c16a,trunk:0x57432a,water:0x5c7e83,accent:0xe6b75d,sun:0xffe0a0,fill:0xc28b4e,terrainTint:0xe2c69a,rockTint:0xa78956,cloud:'rgba(241,207,150,.20)',cloudRGB:[230,194,135],surface:['#3c2c1b','#94703b','#c5a05a','#efdbac'],wet:false},
    combat:{type:'ash',floraForm:'fern',sky:0x82706e,ground:[.13,.065,.075],rock:[.37,.18,.19],flora:0x8c2736,floraLight:0xd45b53,trunk:0x302329,water:0x49323d,accent:0xe65a48,sun:0xffb18b,fill:0x98585b,terrainTint:0xc49a91,rockTint:0x76565a,cloud:'rgba(190,123,113,.20)',cloudRGB:[185,115,105],surface:['#20191f','#632d38','#a84c48','#d89a82'],wet:false},
    progression:{type:'alpine',floraForm:'needle',sky:0x91b6bd,ground:[.10,.22,.22],rock:[.38,.54,.55],flora:0x3c8b83,floraLight:0x9ed4b7,trunk:0x3c4b43,water:0x3b8eaa,accent:0x8bd4d0,sun:0xffedcf,fill:0x78aeb9,terrainTint:0xc5ded6,rockTint:0x6b9694,cloud:'rgba(180,226,224,.24)',cloudRGB:[170,218,220],surface:['#163442','#347b79','#82bcb1','#e1eee0'],wet:true},
    races:{type:'jungle',floraForm:'broadleaf',sky:0x7f9e83,ground:[.045,.13,.075],rock:[.22,.34,.23],flora:0x6b9b38,floraLight:0xc0d76b,trunk:0x3d3826,water:0x286f59,accent:0xa7ce5d,sun:0xffe3b4,fill:0x6b9c76,terrainTint:0xbdd0a1,rockTint:0x627d50,cloud:'rgba(175,213,150,.23)',cloudRGB:[166,208,143],surface:['#12291e','#416e36','#8eae51','#d8e2b1'],wet:true},
    equipment:{type:'rocky',floraForm:'moss',sky:0x9da5ad,ground:[.19,.21,.23],rock:[.49,.53,.57],flora:0x778b91,floraLight:0xb9c8c5,trunk:0x41494c,water:0x477987,accent:0x9fb9c0,sun:0xffe6ce,fill:0x829eaa,terrainTint:0xd0d8d9,rockTint:0x7c898f,cloud:'rgba(197,215,220,.22)',cloudRGB:[190,210,218],surface:['#222e39','#596c78','#9baeb0','#e1e6df'],wet:false},
    crafting:{type:'geothermal',floraForm:'succulent',sky:0xa17e68,ground:[.23,.105,.055],rock:[.53,.29,.16],flora:0x9b4f2b,floraLight:0xe69b4e,trunk:0x3f2b24,water:0x76513a,accent:0xf18b42,sun:0xffc08a,fill:0xb76c4a,terrainTint:0xd2a17d,rockTint:0x895c47,cloud:'rgba(235,165,115,.20)',cloudRGB:[220,145,98],surface:['#2c1d19','#70402b','#b86b3d','#e2ad79'],wet:false},
    economy:{type:'salt',floraForm:'grass',sky:0xb6b6a9,ground:[.40,.39,.32],rock:[.69,.66,.55],flora:0x879c75,floraLight:0xd0d7a0,trunk:0x69634b,water:0x4e8c9c,accent:0xc9c58b,sun:0xffefcc,fill:0x8eb5b6,terrainTint:0xe4dfc9,rockTint:0xaaa58b,cloud:'rgba(230,231,211,.24)',cloudRGB:[222,223,203],surface:['#3c3a2e','#888365','#c2b98b','#f1e9c9'],wet:true},
    ranks:{type:'highland',floraForm:'needle',sky:0x8d83ad,ground:[.16,.13,.27],rock:[.43,.39,.62],flora:0x594d9b,floraLight:0xa89be0,trunk:0x302b45,water:0x4b5b9b,accent:0xafa1ed,sun:0xffe0d0,fill:0x7775b6,terrainTint:0xc7c0e0,rockTint:0x716b9c,cloud:'rgba(192,182,235,.25)',cloudRGB:[185,175,226],surface:['#1b1b3b','#48467e','#8886ba','#ded9f1'],wet:false}
  };


  function routeId(id) { return ALIASES[id] || id || 'overview'; }
  function metaFor(id) {
    var key = routeId(id);
    for (var i=0;i<ROUTES.length;i++) if (ROUTES[i].id === key) return {route:ROUTES[i],index:i};
    return {route:ROUTES[0],index:0};
  }
  function esc(s) { return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }

  function buildNavigation() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    nav.innerHTML = GROUPS.map(function(group) {
      return '<div class="no-nav-group">'+group.label+'</div>'+group.items.map(function(item) {
        return '<button type="button" data-id="'+item[0]+'" class="'+(item[0]===current?'active':'')+'"><span class="no-nav-index">'+String(metaFor(item[0]).index).padStart(2,'0')+'</span><span>'+item[1]+'</span><i></i></button>';
      }).join('');
    }).join('');
    var mobile = document.getElementById('no-mobile-nav');
    if (!mobile) {
      mobile = document.createElement('nav');
      mobile.id = 'no-mobile-nav';
      mobile.setAttribute('aria-label','Navegação principal');
      mobile.innerHTML = '<button type="button" data-id="overview"><b>⌂</b><span>Início</span></button><button type="button" data-id="lore"><b>◉</b><span>Cosmologia</span></button><button type="button" data-id="systems"><b>▦</b><span>Sistemas</span></button><button type="button" data-id="characters"><b>♙</b><span>Personagens</span></button>';
      document.body.appendChild(mobile);
    }
    mobile.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b.dataset.id===current);});
  }

  function buildStage() {
    if (stage || !document.querySelector('.main')) return;
    var main = document.querySelector('.main');
    var top = main.querySelector('.top');
    canvas = document.createElement('canvas');
    canvas.id = 'no-cinema-canvas';
    canvas.setAttribute('aria-hidden','true');
    document.body.appendChild(canvas);
    stage = document.createElement('section');
    stage.id = 'no-cinema-stage';
    stage.className = 'no-cinema-stage';
    stage.setAttribute('aria-label','Ponte de navegação intergaláctica');
    stage.innerHTML = [
      '<div class="no-cinema-vignette"></div>',
      '<div class="no-cinema-grain"></div>',
      '<header class="no-cinema-header"><div class="no-cinema-overline"><span class="no-cinema-live"></span> AGÊNCIA INTERDIMENSIONAL <i>/</i> NAVEGAÇÃO DE LONGO ALCANCE</div><div class="no-cinema-sector">SETOR <b>07.41.Ω</b><span>·</span> LINK ESTÁVEL</div></header>',
      '<div class="no-cinema-title-wrap"><div class="no-cinema-kicker">DESTINO <span class="no-cinema-route-index">00</span> <i></i> <span class="no-cinema-route-kicker">CENTRAL DE NAVEGAÇÃO</span></div><h1 class="no-cinema-title">NOVA <em>ORDEM</em></h1><p class="no-cinema-description">O ponto de partida da Agência. Escolha um destino e inicie a travessia.</p></div>',
      '<aside class="no-cinema-explorer"><div class="no-cinema-explorer-top"><span>REGISTRO DE DESTINO</span><b class="no-cinema-destination-code">NO / 00</b></div><h2 class="no-cinema-destination-name">GALÁXIA</h2><p class="no-cinema-destination-desc">Selecione um ponto de interesse para iniciar a exploração.</p><div class="no-cinema-divider"></div><div class="no-cinema-points-label">PONTOS DE INTERESSE <span>///</span></div><ul class="no-cinema-topics"></ul><button class="no-cinema-land" type="button"><span>INICIAR POUSO</span><b>↗</b></button><div class="no-cinema-land-status">CLIQUE NO PLANETA OU INICIE A APROXIMAÇÃO</div></aside>',
      '<div class="no-cinema-bottom"><div class="no-cinema-vessel"><span class="no-cinema-vessel-light"></span><span><b>NO–07 / CARGUEIRO</b><small class="no-cinema-vessel-state">EM ÓRBITA · PROPULSÃO NOMINAL</small></span></div><div class="no-cinema-route-track"><span>ROTAS MAPEADAS</span><div class="no-cinema-route-list"></div></div><div class="no-cinema-controls"><span>ARRASTE PARA OBSERVAR</span><b>360°</b></div></div>',
      '<div class="no-cinema-transition-flash"></div>',
      '<div class="no-cinema-intro" aria-hidden="true"><div class="no-cinema-intro-label">AGÊNCIA INTERDIMENSIONAL <i>·</i> TRANSPORTE AUTORIZADO</div><div class="no-cinema-intro-title">SALTO <em>ESPACIAL</em></div><div class="no-cinema-intro-sub">INICIANDO NAVEGAÇÃO DE LONGO ALCANCE</div><div class="no-cinema-intro-progress"><i></i></div><button type="button" class="no-cinema-skip">PULAR SEQUÊNCIA ↗</button></div>'
    ].join('');
    if (top && top.nextSibling) main.insertBefore(stage,top.nextSibling);
    else main.insertBefore(stage,main.firstChild);
    routeNav = stage.querySelector('.no-cinema-route-list');
    topicList = stage.querySelector('.no-cinema-topics');
    routeNav.innerHTML = ROUTES.map(function(r,i) {
      return '<button type="button" data-space-id="'+r.id+'" class="'+(r.id===current?'active':'')+'"><span class="no-route-number">'+String(i).padStart(2,'0')+'</span><span>'+esc(r.name)+'</span><i></i></button>';
    }).join('');
    routeNav.addEventListener('click',function(ev) {
      var b = ev.target.closest('button[data-space-id]');
      if (b) window.go(b.dataset.spaceId);
    });
    stage.querySelector('.no-cinema-land').addEventListener('click',landOnPlanet);
    stage.querySelector('.no-cinema-skip').addEventListener('click',dismissIntro);
    stage.addEventListener('pointermove',onPointer,{passive:true});
    stage.addEventListener('pointerdown',onStagePointer);
    document.querySelectorAll('.hero').forEach(function(el){el.classList.add('no-cinema-old-hero');});
    buildNavigation();
    updateHud(current);
    syncTopics();
  }

  function onPointer(ev) {
    var rect = stage.getBoundingClientRect();
    pointerTarget.x = ((ev.clientX-rect.left)/rect.width-.5);
    pointerTarget.y = ((ev.clientY-rect.top)/rect.height-.5);
  }
  function onStagePointer(ev) {
    if (!raycaster || !camera || !planetMesh || ev.target.closest('button')) return;
    var rect = canvas.getBoundingClientRect();
    var mouse = new THREE.Vector2((ev.clientX/rect.width)*2-1,-(ev.clientY/rect.height)*2+1);
    raycaster.setFromCamera(mouse,camera);
    if (raycaster.intersectObject(planetMesh,false).length) landOnPlanet();
  }

  function updateHud(id) {
    if (!stage) return;
    var m = metaFor(id),r = m.route;
    current = r.id;
    stage.dataset.destination = r.id;
    stage.querySelector('.no-cinema-route-index').textContent=String(m.index).padStart(2,'0');
    stage.querySelector('.no-cinema-route-kicker').textContent=r.kicker;
    stage.querySelector('.no-cinema-title').innerHTML=r.id==='overview'?'NOVA <em>ORDEM</em>':esc(r.name).replace(/(Power|System)/g,'<em>$1</em>');
    stage.querySelector('.no-cinema-description').textContent=r.description;
    stage.querySelector('.no-cinema-destination-code').textContent='NO / '+String(m.index).padStart(2,'0');
    stage.querySelector('.no-cinema-destination-name').textContent=r.name.toUpperCase();
    stage.querySelector('.no-cinema-destination-desc').textContent=r.description;
    stage.querySelectorAll('.no-cinema-route-list button').forEach(function(b){b.classList.toggle('active',b.dataset.spaceId===r.id);});
    var nav=document.getElementById('nav');
    if(nav)nav.querySelectorAll('button[data-id]').forEach(function(b){b.classList.toggle('active',b.dataset.id===r.id);});
    var mobile=document.getElementById('no-mobile-nav');
    if(mobile)mobile.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b.dataset.id===r.id);});
    if(r.id==='overview')stage.querySelector('.no-cinema-land-status').textContent='CLIQUE NO PLANETA OU INICIE A APROXIMAÇÃO';
    else stage.querySelector('.no-cinema-land-status').textContent='POUSO DISPONÍVEL · ARQUIVOS AGUARDANDO EXPLORAÇÃO';
  }

  function syncTopics() {
    if (!topicList) return;
    var root=document.getElementById('content');
    var candidates=root?Array.prototype.slice.call(root.querySelectorAll('h2,h3,h4,.section,.v6-item h3,.no87-section h3')):[];
    var values=[];
    candidates.forEach(function(el){
      var t=(el.textContent||'').replace(/\s+/g,' ').trim();
      if(t&&t.length<72&&values.indexOf(t)===-1)values.push(t);
    });
    if(!values.length) values=['Visão geral do destino','Registros e documentação','Sistemas relacionados','Pontos de exploração'];
    topicList.innerHTML=values.slice(0,5).map(function(t,i){return '<li><span>'+String(i+1).padStart(2,'0')+'</span><b>'+esc(t)+'</b><i></i></li>';}).join('');
  }

  function color(hex) {
    var n=parseInt(hex.slice(1),16);
    return [(n>>16)&255,(n>>8)&255,n&255];
  }
  function mix(a,b,t) {return [Math.round(a[0]+(b[0]-a[0])*t),Math.round(a[1]+(b[1]-a[1])*t),Math.round(a[2]+(b[2]-a[2])*t)];}
  function hash(x,y,seed) {var n=Math.sin(x*127.1+y*311.7+seed*74.7)*43758.5453;return n-Math.floor(n);}
  function smooth(t) {return t*t*(3-2*t);}
  function noise(x,y,seed) {
    var ix=Math.floor(x),iy=Math.floor(y),fx=smooth(x-ix),fy=smooth(y-iy);
    var a=hash(ix,iy,seed),b=hash(ix+1,iy,seed),c=hash(ix,iy+1,seed),d=hash(ix+1,iy+1,seed);
    return (a+(b-a)*fx)+((c+(d-c)*fx)-(a+(b-a)*fx))*fy;
  }
  function fbm(x,y,seed) {
    var v=0,amp=.55,norm=0;
    for(var i=0;i<4;i++){v+=noise(x,y,seed+i*13)*amp;norm+=amp;x*=2.03;y*=2.01;amp*=.5;}
    return v/norm;
  }
  function makeSurfaceTexture(route,index) {
    var cache=palettes[route.id];
    if(cache&&cache.surface)return cache.surface;
    // Textura procedural determinística: continentes, faixas atmosféricas e micro-relevo.
    // Resolução moderada para preservar o tempo de inicialização em celulares.
    var eco=ECOLOGIES[route.id]||ECOLOGIES.characters;
    var styleByType={crystal:0,coast:4,badlands:1,temperate:4,glacier:2,volcanic:3,desert:1,ash:3,alpine:2,jungle:4,rocky:6,geothermal:3,salt:1,highland:2};
    var width=384,height=192,style=styleByType[eco.type]===undefined?index%7:styleByType[eco.type],seed=index*31+17;
    var c=document.createElement('canvas');c.width=width;c.height=height;
    var ctx=c.getContext('2d'),img=ctx.createImageData(width,height),data=img.data;
    var hc=document.createElement('canvas');hc.width=width;hc.height=height;
    var hctx=hc.getContext('2d'),himg=hctx.createImageData(width,height),hd=himg.data;
    var surfacePalette=eco.surface||route.palette;
    var sea=color(surfacePalette[0]),land=color(surfacePalette[1]),high=color(surfacePalette[2]),ice=color(surfacePalette[3]);
    for(var y=0;y<height;y++){
      var v=y/height,latitude=Math.abs(v-.5)*2,polar=Math.pow(latitude,2.2);
      for(var x=0;x<width;x++){
        var u=x/width;
        var continent=fbm(u*8+seed*.13,v*5+seed*.07,seed)-.515;
        var detail=fbm(u*34+seed,v*19+seed*.2,seed+7);
        var fine=fbm(u*92+seed*.3,v*54+seed*.17,seed+21);
        var ridge=1-Math.abs(detail*2-1);
        var band=Math.sin(v*42+Math.sin(u*9+seed)*.8+detail*1.4)*.5+.5;
        var rgb,relief=0;
        if(style===5){
          // Gigante gasoso: bandas largas, turbulência e faixas de tempestade.
          var gas=band*.62+detail*.27+fine*.11;
          rgb=mix(sea,land,Math.max(0,Math.min(1,gas)));
          if(gas>.78)rgb=mix(rgb,high,(gas-.78)*2.8);
          if(Math.abs(gas-.57)<.035)rgb=mix(rgb,ice,.34);
          relief=.42+gas*.24+fine*.08;
        }else{
          var landMask=continent+(Math.sin(u*21+Math.sin(v*13)*1.7)*.025);
          var elevation=Math.max(0,Math.min(1,(landMask+.105)*3.5+detail*.26+ridge*.12));
          var oceanDepth=Math.max(0,Math.min(1,(-landMask+.035)*3.1+detail*.16));
          if(style===1){ // árido: desertos, dunas e planaltos
            rgb=mix(land,high,Math.max(0,Math.min(1,elevation*.7+band*.16)));
            rgb=mix(sea,rgb,Math.max(.18,Math.min(1,landMask*4+detail*.25)));
          }else if(style===2){ // mundo glacial
            rgb=mix(sea,ice,Math.max(0,Math.min(1,polar*.72+elevation*.48)));
            rgb=mix(rgb,high,Math.max(0,(ridge-.72)*.65));
          }else if(style===3){ // mundo vulcânico
            rgb=mix(sea,land,Math.max(0,Math.min(1,elevation*.85)));
            if(fine>.68&&ridge>.58)rgb=mix(rgb,[235,91,37],Math.min(.82,(fine-.68)*3.5));
          }else if(style===4){ // mundo oceânico/vegetado
            rgb=mix(sea,land,Math.max(0,Math.min(1,elevation*.9+detail*.1)));
            rgb=mix(rgb,high,Math.max(0,(ridge-.72)*.45));
          }else if(style===6){ // superfície rochosa e árida, com pouca água
            rgb=mix(land,high,Math.max(0,Math.min(1,elevation*.76+fine*.18)));
            rgb=mix(sea,rgb,Math.max(.38,Math.min(1,landMask*3.4+detail*.2)));
          }else{
            rgb=mix(sea,land,Math.max(0,Math.min(1,oceanDepth*.13+elevation*.86)));
            if(elevation>.72)rgb=mix(rgb,ice,Math.min(.78,(elevation-.72)*2.8+polar*.18));
          }
          relief=landMask>0?(.28+elevation*.58+ridge*.1):(.12+oceanDepth*.1);
        }
        var shade=(detail-.5)*19+(fine-.5)*13+(ridge-.5)*9;
        var idx=(y*width+x)*4;
        data[idx]=Math.max(0,Math.min(255,rgb[0]+shade));
        data[idx+1]=Math.max(0,Math.min(255,rgb[1]+shade));
        data[idx+2]=Math.max(0,Math.min(255,rgb[2]+shade));
        data[idx+3]=255;
        var hval=Math.max(0,Math.min(255,relief*210+(fine-.5)*34));
        hd[idx]=hd[idx+1]=hd[idx+2]=hval;hd[idx+3]=255;
      }
    }
    ctx.putImageData(img,0,0);hctx.putImageData(himg,0,0);
    // Crateras com borda iluminada e bacia sombreada em mundos rochosos.
    if(style===1||style===2||style===6){
      var count=style===2?34:52;
      for(var k=0;k<count;k++){
        var cx=hash(k,seed,4)*width,cy=hash(k,seed,8)*height,rad=2+hash(k,seed,12)*(style===6?13:9);
        var grad=ctx.createRadialGradient(cx-rad*.18,cy-rad*.2,rad*.12,cx,cy,rad);
        grad.addColorStop(0,'rgba(8,12,18,.18)');grad.addColorStop(.68,'rgba(12,17,22,.08)');
        grad.addColorStop(.84,'rgba(225,220,202,.17)');grad.addColorStop(1,'rgba(5,9,14,0)');
        ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.fill();
      }
    }
    var tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;tex.wrapS=THREE.RepeatWrapping;tex.needsUpdate=true;
    var heightTex=new THREE.CanvasTexture(hc);heightTex.anisotropy=4;heightTex.wrapS=THREE.RepeatWrapping;heightTex.needsUpdate=true;
    if(!palettes[route.id])palettes[route.id]={};
    palettes[route.id].surface=tex;palettes[route.id].height=heightTex;
    return tex;
  }
  function makeHeightTexture(route,index) {
    var cache=palettes[route.id];
    if(!cache||!cache.height){makeSurfaceTexture(route,index);cache=palettes[route.id];}
    return cache.height;
  }
  function makeCloudTexture(route,index) {
    var cache=palettes[route.id];
    if(cache&&cache.clouds)return cache.clouds;
    var eco=ECOLOGIES[route.id]||ECOLOGIES.characters;
    var width=320,height=160,style=index%7,seed=index*19+3;
    var c=document.createElement('canvas');c.width=width;c.height=height;
    var ctx=c.getContext('2d'),img=ctx.createImageData(width,height),data=img.data;
    for(var y=0;y<height;y++)for(var x=0;x<width;x++){
      var u=x/width,v=y/height;
      var n=fbm(u*13+index*2,v*8+index,seed);
      var bands=Math.sin(v*(style===5?95:28)+Math.sin(u*12+index)*1.7)*.5+.5;
      var density=style===5?(bands*.76+n*.24):(n*.78+bands*.22);
      if(style===1||style===6)density*=.58;
      var alpha=Math.max(0,Math.min(style===5?190:158,(density-(style===5?.43:.57))*(style===5?340:390)));
      var i=(y*width+x)*4;
      var cloudRGB=eco.cloudRGB||[220,235,245];
      data[i]=cloudRGB[0];data[i+1]=cloudRGB[1];data[i+2]=cloudRGB[2];data[i+3]=alpha;
    }
    ctx.putImageData(img,0,0);
    var tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=3;tex.wrapS=THREE.RepeatWrapping;tex.needsUpdate=true;
    if(!palettes[route.id])palettes[route.id]={};
    palettes[route.id].clouds=tex;
    return tex;
  }
  function makeNebulaTexture(tint) {
    var c=document.createElement('canvas');c.width=320;c.height=320;
    var ctx=c.getContext('2d'),img=ctx.createImageData(320,320),m=String(tint||'').match(/rgba?\(([^)]+)\)/);
    var rgb=m?m[1].split(',').slice(0,3).map(function(v){return parseFloat(v)||0;}):[150,185,220];
    for(var y=0;y<320;y++)for(var x=0;x<320;x++){
      var nx=x/320,ny=y/320,cloud=fbm(nx*5.4+1.7,ny*5.4-2.1,43)*.58+fbm(nx*12.8-3,ny*12.8+4,71)*.29+fbm(nx*28,ny*28,97)*.13;
      var filament=1-Math.abs(cloud*2-1),edge=Math.pow(Math.max(0,1-Math.hypot((nx-.5)*1.55,(ny-.5)*1.55)),.7);
      var density=Math.max(0,Math.min(1,(cloud-.43)*3.2+Math.max(0,filament-.72)*.9))*edge;
      var p=(y*320+x)*4;
      img.data[p]=Math.min(255,rgb[0]+density*55);
      img.data[p+1]=Math.min(255,rgb[1]+density*58);
      img.data[p+2]=Math.min(255,rgb[2]+density*70);
      img.data[p+3]=Math.round(density*155);
    }
    ctx.putImageData(img,0,0);
    var tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true;return tex;
  }

  function buildShip() {
    var group=new THREE.Group();
    var hullMat=new THREE.MeshPhysicalMaterial({color:0x7d8b96,metalness:.72,roughness:.29,clearcoat:.68,envMapIntensity:1.35,clearcoatRoughness:.38});
    var armorMat=new THREE.MeshStandardMaterial({color:0x344452,metalness:.72,roughness:.32,envMapIntensity:1.15});
    var panelMat=new THREE.MeshStandardMaterial({color:0x9ba8af,metalness:.7,roughness:.28,envMapIntensity:1.25});
    var darkMat=new THREE.MeshStandardMaterial({color:0x111d28,metalness:.62,roughness:.34,envMapIntensity:.9});
    var cargoMat=new THREE.MeshStandardMaterial({color:0x596b78,metalness:.55,roughness:.4,envMapIntensity:1.05});
    var glassMat=new THREE.MeshPhysicalMaterial({color:0x397b91,metalness:.46,roughness:.12,clearcoat:1,envMapIntensity:1.35,clearcoatRoughness:.08,emissive:0x071b27,emissiveIntensity:.32});
    var glowMat=new THREE.MeshBasicMaterial({color:0x75dfff});
    var warmGlow=new THREE.MeshBasicMaterial({color:0xffc77e});
    function add(geo,mat,x,y,z,rx,ry,rz,parent) {
      var mesh=new THREE.Mesh(geo,mat);
      mesh.position.set(x||0,y||0,z||0);
      mesh.rotation.set(rx||0,ry||0,rz||0);
      (parent||group).add(mesh);
      return mesh;
    }
    function beam(a,b,r1,r2,mat) {
      var delta=new THREE.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
      var mesh=add(new THREE.CylinderGeometry(r2,r1,delta.length(),10),mat,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
      return mesh;
    }
    function panel(x,y,z,w,h,d,mat) { return add(new THREE.BoxGeometry(w,h,d),mat,x,y,z); }

    // Sculpted pressure hull with a tapered bow and broad cargo section.
    var hull=new THREE.Shape();
    hull.moveTo(2.55,.02);
    hull.quadraticCurveTo(2.35,.28,1.72,.36);
    hull.lineTo(.72,.48);
    hull.quadraticCurveTo(.1,.52,-.72,.43);
    hull.lineTo(-1.9,.32);
    hull.quadraticCurveTo(-2.28,.26,-2.42,.08);
    hull.lineTo(-2.42,-.1);
    hull.quadraticCurveTo(-2.24,-.3,-1.82,-.34);
    hull.lineTo(-.6,-.42);
    hull.quadraticCurveTo(.3,-.48,.85,-.4);
    hull.lineTo(1.78,-.28);
    hull.quadraticCurveTo(2.36,-.2,2.55,.02);
    var hullGeo=new THREE.ExtrudeGeometry(hull,{depth:.86,steps:1,bevelEnabled:true,bevelSegments:3,bevelSize:.075,bevelThickness:.085,curveSegments:12});
    hullGeo.translate(0,0,-.43);
    add(hullGeo,hullMat,0,0,0);

    // Reinforced keel, service spine and layered armor.
    panel(-.05,-.31,0,3.45,.12,.72,armorMat);
    panel(-.25,.34,0,2.75,.1,.54,panelMat);
    panel(-1.45,.02,0,.68,.48,.98,armorMat);
    panel(-.15,.03,0,1.65,.24,.74,darkMat);

    // Low panoramic command canopy with a metallic frame.
    var canopy=add(new THREE.SphereGeometry(.43,32,20),glassMat,1.18,.26,0);
    canopy.scale.set(1.42,.58,.92);
    var canopyFrame=add(new THREE.TorusGeometry(.405,.035,8,40),panelMat,1.16,.245,0,0,Math.PI/2,0);
    canopyFrame.scale.set(1.22,.72,1);
    panel(1.02,.49,0,.72,.055,.62,armorMat);

    // Three armored cargo modules with visible ribs and access panels.
    [-.92,-.18,.56].forEach(function(x,i){
      var z=i===1?0:(i===0?-.015:.015);
      panel(x,.56,z,.57,.42,.57,cargoMat);
      panel(x,.79,z,.55,.055,.55,armorMat);
      panel(x,.34,z,.59,.06,.59,darkMat);
      for(var rib=-2;rib<=2;rib++){
        panel(x+rib*.085,.57,z+.292,.025,.32,.018,panelMat);
        panel(x+rib*.085,.57,z-.292,.025,.32,.018,armorMat);
      }
      panel(x,.57,z+.302,.3,.12,.018,darkMat);
      panel(x,.57,z-.302,.3,.12,.018,darkMat);
      add(new THREE.BoxGeometry(.09,.09,.025),warmGlow,x-.18,.57,z+.318);
    });

    // Swept structural wings with reinforced leading edges.
    [-1,1].forEach(function(side){
      var wing=new THREE.Shape();
      wing.moveTo(.42,-.18);
      wing.lineTo(-.55,1.62);
      wing.quadraticCurveTo(-.7,1.78,-.92,1.72);
      wing.lineTo(-1.62,1.42);
      wing.lineTo(-1.05,.2);
      wing.lineTo(-.78,-.18);
      wing.closePath();
      var wingGeo=new THREE.ExtrudeGeometry(wing,{depth:.12,bevelEnabled:true,bevelSegments:2,bevelSize:.045,bevelThickness:.035});
      wingGeo.rotateX(Math.PI/2);
      wingGeo.scale(1,1,side);
      add(wingGeo,panelMat,-.35,-.16,side*.28);
      beam([-.98,-.17,side*1.78],[-1.56,-.17,side*1.58],.045,.035,armorMat);
      add(new THREE.SphereGeometry(.055,12,8),side>0?glowMat:warmGlow,-1.5,-.12,side*1.58);
      panel(-.72,-.08,side*.98,.55,.055,.22,armorMat);
    });

    // Three recessed engine bells with concentric rims and blue drive glow.
    var engineLights=[];
    [-.29,0,.29].forEach(function(z,i){
      add(new THREE.CylinderGeometry(.19,.27,.72,24,1,true),armorMat,-2.25,-.02,z,0,0,Math.PI/2);
      add(new THREE.CylinderGeometry(.205,.205,.08,24),darkMat,-2.64,-.02,z,0,0,Math.PI/2);
      add(new THREE.TorusGeometry(.205,.035,8,28),panelMat,-2.69,-.02,z,0,Math.PI/2,0);
      add(new THREE.CircleGeometry(.155,24),glowMat,-2.695,-.02,z,0,-Math.PI/2,0);
      var glow=new THREE.PointLight(0x4bc8f4,i===1?2.2:1.5,4);
      glow.position.set(-2.72,-.02,z);group.add(glow);engineLights.push(glow);
      panel(-1.95,.19,z,.38,.07,.24,panelMat);
    });

    // Folded landing struts, hatches, service rails and navigation lights.
    [-.72,.82].forEach(function(x){
      [-.28,.28].forEach(function(z){
        beam([x,-.25,z],[x-.12,-.62,z*1.45],.055,.035,armorMat);
        add(new THREE.CylinderGeometry(.09,.09,.055,12),darkMat,x-.12,-.63,z*1.45,0,0,Math.PI/2);
      });
    });
    for(var i=0;i<5;i++){
      panel(-1.45+i*.48,.405,.445,.22,.018,.018,darkMat);
      panel(-1.45+i*.48,.405,-.445,.22,.018,.018,darkMat);
    }
    panel(-1.88,.36,0,.18,.08,.16,panelMat);
    beam([-1.88,.4,0],[-2.02,.72,0],.018,.012,armorMat);
    add(new THREE.SphereGeometry(.035,10,8),glowMat,-2.02,.72,0);
    [-.39,.39].forEach(function(z){add(new THREE.SphereGeometry(.045,12,8),warmGlow,1.82,.08,z);});

    // Visible, layered drive plumes and micro navigation lights.
    var exhaustMat=new THREE.MeshBasicMaterial({color:0x56c9f5,transparent:true,opacity:.34,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
    var exhaustCore=new THREE.MeshBasicMaterial({color:0xb9f4ff,transparent:true,opacity:.62,blending:THREE.AdditiveBlending,depthWrite:false});
    [-.29,0,.29].forEach(function(z,i){
      var plume=add(new THREE.ConeGeometry(.17,.92,20,1,true),exhaustMat,-3.08,-.02,z,0,0,Math.PI/2);
      plume.scale.set(1,.72+i*.08,1);
      var core=add(new THREE.ConeGeometry(.07,.56,16,1,true),exhaustCore,-3.08,-.02,z,0,0,Math.PI/2);
      core.scale.set(1,.7,1);
      var beacon=add(new THREE.SphereGeometry(.035,10,8),glowMat,-.2,.91,z);
    });
    for(var decal=0;decal<7;decal++){
      panel(-1.55+decal*.43,.86,.29,.22,.012,.012,darkMat);
      panel(-1.55+decal*.43,.86,-.29,.22,.012,.012,darkMat);
    }
    var dorsalAntenna=beam([.42,.48,0],[.58,.88,0],.025,.012,panelMat);
    add(new THREE.SphereGeometry(.045,12,8),glowMat,.58,.88,0);
    group.userData.engineLights=engineLights;
    group.scale.setScalar(.74);
    group.position.set(-4.2,-1.55,2.5);
    group.rotation.set(.035,-.08,-.025);
    return group;
  }

  function buildScene() {
    scene=new THREE.Scene();scene.background=new THREE.Color(0x02050b);scene.fog=new THREE.FogExp2(0x02050b,.006);
    camera=new THREE.PerspectiveCamera(43,window.innerWidth/window.innerHeight,.1,180);
    camera.position.set(0,.15,12.6);camera.lookAt(0,0,0);
    renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setSize(window.innerWidth,window.innerHeight,false);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.18;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    scene.add(new THREE.HemisphereLight(0x9bbad8,0x10131b,1.05));
    var key=new THREE.DirectionalLight(0xd6e7ff,3.1);key.position.set(-5,6,8);key.castShadow=true;scene.add(key);
    var rim=new THREE.DirectionalLight(0x4d8cbd,2.1);rim.position.set(5,-2,-6);scene.add(rim);
    var starGeo=new THREE.BufferGeometry(),positions=new Float32Array(5200*3),colors=new Float32Array(5200*3);
    for(var i=0;i<5200;i++){
      var radius=28+Math.random()*80,theta=Math.random()*Math.PI*2,phi=Math.acos(2*Math.random()-1);
      positions[i*3]=radius*Math.sin(phi)*Math.cos(theta);
      positions[i*3+1]=radius*Math.cos(phi);
      positions[i*3+2]=radius*Math.sin(phi)*Math.sin(theta);
      var tint=Math.random()>.9?[.62,.82,1]:[.76,.82,.9];
      colors[i*3]=tint[0];colors[i*3+1]=tint[1];colors[i*3+2]=tint[2];
    }
    starGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    starGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));
    starField=new THREE.Points(starGeo,new THREE.PointsMaterial({size:.105,sizeAttenuation:true,vertexColors:true,transparent:true,opacity:.92,depthWrite:false}));
    scene.add(starField);
    var nebulae=[
      {x:-12,y:7,z:-24,s:19,c:'rgba(111,74,171,.22)'},
      {x:13,y:-5,z:-34,s:24,c:'rgba(36,104,153,.24)'},
      {x:1,y:11,z:-46,s:30,c:'rgba(117,70,120,.18)'}
    ];
    nebulae.forEach(function(n){
      var mat=new THREE.SpriteMaterial({map:makeNebulaTexture(n.c),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.85});
      var sprite=new THREE.Sprite(mat);sprite.position.set(n.x,n.y,n.z);sprite.scale.set(n.s,n.s*.72,1);scene.add(sprite);
    });
    planetGroup=new THREE.Group();planetGroup.position.set(-1.25,-.05,0);scene.add(planetGroup);
    var first=metaFor(current);
    var surface=makeSurfaceTexture(first.route,first.index);
    var clouds=makeCloudTexture(first.route,first.index);
    planetMesh=new THREE.Mesh(new THREE.SphereGeometry(2.65,112,80),new THREE.MeshPhysicalMaterial({map:surface,bumpMap:surface,bumpScale:.045,roughness:.92,metalness:.025,clearcoat:.08,clearcoatRoughness:.8}));
    planetMesh.castShadow=true;planetMesh.receiveShadow=true;planetGroup.add(planetMesh);
    cloudMesh=new THREE.Mesh(new THREE.SphereGeometry(2.68,96,64),new THREE.MeshStandardMaterial({map:clouds,transparent:true,opacity:.42,depthWrite:false,roughness:1,metalness:0}));
    planetGroup.add(cloudMesh);
    var atmosphereColor=new THREE.Color(first.route.palette[2]);
    atmosphereMesh=new THREE.Mesh(new THREE.SphereGeometry(2.74,96,64),new THREE.ShaderMaterial({
      uniforms:{glowColor:{value:atmosphereColor},glowStrength:{value:.62}},
      vertexShader:'varying vec3 vNormal; varying vec3 vView; void main(){vNormal=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.0); vView=-mv.xyz; gl_Position=projectionMatrix*mv;}',
      fragmentShader:'uniform vec3 glowColor; uniform float glowStrength; varying vec3 vNormal; varying vec3 vView; void main(){float f=pow(1.0-max(dot(normalize(vNormal),normalize(vView)),0.0),3.0); gl_FragColor=vec4(glowColor, f*glowStrength);}',
      side:THREE.BackSide,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false
    }));
    planetGroup.add(atmosphereMesh);
    var ring=new THREE.Mesh(new THREE.TorusGeometry(3.25,.018,8,180),new THREE.MeshBasicMaterial({color:0x9cbad0,transparent:true,opacity:.28}));
    ring.rotation.set(.8,.12,.2);planetGroup.add(ring);
    var ring2=new THREE.Mesh(new THREE.TorusGeometry(3.55,.008,6,180),new THREE.MeshBasicMaterial({color:0x6387a6,transparent:true,opacity:.18}));
    ring2.rotation.set(.95,.25,.1);planetGroup.add(ring2);
    var moon=new THREE.Mesh(new THREE.SphereGeometry(.43,32,24),new THREE.MeshStandardMaterial({color:0x89939c,roughness:1,metalness:.05}));
    moon.position.set(3.65,.7,-1.4);planetGroup.add(moon);
    var moonLight=new THREE.PointLight(0x9bc8e5,.28,4);moonLight.position.copy(moon.position);planetGroup.add(moonLight);
    ship=buildShip();scene.add(ship);ark=buildArk();scene.add(ark);
    raycaster=new THREE.Raycaster();
    clock=new THREE.Clock();
    window.addEventListener('resize',onResize,{passive:true});
    animate();
  }

  function applyRouteAtmosphere(id){
    var route=ROUTES.find(function(r){return r.id===id;})||ROUTES[0],eco=ECOLOGIES[id]||ECOLOGIES.characters;
    if(!document.body)return;
    document.body.dataset.noPlanetTheme=id;
    document.body.style.setProperty('--no-ecology-accent','#'+(eco.accent||0x83c9d5).toString(16).padStart(6,'0'));
    document.body.style.setProperty('--no-ecology-flora','#'+(eco.flora||0x55734b).toString(16).padStart(6,'0'));
    document.body.style.setProperty('--no-ecology-glow',route.palette[2]);
  }

  function applyPlanet(id) {
    if(!planetMesh)return;
    var m=metaFor(id),r=m.route;
    planetMesh.material.map=makeSurfaceTexture(r,m.index);
    planetMesh.material.bumpMap=planetMesh.material.map;
    planetMesh.material.needsUpdate=true;
    cloudMesh.material.map=makeCloudTexture(r,m.index);
    cloudMesh.material.needsUpdate=true;
    atmosphereMesh.material.uniforms.glowColor.value.set(ECOLOGIES[r.id]?new THREE.Color(ECOLOGIES[r.id].accent):new THREE.Color(r.palette[2]));
    planetGroup.rotation.set(.04+m.index*.025,.1+m.index*.12,.015);
    planetGroup.scale.setScalar(1);
  }

  function onResize() {
    if(!renderer||!camera)return;
    camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(window.innerWidth,window.innerHeight,false);
  }

  function animate() {
    requestAnimationFrame(animate);
    if(!renderer||!scene)return;
    var dt=Math.min(clock.getDelta(),.05),elapsed=clock.elapsedTime;
    pointer.x+=(pointerTarget.x-pointer.x)*.035;pointer.y+=(pointerTarget.y-pointer.y)*.035;
    if(!reduced){
      planetMesh.rotation.y+=dt*.025;
      cloudMesh.rotation.y+=dt*.038;
      planetGroup.rotation.z+=dt*.003;
      if(!landed&&!transition){
        ship.position.y=-1.55+Math.sin(elapsed*.65)*.11;
        ship.rotation.z=-.035+Math.sin(elapsed*.35)*.018;
        ship.rotation.y=Math.sin(elapsed*.25)*.035;
        ship.position.x=-4.2+Math.sin(elapsed*.16)*.16;
      }
      starField.rotation.y+=dt*.0018;
      starField.rotation.x+=dt*.0005;
      camera.position.x=pointer.x*.42;
      camera.position.y=.15-pointer.y*.24;
    }
    if(transition)updateTransition(performance.now());
    if(lasers.length)updateLasers(dt);
    laserTimer+=dt;
    if(laserTimer>7.5&&!reduced){laserTimer=0;spawnLaser();}
    renderer.render(scene,camera);
  }

  function spawnLaser() {
    if(!scene)return;
    var colorHex=Math.random()>.5?0x42e5b2:0xff536a;
    var start=new THREE.Vector3((Math.random()-.5)*13,Math.random()*5-2,-5-Math.random()*9);
    var end=start.clone().add(new THREE.Vector3((Math.random()-.5)*4,(Math.random()-.5)*2,-2));
    var geo=new THREE.BufferGeometry().setFromPoints([start,end]);
    var line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:colorHex,transparent:true,opacity:.92}));
    scene.add(line);lasers.push({line:line,life:0});
  }
  function updateLasers(dt) {
    lasers=lasers.filter(function(l){l.life+=dt;if(l.life>1.1){scene.remove(l.line);l.line.geometry.dispose();l.line.material.dispose();return false;}l.line.material.opacity=Math.max(0,1-l.life/1.1);return true;});
  }

  function beginTravel(id) {
    if(!camera||!planetGroup)return;
    var m=metaFor(id),r=m.route;
    var now=performance.now();
    var fromPos=camera.position.clone();
    var warpPos=new THREE.Vector3(.35,1.1,18.2);
    var toPos=new THREE.Vector3(0,.1,10.8);
    var shipFrom=ship.position.clone();
    var shipWarp=new THREE.Vector3(-8.2,-2.6,4.4);
    var shipTo=new THREE.Vector3(-4.2,-1.55,2.5);
    transition={start:now,duration:3600,from:fromPos,warp:warpPos,to:toPos,shipFrom:shipFrom,shipWarp:shipWarp,shipTo:shipTo,route:r,meta:m,swapped:false};
    stage.classList.add('is-travelling');
    stage.querySelector('.no-cinema-vessel-state').textContent='SAÍDA DE ÓRBITA · MANOBRA DE TRANSFERÊNCIA';
    landed=false;
    stage.querySelector('.no-cinema-land-status').textContent='TRAJETÓRIA INTERPLANETÁRIA EM CURSO';
  }
  function updateTransition(now) {
    var tr=transition;if(!tr)return;
    var t=Math.max(0,Math.min(1,(now-tr.start)/tr.duration));
    var phase=t<.5?t*2:(t-.5)*2;
    var ease=phase*phase*(3-2*phase);
    if(t<.5)camera.position.lerpVectors(tr.from,tr.warp,ease);
    else camera.position.lerpVectors(tr.warp,tr.to,ease);
    if(ship){
      if(t<.5)ship.position.lerpVectors(tr.shipFrom,tr.shipWarp,ease);
      else ship.position.lerpVectors(tr.shipWarp,tr.shipTo,ease);
    }
    camera.position.x+=Math.sin(t*Math.PI)*.75;
    camera.position.y+=Math.sin(t*Math.PI*2)*.24;
    camera.lookAt(0,0,0);
    if(t>.44&&!tr.swapped){
      tr.swapped=true;
      applyPlanet(tr.route.id);
      updateHud(tr.route.id);
      syncTopics();
      stage.classList.add('is-arriving');
      stage.querySelector('.no-cinema-vessel-state').textContent='APROXIMAÇÃO · DESTINO IDENTIFICADO';
      stage.querySelector('.no-cinema-transition-flash').classList.remove('active');
      void stage.offsetWidth;
      stage.querySelector('.no-cinema-transition-flash').classList.add('active');
    }
    if(t>=1){
      camera.position.copy(tr.to);camera.lookAt(0,0,0);
      if(ship)ship.position.copy(tr.shipTo);
      stage.classList.remove('is-travelling','is-arriving');
      stage.querySelector('.no-cinema-vessel-state').textContent='EM ÓRBITA · PROPULSÃO NOMINAL';
      stage.querySelector('.no-cinema-land-status').textContent='POUSO DISPONÍVEL · ARQUIVOS AGUARDANDO EXPLORAÇÃO';
      transition=null;
    }
  }

  function landOnPlanet() {
    if(!camera||landed||transition)return;
    landed=true;
    stage.classList.add('is-landing');
    stage.querySelector('.no-cinema-vessel-state').textContent='DESCIDA ATMOSFÉRICA · POUSO AUTORIZADO';
    stage.querySelector('.no-cinema-land-status').textContent='NAVE EM APROXIMAÇÃO · PREPARANDO POUSO';
    var start=performance.now(),duration=2600,from=camera.position.clone(),to=new THREE.Vector3(-.55,.05,7.1);
    var startScale=planetGroup.scale.x;
    function frame(now) {
      var t=Math.min(1,(now-start)/duration),e=1-Math.pow(1-t,4);
      camera.position.lerpVectors(from,to,e);camera.lookAt(0,0,0);
      planetGroup.scale.setScalar(startScale+(.16*e));
      ship.position.lerp(new THREE.Vector3(-2.4,-1.0,1.5),.018+e*.045);
      if(t<1)requestAnimationFrame(frame);
      else{
        stage.classList.remove('is-landing');
        stage.classList.add('is-landed');
        stage.querySelector('.no-cinema-vessel-state').textContent='POUSO CONCLUÍDO · ACESSO AO ARQUIVO LIBERADO';
        stage.querySelector('.no-cinema-land-status').textContent='POUSO CONFIRMADO · EXPLORAÇÃO LIBERADA';
        var wrap=document.querySelector('.wrap');
        if(wrap)window.setTimeout(function(){wrap.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});},550);
      }
    }
    requestAnimationFrame(frame);
  }

  function dismissIntro() {
    var intro=stage&&stage.querySelector('.no-cinema-intro');
    if(!intro)return;
    intro.classList.add('is-dismissed');
    window.setTimeout(function(){if(intro.parentNode)intro.parentNode.removeChild(intro);},1000);
    if(introTimer)window.clearTimeout(introTimer);
  }
  function playIntro() {
    if(reduced)return;
    try{if(sessionStorage.getItem('no-cinema-intro-seen'))return;sessionStorage.setItem('no-cinema-intro-seen','1');}catch(e){}
    var intro=stage.querySelector('.no-cinema-intro');
    if(!intro)return;
    intro.classList.add('is-playing');
    introTimer=window.setTimeout(dismissIntro,5200);
  }

  function loadThree() {
    return import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js')
      .then(function(mod){
        THREE=mod;
        buildScene();
        stage.classList.add('no-journey-ready');
        window.dispatchEvent(new Event('nova-ordem-3d-ready'));
      })
      .catch(function(err){
        console.error('Nova Ordem 3D engine failed:',err);
        if(stage){
          stage.classList.add('no-cinema-webgl-fallback','no-journey-error-state');
          var notice=stage.querySelector('.no-journey-error');
          if(notice){
            notice.hidden=false;
            notice.querySelector('b').textContent='MODO VISUAL DE CONTINGÊNCIA';
            notice.querySelector('p').textContent='O motor 3D não iniciou neste dispositivo. A navegação permanece visível em modo visual simplificado. '+(err&&err.message?err.message:'');
          }
          var fallback=stage.querySelector('.no-journey-fallback-scene');
          if(fallback)fallback.classList.add('is-active');
        }
        return null;
      });
  }

  function wrapNavigation() {
    if(typeof originalGo!=='function')return;
    window.go=function(id,fromHistory) {
      var previous=current,next=routeId(id);
      var result=originalGo.apply(this,arguments);
      if(next!==previous){
        current=next;
        updateHud(next);
        syncTopics();
        if(THREE&&planetMesh)beginTravel(next);
      } else {
        current=next;
        updateHud(next);
        syncTopics();
      }
      buildNavigation();
      return result;
    };
    document.addEventListener('click',function(ev){
      var b=ev.target.closest('#nav button[data-id],#no-mobile-nav button[data-id]');
      if(!b)return;
      ev.preventDefault();ev.stopImmediatePropagation();
      window.go(b.dataset.id);
    },true);
    var content=document.getElementById('content');
    if(content&&window.MutationObserver){
      var observer=new MutationObserver(function(){syncTopics();});
      observer.observe(content,{childList:true,subtree:true,characterData:true});
    }
  }

  function start() {
    buildStage();
    wrapNavigation();
    buildNavigation();
    loadThree().then(function(){playIntro();});
    var search=document.getElementById('search');
    if(search)search.addEventListener('input',function(){
      var q=search.value.trim().toLowerCase();
      if(!q)return;
      var root=document.getElementById('content');
      var match=root&&Array.prototype.find.call(root.querySelectorAll('h2,h3,h4,p,.row'),function(el){return (el.textContent||'').toLowerCase().indexOf(q)>=0;});
      if(match)match.scrollIntoView({behavior:'smooth',block:'center'});
    });
  }


  /* NOVA ORDEM — continuous scroll journey, all destinations in one spatial route */
  buildStage = function () {
    if (stage || !document.querySelector('.main')) return;
    var main=document.querySelector('.main'),top=main.querySelector('.top');
    canvas=document.createElement('canvas');canvas.id='no-cinema-canvas';canvas.setAttribute('aria-hidden','true');document.body.appendChild(canvas);
    var journey=document.createElement('div');journey.id='no-cinema-journey';
    stage=document.createElement('section');stage.id='no-cinema-stage';stage.className='no-cinema-stage no-journey-stage';
    stage.setAttribute('aria-label','Viagem espacial contínua pela Nova Ordem');
    stage.innerHTML=[
      '<div class="no-cinema-vignette"></div><div class="no-cinema-grain"></div>',
      '<header class="no-cinema-header"><div class="no-cinema-overline"><span class="no-cinema-live"></span> AGÊNCIA INTERDIMENSIONAL <i>/</i> ROTA DE EXPLORAÇÃO</div><div class="no-cinema-sector">NO–07 <b>· CARGUEIRO</b></div></header>',
      '<div class="no-journey-welcome"><span>TRANSMISSÃO DE LONGO ALCANCE · SINAL ESTÁVEL</span><h1>BEM-VINDO À <em>NOVA ORDEM</em></h1><p>Uma jornada pelos registros, mundos e sistemas conhecidos pela Agência.</p><small>CONTINUE DESCENDO PARA INICIAR A TRAVESSIA</small></div>',
      '<div class="no-journey-destination"><span class="no-journey-kicker">DESTINO EM OBSERVAÇÃO</span><h2>ESPAÇO PROFUNDO</h2><p>A nave ainda está cruzando o vazio.</p><button type="button" class="no-journey-explore" hidden>EXPLORAR ESTE MUNDO ↗</button></div>',
      '<div class="no-journey-progress"><span>PROGRESSO DA EXPEDIÇÃO</span><div><i></i></div><b>00%</b></div>',
      '<div class="no-journey-scrollhint">ROLE PARA VIAJAR <span>↓</span></div>',
      '<div class="no-journey-planet-labels"></div>',
      '<div class="no-journey-landing" aria-live="polite"><span>ACESSO PLANETÁRIO</span><b>PREPARANDO APROXIMAÇÃO</b></div>',
      '<aside class="no-journey-error" hidden role="status"><b>INICIALIZANDO MOTOR 3D</b><p>A experiência espacial está sendo preparada.</p></aside>',
      '<div class="no-journey-fallback-scene" aria-hidden="true"><i class="fallback-starfield"></i><i class="fallback-planet fallback-planet-a"></i><i class="fallback-planet fallback-planet-b"></i><i class="fallback-planet fallback-planet-c"></i><i class="fallback-ship"></i></div>'
    ].join('');
    journey.appendChild(stage);
    if(top&&top.nextSibling)main.insertBefore(journey,top.nextSibling);else main.insertBefore(journey,main.firstChild);
    journey.style.height=(ROUTES.length*105+180)+'vh';
    routeNav=stage.querySelector('.no-journey-planet-labels');
    routeNav.innerHTML=ROUTES.filter(function(r){return r.id!=='overview';}).map(function(r,i){
      return '<button type="button" data-space-id="'+r.id+'"><span>'+String(i+1).padStart(2,'0')+'</span>'+esc(r.name)+'</button>';
    }).join('');
    routeNav.addEventListener('click',function(ev){var b=ev.target.closest('button[data-space-id]');if(b)openPlanetDestination(b.dataset.spaceId);});
    stage.addEventListener('pointermove',onPointer,{passive:true});
    stage.addEventListener('pointerdown',onJourneyPointer);
    document.querySelectorAll('.hero').forEach(function(el){el.classList.add('no-cinema-old-hero');});
    buildNavigation();
  };

  function styleBumpScale(index){return index%7===5?.035:(index%7===2?.105:.075);}
  var journeyPlanets=[],journeyProgress=0,selectedPlanet=null,landscape=null,landscapeClouds=[],landscapeSegments=[],landscapeSkyColors=[],journeyLength=0,ark=null,journeyCelestials=[];
  function onJourneyPointer(ev){
    if(!raycaster||!camera||!journeyPlanets.length||ev.target.closest('button'))return;
    var rect=canvas.getBoundingClientRect(),mouse=new THREE.Vector2((ev.clientX-rect.left)/rect.width*2-1,-((ev.clientY-rect.top)/rect.height*2-1));
    raycaster.setFromCamera(mouse,camera);
    var hits=raycaster.intersectObjects(journeyPlanets.map(function(p){return p.mesh;}),false);
    if(hits.length){var found=journeyPlanets.find(function(p){return p.mesh===hits[0].object;});if(found)openPlanetDestination(found.route.id);}
  }
  function buildArk(){
    var root=new THREE.Group(),body=new THREE.Group();root.add(body);
    var shell=new THREE.MeshPhysicalMaterial({color:0xc8d6df,metalness:.62,roughness:.26,clearcoat:.85});
    var dark=new THREE.MeshStandardMaterial({color:0x172b3a,metalness:.8,roughness:.3});
    var joint=new THREE.MeshStandardMaterial({color:0x597181,metalness:.82,roughness:.24});
    var cyan=new THREE.MeshStandardMaterial({color:0x64e6f5,emissive:0x1689ad,emissiveIntensity:2.2,metalness:.2,roughness:.18});
    var visor=new THREE.MeshPhysicalMaterial({color:0x061725,metalness:.75,roughness:.1,clearcoat:1,emissive:0x08283a,emissiveIntensity:.65});
    function part(g,m,x,y,z,rx,ry,rz){var o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.rotation.set(rx||0,ry||0,rz||0);body.add(o);return o;}
    part(new THREE.CylinderGeometry(.13,.2,.42,14),shell,0,.02,0);
    part(new THREE.BoxGeometry(.37,.24,.24),dark,0,.09,.02);
    part(new THREE.SphereGeometry(.22,24,18),shell,0,.39,0).scale.set(.88,1.05,.82);
    part(new THREE.SphereGeometry(.17,24,16),visor,0,.405,.105).scale.set(1,.72,.38);
    part(new THREE.BoxGeometry(.19,.025,.018),cyan,0,.405,.17);
    part(new THREE.CylinderGeometry(.035,.045,.24,10),joint,-.235,.04,0,0,0,-.12);
    part(new THREE.CylinderGeometry(.035,.045,.24,10),joint,.235,.04,0,0,0,.12);
    part(new THREE.SphereGeometry(.075,14,10),shell,-.29,-.105,0);
    part(new THREE.SphereGeometry(.075,14,10),shell,.29,-.105,0);
    part(new THREE.CylinderGeometry(.045,.055,.25,10),dark,-.09,-.27,0,0,0,-.08);
    part(new THREE.CylinderGeometry(.045,.055,.25,10),dark,.09,-.27,0,0,0,.08);
    part(new THREE.BoxGeometry(.13,.07,.2),shell,-.1,-.405,.015);
    part(new THREE.BoxGeometry(.13,.07,.2),shell,.1,-.405,.015);
    part(new THREE.ConeGeometry(.095,.34,5),dark,-.2,.22,-.12,0,0,.42);
    part(new THREE.ConeGeometry(.095,.34,5),dark,.2,.22,-.12,0,0,-.42);
    var halo=part(new THREE.TorusGeometry(.31,.025,8,40),cyan,0,.02,-.18,Math.PI/2);
    root.scale.setScalar(.92);root.userData={body:body,halo:halo};return root;
  }

  function buildEnvironmentMap(){
    var c=document.createElement('canvas');c.width=512;c.height=256;
    var ctx=c.getContext('2d'),g=ctx.createLinearGradient(0,0,0,256);
    g.addColorStop(0,'#14263c');g.addColorStop(.38,'#26394a');g.addColorStop(.56,'#111c2c');g.addColorStop(1,'#030810');
    ctx.fillStyle=g;ctx.fillRect(0,0,512,256);
    var nebulae=[[-80,110,190,'rgba(111,75,163,.52)','rgba(111,75,163,.12)'],[230,80,170,'rgba(37,110,156,.46)','rgba(37,110,156,.12)'],[430,160,145,'rgba(160,82,91,.32)','rgba(160,82,91,.10)']];
    nebulae.forEach(function(n){var r=ctx.createRadialGradient(n[0],n[1],4,n[0],n[1],n[2]);r.addColorStop(0,n[3]);r.addColorStop(.4,n[4]);r.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=r;ctx.fillRect(0,0,512,256);});
    for(var i=0;i<480;i++){var x=hash(i,11,83)*512,y=hash(i,17,97)*256,rad=.25+hash(i,19,101)*1.1;ctx.fillStyle='rgba(218,235,255,'+(.12+hash(i,23,109)*.55)+')';ctx.beginPath();ctx.arc(x,y,rad,0,Math.PI*2);ctx.fill();}
    var tex=new THREE.CanvasTexture(c);tex.mapping=THREE.EquirectangularReflectionMapping;tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true;return tex;
  }

  function buildScene(){
    scene=new THREE.Scene();scene.background=new THREE.Color(0x01040a);scene.fog=new THREE.FogExp2(0x01040a,.0018);
    scene.environment=buildEnvironmentMap();
    camera=new THREE.PerspectiveCamera(48,window.innerWidth/window.innerHeight,.1,900);
    camera.position.set(0,1.1,17);camera.lookAt(0,0,-24);
    renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:false,antialias:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65));renderer.setSize(window.innerWidth,window.innerHeight,false);
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;
    scene.add(new THREE.HemisphereLight(0xb5d1e8,0x111722,1.05));
    var sun=new THREE.DirectionalLight(0xffe5c2,3.4);sun.position.set(-18,22,20);scene.add(sun);
    var fill=new THREE.DirectionalLight(0x6ba9df,1.5);fill.position.set(16,-5,-30);scene.add(fill);
    var starGeo=new THREE.BufferGeometry(),pos=new Float32Array(11000*3),col=new Float32Array(11000*3);
    for(var i=0;i<11000;i++){var rr=90+Math.random()*380,th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1);pos[i*3]=rr*Math.sin(ph)*Math.cos(th);pos[i*3+1]=rr*Math.cos(ph);pos[i*3+2]=rr*Math.sin(ph)*Math.sin(th);var k=Math.random()>.91?[.65,.82,1]:[.78,.84,.92];col.set(k,i*3);}
    starGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));starGeo.setAttribute('color',new THREE.BufferAttribute(col,3));
    starField=new THREE.Points(starGeo,new THREE.PointsMaterial({size:.19,sizeAttenuation:true,vertexColors:true,transparent:true,opacity:.92,depthWrite:false}));scene.add(starField);
    var dustGeo=new THREE.BufferGeometry(),dustPos=new Float32Array(3200*3),dustCol=new Float32Array(3200*3);
    for(var di=0;di<3200;di++){
      var dr=35+Math.random()*320,da=Math.random()*Math.PI*2;
      dustPos[di*3]=Math.cos(da)*dr;
      dustPos[di*3+1]=(Math.random()-.5)*Math.min(85,dr*.22);
      dustPos[di*3+2]=Math.sin(da)*dr;
      var warm=Math.random()>.72;dustCol.set(warm?[1,.62,.43]:[.48,.72,.9],di*3);
    }
    dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPos,3));dustGeo.setAttribute('color',new THREE.BufferAttribute(dustCol,3));
    dustField=new THREE.Points(dustGeo,new THREE.PointsMaterial({size:.42,sizeAttenuation:true,vertexColors:true,transparent:true,opacity:.24,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(dustField);
    var nebulae=[[-28,18,-80,55,'rgba(101,75,167,.26)'],[34,-12,-155,72,'rgba(35,111,161,.25)'],[-12,22,-250,90,'rgba(141,77,113,.2)']];
    nebulae.forEach(function(n){var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:makeNebulaTexture(n[4]),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.8}));sp.position.set(n[0],n[1],n[2]);sp.scale.set(n[3],n[3]*.7,1);scene.add(sp);});
    ship=buildShip();ship.scale.setScalar(.58);ship.position.set(0,-1.45,10.5);ship.rotation.set(0,Math.PI/2,0);scene.add(ship);
    journeyPlanets=[];
    var spacing=23;
    ROUTES.filter(function(r){return r.id!=='overview';}).forEach(function(r,i){
      var idx=ROUTES.indexOf(r),g=new THREE.Group(),size=(i%4===0?4.25:(i%3===0?3.1:2.65));
      g.position.set((i%2===0?1:-1)*(3.8+(i%3)*1.4),Math.sin(i*1.7)*1.7,-58-i*spacing);
      var material=new THREE.MeshPhysicalMaterial({map:makeSurfaceTexture(r,idx),bumpMap:makeHeightTexture(r,idx),bumpScale:styleBumpScale(idx),roughness:.96,metalness:.012});
      var mesh=new THREE.Mesh(new THREE.SphereGeometry(size,112,80),material);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);
      var clouds=new THREE.Mesh(new THREE.SphereGeometry(size*1.012,96,64),new THREE.MeshStandardMaterial({map:makeCloudTexture(r,idx),transparent:true,opacity:.42,depthWrite:false,roughness:1}));g.add(clouds);
      var atmo=new THREE.Mesh(new THREE.SphereGeometry(size*1.045,96,64),new THREE.ShaderMaterial({uniforms:{glowColor:{value:new THREE.Color(r.palette[2])},glowStrength:{value:.7}},vertexShader:'varying vec3 n;varying vec3 v;void main(){n=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);v=-mv.xyz;gl_Position=projectionMatrix*mv;}',fragmentShader:'uniform vec3 glowColor;uniform float glowStrength;varying vec3 n;varying vec3 v;void main(){float f=pow(1.-max(dot(normalize(n),normalize(v)),0.),3.);gl_FragColor=vec4(glowColor,f*glowStrength);}',side:THREE.BackSide,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(atmo);
      if(i===3||i===8||i===12){var ring=new THREE.Mesh(new THREE.TorusGeometry(size*1.38,.09,8,180),new THREE.MeshStandardMaterial({color:0xb9b4a6,roughness:.78,metalness:.12,transparent:true,opacity:.52}));ring.rotation.set(1.15,.22,.18);g.add(ring);}
      var moon=new THREE.Mesh(new THREE.SphereGeometry(size*.13,32,24),new THREE.MeshStandardMaterial({color:0x858b91,roughness:1}));moon.position.set(size*1.55,size*.24,-size*.32);g.add(moon);
      scene.add(g);journeyPlanets.push({route:r,index:i,group:g,mesh:mesh,clouds:clouds,atmo:atmo,size:size,z:g.position.z});
    });
    var solarGlow=new THREE.Mesh(new THREE.SphereGeometry(10,96,64),new THREE.MeshBasicMaterial({color:0xffd69a}));
    solarGlow.position.set(0,0,-58-journeyPlanets.length*spacing-28);scene.add(solarGlow);journeyCelestials.push(solarGlow);
    var corona=new THREE.Mesh(new THREE.SphereGeometry(12.2,64,48),new THREE.MeshBasicMaterial({color:0xff9d54,transparent:true,opacity:.12,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false}));
    corona.position.copy(solarGlow.position);scene.add(corona);journeyCelestials.push(corona);
    var sunLight=new THREE.PointLight(0xffc887,8,260);sunLight.position.copy(solarGlow.position);scene.add(sunLight);journeyCelestials.push(sunLight);
    journeyLength=58+(journeyPlanets.length-1)*spacing+70;
    raycaster=new THREE.Raycaster();clock=new THREE.Clock();
    window.addEventListener('resize',onResize,{passive:true});
    window.addEventListener('scroll',onJourneyScroll,{passive:true});window.addEventListener('scroll',onLandscapeScroll,{passive:true});
    onJourneyScroll();animate();
  }
  function onJourneyScroll(){
    if(!stage||!renderer||selectedPlanet)return;
    var journey=document.getElementById('no-cinema-journey');if(!journey)return;
    var rect=journey.getBoundingClientRect(),travel=Math.max(1,journey.offsetHeight-window.innerHeight);
    journeyProgress=Math.max(0,Math.min(1,-rect.top/travel));
    var pct=Math.round(journeyProgress*100),bar=stage.querySelector('.no-journey-progress i');
    if(bar)bar.style.width=pct+'%';var label=stage.querySelector('.no-journey-progress b');if(label)label.textContent=String(pct).padStart(2,'0')+'%';
    var z=12-journeyProgress*journeyLength,x=Math.sin(journeyProgress*Math.PI*journeyPlanets.length)*1.35;
    camera.position.set(x,1.15+Math.sin(journeyProgress*18)*.12,z+4.8);
    camera.lookAt(x*.7,.1,z-24);
    ship.position.set(x*.58,-1.5+Math.sin(performance.now()*.0007)*.07,z-1.6);
    var nearest=null,dist=1e9;
    journeyPlanets.forEach(function(p){var d=Math.abs(p.z-z);if(d<dist){dist=d;nearest=p;}});
    var panel=stage.querySelector('.no-journey-destination'),button=stage.querySelector('.no-journey-explore');
    if(dist<18&&nearest){
      panel.classList.add('is-visible');panel.querySelector('h2').textContent=nearest.route.name.toUpperCase();
      panel.querySelector('p').textContent=nearest.route.description;
      panel.querySelector('.no-journey-kicker').textContent='DESTINO '+String(nearest.index+1).padStart(2,'0')+' · APROXIMAÇÃO';
      button.hidden=false;button.onclick=function(){openPlanetDestination(nearest.route.id);};
    }else if(journeyProgress<.045){panel.classList.remove('is-visible');panel.querySelector('h2').textContent='ESPAÇO PROFUNDO';panel.querySelector('p').textContent='A nave ainda está cruzando o vazio.';button.hidden=true;}
    else if(nearest){panel.classList.add('is-visible');panel.querySelector('h2').textContent='PRÓXIMO DESTINO · '+nearest.route.name.toUpperCase();panel.querySelector('p').textContent='A travessia continua. Role para avançar pela rota.';button.hidden=true;}
    var welcome=stage.querySelector('.no-journey-welcome');welcome.classList.toggle('is-hidden',journeyProgress>.14);
  }
  function animate(){
    requestAnimationFrame(animate);if(!renderer||!scene)return;
    var dt=Math.min(clock.getDelta(),.05),elapsed=clock.elapsedTime;
    if(!reduced){
      journeyPlanets.forEach(function(p,i){p.mesh.rotation.y+=dt*(.018+i*.0005);p.clouds.rotation.y+=dt*(.026+i*.0007);p.group.rotation.z=Math.sin(elapsed*.08+i)*.012;});
      if(ship&&!selectedPlanet){ship.rotation.z=Math.sin(elapsed*.34)*.012;ship.rotation.x=Math.sin(elapsed*.22)*.009;}
      if(ark&&ship){
        var a=elapsed*.82,rad=selectedPlanet?1.2:2.25;
        ark.position.set(ship.position.x+Math.cos(a)*rad,ship.position.y+.5+Math.sin(a*1.7)*.62,ship.position.z+Math.sin(a)*1.7);
        ark.rotation.y=a+Math.PI*.5;ark.rotation.z=Math.sin(a*1.7)*.13;
        if(ark.userData&&ark.userData.body){ark.userData.body.rotation.y=Math.sin(elapsed*1.3)*.12;ark.userData.halo.rotation.z+=dt*.8;}
      }
      if(starField)starField.rotation.y+=dt*.00045;
      if(dustField){dustField.rotation.y+=dt*.00013;dustField.rotation.z+=dt*.000025;}
      if(landscape){landscape.rotation.y=Math.sin(elapsed*.05)*.006;landscapeClouds.forEach(function(c,i){c.position.x+=dt*(.12+i*.035);if(c.position.x>70)c.position.x=-70;});}
    }
    renderer.render(scene,camera);
  }

  var landscapePhotoCache={};
  function applyLandscapePhotoMaps(kind,material){
    var asset=(kind==='jungle'||kind==='temperate')?'brown_mud_leaves_01':
      (kind==='coast'||kind==='frozen-coast'||kind==='glacier')?'coast_sand_rocks_02':
      (kind==='desert'||kind==='badlands'||kind==='canyon'||kind==='salt')?'aerial_sand':'aerial_rocks_02';
    var cached=landscapePhotoCache[asset];
    if(cached){
      cached.materials.push(material);
      if(cached.map)material.map=cached.map;
      if(cached.normal){material.normalMap=cached.normal;material.normalScale.set(.72,.72);}
      material.needsUpdate=true;
      return;
    }
    cached=landscapePhotoCache[asset]={map:null,normal:null,materials:[material],failed:false};
    var loader=new THREE.TextureLoader();loader.setCrossOrigin('anonymous');
    var root='https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/'+asset+'/'+asset;
    loader.load(root+'_diff_1k.jpg',function(tex){
      tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(4,4);tex.anisotropy=4;
      cached.map=tex;cached.materials.forEach(function(m){m.map=tex;m.needsUpdate=true;});
    },undefined,function(){cached.failed=true;});
    loader.load(root+'_nor_gl_1k.jpg',function(tex){
      tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(4,4);tex.anisotropy=4;
      cached.normal=tex;cached.materials.forEach(function(m){m.normalMap=tex;m.normalScale.set(.72,.72);m.needsUpdate=true;});
    },undefined,function(){});
  }

  function createLandscape(index){
    if(landscapeSegments&&landscapeSegments.length){
      landscapeSegments.forEach(function(part){
        scene.remove(part);
        part.traverse(function(o){
          if(o.geometry)o.geometry.dispose();
          if(o.material){
            if(Array.isArray(o.material))o.material.forEach(function(m){m.dispose();});
            else o.material.dispose();
          }
        });
      });
      landscapeSegments=[];
    }else if(landscape){scene.remove(landscape);}
    var route=ROUTES.find(function(x){return x.id===selectedPlanet;})||ROUTES[1];
    var biomes=ECOLOGIES;
    var base=biomes[route.id]||biomes.alpine,kind=base.type,seed=index*37+91;
    // Cada destino mantém uma assinatura geológica própria ao longo da travessia.
    // Não inserir alpine/highland como "preenchimento" em planetas que não são montanhosos.
    var sequences={
      crystal:['crystal','crystal','rocky','crystal'],
      coast:['coast','coast','temperate','coast'],
      badlands:['badlands','canyon','badlands','canyon'],
      temperate:['temperate','temperate','coast','temperate'],
      glacier:['glacier','frozen-coast','glacier','glacier'],
      volcanic:['volcanic','ash','geothermal','volcanic'],
      desert:['desert','desert','salt','desert'],
      ash:['ash','volcanic','ash','rocky'],
      alpine:['alpine','highland','alpine','glacier'],
      jungle:['jungle','jungle','temperate','jungle'],
      rocky:['rocky','rocky','canyon','rocky'],
      geothermal:['geothermal','volcanic','geothermal','badlands'],
      salt:['salt','salt','desert','salt'],
      highland:['highland','alpine','highland','rocky']
    };
    var sequence=sequences[kind]||[kind,kind,kind,kind];
    landscape=new THREE.Group();
    landscapeClouds=[];
    landscapeSegments=[];
    var skyColors=[];
    function fractal(x,z,s){
      return fbm(x*.027+s*.13,z*.027-s*.07,s+3)*.55+
        fbm(x*.071-s*.08,z*.071+s*.11,s+17)*.29+
        fbm(x*.19+s*.04,z*.19-s*.03,s+31)*.16;
    }
    function heightAt(x,z,k,s){
      // Domain warp discreto: evita o padrão de "cordilheira de ruído" repetido em todos os mundos.
      var wx=x+(fbm(x*.012,z*.012,s+2)-.5)*10;
      var wz=z+(fbm(x*.012+21,z*.012-13,s+8)-.5)*10;
      var broad=fractal(wx,wz,s),ridge=1-Math.abs(fractal(wx*.92,wz*.92,s+11)*2-1);
      var detail=fractal(wx*3.4,wz*3.4,s+23)-.5;
      var h=0;
      // Relevo baixo e amplo por padrão. Só mundos alpinos recebem picos altos.
      if(k==='coast'||k==='frozen-coast'){
        h=(broad-.5)*4.2+detail*.65+Math.sin(wx*.025+wz*.014)*1.15;
        h-=Math.max(0,1-Math.abs(x+Math.sin(z*.014)*24)/34)*3.8;
      }else if(k==='temperate'){
        h=(broad-.5)*7.2+detail*1.05+Math.sin(wx*.018+wz*.012)*1.7;
      }else if(k==='jungle'){
        h=(broad-.5)*6.2+detail*.9+Math.sin(wx*.021)*1.25;
      }else if(k==='glacier'){
        h=(broad-.5)*8.5+detail*.8+Math.pow(Math.max(0,ridge-.66),2)*34;
      }else if(k==='alpine'||k==='highland'){
        h=(broad-.5)*11+detail*1.25+Math.pow(Math.max(0,ridge-.57),2)*58;
      }else if(k==='volcanic'||k==='geothermal'){
        var caldera=Math.max(0,1-Math.abs(Math.hypot(wx+28,wz-8)-29)/12);
        h=(broad-.5)*6+detail*.8+caldera*13+Math.pow(Math.max(0,ridge-.7),2)*24;
      }else if(k==='badlands'){
        var mesa=(broad-.46)*15;
        h=Math.round(mesa/3.8)*3.8+detail*.55;
      }else if(k==='canyon'){
        h=(broad-.5)*8+detail*.75;
        h-=Math.pow(Math.max(0,1-Math.abs(x-Math.sin(z*.018)*25)/17),2)*15;
      }else if(k==='desert'){
        h=(broad-.5)*3.5+Math.sin(wx*.035+Math.sin(wz*.018)*1.8)*4.1+Math.sin(wz*.022)*1.6;
      }else if(k==='salt'){
        h=(broad-.5)*1.8+detail*.25+Math.sin(wx*.018)*.35;
      }else if(k==='ash'){
        h=(broad-.5)*5.2+detail*.75+Math.sin(wx*.04+wz*.025)*1.1;
      }else if(k==='rocky'){
        h=(broad-.5)*7.5+detail*1.4+Math.pow(Math.max(0,ridge-.76),2)*12;
      }else if(k==='crystal'){
        h=(broad-.5)*4.5+detail*.7+Math.pow(Math.max(0,ridge-.72),2)*15;
      }else{
        h=(broad-.5)*5+detail*.8;
      }
      return Math.max(-12,Math.min(30,h));
    }
    function makeGroundMaps(k,s){
      var w=384,h=384,c=document.createElement('canvas'),b=document.createElement('canvas');
      c.width=b.width=w;c.height=b.height=h;
      var cx=c.getContext('2d'),bx=b.getContext('2d'),im=cx.createImageData(w,h),bm=bx.createImageData(w,h);
      var lo=base.ground,hi=base.rock;
      if(k==='glacier'||k==='frozen-coast'){lo=[.35,.46,.52];hi=[.79,.86,.89];}
      if(k==='volcanic'||k==='geothermal'||k==='ash'){lo=[.075,.065,.06];hi=[.32,.27,.23];}
      if(k==='desert'||k==='badlands'||k==='canyon'||k==='salt'){lo=[.36,.24,.14];hi=[.72,.55,.36];}
      if(k==='jungle'||k==='temperate'){lo=[.07,.16,.075];hi=[.32,.39,.25];}
      for(var py=0;py<h;py++)for(var px=0;px<w;px++){
        var n=fbm(px/w*19+s*.1,py/h*19-s*.07,s+5);
        var fine=hash(px,py,s+13),strata=Math.sin(py*.17+n*15+s)*.5+.5;
        var v=Math.max(0,Math.min(1,(n-.32)*1.25+strata*.16+(fine-.5)*.12));
        var shade=(fine-.5)*.09+(n-.5)*.12;
        var p=(py*w+px)*4;
        im.data[p]=Math.max(0,Math.min(255,(lo[0]+(hi[0]-lo[0])*v+shade)*255));
        im.data[p+1]=Math.max(0,Math.min(255,(lo[1]+(hi[1]-lo[1])*v+shade)*255));
        im.data[p+2]=Math.max(0,Math.min(255,(lo[2]+(hi[2]-lo[2])*v+shade)*255));
        im.data[p+3]=255;
        var bump=Math.max(0,Math.min(255,95+n*90+strata*28+(fine-.5)*40));
        bm.data[p]=bm.data[p+1]=bm.data[p+2]=bump;bm.data[p+3]=255;
      }
      cx.putImageData(im,0,0);bx.putImageData(bm,0,0);
      var map=new THREE.CanvasTexture(c),bump=new THREE.CanvasTexture(b);
      map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(3,3);map.anisotropy=4;
      bump.wrapS=bump.wrapT=THREE.RepeatWrapping;bump.repeat.set(3,3);bump.anisotropy=4;
      return {map:map,bump:bump};
    }
    function irregularRockGeometry(s){
      var g=new THREE.IcosahedronGeometry(1,2),a=g.attributes.position;
      for(var q=0;q<a.count;q++){
        var x=a.getX(q),y=a.getY(q),z=a.getZ(q);
        var n=hash(Math.round((x+1)*100),Math.round((y+1)*100)+Math.round((z+1)*50),s);
        var f=.78+n*.38+Math.sin(x*11+y*7+z*9+s)*.055;
        a.setXYZ(q,x*f,y*f,z*f);
      }
      g.computeVertexNormals();return g;
    }
    function makeFoliageGeometry(s){
      var g=new THREE.SphereGeometry(1,20,14),a=g.attributes.position;
      for(var q=0;q<a.count;q++){
        var x=a.getX(q),y=a.getY(q),z=a.getZ(q);
        var wave=Math.sin(x*7+s)*Math.cos(z*8-s*.4)*.055;
        var n=(hash(Math.round((x+1)*90),Math.round((y+1)*90)+Math.round((z+1)*50),s)-.5)*.11;
        var f=1+wave+n;
        a.setXYZ(q,x*f,y*(1+wave*.7+n),z*f);
      }
      g.computeVertexNormals();return g;
    }
    function makeLeafGeometry(form){
      var shape=new THREE.Shape();
      if(form==='needle'||form==='grass'||form==='crystal'){
        var w=form==='crystal'?.16:form==='grass'?.105:.065,h=form==='crystal'?1.22:1.42;
        shape.moveTo(0,0);shape.quadraticCurveTo(-w*.45,h*.42,0,h);shape.quadraticCurveTo(w*.45,h*.42,0,0);
      }else if(form==='succulent'){
        shape.moveTo(0,0);shape.quadraticCurveTo(-.38,.22,-.31,.58);shape.quadraticCurveTo(-.22,.94,0,1.02);shape.quadraticCurveTo(.3,.83,.34,.49);shape.quadraticCurveTo(.35,.18,0,0);
      }else if(form==='fern'){
        shape.moveTo(0,0);shape.quadraticCurveTo(-.26,.3,-.17,.62);shape.lineTo(-.08,.75);shape.quadraticCurveTo(-.18,.98,0,1.2);shape.quadraticCurveTo(.2,.92,.09,.73);shape.lineTo(.19,.58);shape.quadraticCurveTo(.26,.25,0,0);
      }else if(form==='moss'){
        shape.moveTo(0,0);shape.quadraticCurveTo(-.38,.25,-.27,.62);shape.quadraticCurveTo(-.14,.91,0,.96);shape.quadraticCurveTo(.34,.83,.31,.5);shape.quadraticCurveTo(.27,.18,0,0);
      }else{
        shape.moveTo(0,0);shape.quadraticCurveTo(-.22,.24,-.19,.48);shape.quadraticCurveTo(-.13,.82,0,1.12);shape.quadraticCurveTo(.17,.78,.2,.47);shape.quadraticCurveTo(.22,.2,0,0);
      }
      var g=new THREE.ShapeGeometry(shape,12);g.computeVertexNormals();return g;
    }
    function makeSegment(seg,segIndex){
      var s=seed+segIndex*29,k=seg,group=new THREE.Group(),maps=makeGroundMaps(k,s);
      var geo=new THREE.PlaneGeometry(230,180,128,112);geo.rotateX(-Math.PI/2);
      var attr=geo.attributes.position,colors=[];
      for(var vi=0;vi<attr.count;vi++){
        var x=attr.getX(vi),z=attr.getZ(vi),h=heightAt(x,z,k,s);
        attr.setY(vi,h);
        var elevation=Math.max(0,Math.min(1,(h+5)/92));
        var tint=new THREE.Color(1,1,1);
        var variation=.88+fractal(x*.8,z*.8,s)*.18;
        tint.multiplyScalar(variation);
        if((k==='glacier'||k==='frozen-coast')&&elevation>.46)tint.lerp(new THREE.Color(0xe9f2f4),Math.min(.85,(elevation-.46)*1.5));
        if((k==='volcanic'||k==='geothermal'||k==='ash')&&elevation>.35)tint.lerp(new THREE.Color(0x5d514a),Math.min(.65,(elevation-.35)*.8));
        if((k==='jungle'||k==='temperate')&&elevation<.22)tint.multiplyScalar(.84);
        colors.push(tint.r,tint.g,tint.b);
      }
      geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.computeVertexNormals();
      var terrainMaterial=new THREE.MeshStandardMaterial({color:base.terrainTint||0xffffff,map:maps.map,bumpMap:maps.bump,bumpScale:.52,vertexColors:true,roughness:.94,metalness:.018});
      applyLandscapePhotoMaps(k,terrainMaterial);
      var terrain=new THREE.Mesh(geo,terrainMaterial);
      terrain.position.y=-8;terrain.receiveShadow=true;group.add(terrain);
      var rockGeo=irregularRockGeometry(s),rockMat=new THREE.MeshStandardMaterial({color:base.rockTint||0xffffff,map:maps.map,roughness:.97,flatShading:false});
      var rockCount=k==='jungle'?30:64,rocks=new THREE.InstancedMesh(rockGeo,rockMat,rockCount),dummy=new THREE.Object3D();
      for(var ri=0;ri<rockCount;ri++){
        var side=ri%2?1:-1,rx=side*(22+(hash(ri,1,s)*67)),rz=-72+hash(ri,2,s)*142;
        var rh=heightAt(rx,rz,k,s)-8,scale=1.5+hash(ri,3,s)*7;
        dummy.position.set(rx,rh+scale*.36,rz);dummy.rotation.set(hash(ri,4,s)*.8,hash(ri,5,s)*6.28,hash(ri,6,s)*.8);
        dummy.scale.set(scale*(.7+hash(ri,7,s)*.7),scale*(.8+hash(ri,8,s)*1.8),scale*(.7+hash(ri,9,s)*.7));dummy.updateMatrix();rocks.setMatrixAt(ri,dummy.matrix);
      }
      rocks.castShadow=true;rocks.receiveShadow=true;group.add(rocks);
      if(k==='temperate'||k==='jungle'||k==='coast'||k==='alpine'){
        // Árvores com tronco, galhos e copas em camadas — silhuetas variadas, não esferas verdes isoladas.
        var treeCount=k==='jungle'?112:(k==='temperate'?92:72);
        var trunkGeo=new THREE.CylinderGeometry(.11,.34,6.2,10,2),branchGeo=new THREE.CylinderGeometry(.045,.13,2.7,7,1);
        var crownGeo=makeFoliageGeometry(s+51),trunkMat=new THREE.MeshStandardMaterial({color:base.trunk||0x514637,roughness:.94});
        var crownMat=new THREE.MeshStandardMaterial({color:base.flora||0x55734b,roughness:.91,side:THREE.DoubleSide});
        var trunks=new THREE.InstancedMesh(trunkGeo,trunkMat,treeCount),branches=new THREE.InstancedMesh(branchGeo,trunkMat,treeCount*4),crowns=new THREE.InstancedMesh(crownGeo,crownMat,treeCount*5);
        for(var ti=0;ti<treeCount;ti++){
          var side=ti%2?1:-1,tx=side*(12+hash(ti,11,s)*91),tz=-82+hash(ti,12,s)*150;
          if(Math.abs(tx)<13)tx=side*14;
          var ground=heightAt(tx,tz,k,s)-8,scale=(k==='jungle'?1.05:.82)+hash(ti,13,s)*.9;
          dummy.position.set(tx,ground+3.1*scale,tz);dummy.rotation.set(0,hash(ti,14,s)*6.28,0);dummy.scale.set(scale,scale,scale);dummy.updateMatrix();trunks.setMatrixAt(ti,dummy.matrix);
          for(var br=0;br<4;br++){
            var ba=br*Math.PI*.5+hash(ti,br+31,s)*.55,bx=tx+Math.cos(ba)*.95*scale,bz=tz+Math.sin(ba)*.95*scale;
            dummy.position.set((tx+bx)*.5,ground+(3.1+br*.23)*scale,bz*.5+tz*.5);
            dummy.rotation.set(Math.sin(ba)*-.7,0,Math.cos(ba)*.7);
            dummy.scale.set(scale,scale,scale);dummy.updateMatrix();branches.setMatrixAt(ti*4+br,dummy.matrix);
          }
          for(var crown=0;crown<5;crown++){
            var angle=crown*1.257+hash(ti,crown+20,s)*.65,rad=(crown===4?.12:.82)*scale;
            var cy=ground+(crown===4?6.15:4.1+(crown%2)*.85)*scale;
            dummy.position.set(tx+Math.cos(angle)*rad,cy,tz+Math.sin(angle)*rad);
            dummy.rotation.set(hash(ti,crown+30,s)*.35,angle,hash(ti,crown+40,s)*.35);
            var broad=(crown===4?.68:1.0+hash(ti,crown+50,s)*.34)*scale;
            dummy.scale.set(broad,scale*(.72+hash(ti,crown+60,s)*.42),broad*.92);
            dummy.updateMatrix();crowns.setMatrixAt(ti*5+crown,dummy.matrix);
          }
        }
        trunks.castShadow=true;branches.castShadow=true;crowns.castShadow=true;group.add(trunks);group.add(branches);group.add(crowns);
      }
      // Flora alienígena presente em todos os mundos: forma, densidade e pigmento variam por ecologia.
      var plantCounts={jungle:86,temperate:64,coast:52,alpine:48,highland:42,glacier:34,'frozen-coast':30,desert:30,badlands:26,canyon:24,volcanic:24,geothermal:25,ash:22,rocky:22,crystal:30,salt:18};
      var plantCount=plantCounts[k]||28;
      var leafGeo=makeLeafGeometry(base.floraForm);
      var leafMat=new THREE.MeshStandardMaterial({color:base.flora||0x638c5a,emissive:base.accent||0x000000,emissiveIntensity:.075,roughness:.82,side:THREE.DoubleSide});
      var stemMat=new THREE.MeshStandardMaterial({color:base.trunk||0x4b4639,roughness:.94});
      var budMat=new THREE.MeshStandardMaterial({color:base.floraLight||base.accent||0xa4c18a,emissive:base.accent||0x000000,emissiveIntensity:.24,roughness:.55});
      var leaves=new THREE.InstancedMesh(leafGeo,leafMat,plantCount*5),stems=new THREE.InstancedMesh(new THREE.CylinderGeometry(.035,.075,1,7),stemMat,plantCount),buds=new THREE.InstancedMesh(new THREE.SphereGeometry(.105,10,8),budMat,plantCount);
      for(var pi=0;pi<plantCount;pi++){
        var px=(hash(pi,71,s)-.5)*194,pz=-82+hash(pi,72,s)*154;
        if(Math.abs(px)<20)px+=px<0?-24:24;
        var py=heightAt(px,pz,k,s)-8;
        var tall=(k==='jungle'?4.8:k==='temperate'?3.8:k==='coast'?3.2:k==='alpine'||k==='highland'?2.7:k==='glacier'||k==='frozen-coast'?2.2:k==='desert'||k==='salt'||k==='badlands'||k==='canyon'?1.65:2.1)*(0.65+hash(pi,73,s)*.85);
        dummy.position.set(px,py+tall*.48,pz);dummy.rotation.set(0,hash(pi,74,s)*6.28,0);dummy.scale.set(.8,tall,.8);dummy.updateMatrix();stems.setMatrixAt(pi,dummy.matrix);
        for(var lf=0;lf<5;lf++){
          var angle=lf*1.256+hash(pi,lf+80,s)*.65;
          var height=tall*(.24+lf*.115);
          dummy.position.set(px+Math.cos(angle)*.14,py+height,pz+Math.sin(angle)*.14);
          dummy.rotation.set(.18+hash(pi,lf+90,s)*.45,angle,(hash(pi,lf+100,s)-.5)*.55);
          var leafScale=tall*(.34+hash(pi,lf+110,s)*.18);
          dummy.scale.set(leafScale*.56,leafScale,leafScale*.12);dummy.updateMatrix();leaves.setMatrixAt(pi*5+lf,dummy.matrix);
        }
        dummy.position.set(px,py+tall*.98,pz);dummy.rotation.set(0,hash(pi,121,s)*6.28,0);dummy.scale.setScalar(.72+hash(pi,122,s)*.48);dummy.updateMatrix();buds.setMatrixAt(pi,dummy.matrix);
      }
      stems.castShadow=true;leaves.castShadow=true;group.add(stems);group.add(leaves);group.add(buds);
      // Capim tridimensional em tufos: centenas de lâminas curvas com variação de escala e orientação.
      if(k!=='glacier'&&k!=='frozen-coast'&&k!=='volcanic'&&k!=='geothermal'&&k!=='ash'&&k!=='salt'){
        var grassCount=k==='jungle'?1050:(k==='temperate'?1250:760);
        var grassGeo=makeLeafGeometry('grass'),grassMat=new THREE.MeshStandardMaterial({color:base.floraLight||base.flora||0x78945a,roughness:.96,side:THREE.DoubleSide});
        var grass=new THREE.InstancedMesh(grassGeo,grassMat,grassCount*4);
        for(var gi=0;gi<grassCount;gi++){
          var gx=(hash(gi,131,s)-.5)*204,gz=-84+hash(gi,132,s)*160;
          if(Math.abs(gx)<9)continue;
          var gy=heightAt(gx,gz,k,s)-7.94,tuft=.55+hash(gi,133,s)*1.25;
          for(var blade=0;blade<4;blade++){
            var ga=blade*Math.PI*.5+hash(gi,blade+140,s)*.7;
            dummy.position.set(gx+Math.cos(ga)*.13,gy+tuft*.52,gz+Math.sin(ga)*.13);
            dummy.rotation.set((hash(gi,blade+150,s)-.5)*.2,ga,(hash(gi,blade+160,s)-.5)*.42);
            dummy.scale.set(tuft*(.42+hash(gi,blade+170,s)*.22),tuft*(.72+hash(gi,blade+180,s)*.5),.22);
            dummy.updateMatrix();grass.setMatrixAt(gi*4+blade,dummy.matrix);
          }
        }
        grass.castShadow=true;group.add(grass);
      }
      // Arbustos baixos com vários volumes orgânicos e tonalidades discretas.
      if(k==='jungle'||k==='temperate'||k==='coast'||k==='alpine'||k==='highland'||k==='rocky'){
        var bushCount=k==='jungle'?115:86,bushGeo=makeFoliageGeometry(s+211);
        var bushMat=new THREE.MeshStandardMaterial({color:base.flora||0x55734b,roughness:.96});
        var bushes=new THREE.InstancedMesh(bushGeo,bushMat,bushCount*4);
        for(var bu=0;bu<bushCount;bu++){
          var bx=(hash(bu,191,s)-.5)*198,bz=-84+hash(bu,192,s)*158;
          if(Math.abs(bx)<10)bx+=bx<0?-11:11;
          var by=heightAt(bx,bz,k,s)-7.82,bs=.7+hash(bu,193,s)*1.5;
          for(var bc=0;bc<4;bc++){
            var ba=bc*1.57+hash(bu,bc+200,s)*.5;
            dummy.position.set(bx+Math.cos(ba)*bs*.38,by+bs*(.45+hash(bu,bc+210,s)*.18),bz+Math.sin(ba)*bs*.38);
            dummy.rotation.set(hash(bu,bc+220,s)*.25,ba,hash(bu,bc+230,s)*.25);
            dummy.scale.set(bs*(.55+hash(bu,bc+240,s)*.32),bs*(.48+hash(bu,bc+250,s)*.32),bs*(.55+hash(bu,bc+260,s)*.32));
            dummy.updateMatrix();bushes.setMatrixAt(bu*4+bc,dummy.matrix);
          }
        }
        bushes.castShadow=true;group.add(bushes);
      }
      if(k==='crystal'){
        var crystalMat=new THREE.MeshPhysicalMaterial({color:base.floraLight||base.accent,metalness:.12,roughness:.16,transmission:.34,thickness:1.35,clearcoat:1,emissive:base.flora||0x4c6c8c,emissiveIntensity:.08});
        for(var ci=0;ci<20;ci++){
          var crystal=new THREE.Mesh(new THREE.CylinderGeometry(.08,.72,5+hash(ci,3,s)*11,6,1),crystalMat);
          var cx=(hash(ci,4,s)-.5)*150,cz=-78+hash(ci,5,s)*145;
          crystal.position.set(cx,heightAt(cx,cz,k,s)-2,cz);crystal.rotation.z=(hash(ci,6,s)-.5)*.28;crystal.rotation.x=(hash(ci,7,s)-.5)*.24;group.add(crystal);
        }
      }
      if(k==='volcanic'||k==='geothermal'){
        var lavaMat=new THREE.MeshStandardMaterial({color:base.accent||0xff5a24,emissive:base.accent||0xe13b12,emissiveIntensity:2.0,roughness:.34});
        for(var li=0;li<9;li++){
          var lx=(hash(li,21,s)-.5)*145,lz=-78+hash(li,22,s)*145;
          var points=[];
          for(var lp=0;lp<7;lp++){var px=lx+(hash(li,lp+30,s)-.5)*12,pz=lz+lp*2.7;points.push(new THREE.Vector3(px,heightAt(px,pz,k,s)-7.7,pz));}
          var curve=new THREE.CatmullRomCurve3(points),fissure=new THREE.Mesh(new THREE.TubeGeometry(curve,28,.12+hash(li,23,s)*.12,5,false),lavaMat);group.add(fissure);
        }
      }
      if(k==='desert'||k==='badlands'||k==='canyon'||k==='salt'){
        // Ondulações de dunas e escarpas são parte do relevo, não esferas sobrepostas.
        var duneMat=new THREE.MeshStandardMaterial({color:base.rockTint||0xb58c5d,roughness:.94});
        for(var di=0;di<6;di++){
          var dx=(hash(di,41,s)-.5)*145,dz=-78+hash(di,42,s)*145;
          var duneGeo=new THREE.PlaneGeometry(42,34,32,24);duneGeo.rotateX(-Math.PI/2);
          var da=duneGeo.attributes.position;
          for(var dj=0;dj<da.count;dj++){var px=da.getX(dj),pz=da.getZ(dj);da.setY(dj,Math.sin(px*.09+di)*1.8+Math.cos(pz*.11)*.9);}
          duneGeo.computeVertexNormals();
          var dune=new THREE.Mesh(duneGeo,duneMat);dune.position.set(dx,heightAt(dx,dz,k,s)-8,dz);group.add(dune);
        }
      }
      if(base.wet||k==='coast'||k==='frozen-coast'){
        var waterMat=new THREE.MeshPhysicalMaterial({color:base.water||0x285d69,roughness:.19,metalness:.025,clearcoat:1,clearcoatRoughness:.08,ior:1.333,envMapIntensity:1.2});
        // Rio como lâmina larga de água sobre o leito, com margens irregulares — nunca um tubo.
        var riverVertices=[],riverUvs=[],riverIndices=[],riverRows=220;
        for(var rp=0;rp<=riverRows;rp++){
          var rt=rp/riverRows,rz=-88+rt*174,rx=Math.sin(rt*7.2+s*.01)*19+Math.sin(rt*17+s)*5.5;
          var prevX=Math.sin(Math.max(0,rt-.004)*7.2+s*.01)*19+Math.sin(Math.max(0,rt-.004)*17+s)*5.5;
          var nextX=Math.sin(Math.min(1,rt+.004)*7.2+s*.01)*19+Math.sin(Math.min(1,rt+.004)*17+s)*5.5;
          var dx=nextX-prevX,dz=1.4,len=Math.hypot(dx,dz)||1,nx=-dz/len,nz=dx/len;
          var halfWidth=2.1+Math.sin(rt*23+s)*.55+hash(rp,271,s)*.42;
          for(var edge=0;edge<2;edge++){
            var side=edge===0?-1:1,wx=rx+nx*halfWidth*side,wz=rz+nz*halfWidth*side;
            riverVertices.push(wx,heightAt(wx,wz,k,s)-7.82,wz);
            riverUvs.push(edge,rt*7);
          }
          if(rp<riverRows){var a=rp*2;riverIndices.push(a,a+1,a+2,a+1,a+3,a+2);}
        }
        var riverGeo=new THREE.BufferGeometry();
        riverGeo.setAttribute('position',new THREE.Float32BufferAttribute(riverVertices,3));
        riverGeo.setAttribute('uv',new THREE.Float32BufferAttribute(riverUvs,2));riverGeo.setIndex(riverIndices);riverGeo.computeVertexNormals();
        var river=new THREE.Mesh(riverGeo,waterMat);river.receiveShadow=true;group.add(river);
        // Pequenas ondulações planas capturam a luz sem criar volumes cilíndricos artificiais.
        var glintMat=new THREE.MeshBasicMaterial({color:base.floraLight||base.accent,transparent:true,opacity:.13,depthWrite:false});
        for(var wi=0;wi<18;wi++){
          var wt=hash(wi,281,s),wz=-82+wt*164,wx=Math.sin(wt*7.2+s*.01)*19+Math.sin(wt*17+s)*5.5;
          var glint=new THREE.Mesh(new THREE.PlaneGeometry(.35+hash(wi,282,s)*1.1,.035),glintMat);
          glint.rotation.x=-Math.PI/2;glint.rotation.z=(hash(wi,283,s)-.5)*.25;
          glint.position.set(wx,heightAt(wx,wz,k,s)-7.76,wz);group.add(glint);
        }
      }
      if(segIndex===3){
        // Último trecho: trilha de exploração que abre para uma vista panorâmica no horizonte.
        var pathVertices=[],pathUvs=[],pathIndices=[],pathRows=150;
        for(var pr=0;pr<=pathRows;pr++){
          var pt=pr/pathRows,pz=84-pt*174,pcx=Math.sin(pt*5.4+s*.02)*3.2;
          var width=5.8+pt*2.8;
          for(var pe=0;pe<2;pe++){
            var side=pe===0?-1:1,px=pcx+side*width*.5;
            pathVertices.push(px,heightAt(px,pz,k,s)-7.84,pz);pathUvs.push(pe,pt*8);
          }
          if(pr<pathRows){var pi2=pr*2;pathIndices.push(pi2,pi2+1,pi2+2,pi2+1,pi2+3,pi2+2);}
        }
        var pathGeo=new THREE.BufferGeometry();pathGeo.setAttribute('position',new THREE.Float32BufferAttribute(pathVertices,3));pathGeo.setAttribute('uv',new THREE.Float32BufferAttribute(pathUvs,2));pathGeo.setIndex(pathIndices);pathGeo.computeVertexNormals();
        var pathMat=new THREE.MeshStandardMaterial({color:k==='glacier'||k==='frozen-coast'?0x9caeb1:0x77634d,map:maps.map,bumpMap:maps.bump,bumpScale:.18,roughness:1});
        var trailMesh=new THREE.Mesh(pathGeo,pathMat);trailMesh.receiveShadow=true;group.add(trailMesh);
        // Pedras pequenas nas bordas da trilha dão escala e quebram a repetição do terreno.
        var pathStoneGeo=irregularRockGeometry(s+301),pathStoneMat=new THREE.MeshStandardMaterial({color:base.rockTint||0x887b6d,roughness:1});
        var pathStones=new THREE.InstancedMesh(pathStoneGeo,pathStoneMat,110);
        for(var ps=0;ps<110;ps++){
          var pz2=-82+hash(ps,302,s)*164,side2=ps%2?1:-1,px2=side2*(4.2+hash(ps,303,s)*4.2);
          var pscale=.18+hash(ps,304,s)*.72;
          dummy.position.set(px2,heightAt(px2,pz2,k,s)-7.72+pscale*.25,pz2);
          dummy.rotation.set(hash(ps,305,s),hash(ps,306,s)*6.28,hash(ps,307,s));dummy.scale.set(pscale,pscale*.48,pscale*.72);dummy.updateMatrix();pathStones.setMatrixAt(ps,dummy.matrix);
        }
        group.add(pathStones);
      }
      // Nuvens ficam claramente acima do relevo e muito suaves; não podem se confundir com montanhas.
      var cloudTexture=makeNebulaTexture(base.cloud||'rgba(226,239,246,.22)');
      for(var cl=0;cl<3;cl++){
        var cloud=new THREE.Sprite(new THREE.SpriteMaterial({map:cloudTexture,transparent:true,depthWrite:false,opacity:.105}));
        cloud.position.set(-82+cl*78,53+(cl%2)*5,-62-cl*18);cloud.scale.set(88,13,1);group.add(cloud);landscapeClouds.push(cloud);
      }
      var key=new THREE.DirectionalLight(base.sun||0xffe8d2,3.05);
      key.position.set(-32,58,28);key.castShadow=true;key.shadow.mapSize.set(1024,1024);group.add(key);
      var fill=new THREE.DirectionalLight(base.fill||0x86a9c4,1.15);fill.position.set(38,18,-42);group.add(fill);
      group.add(new THREE.HemisphereLight(base.sky||0xc9dce7,base.groundColor||0x292722,1.05));
      var ecologyGlow=new THREE.PointLight(base.accent||0x8acfe2,.55,115);ecologyGlow.position.set(0,22,-46);group.add(ecologyGlow);
      group.position.set(0,0,-22-segIndex*168);
      scene.add(group);landscapeSegments.push(group);
      skyColors.push(new THREE.Color(base.sky));
    }
    var variants=sequence.slice();
    for(var si=0;si<4;si++)makeSegment(variants[si]||kind,si);
    landscape=landscapeSegments[0];
    scene.background=new THREE.Color(base.sky);
    scene.fog=new THREE.Fog(new THREE.Color(base.sky),38,285);
    if(renderer){renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;}
    landscapeSkyColors=skyColors;
  }

  function openPlanetDestination(id){
    if(selectedPlanet||!camera)return;
    var entry=journeyPlanets.find(function(p){return p.route.id===id;});if(!entry)return;
    selectedPlanet=id;current=id;applyRouteAtmosphere(id);
    if(typeof originalGo==='function')originalGo.call(window,id);
    stage.classList.add('is-planet-landing');
    stage.querySelector('.no-journey-landing').classList.add('is-active');
    stage.querySelector('.no-journey-landing b').textContent='NAVE EM APROXIMAÇÃO · '+entry.route.name.toUpperCase();
    var from=camera.position.clone(),target=new THREE.Vector3(entry.group.position.x,entry.group.position.y+entry.size*.22,entry.group.position.z+entry.size*3.6);
    var start=performance.now(),duration=3900;
    function approach(now){var t=Math.min(1,(now-start)/duration),e=t*t*(3-2*t);camera.position.lerpVectors(from,target,e);camera.lookAt(entry.group.position);ship.position.lerpVectors(ship.position,new THREE.Vector3(target.x-1,target.y-1,target.z+entry.size*1.5),.055);if(t<1)requestAnimationFrame(approach);else{
      journeyPlanets.forEach(function(p){scene.remove(p.group);});journeyCelestials.forEach(function(o){scene.remove(o);});if(starField)starField.visible=false;createLandscape(entry.index);ship.position.set(-8,-2.1,5);ship.rotation.set(.015,Math.PI/2,-.025);camera.position.set(0,7,34);camera.lookAt(0,0,-25);
      stage.querySelector('.no-journey-landing b').textContent='POUSO CONCLUÍDO · '+entry.route.name.toUpperCase();
      var wrap=document.querySelector('.wrap');if(wrap){wrap.classList.add('no-planet-exploration');wrap.dataset.planet=id;window.setTimeout(function(){wrap.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});},500);}
    }}
    requestAnimationFrame(approach);
  }
  function landOnPlanet(){var p=journeyPlanets.find(function(x){return x.route.id===current;});if(p)openPlanetDestination(p.route.id);}
  function beginTravel(id){var p=journeyPlanets.find(function(x){return x.route.id===routeId(id);});if(p)openPlanetDestination(p.route.id);}
  function updateTransition(){}
  function wrapNavigation(){
    if(typeof originalGo!=='function')return;
    window.go=function(id,fromHistory){
      var next=routeId(id);
      if(next==='overview'){current='overview';if(typeof originalGo==='function')return originalGo.apply(this,arguments);return;}
      openPlanetDestination(next);
    };
    document.addEventListener('click',function(ev){var b=ev.target.closest('#nav button[data-id],#no-mobile-nav button[data-id]');if(!b)return;ev.preventDefault();ev.stopImmediatePropagation();window.go(b.dataset.id);},true);
    var content=document.getElementById('content');if(content&&window.MutationObserver){var observer=new MutationObserver(function(){syncTopics();});observer.observe(content,{childList:true,subtree:true,characterData:true});}
  }
  function start(){
    try{
      applyRouteAtmosphere(current);
      buildStage();
      if(!stage)throw new Error('A estrutura da jornada não foi criada.');
      wrapNavigation();buildNavigation();
      loadThree();
    }catch(err){
      console.error('Nova Ordem journey startup failed:',err);
      var main=document.querySelector('.main');
      if(main&&!document.getElementById('no-journey-startup-error')){
        var box=document.createElement('section');box.id='no-journey-startup-error';
        box.innerHTML='<strong>NOVA ORDEM · MODO DE RECUPERAÇÃO</strong><p>Não foi possível iniciar a experiência espacial. O conteúdo institucional continua disponível abaixo.</p>';
        main.insertBefore(box,main.firstChild);
      }
      document.querySelectorAll('.hero').forEach(function(el){el.classList.remove('no-cinema-old-hero');});
    }
    var search=document.getElementById('search');if(search)search.addEventListener('input',function(){var q=search.value.trim().toLowerCase();if(!q)return;var root=document.getElementById('content');var match=root&&Array.prototype.find.call(root.querySelectorAll('h2,h3,h4,p,.row'),function(el){return(el.textContent||'').toLowerCase().indexOf(q)>=0;});if(match)match.scrollIntoView({behavior:'smooth',block:'center'});});
  }


  function onLandscapeScroll(){
    if(!landscapeSegments||!landscapeSegments.length||!selectedPlanet)return;
    var wrap=document.querySelector('.wrap');if(!wrap)return;
    var rect=wrap.getBoundingClientRect(),span=Math.max(1,wrap.offsetHeight-window.innerHeight);
    var p=Math.max(0,Math.min(1,-rect.top/span));
    var travel=520,segmentFloat=p*3,segment=Math.min(2,Math.floor(segmentFloat)),blend=segmentFloat-segment;
    var z=28-p*travel,x=Math.sin(p*Math.PI*3)*8;
    camera.position.set(x,8+Math.sin(p*Math.PI*4)*1.4,z);
    camera.lookAt(x*.38,0,z-43);
    var a=landscapeSkyColors[segment]||new THREE.Color(0x9aabb9),b=landscapeSkyColors[Math.min(3,segment+1)]||a;
    var sky=a.clone().lerp(b,blend);
    scene.background.copy(sky);
    if(scene.fog&&scene.fog.color)scene.fog.color.copy(sky);
    if(ship){ship.position.set(-9,-2.2,8);ship.rotation.set(.015,Math.PI/2,-.025);}
    if(ark&&ship){ark.position.set(ship.position.x+2.3,ship.position.y+.8,ship.position.z-.8);}
  }

  function returnToJourney(){
    selectedPlanet=null;current='overview';applyRouteAtmosphere('overview');
    var wrap=document.querySelector('.wrap');if(wrap){wrap.classList.remove('no-planet-exploration');delete wrap.dataset.planet;}
    if(landscapeSegments&&landscapeSegments.length){
      landscapeSegments.forEach(function(part){
        scene.remove(part);
        part.traverse(function(o){
          if(o.geometry)o.geometry.dispose();
          if(o.material){
            if(Array.isArray(o.material))o.material.forEach(function(m){m.dispose();});
            else o.material.dispose();
          }
        });
      });
    }
    landscapeSegments=[];landscape=null;landscapeClouds=[];landscapeSkyColors=[];
    scene.background=new THREE.Color(0x01040a);scene.fog=new THREE.FogExp2(0x01040a,.0018);
    journeyPlanets.forEach(function(p){if(!p.group.parent)scene.add(p.group);});journeyCelestials.forEach(function(o){if(!o.parent)scene.add(o);});if(starField)starField.visible=true;
    stage.classList.remove('is-planet-landing');
    stage.querySelector('.no-journey-landing').classList.remove('is-active');
    var journey=document.getElementById('no-cinema-journey');if(journey)window.scrollTo({top:journey.offsetTop,behavior:reduced?'auto':'smooth'});
    onJourneyScroll();
  }
  var oldOpenPlanetDestination=openPlanetDestination;
  openPlanetDestination=function(id){
    oldOpenPlanetDestination(id);
    window.addEventListener('scroll',onLandscapeScroll,{passive:true});
  };
  var oldWrapNavigation=wrapNavigation;
  wrapNavigation=function(){
    if(typeof originalGo!=='function')return;
    window.go=function(id,fromHistory){
      var next=routeId(id);
      if(next==='overview'){returnToJourney();return originalGo.apply(this,arguments);}
      if(selectedPlanet===next){return originalGo.apply(this,arguments);}
      if(selectedPlanet&&selectedPlanet!==next)returnToJourney();
      openPlanetDestination(next);
    };
    document.addEventListener('click',function(ev){
      var b=ev.target.closest('#nav button[data-id],#no-mobile-nav button[data-id]');
      if(!b)return;ev.preventDefault();ev.stopImmediatePropagation();window.go(b.dataset.id);
    },true);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();