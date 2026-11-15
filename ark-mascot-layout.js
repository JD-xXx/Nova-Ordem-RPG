/* NOVA ORDEM — A.R.K. em cena + navegação de retorno */
(function () {
  'use strict';
  if (window.NovaOrdemARKScenes) return;

  var style = document.createElement('style');
  style.id = 'ark-scene-layout-styles';
  style.textContent = [
    '.ark-scene{display:flex;align-items:center;gap:15px;position:relative;margin:22px 0;padding:14px 17px;border:1px solid rgba(91,177,232,.34);border-radius:12px;background:linear-gradient(112deg,rgba(17,42,63,.88),rgba(7,17,28,.94));box-shadow:0 8px 26px rgba(0,0,0,.18);overflow:hidden;isolation:isolate}',
    '.ark-scene:before{content:"";position:absolute;inset:0 auto 0 0;width:3px;background:linear-gradient(#b8eaff,#318fd0);opacity:.85}',
    '.ark-scene-robot{width:112px;height:122px;flex:0 0 112px;display:grid;place-items:center;position:relative;filter:drop-shadow(0 8px 13px rgba(65,174,235,.22));animation:ark-hover 3.6s ease-in-out infinite}',
    '.ark-scene-robot svg{width:100%;height:100%;overflow:visible}',
    '.ark-scene-bubble{position:relative;flex:1;min-width:0;padding:12px 15px;border:1px solid rgba(92,172,224,.3);border-radius:10px;background:rgba(8,20,32,.78);color:#c8dced;font-size:13px;line-height:1.65}',
    '.ark-scene-bubble:before{content:"A.R.K.  /  GUIA DA AGÊNCIA";display:block;margin-bottom:5px;color:#8dd4ff;font:700 9px var(--mono,monospace);letter-spacing:1.1px}',
    '.ark-scene-bubble p{margin:0;color:inherit;font-size:inherit;line-height:inherit}',
    '.ark-scene--compact{padding:10px 13px;gap:10px;margin:15px 0}.ark-scene--compact .ark-scene-robot{width:82px;height:92px;flex-basis:82px}.ark-scene--compact .ark-scene-bubble{font-size:12px;padding:10px 12px}',
    '.ark-scene--peek{margin:12px 0 22px auto;max-width:620px;transform:translateX(16px);border-color:rgba(125,93,111,.42);background:linear-gradient(110deg,rgba(35,22,31,.92),rgba(10,12,19,.96))}.ark-scene--peek .ark-scene-robot{width:94px;height:104px;flex-basis:94px}.ark-scene--peek .ark-scene-bubble{border-color:rgba(151,99,116,.36);background:rgba(12,10,16,.82);color:#d4c5ce}.ark-scene--peek .ark-scene-bubble:before{color:#d59cac}',
    '.ark-scene--peek .ark-scene-robot{transform:translateX(9px)}',
    '.ark-scene-trio{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:17px 0}',
    '.ark-scene-trio .ark-scene{display:block;margin:0;padding:11px;text-align:center}.ark-scene-trio .ark-scene-robot{width:84px;height:92px;margin:0 auto 4px}.ark-scene-trio .ark-scene-bubble{text-align:left;font-size:11px;padding:9px}.ark-scene-trio .ark-scene-bubble:before{font-size:8px}',
    '.ark-scene-trio .ark-scene-bubble p{font-size:11px;line-height:1.55}',
    '.ark-back-row{display:flex;align-items:center;justify-content:flex-start;margin:0 0 17px}.ark-back-button{display:inline-flex;align-items:center;gap:8px;padding:9px 13px;border:1px solid #355b78;border-radius:7px;background:linear-gradient(120deg,#122b40,#0b1724);color:#c9e8ff;font:600 10px var(--mono,monospace);letter-spacing:.7px;cursor:pointer;transition:background .2s,border-color .2s,transform .2s}.ark-back-button:hover{border-color:#7bcaff;background:#173953;transform:translateX(-2px)}.ark-back-button:focus-visible{outline:2px solid #83d1ff;outline-offset:3px}',
    '@keyframes ark-hover{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}',
    '@media(max-width:700px){.ark-scene{gap:9px;padding:11px}.ark-scene-robot{width:82px;height:92px;flex-basis:82px}.ark-scene-bubble{font-size:12px;padding:10px}.ark-scene-trio{grid-template-columns:1fr}.ark-scene-trio .ark-scene{display:flex;align-items:center;text-align:left}.ark-scene-trio .ark-scene-robot{width:72px;height:80px;flex-basis:72px;margin:0}.ark-scene-trio .ark-scene-bubble{flex:1}.ark-scene--peek{transform:none;margin-left:0}.ark-scene--peek .ark-scene-robot{width:75px;height:84px;flex-basis:75px}}',
    '@media(prefers-reduced-motion:reduce){.ark-scene-robot{animation:none}.ark-back-button{transition:none}}'
  ].join('\n');
  document.head.appendChild(style);

  var robotSvg = '<svg viewBox="0 0 140 150" role="img" aria-label="Robô A.R.K. branco, flutuante, com olhos de LED azuis e braços articulados">' +
    '<defs><linearGradient id="ark-shell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".58" stop-color="#e6f3fa"/><stop offset="1" stop-color="#a9c7d9"/></linearGradient><linearGradient id="ark-blue" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#123e60"/><stop offset="1" stop-color="#061827"/></linearGradient><filter id="ark-glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<ellipse cx="70" cy="137" rx="35" ry="6" fill="#49b9f5" opacity=".25"/><ellipse cx="70" cy="134" rx="25" ry="3.5" fill="#80d8ff" opacity=".65"/>' +
    '<path d="M70 7V17" stroke="#bdeeff" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="6" r="4" fill="#64caff" filter="url(#ark-glow)"/>' +
    '<path d="M48 77L31 83L22 100" fill="none" stroke="#d9e9f2" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M92 77L109 83L118 100" fill="none" stroke="#d9e9f2" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="31" cy="84" r="6" fill="#f7fcff" stroke="#8eafc2" stroke-width="2"/><circle cx="109" cy="84" r="6" fill="#f7fcff" stroke="#8eafc2" stroke-width="2"/><path d="M17 99l5 7 6-6M112 100l6 6 5-7" fill="none" stroke="#dff4ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<rect x="43" y="65" width="54" height="55" rx="19" fill="url(#ark-shell)" stroke="#91b4c9" stroke-width="2"/><path d="M52 86Q70 76 88 86" fill="none" stroke="#fff" stroke-width="4" opacity=".8"/><rect x="60" y="91" width="20" height="15" rx="5" fill="#d5efff" stroke="#78b9df"/><path d="M65 98h10" stroke="#2699d6" stroke-width="2.5" stroke-linecap="round"/>' +
    '<rect x="35" y="18" width="70" height="57" rx="25" fill="url(#ark-shell)" stroke="#8eafc2" stroke-width="2"/><path d="M46 31Q70 18 94 31" fill="none" stroke="#fff" stroke-width="5" opacity=".9"/><rect x="44" y="36" width="52" height="25" rx="10" fill="url(#ark-blue)" stroke="#4d91b7" stroke-width="1.5"/><circle cx="58" cy="48.5" r="4" fill="#7de0ff" filter="url(#ark-glow)"/><circle cx="82" cy="48.5" r="4" fill="#7de0ff" filter="url(#ark-glow)"/><path d="M64 57h12" stroke="#55b8ed" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>' +
    '<path d="M35 47h-5M105 47h5" stroke="#9fdcf8" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="76" r="3" fill="#5dbff1"/><path d="M57 120v5M83 120v5" stroke="#7ec9ed" stroke-width="3" stroke-linecap="round"/>' +
    '</svg>';

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function scene(message, variant) {
    var cls = 'ark-scene' + (variant ? ' ark-scene--' + variant : '');
    return '<aside class="' + cls + '" data-ark-scene="true">' +
      '<div class="ark-scene-robot" aria-hidden="true">' + robotSvg + '</div>' +
      '<div class="ark-scene-bubble"><p>' + esc(message) + '</p></div></aside>';
  }

  function addAfter(target, html) {
    if (!target || !target.parentNode) return null;
    var holder = document.createElement('div');
    holder.innerHTML = html;
    var node = holder.firstElementChild;
    if (node) target.parentNode.insertBefore(node, target.nextSibling);
    return node;
  }

  function addBefore(target, html) {
    if (!target || !target.parentNode) return null;
    var holder = document.createElement('div');
    holder.innerHTML = html;
    var node = holder.firstElementChild;
    if (node) target.parentNode.insertBefore(node, target);
    return node;
  }

  function activeId() {
    try { if (typeof current !== 'undefined' && current) return current; } catch (_) {}
    var title = document.getElementById('title');
    var value = title ? title.textContent.trim() : '';
    try {
      if (typeof pages !== 'undefined') {
        var keys = Object.keys(pages);
        for (var i = 0; i < keys.length; i++) if (pages[keys[i]] && pages[keys[i]].title === value) return keys[i];
      }
    } catch (_) {}
    return 'overview';
  }

  var parents = {
    chi:'systems', talents:'systems', combat:'systems', progression:'systems',
    races:'systems', honor:'systems', karma:'systems', equipment:'systems',
    crafting:'systems', economy:'systems', ranks:'systems', power:'systems',
    'lore-history':'lore', 'lore-pantheons':'lore', 'lore-thanatos':'lore',
    'lore-progenitor':'lore', training:'functions', forge:'functions', work:'functions'
  };
  var backPages = Object.keys(parents).concat(['agency','organizations','protocol','characters']);

  function installBackButton(content, id) {
    if (backPages.indexOf(id) < 0 || content.querySelector('.ark-back-row')) return;
    var row = document.createElement('div');
    row.className = 'ark-back-row';
    row.innerHTML = '<button type="button" class="ark-back-button"><span aria-hidden="true">←</span> VOLTAR</button>';
    row.querySelector('button').addEventListener('click', function () {
      var destination = null;
      try {
        if (typeof pageHistory !== 'undefined' && pageHistory.length) destination = pageHistory.pop();
      } catch (_) {}
      if (!destination || destination === id) destination = parents[id] || 'overview';
      if (typeof window.go === 'function') window.go(destination, true);
    });
    content.insertBefore(row, content.firstChild);
  }

  function addTalentScenes(content) {
    var rows = content.querySelector('.rows');
    if (!rows) return;
    var trio = document.createElement('div');
    trio.className = 'ark-scene-trio';
    trio.innerHTML =
      scene('Corporal: esta classe se manifesta no próprio corpo. Observe como o Chi pode aprimorar capacidades e alterar características corporais.', 'compact') +
      scene('Influência: aqui, o efeito alcança algo além do corpo do usuário. O controle adequado importa para manter a eficiência da manifestação.', 'compact') +
      scene('Existência: envolve a própria manifestação da existência, com possibilidades como criação, distorção espacial e vazio, conforme as regras registradas.', 'compact');
    rows.parentNode.insertBefore(trio, rows.nextSibling);
  }

  function placeScenes(content, id) {
    if (!content || content.querySelector('[data-ark-scene]')) return;

    if (id === 'overview') {
      var welcome = content.querySelector('.welcome-marketing');
      if (welcome) {
        var lead = welcome.querySelector('.welcome-copy');
        addAfter(lead || welcome.firstElementChild, scene('Olá! Eu sou o A.R.K., um dos programas de defesa e assistência da Agência. Vou acompanhar sua exploração pela Nova Ordem e explicar os registros conforme você avança.', ''));
        var innovation = welcome.querySelector('.innovation-copy');
        if (innovation) addAfter(innovation, scene('Nesta área ficam as ferramentas interativas. Por exemplo: os treinamentos ajudam a registrar atividades de desenvolvimento; a Forja recebe projetos; e o Trabalho registra jornadas profissionais.', 'compact'));
      }
      var story = content.querySelector('.story-band');
      if (story) addAfter(story.querySelector('p'), scene('Atenção: nem todos os arquivos estão abertos. Algumas informações da cosmologia são reservadas e devem ser descobertas no momento certo da história.', 'compact'));
      return;
    }

    if (id === 'systems') {
      var cards = content.querySelector('.cards');
      if (cards) addAfter(cards, scene('Os sistemas são módulos diferentes que trabalham em conjunto. Abra um registro para consultar suas regras. Se quiser retornar à lista, use o botão “Voltar” no início de cada página.', ''));
      return;
    }

    if (id === 'talents') {
      var intro = content.querySelector('.panel');
      if (intro) addAfter(intro, scene('Antes de escolher uma manifestação, lembre-se: Talentos são congênitos. A classe descreve como a habilidade se manifesta; a especialização define seu campo de atuação.', 'compact'));
      addTalentScenes(content);
      return;
    }

    if (id === 'lore-thanatos') {
      var first = content.querySelector('.panel');
      if (first) addAfter(first, scene('Este registro é delicado. Posso apresentar o que está documentado publicamente, mas certos dados permanecem reservados. Recomendo cautela ao explorar este arquivo.', 'peek'));
      return;
    }

    var messages = {
      chi:'O Chi está presente em todos os seres vivos. Perceber a própria energia não significa dominá-la imediatamente: controle e treinamento continuam necessários.',
      races:'A Nova Ordem trabalha com quatro categorias: Humanos, Híbridos, Químios e Ciborgues. Consulte cada descrição antes de definir a origem do personagem.',
      combat:'No combate, descreva ações coerentes com as capacidades e condições do personagem. O sistema exige atenção às regras e à interação entre as ações.',
      progression:'A progressão reúne diferentes caminhos de desenvolvimento. Missões, eventos e treinamentos têm funções próprias; não existe uma única trajetória obrigatória.',
      'lore-history':'Este arquivo reúne acontecimentos históricos conhecidos. Leia com atenção: alguns eventos explicam a formação da ordem atual.',
      'lore-pantheons':'As culturas e tradições possuem seus próprios registros. Não confunda referências mitológicas com as entidades originais da cosmologia da Nova Ordem.',
      'lore-progenitor':'Este registro possui caráter reservado. Nem toda informação deve ser interpretada como conhecimento público dos personagens.',
      characters:'A criação de personagens é livre, mas a administração avalia coerência com a Lore e equilíbrio da ficha.',
      agency:'A Agência possui estrutura, procedimentos e responsabilidades próprias. A participação de um personagem não é obrigatória.',
      organizations:'Cada organização tem identidade, território e interesses próprios. Consulte os registros antes de assumir vínculos ou alianças.',
      protocol:'Este protocolo reúne orientações para a participação no RPG. Em caso de dúvida, consulte a administração.',
      races:'As categorias raciais não substituem a história individual do personagem; a ficha ainda precisa explicar sua origem e trajetória.',
      equipment:'Os equipamentos devem respeitar as categorias e condições registradas. Uma descrição visual, por si só, não concede capacidades adicionais.',
      honor:'Honra e Karma são medidas diferentes. Não trate uma pontuação como conversível na outra.',
      karma:'Karma registra consequências de ações criminosas relevantes e é avaliado separadamente da Honra.',
      progression:'A evolução é avaliada conforme a atividade e as regras próprias de cada caminho.',
      economy:'Os valores e transações devem seguir os registros do sistema monetário, sem presumir preços que não estejam documentados.',
      ranks:'Rank, nível e reconhecimento são critérios distintos. A promoção depende das regras e da avaliação administrativa.'
    };
    var message = messages[id];
    if (!message) return;
    var anchor = content.querySelector('.panel') || content.querySelector('.intro-lead') || content.firstElementChild;
    if (anchor) addAfter(anchor, scene(message, ''));
    if (id === 'chi' || id === 'combat' || id === 'progression') {
      var rows = content.querySelector('.rows');
      if (rows) addAfter(rows, scene('Dica de consulta: compare os termos desta página com os registros relacionados. Se uma regra não estiver escrita, não presuma um efeito adicional.', 'compact'));
    }
  }

  function enhance() {
    var content = document.getElementById('content');
    if (!content) return;
    var id = activeId();
    installBackButton(content, id);
    placeScenes(content, id);
  }

  var observer = null;
  function initialize() {
    enhance();
    var content = document.getElementById('content');
    if (content && window.MutationObserver) {
      observer = new MutationObserver(function () {
        window.clearTimeout(observer._arkTimer);
        observer._arkTimer = window.setTimeout(enhance, 40);
      });
      observer.observe(content, {childList:true,subtree:true});
    }
    document.addEventListener('click', function (event) {
      var target = event.target.closest('[data-go]');
      if (target && target.getAttribute('data-go') && typeof window.go === 'function') {
        window.go(target.getAttribute('data-go'));
      }
    });
  }

  window.NovaOrdemARKScenes = { refresh: enhance };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();
})();