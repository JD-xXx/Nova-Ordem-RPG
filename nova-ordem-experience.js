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
    var hullMat=new THREE.MeshPhysicalMaterial({color:0x7d8b96,metalness:.78,roughness:.36,clearcoat:.42,clearcoatRoughness:.38});
    var armorMat=new THREE.MeshStandardMaterial({color:0x344452,metalness:.82,roughness:.4});
    var panelMat=new THREE.MeshStandardMaterial({color:0x9ba8af,metalness:.76,roughness:.34});
    var darkMat=new THREE.MeshStandardMaterial({color:0x111d28,metalness:.72,roughness:.46});
    var cargoMat=new THREE.MeshStandardMaterial({color:0x596b78,metalness:.62,roughness:.52});
    var glassMat=new THREE.MeshPhysicalMaterial({color:0x397b91,metalness:.56,roughness:.16,clearcoat:1,clearcoatRoughness:.08,emissive:0x071b27,emissiveIntensity:.32});
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
      '<div class="no-journey-landing" aria-live="polite"><span>ACESSO PLANETÁRIO</span><b>PREPARANDO APROXIMAÇÃO</b></div>'
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

  var journeyPlanets=[],journeyProgress=0,selectedPlanet=null,landscape=null,landscapeClouds=[],journeyLength=0;
  function onJourneyPointer(ev){
    if(!raycaster||!camera||!journeyPlanets.length||ev.target.closest('button'))return;
    var rect=canvas.getBoundingClientRect(),mouse=new THREE.Vector2((ev.clientX-rect.left)/rect.width*2-1,-((ev.clientY-rect.top)/rect.height*2-1));
    raycaster.setFromCamera(mouse,camera);
    var hits=raycaster.intersectObjects(journeyPlanets.map(function(p){return p.mesh;}),false);
    if(hits.length){var found=journeyPlanets.find(function(p){return p.mesh===hits[0].object;});if(found)openPlanetDestination(found.route.id);}
  }
  function buildScene(){
    scene=new THREE.Scene();scene.background=new THREE.Color(0x01040a);scene.fog=new THREE.FogExp2(0x01040a,.0018);
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
    var nebulae=[[-28,18,-80,55,'rgba(101,75,167,.26)'],[34,-12,-155,72,'rgba(35,111,161,.25)'],[-12,22,-250,90,'rgba(141,77,113,.2)']];
    nebulae.forEach(function(n){var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:makeNebulaTexture(n[4]),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.8}));sp.position.set(n[0],n[1],n[2]);sp.scale.set(n[3],n[3]*.7,1);scene.add(sp);});
    ship=buildShip();ship.scale.setScalar(.58);ship.position.set(0,-1.45,10.5);ship.rotation.set(0,Math.PI/2,0);scene.add(ship);
    journeyPlanets=[];
    var spacing=23;
    ROUTES.filter(function(r){return r.id!=='overview';}).forEach(function(r,i){
      var idx=ROUTES.indexOf(r),g=new THREE.Group(),size=(i%4===0?4.25:(i%3===0?3.1:2.65));
      g.position.set((i%2===0?1:-1)*(3.8+(i%3)*1.4),Math.sin(i*1.7)*1.7,-24-i*spacing);
      var material=new THREE.MeshPhysicalMaterial({map:makeSurfaceTexture(r,idx),bumpMap:makeSurfaceTexture(r,idx),bumpScale:.085,roughness:.94,metalness:.015});
      var mesh=new THREE.Mesh(new THREE.SphereGeometry(size,112,80),material);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);
      var clouds=new THREE.Mesh(new THREE.SphereGeometry(size*1.012,96,64),new THREE.MeshStandardMaterial({map:makeCloudTexture(r,idx),transparent:true,opacity:.42,depthWrite:false,roughness:1}));g.add(clouds);
      var atmo=new THREE.Mesh(new THREE.SphereGeometry(size*1.045,96,64),new THREE.ShaderMaterial({uniforms:{glowColor:{value:new THREE.Color(r.palette[2])},glowStrength:{value:.7}},vertexShader:'varying vec3 n;varying vec3 v;void main(){n=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);v=-mv.xyz;gl_Position=projectionMatrix*mv;}',fragmentShader:'uniform vec3 glowColor;uniform float glowStrength;varying vec3 n;varying vec3 v;void main(){float f=pow(1.-max(dot(normalize(n),normalize(v)),0.),3.);gl_FragColor=vec4(glowColor,f*glowStrength);}',side:THREE.BackSide,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(atmo);
      if(i===3||i===8||i===12){var ring=new THREE.Mesh(new THREE.TorusGeometry(size*1.38,.09,8,180),new THREE.MeshStandardMaterial({color:0xb9b4a6,roughness:.78,metalness:.12,transparent:true,opacity:.52}));ring.rotation.set(1.15,.22,.18);g.add(ring);}
      var moon=new THREE.Mesh(new THREE.SphereGeometry(size*.13,32,24),new THREE.MeshStandardMaterial({color:0x858b91,roughness:1}));moon.position.set(size*1.55,size*.24,-size*.32);g.add(moon);
      scene.add(g);journeyPlanets.push({route:r,index:i,group:g,mesh:mesh,clouds:clouds,atmo:atmo,size:size,z:g.position.z});
    });
    journeyLength=(journeyPlanets.length-1)*spacing+44;
    raycaster=new THREE.Raycaster();clock=new THREE.Clock();
    window.addEventListener('resize',onResize,{passive:true});
    window.addEventListener('scroll',onJourneyScroll,{passive:true});
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
      if(starField)starField.rotation.y+=dt*.00045;
      if(landscape){landscape.rotation.y=Math.sin(elapsed*.05)*.012;landscapeClouds.forEach(function(c,i){c.position.x+=dt*(.12+i*.035);if(c.position.x>70)c.position.x=-70;});}
    }
    renderer.render(scene,camera);
  }
  function createLandscape(index){
    if(landscape){scene.remove(landscape);landscape.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material&&o.material.dispose)o.material.dispose();});}
    landscape=new THREE.Group();landscapeClouds=[];
    var r=ROUTES.find(function(x){return x.id===selectedPlanet;})||ROUTES[1],pal=r.palette;
    scene.background=new THREE.Color(index%3===0?0x9aaeb6:(index%3===1?0x9a8f83:0x728b9a));
    scene.fog=new THREE.Fog(new THREE.Color(index%3===0?0xa6b7bd:0x8d9ba0),22,150);
    var groundColor=new THREE.Color(pal[1]),rockColor=new THREE.Color(pal[2]);
    var geo=new THREE.PlaneGeometry(190,190,150,150);geo.rotateX(-Math.PI/2);
    var p=geo.attributes.position;
    for(var i=0;i<p.count;i++){var x=p.getX(i),z=p.getZ(i),h=Math.sin(x*.055+index)*1.7+Math.cos(z*.072-index)*2.2+Math.sin((x+z)*.021)*4.2+Math.pow(Math.max(0,Math.sin(x*.018)*Math.cos(z*.024)),2)*16;p.setY(i,h);}
    geo.computeVertexNormals();var terrain=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:groundColor,roughness:1,metalness:.015}));terrain.position.y=-7;terrain.receiveShadow=true;landscape.add(terrain);
    for(var m=0;m<8;m++){var mountain=new THREE.Mesh(new THREE.ConeGeometry(9+Math.random()*12,20+Math.random()*22,7),new THREE.MeshStandardMaterial({color:rockColor,roughness:1,flatShading:true}));mountain.position.set((m-3.5)*23,-1,-55-Math.random()*28);mountain.rotation.y=Math.random()*Math.PI;landscape.add(mountain);}
    var water=new THREE.Mesh(new THREE.PlaneGeometry(260,180),new THREE.MeshPhysicalMaterial({color:index%2?0x426c78:0x496e79,roughness:.22,metalness:.08,transparent:true,opacity:.76,clearcoat:.6}));water.rotation.x=-Math.PI/2;water.position.set(0,-5,-38);landscape.add(water);
    for(var c=0;c<7;c++){var cloud=new THREE.Sprite(new THREE.SpriteMaterial({map:makeNebulaTexture('rgba(235,244,248,.38)'),transparent:true,depthWrite:false,opacity:.45}));cloud.position.set(-65+c*21,18+(c%3)*5,-25-c*12);cloud.scale.set(34,15,1);landscape.add(cloud);landscapeClouds.push(cloud);}
    var sun=new THREE.DirectionalLight(0xffe3c1,2.6);sun.position.set(-25,40,25);landscape.add(sun);
    landscape.position.set(0,-1,-20);scene.add(landscape);
  }
  function openPlanetDestination(id){
    if(selectedPlanet||!camera)return;
    var entry=journeyPlanets.find(function(p){return p.route.id===id;});if(!entry)return;
    selectedPlanet=id;current=id;
    if(typeof originalGo==='function')originalGo.call(window,id);
    stage.classList.add('is-planet-landing');
    stage.querySelector('.no-journey-landing').classList.add('is-active');
    stage.querySelector('.no-journey-landing b').textContent='NAVE EM APROXIMAÇÃO · '+entry.route.name.toUpperCase();
    var from=camera.position.clone(),target=new THREE.Vector3(entry.group.position.x,entry.group.position.y+entry.size*.22,entry.group.position.z+entry.size*3.6);
    var start=performance.now(),duration=3900;
    function approach(now){var t=Math.min(1,(now-start)/duration),e=t*t*(3-2*t);camera.position.lerpVectors(from,target,e);camera.lookAt(entry.group.position);ship.position.lerpVectors(ship.position,new THREE.Vector3(target.x-1,target.y-1,target.z+entry.size*1.5),.055);if(t<1)requestAnimationFrame(approach);else{
      scene.remove(entry.group);createLandscape(entry.index);camera.position.set(0,7,34);camera.lookAt(0,0,-25);
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
    buildStage();wrapNavigation();buildNavigation();loadThree();
    var search=document.getElementById('search');if(search)search.addEventListener('input',function(){var q=search.value.trim().toLowerCase();if(!q)return;var root=document.getElementById('content');var match=root&&Array.prototype.find.call(root.querySelectorAll('h2,h3,h4,p,.row'),function(el){return(el.textContent||'').toLowerCase().indexOf(q)>=0;});if(match)match.scrollIntoView({behavior:'smooth',block:'center'});});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();