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
  if(btn){ev.preventDefault();if(typeof window.go==='function')window.go(btn.dataset.id);}
 }
 document.addEventListener('click',routeFromButton,true);
 if(typeof originalGo==='function'){
  window.go=function(id,fromHistory){var result=originalGo.call(window,id,fromHistory);var normalized=(id==='chi'||id==='talents')?'power':((id==='missions'||id==='honor'||id==='karma')?'progression':id);decoratePage(normalized);return result;};
 }
 document.addEventListener('DOMContentLoaded',function(){
  var title=document.querySelector('.brand b');
  var sub=document.querySelector('.brand small');
  installMobileNav();\n  if(title)title.textContent='NOVA ORDEM';
  if(sub)sub.textContent='AGÊNCIA INTERDIMENSIONAL';
  var navtitle=document.querySelector('.navtitle');if(navtitle)navtitle.textContent='ÍNDICE DE ACESSO';
  var foot=document.querySelector('.sidefoot');if(foot)foot.innerHTML='<i></i> SISTEMA OPERACIONAL<br><span style="display:block;margin:8px 0 0 14px">ARQUIVOS PÚBLICOS · V8</span>';
  if(typeof window.go==='function')window.go('overview',true);else decoratePage('overview');
 });
 if(document.readyState!=='loading'){
  if(typeof window.go==='function')window.go('overview',true);else decoratePage('overview');
 }
})();