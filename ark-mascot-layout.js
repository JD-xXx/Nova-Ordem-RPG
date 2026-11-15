/* NOVA ORDEM — A.R.K. em cena, com navegação inferior */
(function () {
  'use strict';
  if (window.NovaOrdemARKScenes) return;

  var css = [
    '.ark-scene{display:flex;align-items:center;gap:15px;position:relative;margin:22px 0;padding:14px 17px;border:1px solid rgba(91,177,232,.34);border-radius:12px;background:linear-gradient(112deg,rgba(17,42,63,.9),rgba(7,17,28,.96));box-shadow:0 8px 26px rgba(0,0,0,.18);overflow:hidden;isolation:isolate}',
    '.ark-scene:before{content:"";position:absolute;inset:0 auto 0 0;width:3px;background:linear-gradient(#b8eaff,#318fd0)}',
    '.ark-scene-robot{width:112px;height:122px;flex:0 0 112px;display:grid;place-items:center;filter:drop-shadow(0 8px 13px rgba(65,174,235,.22));animation:ark-hover 3.6s ease-in-out infinite}',
    '.ark-scene-robot svg{width:100%;height:100%;overflow:visible}',
    '.ark-scene-bubble{position:relative;flex:1;min-width:0;padding:12px 15px;border:1px solid rgba(92,172,224,.3);border-radius:10px;background:rgba(8,20,32,.82);color:#c8dced;font-size:13px;line-height:1.65}',
    '.ark-scene-bubble:before{content:"A.R.K.  /  GUIA DA AGÊNCIA";display:block;margin-bottom:5px;color:#8dd4ff;font:700 9px var(--mono,monospace);letter-spacing:1.1px}',
    '.ark-scene-bubble p{margin:0;color:inherit;font-size:inherit;line-height:inherit}',
    '.ark-scene--compact{padding:10px 13px;gap:10px;margin:15px 0}.ark-scene--compact .ark-scene-robot{width:82px;height:92px;flex-basis:82px}.ark-scene--compact .ark-scene-bubble{font-size:12px;padding:10px 12px}',
    '.ark-scene--peek{margin:12px 0 22px auto;max-width:620px;transform:translateX(10px);border-color:rgba(125,93,111,.42);background:linear-gradient(110deg,rgba(35,22,31,.94),rgba(10,12,19,.97))}.ark-scene--peek .ark-scene-robot{width:94px;height:104px;flex-basis:94px;transform:translateX(8px)}.ark-scene--peek .ark-scene-bubble{border-color:rgba(151,99,116,.36);background:rgba(12,10,16,.86);color:#d4c5ce}.ark-scene--peek .ark-scene-bubble:before{color:#d59cac}',
    '.ark-scene-trio{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:17px 0}',
    '.ark-table-explainer{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(230px,.85fr);gap:12px;align-items:center;margin:14px 0}.ark-table-explainer>.ark-scene{margin:0;height:100%;align-self:stretch}.ark-table-explainer>.tablebox{min-width:0}',
    '.ark-scene-trio .ark-scene{display:block;margin:0;padding:11px;text-align:center}.ark-scene-trio .ark-scene-robot{width:84px;height:92px;margin:0 auto 4px}.ark-scene-trio .ark-scene-bubble{text-align:left;font-size:11px;padding:9px}.ark-scene-trio .ark-scene-bubble:before{font-size:8px}.ark-scene-trio .ark-scene-bubble p{font-size:11px;line-height:1.55}',
    '#backFloat{position:fixed;right:20px;bottom:20px;z-index:8;display:none;align-items:center;justify-content:center;gap:8px;width:auto;height:auto;min-height:44px;padding:10px 16px;border:1px solid #62bce9;border-radius:8px;background:linear-gradient(120deg,#123653,#091725);color:#e8f6ff;font:600 10px var(--mono,monospace);letter-spacing:.8px;box-shadow:0 8px 24px #0009;cursor:pointer}',
    '#backFloat:hover{background:#174567;border-color:#a0ddff;transform:translateY(-2px)}#backFloat:focus-visible{outline:2px solid #83d1ff;outline-offset:3px}',
    '@keyframes ark-hover{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}',
    '@media(max-width:700px){.ark-table-explainer{grid-template-columns:1fr}.ark-scene{gap:9px;padding:11px}.ark-scene-robot{width:82px;height:92px;flex-basis:82px}.ark-scene-bubble{font-size:12px;padding:10px}.ark-scene-trio{grid-template-columns:1fr}.ark-scene-trio .ark-scene{display:flex;align-items:center;text-align:left}.ark-scene-trio .ark-scene-robot{width:72px;height:80px;flex-basis:72px;margin:0}.ark-scene-trio .ark-scene-bubble{flex:1}.ark-scene--peek{transform:none;margin-left:0}.ark-scene--peek .ark-scene-robot{width:75px;height:84px;flex-basis:75px}#backFloat{right:14px;bottom:14px;min-height:42px;padding:9px 13px}}',
    '@media(prefers-reduced-motion:reduce){.ark-scene-robot{animation:none}#backFloat{transition:none}}'
  ].join('\n');
  var style = document.createElement('style');
  style.id = 'ark-scene-layout-styles';
  style.textContent = css;
  document.head.appendChild(style);

  var robotSvg = '<svg viewBox="0 0 140 150" role="img" aria-label="Robô A.R.K. branco, arredondado, flutuante, com olhos de LED azuis e braços articulados">' +
    '<defs><linearGradient id="ark-shell-v2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".58" stop-color="#e6f3fa"/><stop offset="1" stop-color="#a9c7d9"/></linearGradient><linearGradient id="ark-screen-v2" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#123e60"/><stop offset="1" stop-color="#061827"/></linearGradient><filter id="ark-glow-v2"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<ellipse cx="70" cy="137" rx="35" ry="6" fill="#49b9f5" opacity=".25"/><ellipse cx="70" cy="134" rx="25" ry="3.5" fill="#80d8ff" opacity=".65"/>' +
    '<path d="M70 7V17" stroke="#bdeeff" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="6" r="4" fill="#64caff" filter="url(#ark-glow-v2)"/>' +
    '<path d="M48 77L31 83L22 100M92 77L109 83L118 100" fill="none" stroke="#d9e9f2" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="31" cy="84" r="6" fill="#f7fcff" stroke="#8eafc2" stroke-width="2"/><circle cx="109" cy="84" r="6" fill="#f7fcff" stroke="#8eafc2" stroke-width="2"/><path d="M17 99l5 7 6-6M112 100l6 6 5-7" fill="none" stroke="#dff4ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<rect x="43" y="65" width="54" height="55" rx="19" fill="url(#ark-shell-v2)" stroke="#91b4c9" stroke-width="2"/><path d="M52 86Q70 76 88 86" fill="none" stroke="#fff" stroke-width="4" opacity=".8"/><rect x="60" y="91" width="20" height="15" rx="5" fill="#d5efff" stroke="#78b9df"/><path d="M65 98h10" stroke="#2699d6" stroke-width="2.5" stroke-linecap="round"/>' +
    '<rect x="35" y="18" width="70" height="57" rx="25" fill="url(#ark-shell-v2)" stroke="#8eafc2" stroke-width="2"/><path d="M46 31Q70 18 94 31" fill="none" stroke="#fff" stroke-width="5" opacity=".9"/><rect x="44" y="36" width="52" height="25" rx="10" fill="url(#ark-screen-v2)" stroke="#4d91b7" stroke-width="1.5"/><circle cx="58" cy="48.5" r="4" fill="#7de0ff" filter="url(#ark-glow-v2)"/><circle cx="82" cy="48.5" r="4" fill="#7de0ff" filter="url(#ark-glow-v2)"/><path d="M64 57h12" stroke="#55b8ed" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>' +
    '<path d="M35 47h-5M105 47h5" stroke="#9fdcf8" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="76" r="3" fill="#5dbff1"/><path d="M57 120v5M83 120v5" stroke="#7ec9ed" stroke-width="3" stroke-linecap="round"/></svg>';

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function scene(key, message, variant) {
    var cls = 'ark-scene' + (variant ? ' ark-scene--' + variant : '');
    return '<aside class="' + cls + '" data-ark-scene="true" data-ark-key="' + esc(key) + '">' +
      '<div class="ark-scene-robot" aria-hidden="true">' + robotSvg + '</div>' +
      '<div class="ark-scene-bubble"><p>' + esc(message) + '</p></div></aside>';
  }
  function addAfter(target, key, message, variant) {
    if (!target || !target.parentNode) return;
    var content = document.getElementById('content');
    if (!content || content.querySelector('[data-ark-key="' + key + '"]')) return;
    var holder = document.createElement('div');
    holder.innerHTML = scene(key, message, variant);
    target.parentNode.insertBefore(holder.firstElementChild, target.nextSibling);
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
  function updateBackButton(id) {
    var button = document.getElementById('backFloat');
    if (!button) return;
    if (id === 'overview') {
      button.style.display = 'none';
      return;
    }
    button.textContent = '← VOLTAR';
    button.setAttribute('aria-label', 'Voltar à página anterior');
    button.title = 'Voltar à página anterior';
    button.style.display = 'inline-flex';
  }
  function addTalentTrio(content) {
    var rows = content.querySelector('.rows');
    if (!rows || content.querySelector('[data-ark-key="talent-classes"]')) return;
    var holder = document.createElement('div');
    holder.innerHTML = '<div class="ark-scene-trio">' +
      scene('talent-corporal','Corporal: esta classe se manifesta no próprio corpo. O Chi pode aprimorar capacidades e alterar características corporais, sempre respeitando os limites do personagem.','compact') +
      scene('talent-influencia','Influência: o efeito alcança algo além do corpo do usuário. O controle adequado é importante para preservar a eficiência da manifestação.','compact') +
      scene('talent-existencia','Existência: envolve manifestações que afetam a própria existência. Consulte as especializações e os limites registrados antes de definir um efeito.','compact') +
      '</div>';
    rows.parentNode.insertBefore(holder.firstElementChild, rows.nextSibling);
  }
  function addAfterIndex(content, selector, index, key, message, variant) {
    var nodes = content.querySelectorAll(selector);
    if (nodes[index]) addAfter(nodes[index], key, message, variant || 'compact');
  }
  function wrapWithScene(target, key, message) {
    if (!target || !target.parentNode) return;
    var content = document.getElementById('content');
    if (!content || content.querySelector('[data-ark-key="' + key + '"]')) return;
    if (target.parentNode.classList && target.parentNode.classList.contains('ark-table-explainer')) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'ark-table-explainer';
    target.parentNode.insertBefore(wrapper, target);
    wrapper.appendChild(target);
    var holder = document.createElement('div');
    holder.innerHTML = scene(key, message, 'compact');
    wrapper.appendChild(holder.firstElementChild);
  }
  function placeScenes(content, id) {
    if (!content) return;
    if (id === 'overview') {
      var welcome = content.querySelector('.welcome-marketing');
      if (welcome) {
        addAfter(welcome.querySelector('.welcome-copy'), 'home-intro', 'Olá! Eu sou o A.R.K., um dos programas de defesa e assistência da Agência. Vou acompanhar sua exploração pela Nova Ordem e explicar os registros conforme você avança.');
        addAfter(welcome.querySelector('.innovation-copy'), 'home-tools', 'Nesta área ficam as ferramentas interativas. Os treinamentos registram atividades de desenvolvimento; a Forja recebe projetos; e o Trabalho registra jornadas profissionais.', 'compact');
        addAfter(welcome.querySelector('.innovation-grid'), 'home-tools-detail', 'Se alguma ferramenta ainda estiver em desenvolvimento, eu aviso. Não vou apresentar funções incompletas como se já estivessem disponíveis.', 'compact');
      }
      var oldIntro = content.querySelector('.intro-lead');
      if (oldIntro) addAfter(oldIntro, 'home-intro-fallback', 'Olá! Eu sou o A.R.K., guia virtual da Agência. Explore os registros e encontre minhas orientações ao longo da página.', 'compact');
      return;
    }
    if (id === 'systems') {
      addAfter(content.querySelector('.cards'), 'systems-guide', 'Estes são os arquivos centrais do RPG. Cada cartão abre um sistema próprio; alguns se relacionam, mas cada um tem uma função diferente. Vou explicar os pontos importantes dentro dos próprios registros.', 'compact');
      addAfterIndex(content, '.cards', 0, 'systems-howto', 'Por exemplo: Chi explica a energia; Talentos explica as manifestações congênitas; Combate explica como as ações se resolvem. Para entender uma situação completa, normalmente precisamos consultar mais de um sistema.', 'compact');
      return;
    }
    if (id === 'combat') {
      addAfter(content.querySelector('.panel'), 'combat-intro-example', 'Exemplo prático: A tenta acertar B. B escolhe esquivar. Se o ataque tirar 9 e a esquiva 5, a diferença é 4: 40% do ataque ainda alcança B e 60% é evitado. É uma aplicação da tabela abaixo, não uma regra nova.', 'compact');
      wrapWithScene(content.querySelector('.no87-table'), 'combat-dodge-table', 'Leia esta tabela como uma comparação entre dois resultados: quanto maior a diferença a favor da esquiva, menor a parcela do ataque que acerta. Se a esquiva igualar ou superar o ataque, o ataque é evitado por completo.');
      addAfterIndex(content, '.no87-section', 1, 'combat-damage-example', 'Imagine que uma técnica tenha força de impacto e também uma propriedade especial. O dano bruto representa o impacto; o efeito é o que a técnica faz além de atingir. A defesa pode reduzir o impacto sem necessariamente apagar a propriedade.', 'compact');
      addAfterIndex(content, '.no87-section', 5, 'combat-perfect-example', 'Um resultado natural 10 no ataque ativa o Ataque Perfeito conforme o registro. Já o bônus de Técnica Máxima não transforma um resultado em 10: o resultado final continua limitado a 9.', 'compact');
      return;
    }
    if (id === 'chi') {
      addAfter(content.querySelector('.panel'), 'chi-intro-example', 'Ter Chi não significa saber utilizá-lo. Todos os seres vivos possuem Chi, mas pessoas comuns podem ter essa energia inativa. Percepção, controle e treinamento são etapas diferentes.', 'compact');
      addAfterIndex(content, '.rows', 0, 'chi-emission-example', 'Na prática, uma técnica simples e breve tende a exigir menos Chi do que uma manifestação complexa, potente ou mantida por muito tempo. O custo considera esses três fatores, não uma tarifa fixa para toda habilidade.', 'compact');
      addAfterIndex(content, '.rows', 1, 'chi-recovery-example', 'Se um personagem gastar energia demais, descansar e meditar são formas de recuperação. Continuar tentando executar técnicas durante a exaustão pode comprometer o controle e deixá-lo vulnerável.', 'compact');
      return;
    }
    if (id === 'talents') {
      addAfter(content.querySelector('.panel'), 'talents-intro', 'Antes de escolher uma manifestação, lembre-se: Talentos são congênitos. A classe descreve como a habilidade se manifesta; a especialização define seu campo de atuação.', 'compact');
      addAfterIndex(content, '.rows', 0, 'talents-class-example', 'Exemplo: se uma habilidade age diretamente no corpo do usuário, sua manifestação pode ser Corporal. Se influencia algo externo, pode ser Influência. A classificação depende do funcionamento real da habilidade, não apenas do nome escolhido.', 'compact');
      addAfter(content.querySelector('.special-grid'), 'talents-specialization-example', 'Uma especialização delimita o tipo de manifestação. Ela não elimina os limites do Talento nem dispensa controle, treinamento e coerência com a classe.', 'compact');
      addTalentTrio(content);
      return;
    }
    if (id === 'progression') {
      addAfter(content.querySelector('.panel'), 'progression-intro-example', 'Um personagem pode se desenvolver por caminhos diferentes: participar de uma missão, treinar ou contribuir em um evento são atividades distintas. A progressão não precisa ser uma sequência exclusiva de combates.', 'compact');
      addAfterIndex(content, '.rows', 0, 'progression-paths-example', 'Exemplo: um herói que participa de uma missão de proteção pode avançar por esse caminho; outro personagem pode optar por treinamento individual. A atividade precisa cumprir os critérios do registro e ser avaliada conforme as regras.', 'compact');
      addAfterIndex(content, '.rows', 1, 'progression-level-example', 'Não confunda nível com Rank. Nível representa progressão do personagem; Rank é uma classificação hierárquica com critérios próprios.', 'compact');
      return;
    }
    if (id === 'races') {
      addAfter(content.querySelector('.cards'), 'races-overview-example', 'As categorias não são apenas aparências diferentes. Elas têm características biológicas e limites próprios. A escolha deve combinar com a história e com as capacidades descritas na ficha.', 'compact');
      addAfterIndex(content, '.rows', 0, 'races-comparison-example', 'Como referência física do sistema, um Químio equivale aproximadamente a dez humanos e um Híbrido a cinco. Essa comparação não significa que toda característica seja multiplicada automaticamente.', 'compact');
      return;
    }
    if (id === 'honor') {
      addAfter(content.querySelector('.panel'), 'honor-karma-example', 'Honra e Karma não são duas escalas da mesma coisa. Uma registra ações positivas e reconhecimento; a outra registra condutas negativas relevantes e consequências. Uma pontuação não é convertida na outra.', 'compact');
      var honorTables = content.querySelectorAll('.tablebox');
      if (honorTables[0]) wrapWithScene(honorTables[0], 'honor-stars-table', 'As estrelas representam o grau de procura associado ao Karma. Consulte a tabela como classificação, não como uma recompensa por completar missões.');
      if (honorTables[1]) wrapWithScene(honorTables[1], 'honor-suits-table', 'Esta segunda tabela é diferente: mostra os requisitos de Honra para os trajes da Agência. Por isso, uma ficha pode ter Honra relevante para os trajes sem que isso reduza seu Karma.');
      return;
    }
    if (id === 'karma') {
      addAfter(content.querySelector('.panel'), 'karma-intro-example', 'Exemplo: uma ação criminosa de grande impacto pode ser avaliada pela Administração considerando gravidade, consequências e importância narrativa. Não é uma soma automática por repetir delitos pequenos.', 'compact');
      var karmaTable = content.querySelector('table');
      if (karmaTable) wrapWithScene(karmaTable, 'karma-stars-table', 'As estrelas dependem dos requisitos de nível e Karma indicados na tabela. Ter muitos pontos sem cumprir o nível mínimo não basta para alcançar a faixa seguinte.');
      addAfterIndex(content, '.rows', 0, 'karma-consequences-example', 'A classificação de procurado pode aparecer em notícias e registros da Lore. Ela representa notoriedade e investigação, não um bônus de poder para o personagem.', 'compact');
      return;
    }
    if (id === 'equipment') {
      addAfter(content.querySelector('.panel'), 'equipment-intro-example', 'Um equipamento não ganha uma capacidade só porque a descrição diz que ele é muito avançado. Materiais, mecanismos, funcionamento, Rank e condição precisam ser explicados e avaliados.', 'compact');
      addAfterIndex(content, '.rows', 0, 'equipment-condition-example', 'Rank e condição são critérios separados. Um item pode ter Rank alto e estar danificado, ou Rank baixo e estar em perfeito estado.', 'compact');
      return;
    }
    if (id === 'crafting') {
      addAfter(content.querySelector('.panel'), 'crafting-intro-example', 'Exemplo: um jogador pode propor uma ferramenta ou proteção, mas precisa explicar materiais, funcionamento, recursos e processo de fabricação. A proposta ainda passa pela avaliação prevista no sistema.', 'compact');
      addAfterIndex(content, '.rows', 0, 'crafting-materials-example', 'A escolha de materiais deve considerar propriedades e disponibilidade. Um material raro ou resistente não torna o projeto automaticamente aprovado nem elimina custos de produção.', 'compact');
      return;
    }
    if (id === 'economy') {
      addAfter(content.querySelector('.panel'), 'economy-intro-example', 'Os valores de referência ajudam a manter uma economia coerente. Eles não significam que todo personagem recebe automaticamente um salário: trabalho, atividade e registro precisam ser considerados.', 'compact');
      wrapWithScene(content.querySelector('.tablebox'), 'economy-reference-table', 'Use esta tabela para comparar valores de referência. Antes de comprar ou vender algo, considere o item concreto e as condições registradas, sem presumir um preço universal.');
      return;
    }
    if (id === 'organizations') {
      addAfter(content.querySelector('.panel'), 'organizations-intro-example', 'Uma organização não é apenas um nome ou uma bandeira. Observe sua origem, seus objetivos, sua escala de atuação e a forma como recruta ou se relaciona com os personagens.', 'compact');
      addAfterIndex(content, '.no87-section', 0, 'organization-order-example', 'A Ordem tem uma atuação institucional ampla e uma história ligada à resistência e à proteção. Um personagem pode se relacionar com a Agência sem que todo personagem do RPG seja obrigado a fazer parte dela.', 'compact');
      addAfterIndex(content, '.no87-section', 1, 'organization-lua-example', 'A Lua Sangrenta possui uma visão própria sobre a realidade e objetivos diferentes dos da Ordem. Ao interpretar um grupo, diferencie o que seus membros acreditam daquilo que a narrativa confirma como verdade.', 'compact');
      return;
    }
    if (id === 'missions') {
      addAfter(content.querySelector('.cards'), 'missions-types-example', 'Exemplo: uma missão de Salvação pode ter como objetivo proteger uma cidade; uma de Destruição pode ter como objetivo destruí-la. O tipo indica o objetivo narrativo, não garante o sucesso de quem participa.', 'compact');
      addAfter(content.querySelector('.callout'), 'missions-outcome-example', 'A conclusão depende das ações, da situação e da avaliação da missão. Participar não significa receber automaticamente o resultado desejado.', 'compact');
      return;
    }
    if (id === 'ranks') {
      addAfter(content.querySelector('.panel'), 'ranks-intro-example', 'Um personagem pode ter nível elevado sem ocupar automaticamente um Rank superior. Nível, patente e função respondem a critérios diferentes.', 'compact');
      addAfterIndex(content, '.rows', 0, 'ranks-hierarchy-example', 'Uma promoção não deve ser tratada como consequência automática de força. O registro considera requisitos e avaliação administrativa, além de vagas quando aplicável.', 'compact');
      return;
    }
    if (id === 'characters') {
      addAfter(content.querySelector('.panel'), 'characters-creation-example', 'O jogador define a origem, a história e a apresentação do personagem. A Administração não exige uma origem padronizada: avalia coerência com a Lore e equilíbrio da ficha.', 'compact');
      addAfterIndex(content, '.rows', 0, 'characters-review-example', 'Se uma ficha precisar de ajustes, a devolução deve explicar o que precisa ser revisto. Aprovação não significa que todos os personagens precisem seguir o mesmo caminho narrativo.', 'compact');
      return;
    }
    if (id === 'protocol') {
      addAfter(content.querySelector('.panel'), 'protocol-intro-example', 'O protocolo orienta a convivência e os procedimentos do RPG. Ele não substitui a leitura dos sistemas: uma regra de combate, por exemplo, continua sendo consultada no arquivo de Combate.', 'compact');
      addAfterIndex(content, '.rows', 0, 'protocol-question-example', 'Se surgir uma dúvida, indique o sistema e a situação concreta. Isso ajuda a Administração a distinguir uma dúvida de regra de uma decisão narrativa.', 'compact');
      return;
    }
    if (id === 'lore-thanatos') {
      addAfter(content.querySelector('.panel'), 'thanatos-peek', 'Este registro é delicado. Posso apresentar o que está documentado publicamente, mas certos dados permanecem reservados. Recomendo cautela ao explorar este arquivo.', 'peek');
      return;
    }
    if (id === 'lore') {
      addAfter(content.querySelector('.panel'), 'lore-archive-guide', 'Os arquivos públicos apresentam a história, as culturas e os registros conhecidos. Nem toda informação de bastidores é conhecimento que os personagens possuem dentro da narrativa.', 'compact');
      addAfter(content.querySelector('.cards'), 'lore-reading-example', 'Ao ler um acontecimento histórico, separe o fato registrado das interpretações de povos, organizações e personagens. Nem toda crença apresentada no mundo é necessariamente verdadeira.', 'compact');
      return;
    }
    var messages = {
      agency:'A Agência possui estrutura, procedimentos e responsabilidades próprias. A participação de um personagem não é obrigatória.',
      'lore-history':'Este arquivo reúne acontecimentos históricos conhecidos. Alguns eventos ajudam a compreender a formação da ordem atual.',
      'lore-pantheons':'As culturas e tradições possuem seus próprios registros. Não confunda referências mitológicas com as entidades originais da cosmologia da Nova Ordem.',
      'lore-progenitor':'Este registro possui caráter reservado. Nem toda informação deve ser interpretada como conhecimento público dos personagens.',
      'character-creation':'Revise cada etapa antes de enviar a ficha. As escolhas devem ser coerentes com o conceito do personagem e com as regras documentadas.',
      functions:'As ferramentas interativas apoiam atividades do jogador. Verifique o que cada função registra e se ela já está conectada ao banco de dados.',
      training:'Um registro de treinamento deve descrever a atividade realizada e o objetivo de desenvolvimento, sem presumir aprovação automática.',
      forge:'Uma proposta de Forja precisa explicar o projeto, os recursos e o funcionamento pretendido.',
      work:'O registro de Trabalho deve corresponder à ocupação e às condições previstas no sistema monetário.',
      admin:'Olá, administrador. Este painel reúne a avaliação de fichas e os registros necessários para analisar propostas dos jogadores.'
    };
    if (messages[id]) {
      var anchor = content.querySelector('.panel') || content.querySelector('.intro-lead') || content.firstElementChild;
      addAfter(anchor, 'page-' + id, messages[id], 'compact');
      var sections = content.querySelectorAll('.rows,.tablebox,.no87-section');
      if (sections.length > 1) addAfter(sections[1], 'page-' + id + '-detail', 'Consulte esta parte junto com a explicação anterior. Se algum detalhe não estiver definido no registro, não presuma um valor ou uma exceção: encaminhe a dúvida para a Administração.', 'compact');
    }
  }
  function enhance() {
    var content = document.getElementById('content');
    if (!content) return;
    var id = activeId();
    updateBackButton(id);
    placeScenes(content, id);
  }
  function initialize() {
    var content = document.getElementById('content');
    enhance();
    if (content && window.MutationObserver) {
      var observer = new MutationObserver(function () {
        window.clearTimeout(observer._arkTimer);
        observer._arkTimer = window.setTimeout(enhance, 30);
      });
      observer.observe(content, {childList:true,subtree:true});
    }
    if (window.go && !window.go.__arkSceneWrapped) {
      var previousGo = window.go;
      var wrappedGo = function () {
        var result = previousGo.apply(this, arguments);
        window.setTimeout(enhance, 0);
        return result;
      };
      wrappedGo.__arkSceneWrapped = true;
      window.go = wrappedGo;
    }
    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest ? event.target.closest('[data-go]') : null;
      if (target && target.getAttribute('data-go') && typeof window.go === 'function') {
        window.go(target.getAttribute('data-go'));
      }
    });
  }
  window.NovaOrdemARKScenes = {refresh:enhance};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();
})();