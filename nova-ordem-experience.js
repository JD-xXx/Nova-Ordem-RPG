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
  var stage, canvas, renderer, scene, camera, planetGroup, planetMesh, cloudMesh, atmosphereMesh, ship, starField, routeNav, topicList;
  var THREE = null, clock, transition = null, landed = false, reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raycaster, pointer = {x:0,y:0}, pointerTarget = {x:0,y:0}, laserTimer = 0, lasers = [], introTimer = 0;
  var palettes = {};

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
    var c=document.createElement('canvas');c.width=768;c.height=384;
    var ctx=c.getContext('2d'),img=ctx.createImageData(c.width,c.height),data=img.data;
    var sea=color(route.palette[0]),land=color(route.palette[1]),high=color(route.palette[2]),ice=color(route.palette[3]);
    var seed=index*31+17;
    for(var y=0;y<c.height;y++){
      var lat=Math.cos((y/c.height-.5)*Math.PI);
      for(var x=0;x<c.width;x++){
        var u=x/c.width,v=y/c.height;
        var n=fbm(u*7+seed*.13,v*5+seed*.07,seed);
        var detail=fbm(u*31+seed,v*17+seed*.2,seed+7);
        var ridge=fbm(u*70,v*35,seed+21);
        var continent=n+(Math.sin(u*18+Math.sin(v*11)*2)*.035)-.52;
        var rgb;
        if(continent>0.025){
          var h=Math.max(0,Math.min(1,(continent+.12)*2.8+detail*.24));
          rgb=mix(land,high,h);
          if(h>.77)rgb=mix(rgb,ice,Math.min(.7,(h-.77)*3));
        }else{
          var depth=Math.max(0,Math.min(1,(-continent+.02)*3+detail*.15));
          rgb=mix(sea,land,depth*.2);
        }
        var variation=(ridge-.5)*17+(detail-.5)*11;
        var i=(y*c.width+x)*4;
        data[i]=Math.max(0,Math.min(255,rgb[0]+variation));
        data[i+1]=Math.max(0,Math.min(255,rgb[1]+variation));
        data[i+2]=Math.max(0,Math.min(255,rgb[2]+variation));
        data[i+3]=255;
      }
    }
    ctx.putImageData(img,0,0);
    ctx.globalAlpha=.13;
    for(var j=0;j<220;j++){
      ctx.fillStyle=j%3===0?'#ffffff':'#07101a';
      ctx.beginPath();ctx.ellipse(Math.random()*c.width,Math.random()*c.height,Math.random()*18+3,Math.random()*4+1,Math.random()*Math.PI,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    var tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;tex.needsUpdate=true;
    if(!palettes[route.id])palettes[route.id]={};
    palettes[route.id].surface=tex;
    return tex;
  }
  function makeCloudTexture(route,index) {
    var cache=palettes[route.id];
    if(cache&&cache.clouds)return cache.clouds;
    var c=document.createElement('canvas');c.width=512;c.height=256;
    var ctx=c.getContext('2d'),img=ctx.createImageData(c.width,c.height),data=img.data;
    for(var y=0;y<c.height;y++)for(var x=0;x<c.width;x++){
      var n=fbm(x/76+index*2,y/44+index, index*19+3);
      var bands=Math.sin(y*.095+Math.sin(x*.025)*2)*.12;
      var a=Math.max(0,Math.min(105,(n-.53+bands)*440));
      var i=(y*c.width+x)*4;data[i]=220;data[i+1]=235;data[i+2]=245;data[i+3]=a;
    }
    ctx.putImageData(img,0,0);
    var tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=2;tex.needsUpdate=true;
    if(!palettes[route.id])palettes[route.id]={};
    palettes[route.id].clouds=tex;
    return tex;
  }
  function makeNebulaTexture(tint) {
    var c=document.createElement('canvas');c.width=256;c.height=256;
    var ctx=c.getContext('2d'),g=ctx.createRadialGradient(128,128,4,128,128,126);
    g.addColorStop(0,'rgba(180,210,255,.48)');g.addColorStop(.18,tint);g.addColorStop(.5,'rgba(52,78,135,.13)');g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,256,256);
    return new THREE.CanvasTexture(c);
  }

  function buildShip() {
    var group=new THREE.Group();
    var hullMat=new THREE.MeshStandardMaterial({color:0x8796a5,metalness:.82,roughness:.32});
    var edgeMat=new THREE.MeshStandardMaterial({color:0x273848,metalness:.72,roughness:.42});
    var paleMat=new THREE.MeshStandardMaterial({color:0xc2cbd1,metalness:.78,roughness:.3});
    var glassMat=new THREE.MeshPhysicalMaterial({color:0x4a9ab7,metalness:.45,roughness:.12,clearcoat:1,emissive:0x0b2738,emissiveIntensity:.5});
    var glowMat=new THREE.MeshBasicMaterial({color:0x65d9ff});
    function part(geo,mat,x,y,z,rx,ry,rz){var m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.rotation.set(rx||0,ry||0,rz||0);group.add(m);return m;}
    part(new THREE.BoxGeometry(3.2,.58,.82),hullMat,-.05,0,0);
    part(new THREE.ConeGeometry(.48,1.3,10),paleMat,1.95,0,0,0,0,-Math.PI/2);
    part(new THREE.BoxGeometry(1.9,.13,2.55),edgeMat,-.35,-.12,0);
    part(new THREE.BoxGeometry(1.45,.08,2.2),hullMat,-.55,-.02,0);
    part(new THREE.BoxGeometry(.9,.64,.9),edgeMat,-1.0,.47,0);
    part(new THREE.BoxGeometry(.72,.5,.82),paleMat,-.2,.4,0);
    part(new THREE.SphereGeometry(.38,20,12),glassMat,.82,.27,0,0,0,Math.PI/2).scale.set(1.2,.7,1.1);
    for(var z of [-.28,.28]){
      part(new THREE.CylinderGeometry(.2,.29,.72,12),edgeMat,-1.75,-.02,z,0,0,Math.PI/2);
      part(new THREE.CircleGeometry(.17,16),glowMat,-2.12,-.02,z,0,-Math.PI/2,0);
      part(new THREE.BoxGeometry(.42,.08,.12),paleMat,-1.55,.38,z*1.8);
    }
    for(var side of [-1,1]){
      var fin=part(new THREE.BoxGeometry(1.15,.1,.55),paleMat,-.75,.05,side*1.45,0,0,side*.16);
      fin.scale.set(1.2,1,1);
      part(new THREE.BoxGeometry(.55,.08,.24),edgeMat,-1.25,.13,side*1.72,0,0,side*.3);
      part(new THREE.BoxGeometry(.42,.22,.3),hullMat,-.5,.43,side*.35);
      for(var w=0;w<3;w++)part(new THREE.BoxGeometry(.08,.035,.13),glassMat,.1+w*.22,.72,side*.28);
    }
    var engineGlow=new THREE.PointLight(0x51cfff,2.4,5);engineGlow.position.set(-2.1,0,0);group.add(engineGlow);
    group.userData.engineGlow=engineGlow;
    group.scale.setScalar(.74);
    group.position.set(-4.2,-1.55,2.5);
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
    ship=buildShip();scene.add(ship);
    raycaster=new THREE.Raycaster();
    clock=new THREE.Clock();
    window.addEventListener('resize',onResize,{passive:true});
    animate();
  }

  function applyPlanet(id) {
    if(!planetMesh)return;
    var m=metaFor(id),r=m.route;
    planetMesh.material.map=makeSurfaceTexture(r,m.index);
    planetMesh.material.bumpMap=planetMesh.material.map;
    planetMesh.material.needsUpdate=true;
    cloudMesh.material.map=makeCloudTexture(r,m.index);
    cloudMesh.material.needsUpdate=true;
    atmosphereMesh.material.uniforms.glowColor.value.set(r.palette[2]);
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
      ship.position.y=-1.55+Math.sin(elapsed*.65)*.11;
      ship.rotation.z=-.035+Math.sin(elapsed*.35)*.018;
      ship.rotation.y=Math.sin(elapsed*.25)*.035;
      ship.position.x=-4.2+Math.sin(elapsed*.16)*.16;
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
    var fromLook=new THREE.Vector3(0,0,0);
    var toPos=new THREE.Vector3(0,.1,12.6);
    if(landed)toPos.set(-1.1,.5,15.8);
    transition={start:now,duration:3200,from:fromPos,to:toPos,route:r,meta:m,swapped:false};
    stage.classList.add('is-travelling');
    stage.querySelector('.no-cinema-vessel-state').textContent='SAÍDA DE ÓRBITA · MANOBRA DE TRANSFERÊNCIA';
    landed=false;
    stage.querySelector('.no-cinema-land-status').textContent='TRAJETÓRIA INTERPLANETÁRIA EM CURSO';
  }
  function updateTransition(now) {
    var tr=transition;if(!tr)return;
    var t=Math.max(0,Math.min(1,(now-tr.start)/tr.duration));
    var ease=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    camera.position.lerpVectors(tr.from,tr.to,ease);
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
    intro.classList.add('is-playing');
    introTimer=window.setTimeout(dismissIntro,5200);
  }

  function loadThree() {
    return import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js').then(function(mod){THREE=mod;buildScene();}).catch(function(err){
      console.error('Nova Ordem 3D engine:',err);
      stage.classList.add('no-cinema-webgl-fallback');
      stage.querySelector('.no-cinema-land-status').textContent='MOTOR 3D INDISPONÍVEL NESTE NAVEGADOR';
      stage.querySelector('.no-cinema-explorer').classList.add('is-fallback');
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

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();