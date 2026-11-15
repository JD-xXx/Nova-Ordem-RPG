/* NOVA ORDEM — A.R.K. | Guia contextual e Central de Conhecimento */
(function () {
  'use strict';

  if (window.NovaOrdemARK) return;

  var style = document.createElement('style');
  style.id = 'ark-assistant-styles';
  style.textContent = [
    '#ark-launcher{position:fixed;right:22px;bottom:22px;z-index:10020;display:flex;align-items:center;gap:10px;border:1px solid rgba(99,190,255,.65);border-radius:999px;background:linear-gradient(135deg,#123653,#091725);color:#eaf7ff;padding:8px 15px 8px 8px;box-shadow:0 10px 35px #0009;cursor:pointer;font:600 12px var(--sans,Arial);transition:transform .2s,border-color .2s}',
    '#ark-launcher:hover{transform:translateY(-3px);border-color:#9cddff}',
    '.ark-avatar{width:42px;height:42px;flex:0 0 42px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 25%,#d9f5ff,#5bb9f5 42%,#123d62 78%);border:1px solid #9cddff;box-shadow:0 0 18px #48b8ff55}',
    '.ark-avatar svg{width:30px;height:30px}',
    '.ark-launch-copy{display:grid;gap:2px;text-align:left}.ark-launch-copy b{font:700 13px var(--display,Arial);letter-spacing:1px}.ark-launch-copy small{font:9px var(--mono,monospace);color:#a8cde6}',
    '#ark-panel{position:fixed;right:22px;bottom:82px;z-index:10021;width:min(390px,calc(100vw - 28px));height:min(570px,calc(100vh - 115px));display:none;flex-direction:column;overflow:hidden;border:1px solid #28618a;border-radius:13px;background:#09131f;box-shadow:0 18px 60px #000c;color:#e8f4ff;font-family:var(--sans,Arial)}',
    '#ark-panel.ark-open{display:flex}',
    '.ark-head{display:flex;align-items:center;gap:11px;padding:14px 15px;background:linear-gradient(110deg,#123652,#0b1c2d);border-bottom:1px solid #244967}',
    '.ark-head .ark-avatar{width:38px;height:38px;flex-basis:38px}',
    '.ark-head-copy{flex:1;min-width:0}.ark-head-copy b{display:block;font:700 16px var(--display,Arial);letter-spacing:1px}.ark-head-copy small{display:block;color:#a6c6df;font:9px var(--mono,monospace);margin-top:3px}',
    '.ark-close{border:1px solid #345b78;background:#10283b;color:#dff3ff;border-radius:5px;padding:7px 10px;cursor:pointer}',
    '.ark-context{padding:8px 14px;background:#0c1a29;color:#9dbbd3;font:9px var(--mono,monospace);border-bottom:1px solid #1b354d}',
    '.ark-messages{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:11px;scroll-behavior:smooth}',
    '.ark-message{max-width:91%;padding:10px 12px;border-radius:10px;font-size:13px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}',
    '.ark-message.ark-bot{align-self:flex-start;background:#12283a;border:1px solid #244965;color:#e0f1ff;border-top-left-radius:3px}',
    '.ark-message.ark-user{align-self:flex-end;background:#17456a;border:1px solid #2b6e9e;color:#f0f8ff;border-top-right-radius:3px}',
    '.ark-source{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-top:9px;color:#9fc8e8;font:9px var(--mono,monospace)}',
    '.ark-source button{border:1px solid #2c6388;background:#0b2031;color:#c8eaff;border-radius:4px;padding:5px 8px;cursor:pointer}',
    '.ark-quick{display:flex;gap:6px;flex-wrap:wrap;padding:0 13px 10px}',
    '.ark-quick button{border:1px solid #28516f;background:#0d2132;color:#b9dafa;border-radius:20px;padding:6px 9px;font-size:10px;cursor:pointer}',
    '.ark-compose{display:flex;gap:8px;padding:11px;border-top:1px solid #203d55;background:#0c1b2a}',
    '.ark-compose input{flex:1;min-width:0;border:1px solid #31526d;border-radius:6px;background:#07111b;color:#edf8ff;padding:11px;font-size:13px;outline:none}',
    '.ark-compose input:focus{border-color:#64c5ff;box-shadow:0 0 0 2px #3b9ddd22}',
    '.ark-compose button{border:1px solid #3887bb;border-radius:6px;background:#14517a;color:white;padding:0 13px;cursor:pointer;font:600 11px var(--mono,monospace)}',
    '.ark-foot{padding:7px 12px;color:#66859f;background:#08121d;font:8px var(--mono,monospace);text-align:center}',
    '.ark-main{border:1px solid #245276;border-radius:12px;background:linear-gradient(145deg,#0c1b2a,#09131f);overflow:hidden;margin:18px 0}',
    '.ark-main-intro{display:flex;align-items:center;gap:15px;padding:20px;border-bottom:1px solid #1c3b55}',
    '.ark-main-intro .ark-avatar{width:62px;height:62px;flex-basis:62px}',
    '.ark-main-intro h3{font:700 23px var(--display,Arial);color:#e4f5ff;margin:0 0 4px}',
    '.ark-main-intro p{font-size:12px;color:#a9c3d8;margin:0;line-height:1.6}',
    '.ark-main .ark-messages{height:340px;min-height:240px}',
    '.ark-main .ark-compose{padding:14px}',
    '.ark-main .ark-quick{padding:0 14px 12px}',
    '.ark-disclaimer{margin:14px 0;padding:12px 14px;border-left:2px solid #58bfff;background:#0b1a28;color:#9eb7cc;font-size:11px;line-height:1.65}',
    '@media(max-width:600px){#ark-launcher{right:13px;bottom:13px;padding:6px 11px 6px 6px}.ark-avatar{width:38px;height:38px;flex-basis:38px}#ark-panel{right:8px;bottom:70px;width:calc(100vw - 16px);height:min(600px,calc(100vh - 85px))}.ark-main-intro{padding:15px}.ark-main .ark-messages{height:300px}}'
  ].join('\n');
  document.head.appendChild(style);

  var robot = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5v6M20 5h8" stroke="#123d62" stroke-width="2.5" stroke-linecap="round"/><rect x="7" y="12" width="34" height="27" rx="9" fill="#eaf8ff" stroke="#164b75" stroke-width="2"/><path d="M7 22H4m40 0h-3" stroke="#164b75" stroke-width="2.5" stroke-linecap="round"/><rect x="12" y="18" width="24" height="13" rx="5" fill="#143d60"/><circle cx="18" cy="24.5" r="2.2" fill="#8de0ff"/><circle cx="30" cy="24.5" r="2.2" fill="#8de0ff"/><path d="M19 35h10" stroke="#4a9dca" stroke-width="2" stroke-linecap="round"/></svg>';
  var avatar = '<span class="ark-avatar">' + robot + '</span>';
  var pages = window.pages || null;
  var navItems = window.navItems || null;
  var state = {messages: [], opened: false, index: [], page: 'overview'};
  var pageTitles = {
    overview: 'Início', lore: 'Cosmologia', agency: 'A Agência',
    organizations: 'Organizações', characters: 'Personagens e fichas',
    protocol: 'Protocolo', systems: 'Sistemas', chi: 'Sistema de Chi',
    talents: 'Talentos', combat: 'Combate', progression: 'Progressão',
    races: 'Raças', honor: 'Honra e Karma', equipment: 'Equipamentos',
    crafting: 'Criação e Crafting', economy: 'Sistema monetário',
    missions: 'Missões', ranks: 'Ranks e hierarquia', ark: 'Central do A.R.K.'
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }
  function normalize(value) {
    return String(value || '').toLocaleLowerCase('pt-BR').normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  function tokens(value) {
    var ignored = {'para':1,'com':1,'que':1,'uma':1,'uns':1,'das':1,'dos':1,'por':1,'como':1,'qual':1,'quais':1,'isso':1,'essa':1,'esse':1,'sobre':1,'meu':1,'minha':1,'tem':1,'ser':1,'sao':1,'the':1,'and':1};
    return normalize(value).split(' ').filter(function (word) { return word.length > 2 && !ignored[word]; });
  }
  function currentPage() {
    var heading = document.getElementById('title');
    var desc = document.getElementById('desc');
    var title = heading ? heading.textContent.trim() : 'Nova Ordem';
    var description = desc ? desc.textContent.trim() : '';
    return {title:title, description:description, id:state.page};
  }
  function setContext() {
    var title = currentPage().title;
    var context = document.querySelectorAll('.ark-context');
    context.forEach(function (node) { node.textContent = 'CONTEXTO ATUAL: ' + title.toUpperCase(); });
  }
  function addMessage(text, who, sources) {
    state.messages.push({text:text, who:who, sources:sources || []});
    if (state.messages.length > 60) state.messages.shift();
    renderAllChats();
  }
  function makeMessage(message) {
    var item = document.createElement('div');
    item.className = 'ark-message ' + (message.who === 'user' ? 'ark-user' : 'ark-bot');
    item.textContent = message.text;
    if (message.sources && message.sources.length) {
      var source = document.createElement('div');
      source.className = 'ark-source';
      var label = document.createElement('span');
      label.textContent = 'REGISTROS RELACIONADOS:';
      source.appendChild(label);
      message.sources.forEach(function (entry) {
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = entry.title;
        button.setAttribute('data-ark-open', entry.id);
        source.appendChild(button);
      });
      item.appendChild(source);
    }
    return item;
  }
  function renderMessages(container) {
    if (!container) return;
    container.textContent = '';
    state.messages.forEach(function (message) { container.appendChild(makeMessage(message)); });
    container.scrollTop = container.scrollHeight;
  }
  function renderAllChats() {
    renderMessages(document.getElementById('ark-float-messages'));
    renderMessages(document.getElementById('ark-main-messages'));
  }
  function quickButtons() {
    return '<div class="ark-quick">' +
      '<button type="button" data-ark-ask="Quais são as raças da Nova Ordem?">Raças</button>' +
      '<button type="button" data-ark-ask="Como funciona o Chi?">Sistema de Chi</button>' +
      '<button type="button" data-ark-ask="Como funcionam os Talentos?">Talentos</button>' +
      '<button type="button" data-ark-ask="Como funcionam os módulos cibernéticos?">Módulos Cibernéticos</button>' +
      '</div>';
  }
  function composeMarkup(prefix) {
    return '<form class="ark-compose" data-ark-form="' + prefix + '">' +
      '<input type="text" name="question" maxlength="500" autocomplete="off" placeholder="Pergunte sobre a Nova Ordem..." aria-label="Pergunte ao A.R.K.">' +
      '<button type="submit">ENVIAR</button></form>';
  }
  function renderMainPage() {
    return '<section class="ark-main">' +
      '<div class="ark-main-intro">' + avatar +
        '<div><h3>Central do A.R.K.</h3><p>Consulta de informações e regras oficiais da Nova Ordem. Pergunte sobre os sistemas, raças, personagens e funcionamento da plataforma.</p></div>' +
      '</div><div class="ark-context">CONTEXTO ATUAL: CENTRAL DO A.R.K.</div>' +
      '<div class="ark-messages" id="ark-main-messages" aria-live="polite"></div>' +
      quickButtons() + composeMarkup('main') +
      '<div class="ark-foot">A.R.K. // CENTRAL DE CONHECIMENTO DA AGÊNCIA</div></section>' +
      '<div class="ark-disclaimer">As respostas desta versão são montadas a partir das regras confirmadas e dos registros disponíveis no próprio site. Quando uma informação não estiver documentada, o A.R.K. avisará em vez de inventar uma regra.</div>';
  }

  function addKnowledge(title, id, text, terms) {
    if (!text || !String(text).trim()) return;
    state.index.push({title:title, id:id, text:String(text).replace(/\s+/g,' ').trim(), terms:terms || []});
  }
  function buildKnowledgeIndex() {
    state.index = [];
    var confirmed = [
      ['Raças', 'races', 'A Nova Ordem possui quatro categorias de raça: Humanos, Híbridos, Químios e Ciborgues. Humanos possuem Chi inativo e não conseguem utilizar Chi nem Talentos. Híbridos e Químios podem utilizar Chi e Talentos. Ciborgues não acessam Chi nem possuem Talentos ou habilidades sobrenaturais; suas capacidades vêm de módulos mecânicos.', ['raca','humanos','hibridos','quimios','ciborgues']],
      ['Sistema de Chi', 'chi', 'Todos os seres vivos possuem Chi. Nos humanos comuns, o Chi permanece inativo e não pode ser utilizado. Híbridos e Químios podem desenvolver consciência e controle do próprio Chi por meio de treinamento. O custo de uma técnica considera sua complexidade, potência e duração. Descanso e meditação auxiliam a recuperação.', ['chi','energia','reserva','controle','emissao']],
      ['Talentos', 'talents', 'Talentos são capacidades congênitas e únicas. As raridades atuais são Comum e Raro. Talento Comum exige exatamente uma especialização; Talento Raro exige exatamente duas. A lista oficial contém: Controle, Corroer, Criação, Elemental, Aceleração, Ocultar, Cinese, Poder, Psíquico, Controle de Alcance, Alcance, Transformação, Estado, Suporte, Tóxico, Vazio e Warp.', ['talento','especializacao','raridade','comum','raro']],
      ['Módulos Cibernéticos', 'races', 'Ciborgues podem propor até cinco módulos cibernéticos. A escolha é livre: não existe obrigação de distribuir módulos entre categorias. Cada módulo precisa ter nome e descrição de funcionamento. Categorias como ofensivo, defensivo, mobilidade e suporte são apenas exemplos, não um catálogo fechado. A proposta é avaliada pela administração junto com a ficha.', ['modulo','modulos','cibernetico','ciberneticos','ciborgue']],
      ['Criação e avaliação de fichas', 'characters', 'A criação de personagens permite que o jogador defina origem, nascimento, história e apresentação do personagem. A administração avalia se a proposta se encaixa no RPG e se está equilibrada, podendo aprovar, rejeitar ou devolver para ajustes. A evolução pertence ao Sistema de Progressão.', ['ficha','personagem','criacao','criar','avaliacao','aprovar','rejeitar']],
      ['Habilidades sobrenaturais', 'talents', 'Humanos e Ciborgues não podem possuir habilidades sobrenaturais. Híbridos e Químios podem desenvolver habilidades conforme seus Talentos e especializações, respeitando as regras e a avaliação da ficha.', ['habilidade','sobrenatural','poderes']],
      ['Central de navegação', 'overview', 'O A.R.K. é o guia virtual da Nova Ordem. Ele acompanha a navegação, explica as páginas e oferece uma Central própria para dúvidas sobre os sistemas e as funcionalidades do site.', ['ark','guia','mascote','navegacao','ajuda']]
    ];
    confirmed.forEach(function (entry) { addKnowledge(entry[0],entry[1],entry[2],entry[3]); });

    if (typeof window.render === 'function' && window.pages) {
      Object.keys(window.pages).forEach(function (id) {
        if (id === 'ark') return;
        try {
          var page = window.pages[id];
          var html = window.render(id, page);
          var holder = document.createElement('div');
          holder.innerHTML = html || '';
          var nodes = holder.querySelectorAll('h2,h3,h4,p,li,td,th,.row,.card,.panel');
          var chunks = [];
          nodes.forEach(function (node) {
            var text = (node.textContent || '').replace(/\s+/g,' ').trim();
            if (text.length > 35 && chunks.indexOf(text) === -1) chunks.push(text);
          });
          if (!chunks.length) {
            var all = (holder.textContent || '').replace(/\s+/g,' ').trim();
            if (all.length > 40) chunks.push(all);
          }
          chunks.forEach(function (chunk) { addKnowledge(page.title || pageTitles[id] || id, id, chunk, []); });
        } catch (error) {
          console.warn('[A.R.K.] Não foi possível indexar o registro ' + id, error);
        }
      });
    }
  }
  function findAnswers(question) {
    var queryTokens = tokens(question);
    var query = normalize(question);
    var scored = state.index.map(function (entry) {
      var haystack = normalize(entry.title + ' ' + entry.text + ' ' + (entry.terms || []).join(' '));
      var score = 0;
      queryTokens.forEach(function (word) {
        if (haystack.indexOf(word) !== -1) score += (entry.terms && entry.terms.indexOf(word) !== -1 ? 4 : 1);
        if (normalize(entry.title).indexOf(word) !== -1) score += 2;
      });
      if (query.length > 5 && haystack.indexOf(query) !== -1) score += 5;
      var page = currentPage();
      if (entry.id === page.id && score > 0) score += 1;
      return {entry:entry, score:score};
    }).filter(function (item) { return item.score > 0; });
    scored.sort(function (a,b) { return b.score-a.score; });
    return scored.slice(0,3).map(function (item) { return item.entry; });
  }
  function answer(question) {
    var found = findAnswers(question);
    if (!found.length) {
      return {
        text:'Não encontrei uma resposta suficientemente confirmada nos registros disponíveis. Posso consultar os sistemas documentados, mas prefiro não inventar uma regra. Tente mencionar o nome do sistema, raça ou funcionalidade que deseja entender.',
        sources:[{title:'Todos os sistemas',id:'systems'}]
      };
    }
    var unique = [];
    found.forEach(function (entry) {
      var text = entry.text;
      if (unique.indexOf(text) === -1) unique.push(text);
    });
    var main = unique[0];
    var extra = unique.slice(1,3);
    var response = main;
    if (extra.length) response += '\n\nTambém encontrei estas informações relacionadas:\n• ' + extra.join('\n• ');
    return {text:response, sources:found.map(function (entry) {
      return {title:entry.title,id:entry.id};
    }).filter(function (entry,index,array) {
      return array.findIndex(function (item) { return item.id === entry.id; }) === index;
    })};
  }
  function ask(question) {
    var value = String(question || '').trim();
    if (!value) return;
    addMessage(value,'user');
    var result = answer(value);
    window.setTimeout(function () { addMessage(result.text,'bot',result.sources); }, 120);
  }
  function sendFromForm(form) {
    var input = form.querySelector('input[name="question"]');
    if (!input) return;
    var value = input.value.trim();
    if (!value) return;
    input.value = '';
    ask(value);
  }
  function renderWidget() {
    if (document.getElementById('ark-launcher')) return;
    var launcher = document.createElement('button');
    launcher.id = 'ark-launcher';
    launcher.type = 'button';
    launcher.setAttribute('aria-label','Abrir guia A.R.K.');
    launcher.innerHTML = avatar + '<span class="ark-launch-copy"><b>A.R.K.</b><small>GUIA DA AGÊNCIA</small></span>';
    var panel = document.createElement('section');
    panel.id = 'ark-panel';
    panel.setAttribute('aria-label','Assistente A.R.K.');
    panel.innerHTML = '<div class="ark-head">' + avatar +
      '<div class="ark-head-copy"><b>A.R.K.</b><small>ASSISTENTE DA AGÊNCIA</small></div>' +
      '<button class="ark-close" type="button" aria-label="Fechar">×</button></div>' +
      '<div class="ark-context">CONTEXTO ATUAL: INÍCIO</div>' +
      '<div class="ark-messages" id="ark-float-messages" aria-live="polite"></div>' +
      quickButtons() + composeMarkup('float') +
      '<div class="ark-foot">RESPOSTAS BASEADAS NOS REGISTROS DA NOVA ORDEM</div>';
    document.body.appendChild(launcher);
    document.body.appendChild(panel);
    launcher.addEventListener('click',function () {
      state.opened = !state.opened;
      panel.classList.toggle('ark-open',state.opened);
      setContext();
      if (state.opened && !state.messages.length) {
        var page = currentPage();
        addMessage('Olá! Sou o A.R.K., guia virtual da Agência. Você está na seção "' + page.title + '". Posso orientar sua navegação ou ajudar a consultar as regras e sistemas da Nova Ordem. O que deseja saber?','bot');
      }
      renderAllChats();
      if (state.opened) {
        var field = panel.querySelector('input[name="question"]');
        if (field) field.focus();
      }
    });
    panel.querySelector('.ark-close').addEventListener('click',function () {
      state.opened = false;
      panel.classList.remove('ark-open');
    });
  }
  function centralPageMarkup() {
    return '<section class="ark-main"><div class="ark-main-intro">' + avatar +
      '<div><h3>Central do A.R.K.</h3><p>Olá. Sou o guia virtual da Agência. Consulte os registros oficiais e tire dúvidas sobre os sistemas, personagens e funcionalidades da Nova Ordem.</p></div></div>' +
      '<div class="ark-context">CONTEXTO ATUAL: CENTRAL DO A.R.K.</div>' +
      '<div class="ark-messages" id="ark-main-messages" aria-live="polite"></div>' +
      quickButtons() + composeMarkup('main') +
      '<div class="ark-foot">A.R.K. // CENTRAL DE CONHECIMENTO DA AGÊNCIA</div></section>' +
      '<div class="ark-disclaimer">Esta versão consulta as informações confirmadas e a documentação presente no site. Quando um detalhe não estiver documentado, o A.R.K. informa a limitação em vez de inventar uma resposta.</div>';
  }
  function registerPage() {
    if (!window.pages || !window.navItems || typeof window.render !== 'function') return false;
    window.pages.ark = {
      title:'Central do A.R.K.',
      desc:'Assistente virtual para consulta dos sistemas e orientação pela plataforma.',
      code:'ARQUIVO 16 / ASSISTÊNCIA'
    };
    if (!window.navItems.some(function (item) { return item[0] === 'ark'; })) {
      window.navItems.push(['ark','🤖 Central do A.R.K.']);
    }
    var previousRender = window.render;
    window.render = function (id,page) {
      if (id === 'ark') return centralPageMarkup();
      return previousRender(id,page);
    };
    if (typeof window.go === 'function') window.go(window.current || 'overview',true);
    return true;
  }

  document.addEventListener('submit',function (event) {
    var form = event.target.closest('[data-ark-form]');
    if (!form) return;
    event.preventDefault();
    sendFromForm(form);
  });
  document.addEventListener('click',function (event) {
    var askButton = event.target.closest('[data-ark-ask]');
    if (askButton) { ask(askButton.getAttribute('data-ark-ask')); return; }
    var openButton = event.target.closest('[data-ark-open]');
    if (openButton && typeof window.go === 'function') {
      window.go(openButton.getAttribute('data-ark-open'));
      var panel = document.getElementById('ark-panel');
      if (panel && state.opened) {
        panel.classList.remove('ark-open');
        state.opened = false;
      }
    }
  });

  function initialize() {
    renderWidget();
    registerPage();
    buildKnowledgeIndex();
    if (!state.messages.length) {
      addMessage('Central de conhecimento pronta. Pergunte sobre uma regra, raça, sistema ou função do site.','bot');
    }
    renderAllChats();
    setContext();
    var content = document.getElementById('content');
    if (content && window.MutationObserver) {
      var observer = new MutationObserver(function () {
        var title = currentPage().title;
        var id = Object.keys(pageTitles).find(function (key) { return pageTitles[key] === title; });
        if (id) state.page = id;
        setContext();
        if (id === 'ark') renderMessages(document.getElementById('ark-main-messages'));
      });
      observer.observe(content,{childList:true,subtree:true});
    }
  }

  window.NovaOrdemARK = {
    ask: ask,
    open: function () {
      var launcher = document.getElementById('ark-launcher');
      if (launcher) launcher.click();
    },
    rebuildKnowledge: buildKnowledgeIndex
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',initialize);
  else initialize();
})();