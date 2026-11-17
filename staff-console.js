/* NOVA ORDEM — Equipe, permissões e avaliações por seção */
(function () {
  'use strict';
  if (window.NovaOrdemStaffConsole) return;

  var cfg = window.NOVA_ORDEM_SUPABASE_CONFIG;
  var db = window.supabase && cfg && window.supabase.createClient
    ? window.supabase.createClient(cfg.url, cfg.anonKey)
    : null;
  var state = {
    access: { is_owner:false, roles:[], permissions:[] },
    userId: null,
    users: [], roles: [], permissions: [], audit: [], queue: [],
    busy: false, message: '', activeRoute: null
  };
  var statusLabels = {
    pending: 'Pendente',
    approved: 'Aprovada',
    needs_revision: 'Devolvida para revisão',
    not_applicable: 'Não se aplica'
  };
  var sectionLabels = {
    profile: 'Informações básicas',
    story: 'História e origem',
    powers: 'Talento e poderes'
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }
  function root() { return document.getElementById('content'); }
  function pagesRef() { return typeof pages !== 'undefined' ? pages : null; }
  function navRef() { return typeof navItems !== 'undefined' ? navItems : null; }
  function setMeta(id) {
    var registry = pagesRef();
    var meta = registry && registry[id];
    if (!meta) return;
    var crumb = document.getElementById('crumb');
    var title = document.getElementById('title');
    var desc = document.getElementById('desc');
    var code = document.getElementById('code');
    var hero = document.getElementById('hero');
    if (crumb) crumb.textContent = id === 'team' ? 'EQUIPE / CONTROLE DE ACESSO' : 'AGÊNCIA / ÁREA DE TRABALHO';
    if (title) title.textContent = meta.title;
    if (desc) desc.textContent = meta.desc;
    if (code) code.textContent = meta.code;
    if (hero) hero.style.display = 'none';
  }
  function renderNav() {
    var nav = document.getElementById('nav');
    var items = navRef();
    if (!nav || !items) return;
    var title = document.getElementById('title');
    var activeTitle = title ? title.textContent.trim() : '';
    nav.innerHTML = items.map(function (item) {
      var meta = pagesRef() && pagesRef()[item[0]];
      var active = meta && meta.title === activeTitle;
      return '<button type="button" class="' + (active ? 'active' : '') + '" data-id="' + esc(item[0]) + '">' + esc(item[1]) + '</button>';
    }).join('');
    nav.querySelectorAll('button[data-id]').forEach(function (button) {
      button.onclick = function () { if (window.go) window.go(button.dataset.id); };
    });
  }
  function setNavItem(id, label, enabled) {
    var items = navRef();
    if (!items) return;
    var index = items.findIndex(function (item) { return item[0] === id; });
    if (enabled && index < 0) items.push([id, label]);
    if (!enabled && index >= 0) items.splice(index, 1);
  }
  function callArk(question) {
    if (!window.NovaOrdemARK) return;
    var panel = document.getElementById('ark-panel');
    if (!panel || !panel.classList.contains('ark-open')) window.NovaOrdemARK.open();
    window.NovaOrdemARK.ask(question);
  }
  function messageHtml() {
    return state.message ? '<div class="no-staff-message" role="status">' + esc(state.message) + '</div>' : '';
  }
  function statusBadge(status) {
    var color = status === 'approved' ? 'good' : status === 'needs_revision' ? 'bad' : status === 'not_applicable' ? 'neutral' : 'wait';
    return '<span class="no-staff-status no-staff-status--' + color + '">' + esc(statusLabels[status] || status || 'Pendente') + '</span>';
  }
  function arkIntro(title, message, question) {
    return '<section class="no-staff-ark"><div><small>A.R.K. · GUIA DA SUA FUNÇÃO</small><h3>' + esc(title) + '</h3><p>' + esc(message) + '</p></div><button type="button" data-staff-ark="' + esc(question) + '">CONSULTAR A.R.K.</button></section>';
  }
  function installStyles() {
    if (document.getElementById('no-staff-styles')) return;
    var style = document.createElement('style');
    style.id = 'no-staff-styles';
    style.textContent = [
      '.no-staff-shell{display:grid;gap:16px;color:#e8f1fc}',
      '.no-staff-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:20px;border:1px solid #29445d;border-radius:10px;background:linear-gradient(125deg,#13283b,#0b1420)}',
      '.no-staff-head h2{margin:7px 0;font:700 25px var(--display,Arial)}.no-staff-head p{margin:0;color:#a9bfd2;font-size:12px;line-height:1.65}',
      '.no-staff-kicker,.no-staff-ark small{font:9px var(--mono,monospace);letter-spacing:1px;color:#83c9ff}',
      '.no-staff-panel{padding:16px;border:1px solid #263c52;border-radius:9px;background:#0c1724;display:grid;gap:12px}',
      '.no-staff-panel h3{margin:0;font:700 16px var(--display,Arial)}.no-staff-muted{color:#91a8bb;font-size:12px;line-height:1.6}',
      '.no-staff-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
      '.no-staff-field{display:grid;gap:5px}.no-staff-field label{font:10px var(--mono,monospace);color:#9cc9e7;text-transform:uppercase}.no-staff-field input,.no-staff-field select,.no-staff-field textarea{width:100%;box-sizing:border-box;border:1px solid #36516b;border-radius:6px;background:#07111c;color:#eaf5ff;padding:10px;font:12px inherit}',
      '.no-staff-actions{display:flex;flex-wrap:wrap;gap:8px}.no-staff-shell button{border:1px solid #42617e;border-radius:6px;background:#152b40;color:#eaf5ff;padding:9px 12px;font:10px var(--mono,monospace);cursor:pointer}.no-staff-shell button:disabled{opacity:.45;cursor:not-allowed}.no-staff-primary{background:#1b4a68!important;border-color:#4d8bb4!important}',
      '.no-staff-list{display:grid;gap:9px}.no-staff-row{display:grid;gap:9px;padding:13px;border:1px solid #263c52;border-radius:8px;background:#0a1521}.no-staff-row-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.no-staff-row small{color:#91a8bb;font-size:10px}.no-staff-tags{display:flex;flex-wrap:wrap;gap:6px}.no-staff-tag{border:1px solid #35516a;border-radius:20px;padding:4px 8px;color:#b9d7ed;font-size:10px}',
      '.no-staff-status{display:inline-flex;border-radius:20px;padding:4px 8px;font:9px var(--mono,monospace);white-space:nowrap}.no-staff-status--good{background:#123b2d;color:#8de0b3}.no-staff-status--bad{background:#492323;color:#ffaaaa}.no-staff-status--wait{background:#453817;color:#f3d58a}.no-staff-status--neutral{background:#273544;color:#b4c4d2}',
      '.no-staff-ark{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:15px;border:1px solid #315a78;border-radius:9px;background:linear-gradient(110deg,#102b40,#101b2a)}.no-staff-ark h3{margin:5px 0;font-size:15px}.no-staff-ark p{margin:0;color:#a9bfd2;font-size:11px;line-height:1.6}',
      '.no-staff-message{padding:10px 12px;border:1px solid #42617e;border-radius:7px;background:#10273a;color:#c9e7fb;font-size:12px}',
      '.no-staff-data{display:grid;gap:7px}.no-staff-data p{margin:0;font-size:12px;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere}.no-staff-data b{color:#9fcdf0}',
      '.no-staff-checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.no-staff-check{display:flex;gap:8px;align-items:flex-start;padding:9px;border:1px solid #2a4359;border-radius:6px;color:#c6d7e5;font-size:11px}',
      '.no-review-owner-status{display:grid;gap:6px;padding:10px;margin-top:9px;border:1px solid #2b4962;border-radius:7px;background:#0a1724}.no-review-owner-status b{font-size:11px}.no-review-owner-status p{margin:0;color:#a8bfd2;font-size:11px;line-height:1.5}',
      '.no-review-lock-banner{margin:0 0 12px;padding:11px 13px;border:1px solid #45617a;border-radius:7px;background:#102337;color:#c4e2f8;font-size:11px;line-height:1.6}',
      '.no-review-locked{opacity:.55!important;filter:saturate(.5)}',
      '@media(max-width:650px){.no-staff-grid,.no-staff-checks{grid-template-columns:1fr}.no-staff-head,.no-staff-ark{flex-direction:column;align-items:stretch}.no-staff-row-head{flex-direction:column}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  async function updateAccess() {
    if (!db) return;
    try {
      var auth = await db.auth.getUser();
      state.userId = auth.data && auth.data.user ? auth.data.user.id : null;
      if (!state.userId) {
        state.access = {is_owner:false,roles:[],permissions:[]};
        setNavItem('team','♙ Equipe e Permissões',false);
        setNavItem('staff-workbench','▣ Área de Trabalho',false);
        renderNav();
        return;
      }
      var result = await db.rpc('get_my_staff_access');
      if (result.error) throw result.error;
      state.access = result.data || {is_owner:false,roles:[],permissions:[]};
      var hasRoles = Array.isArray(state.access.roles) && state.access.roles.length > 0;
      setNavItem('team','♙ Equipe e Permissões',!!state.access.is_owner);
      setNavItem('staff-workbench','▣ Área de Trabalho',!!state.access.is_owner || hasRoles);
      renderNav();
      if (!state.access.is_owner && !hasRoles && (state.activeRoute === 'team' || state.activeRoute === 'staff-workbench')) {
        state.activeRoute = null;
        if (window.go) window.go('profile');
      }
    } catch (error) {
      console.warn('[Nova Ordem] Falha ao consultar cargos e permissões:', error);
    }
  }

  function setRoute(id) {
    state.activeRoute = id;
    setMeta(id);
    renderNav();
  }

  async function renderTeamPage() {
    var el = root();
    if (!el) return;
    if (!state.access.is_owner) {
      el.innerHTML = '<section class="no-staff-panel"><h3>Acesso restrito</h3><p class="no-staff-muted">Somente o Administrador Principal pode administrar cargos e permissões.</p></section>';
      return;
    }
    el.innerHTML = '<section class="no-staff-shell"><p class="no-staff-muted">Carregando equipe, cargos e histórico...</p></section>';
    var results = await Promise.all([
      db.rpc('list_staff_management'),
      db.rpc('list_staff_role_catalog'),
      db.rpc('list_staff_permission_catalog'),
      db.rpc('list_staff_audit_log', {p_limit:60})
    ]);
    var failed = results.find(function (r) { return r.error; });
    if (failed) {
      el.innerHTML = '<section class="no-staff-panel"><h3>Não foi possível carregar a equipe</h3><p class="no-staff-muted">' + esc(failed.error.message) + '</p><button type="button" data-staff-refresh> TENTAR NOVAMENTE </button></section>';
      return;
    }
    state.users = results[0].data || [];
    state.roles = results[1].data || [];
    state.permissions = results[2].data || [];
    state.audit = results[3].data || [];
    if (state.activeRoute !== 'team' || root() !== el) return;

    var accountOptions = state.users.filter(function (user) { return user.user_id !== state.userId; }).map(function (user) {
      return '<option value="' + esc(user.user_id) + '">' + esc(user.display_name || user.email) + ' · ' + esc(user.email) + '</option>';
    }).join('');
    var roleOptions = state.roles.map(function (role) {
      return '<option value="' + esc(role.role_code) + '">' + esc(role.label) + '</option>';
    }).join('');
    var teamRows = state.users.map(function (user) {
      var isOwner = user.user_id === state.userId;
      var roles = Array.isArray(user.roles) ? user.roles : [];
      var roleTags = roles.length ? roles.map(function (role) {
        return '<span class="no-staff-tag">' + esc(role.label) + '</span>';
      }).join('') : '<span class="no-staff-muted">Sem cargo delegado</span>';
      var actions = roles.length && !isOwner ? roles.map(function (role) {
        return '<button type="button" data-staff-revoke="' + esc(role.assignment_id) + '">REVOGAR ' + esc(role.label).toUpperCase() + '</button>';
      }).join('') : '';
      return '<article class="no-staff-row"><div class="no-staff-row-head"><div><b>' + esc(user.display_name || user.email) + '</b><br><small>' + esc(user.email) + (isOwner ? ' · ADMINISTRADOR PRINCIPAL' : '') + '</small></div>' + (isOwner ? '<span class="no-staff-status no-staff-status--good">PROPRIETÁRIO</span>' : '') + '</div><div class="no-staff-tags">' + roleTags + '</div><div class="no-staff-actions">' + actions + '</div></article>';
    }).join('');
    var roleCards = state.roles.map(function (role) {
      var perms = Array.isArray(role.permissions) ? role.permissions : [];
      return '<article class="no-staff-row"><div class="no-staff-row-head"><div><b>' + esc(role.label) + '</b><br><small>' + esc(role.description) + '</small></div><span class="no-staff-tag">' + (role.is_system ? 'CARGO PADRÃO' : 'PERSONALIZADO') + '</span></div><div class="no-staff-tags">' + perms.map(function (permission) { return '<span class="no-staff-tag">' + esc(permission) + '</span>'; }).join('') + '</div></article>';
    }).join('');
    var permissionChecks = state.permissions.map(function (permission) {
      return '<label class="no-staff-check"><input type="checkbox" data-staff-permission value="' + esc(permission.permission_code) + '"><span><b>' + esc(permission.permission_code) + '</b><br>' + esc(permission.description) + '</span></label>';
    }).join('');
    var auditRows = state.audit.length ? state.audit.map(function (entry) {
      return '<article class="no-staff-row"><div class="no-staff-row-head"><b>' + esc(entry.action) + '</b><small>' + esc(entry.created_at ? new Date(entry.created_at).toLocaleString('pt-BR') : '') + '</small></div><p class="no-staff-muted">' + esc(entry.actor_name || 'Sistema') + (entry.target_name ? ' → ' + esc(entry.target_name) : '') + (entry.role_label ? ' · ' + esc(entry.role_label) : '') + '</p></article>';
    }).join('') : '<p class="no-staff-muted">Nenhuma alteração registrada ainda.</p>';

    el.innerHTML = '<section class="no-staff-shell">' +
      '<header class="no-staff-head"><div><span class="no-staff-kicker">AGÊNCIA A ORDEM · CONTROLE DE ACESSO</span><h2>Equipe e Permissões</h2><p>Somente você, como Administrador Principal, pode conceder e revogar cargos. Os colaboradores recebem apenas as permissões vinculadas às suas funções.</p></div><button type="button" data-staff-refresh>ATUALIZAR</button></header>' +
      messageHtml() +
      '<section class="no-staff-panel"><h3>Conceder um cargo</h3><div class="no-staff-grid"><div class="no-staff-field"><label>Conta do colaborador</label><select id="no-staff-user"><option value="">Selecione uma conta</option>' + accountOptions + '</select></div><div class="no-staff-field"><label>Cargo</label><select id="no-staff-role"><option value="">Selecione um cargo</option>' + roleOptions + '</select></div></div><div class="no-staff-actions"><button type="button" class="no-staff-primary" data-staff-assign>CONCEDER CARGO</button></div></section>' +
      '<section class="no-staff-panel"><h3>Equipe atual</h3><div class="no-staff-list">' + teamRows + '</div></section>' +
      '<section class="no-staff-panel"><h3>Cargos cadastrados</h3><div class="no-staff-list">' + roleCards + '</div></section>' +
      '<section class="no-staff-panel"><h3>Criar um cargo personalizado</h3><p class="no-staff-muted">Você pode combinar permissões existentes para preparar novas funções. Nenhum cargo personalizado recebe poderes de Administrador Principal.</p><div class="no-staff-grid"><div class="no-staff-field"><label>Código interno</label><input id="no-staff-new-code" maxlength="48" placeholder="exemplo: revisor_eventos"></div><div class="no-staff-field"><label>Nome do cargo</label><input id="no-staff-new-label" maxlength="80" placeholder="Nome exibido no site"></div></div><div class="no-staff-field"><label>Descrição</label><textarea id="no-staff-new-description" rows="2" maxlength="300"></textarea></div><div class="no-staff-checks">' + permissionChecks + '</div><div class="no-staff-actions"><button type="button" class="no-staff-primary" data-staff-create-role>CRIAR CARGO</button></div></section>' +
      '<section class="no-staff-panel"><h3>Histórico de alterações</h3><div class="no-staff-list">' + auditRows + '</div></section>' +
      arkIntro('Controle exclusivo do Administrador Principal', 'A.R.K. pode explicar a estrutura de cargos e as permissões disponíveis. A atribuição e a revogação continuam sob seu controle exclusivo.', 'Explique como funciona o painel Equipe e Permissões da Nova Ordem, incluindo a diferença entre os cargos delegados e o Administrador Principal.') +
      '</section>';
  }

  function dataMarkup(item) {
    var data = item.section_data || {};
    if (item.section_key === 'profile') {
      var fields = [
        ['Nome',data.name],['Idade',data.age],['Gênero',data.gender],
        ['Altura (cm)',data.height_cm],['Peso (kg)',data.weight_kg],
        ['Raça',data.race],['Reserva de Chi',data.chi_reserve],
        ['Habilidades comuns',Array.isArray(data.common_skills) ? data.common_skills.join(', ') : ''],
        ['Profissão',data.occupation && data.occupation !== 'null' ? data.occupation : ''],
        ['Personalidade',data.personality],['Aparência',data.appearance]
      ];
      return '<div class="no-staff-data">' + fields.map(function (field) {
        return '<p><b>' + esc(field[0]) + ':</b> ' + esc(field[1] == null ? 'Não informado' : field[1]) + '</p>';
      }).join('') + '</div>';
    }
    if (item.section_key === 'story') {
      return '<div class="no-staff-data"><p>' + esc(data.backstory || 'História não informada.') + '</p></div>';
    }
    var modules = Array.isArray(data.cybernetic_modules) ? data.cybernetic_modules : [];
    return '<div class="no-staff-data">' +
      '<p><b>Raça:</b> ' + esc(data.race || 'Não informada') + '</p>' +
      '<p><b>Raridade:</b> ' + esc(data.talent_rarity || 'Não se aplica') + '</p>' +
      '<p><b>Especializações:</b> ' + esc(Array.isArray(data.specializations) ? data.specializations.join(', ') : 'Nenhuma') + '</p>' +
      '<p><b>Habilidades sobrenaturais:</b> ' + esc(Array.isArray(data.supernatural_skills) ? data.supernatural_skills.join(', ') : 'Nenhuma') + '</p>' +
      '<p><b>Descrição do Talento:</b> ' + esc(data.talent_description || 'Não informada') + '</p>' +
      (modules.length ? modules.map(function (module, index) { return '<p><b>Módulo ' + (index+1) + ' — ' + esc(module.name || '') + ':</b> ' + esc(module.description || '') + '</p>'; }).join('') : '') +
      '</div>';
  }

  function roleGreeting() {
    var roles = Array.isArray(state.access.roles) ? state.access.roles : [];
    var codes = roles.map(function (role) { return role.code; });
    if (codes.indexOf('avaliador_fichas') >= 0) return {
      title:'Orientação do Avaliador de Fichas',
      message:'Você recebe informações básicas e histórias para análise. A história pode ser pessoal e independente da trama principal; avalie a coerência com o universo e as regras, sem exigir que o personagem altere a Lore central.',
      question:'Sou Avaliador de Fichas da Nova Ordem. Explique minhas responsabilidades ao analisar informações básicas e histórias pessoais, incluindo o que não devo exigir do jogador.'
    };
    if (codes.indexOf('balanceador') >= 0) return {
      title:'Orientação do Balanceador',
      message:'Você recebe Talentos, habilidades sobrenaturais e módulos cibernéticos. Observe capacidades, aplicações, limitações e fraquezas. Registre problemas concretos e proponha ajustes negociáveis com o jogador.',
      question:'Sou Balanceador da Nova Ordem. Explique como analisar Talentos, habilidades, capacidades, aplicações, limitações e fraquezas, buscando ajustes equilibrados com o jogador.'
    };
    if (codes.indexOf('moderador') >= 0) return {
      title:'Orientação do Moderador',
      message:'Sua função é apoiar a convivência da comunidade. As ferramentas específicas de moderação serão conectadas nesta área em uma etapa própria.',
      question:'Sou Moderador da Nova Ordem. Explique minhas responsabilidades e os cuidados que devo ter ao lidar com conflitos entre jogadores.'
    };
    if (codes.indexOf('organizador') >= 0) return {
      title:'Orientação do Organizador',
      message:'Sua função é organizar eventos, missões e treinamentos. As ferramentas de cadastro e acompanhamento serão conectadas nesta área em uma etapa própria.',
      question:'Sou Organizador de Eventos e Missões da Nova Ordem. Explique como devo organizar atividades sem ultrapassar minhas permissões.'
    };
    return {
      title:'Área de trabalho da Agência',
      message:'Esta área reúne as tarefas correspondentes às permissões da sua conta. Consulte as orientações antes de registrar uma decisão.',
      question:'Explique as funções e permissões da minha conta na Nova Ordem.'
    };
  }

  async function renderWorkbench() {
    var el = root();
    if (!el) return;
    var hasRole = state.access.is_owner || (Array.isArray(state.access.roles) && state.access.roles.length);
    if (!hasRole) {
      el.innerHTML = '<section class="no-staff-panel"><h3>Acesso restrito</h3><p class="no-staff-muted">Sua conta não possui um cargo delegado.</p></section>';
      return;
    }
    el.innerHTML = '<section class="no-staff-shell"><p class="no-staff-muted">Carregando tarefas autorizadas...</p></section>';
    var result = await db.rpc('get_character_review_queue');
    if (result.error) {
      el.innerHTML = '<section class="no-staff-panel"><h3>Falha ao carregar tarefas</h3><p class="no-staff-muted">' + esc(result.error.message) + '</p><button type="button" data-staff-refresh>ATUALIZAR</button></section>';
      return;
    }
    state.queue = result.data || [];
    if (state.activeRoute !== 'staff-workbench' || root() !== el) return;
    var guide = roleGreeting();
    var queueHtml = state.queue.length ? state.queue.map(function (item, index) {
      var noteId = 'no-staff-note-' + index;
      return '<article class="no-staff-row"><div class="no-staff-row-head"><div><b>' + esc(item.character_name) + '</b><br><small>' + esc(item.player_name) + ' · ' + esc(item.section_label) + '</small></div>' + statusBadge(item.section_status) + '</div>' +
        dataMarkup(item) +
        '<div class="no-staff-field"><label>Orientação ao jogador (obrigatória ao devolver)</label><textarea id="' + noteId + '" rows="3" maxlength="2000" placeholder="Explique o que precisa ser ajustado ou deixe uma observação ao aprovar."></textarea></div>' +
        '<div class="no-staff-actions"><button type="button" class="no-staff-primary" data-review-decision="approved" data-review-character="' + esc(item.character_id) + '" data-review-section="' + esc(item.section_key) + '" data-review-note="' + noteId + '">APROVAR SEÇÃO</button><button type="button" data-review-decision="needs_revision" data-review-character="' + esc(item.character_id) + '" data-review-section="' + esc(item.section_key) + '" data-review-note="' + noteId + '">DEVOLVER PARA REVISÃO</button></div></article>';
    }).join('') : '<div class="no-staff-row"><p class="no-staff-muted">Nenhuma seção está aguardando sua avaliação neste momento.</p></div>';
    var roles = (state.access.roles || []).map(function (role) { return '<span class="no-staff-tag">' + esc(role.label) + '</span>'; }).join('');
    el.innerHTML = '<section class="no-staff-shell">' +
      '<header class="no-staff-head"><div><span class="no-staff-kicker">AGÊNCIA A ORDEM · ESTAÇÃO DE TRABALHO</span><h2>Área de Trabalho</h2><p>As tarefas exibidas aqui são filtradas pelas permissões da sua conta. Você não recebe acesso à ficha completa quando sua função exige apenas uma seção.</p><div class="no-staff-tags">' + (roles || '<span class="no-staff-tag">Administrador Principal</span>') + '</div></div><button type="button" data-staff-refresh>ATUALIZAR</button></header>' +
      messageHtml() +
      arkIntro(guide.title, guide.message, guide.question) +
      '<section class="no-staff-panel"><h3>Fila de avaliações</h3><div class="no-staff-list">' + queueHtml + '</div></section>' +
      '</section>';
  }

  async function refreshCurrentRoute() {
    if (state.activeRoute === 'team') return renderTeamPage();
    if (state.activeRoute === 'staff-workbench') return renderWorkbench();
  }

  async function handleClick(event) {
    var target = event.target && event.target.closest ? event.target.closest('button') : null;
    if (!target) return;
    if (target.hasAttribute('data-staff-refresh')) {
      state.message = '';
      await updateAccess();
      await refreshCurrentRoute();
      return;
    }
    var ask = target.getAttribute('data-staff-ark');
    if (ask) { callArk(ask); return; }

    if (target.hasAttribute('data-staff-assign')) {
      var user = document.getElementById('no-staff-user');
      var role = document.getElementById('no-staff-role');
      if (!user || !user.value || !role || !role.value) { state.message = 'Selecione uma conta e um cargo.'; await renderTeamPage(); return; }
      target.disabled = true;
      var assigned = await db.rpc('assign_staff_role', {p_user_id:user.value, p_role_code:role.value});
      if (assigned.error) state.message = assigned.error.message;
      else state.message = 'Cargo concedido. As permissões já estão registradas no banco.';
      await renderTeamPage();
      return;
    }

    var revoke = target.getAttribute('data-staff-revoke');
    if (revoke) {
      if (!window.confirm('Confirma a revogação deste cargo?')) return;
      target.disabled = true;
      var revoked = await db.rpc('revoke_staff_role', {p_assignment_id:revoke});
      if (revoked.error) state.message = revoked.error.message;
      else state.message = 'Cargo revogado. O acesso correspondente foi retirado.';
      await renderTeamPage();
      return;
    }

    if (target.hasAttribute('data-staff-create-role')) {
      var code = document.getElementById('no-staff-new-code');
      var label = document.getElementById('no-staff-new-label');
      var description = document.getElementById('no-staff-new-description');
      var permissions = Array.prototype.slice.call(document.querySelectorAll('[data-staff-permission]:checked')).map(function (input) { return input.value; });
      if (!code || !label || !label.value.trim() || !permissions.length) {
        state.message = 'Informe o código, o nome e selecione ao menos uma permissão.';
        await renderTeamPage();
        return;
      }
      target.disabled = true;
      var created = await db.rpc('create_staff_role', {
        p_code:code.value.trim(),
        p_label:label.value.trim(),
        p_description:description ? description.value.trim() : '',
        p_permissions:permissions
      });
      if (created.error) state.message = created.error.message;
      else state.message = 'Cargo personalizado criado com sucesso.';
      await renderTeamPage();
      return;
    }

    var decision = target.getAttribute('data-review-decision');
    if (decision) {
      var characterId = target.getAttribute('data-review-character');
      var section = target.getAttribute('data-review-section');
      var noteId = target.getAttribute('data-review-note');
      var note = document.getElementById(noteId);
      var noteValue = note ? note.value.trim() : '';
      if (decision === 'needs_revision' && !noteValue) {
        state.message = 'Escreva uma orientação antes de devolver a seção.';
        await renderWorkbench();
        return;
      }
      if (decision === 'approved' && !window.confirm('Confirma a aprovação desta seção?')) return;
      target.disabled = true;
      var saved = await db.rpc('decide_character_section', {
        p_character_id:characterId,
        p_section_key:section,
        p_decision:decision,
        p_note:noteValue || null
      });
      if (saved.error) state.message = saved.error.message;
      else state.message = decision === 'approved' ? 'Seção aprovada.' : 'Seção devolvida para revisão. As demais avaliações continuam independentes.';
      await renderWorkbench();
    }
  }

  function statusBlock(title, row) {
    var status = row ? row.status : 'pending';
    var note = row && row.note ? '<p>' + esc(row.note) + '</p>' : '';
    var reviewer = row && row.reviewer_name ? '<p>Responsável: ' + esc(row.reviewer_name) + (row.reviewed_at ? ' · ' + esc(new Date(row.reviewed_at).toLocaleString('pt-BR')) : '') + '</p>' : '';
    return '<div class="no-review-owner-status"><div><b>' + esc(title) + '</b> ' + statusBadge(status) + '</div>' + reviewer + note + '</div>';
  }

  var detailObserver = null;
  var detailBusy = new Set();
  async function enhanceAdminDetails() {
    if (!db) return;
    var details = document.querySelectorAll('.no-admin-detail[data-character-id]');
    for (var i = 0; i < details.length; i++) {
      var detail = details[i];
      var id = detail.getAttribute('data-character-id');
      if (!id || detail.dataset.sectionReviewsLoaded === id || detailBusy.has(id)) continue;
      detailBusy.add(id);
      try {
        var result = await db.rpc('get_my_character_review_status', {p_character_id:id});
        if (result.error) throw result.error;
        if (!detail.isConnected) continue;
        var rows = result.data || [];
        var map = {};
        rows.forEach(function (row) { map[row.section_key] = row; });
        var grid = detail.querySelector('.no-admin-detail-grid');
        if (grid && !detail.querySelector('[data-owner-section-status="profile"]')) {
          grid.insertAdjacentHTML('afterend', '<div data-owner-section-status="profile">' + statusBlock('Informações básicas', map.profile) + '</div>');
        }
        var sections = detail.querySelectorAll('.no-admin-detail-section');
        sections.forEach(function (section) {
          var heading = section.querySelector('h4');
          if (!heading) return;
          var title = heading.textContent.trim();
          if (title.indexOf('História') >= 0 && !section.querySelector('[data-owner-section-status="story"]')) {
            section.insertAdjacentHTML('beforeend', '<div data-owner-section-status="story">' + statusBlock('História e origem', map.story) + '</div>');
          }
          if (title.indexOf('Módulos cibernéticos') >= 0 && !section.querySelector('[data-owner-section-status="powers"]')) {
            section.insertAdjacentHTML('beforeend', '<div data-owner-section-status="powers">' + statusBlock('Talento e poderes', map.powers) + '</div>');
          }
        });
        var finalButton = detail.querySelector('[data-admin-approve]');
        var allDone = ['profile','story','powers'].every(function (key) {
          return map[key] && (map[key].status === 'approved' || map[key].status === 'not_applicable');
        });
        if (finalButton) {
          finalButton.disabled = !allDone;
          finalButton.title = allDone ? 'Todas as seções foram aprovadas. Você pode decidir a aprovação final.' : 'A aprovação final fica disponível quando todas as seções estiverem aprovadas ou marcadas como não aplicáveis.';
        }
        detail.dataset.sectionReviewsLoaded = id;
      } catch (error) {
        console.warn('[Nova Ordem] Não foi possível carregar os estados das seções:', error);
      } finally {
        detailBusy.delete(id);
      }
    }
  }

  function installDetailObserver() {
    var content = root();
    if (!content || !window.MutationObserver || detailObserver) return;
    detailObserver = new MutationObserver(function () {
      window.clearTimeout(detailObserver._timer);
      detailObserver._timer = window.setTimeout(enhanceAdminDetails, 60);
    });
    detailObserver.observe(content, {childList:true,subtree:true});
    enhanceAdminDetails();
  }

  function installRoutes() {
    var registry = pagesRef();
    if (registry) {
      registry.team = {title:'Equipe e Permissões',desc:'Gerencie os cargos delegados e os acessos da equipe.',code:'AGÊNCIA / EQUIPE E PERMISSÕES'};
      registry['staff-workbench'] = {title:'Área de Trabalho',desc:'Tarefas e avaliações autorizadas para sua função.',code:'AGÊNCIA / ESTAÇÃO DE TRABALHO'};
    }
    setNavItem('team','♙ Equipe e Permissões',false);
    setNavItem('staff-workbench','▣ Área de Trabalho',false);

    if (window.go && !window.go.__staffConsoleWrapped) {
      var previousGo = window.go;
      var wrappedGo = function (id, fromHistory) {
        if (id === 'team' || id === 'staff-workbench') {
          previousGo.call(this, 'overview', fromHistory);
          setRoute(id);
          if (id === 'team') renderTeamPage();
          else renderWorkbench();
          return;
        }
        return previousGo.apply(this, arguments);
      };
      wrappedGo.__staffConsoleWrapped = true;
      window.go = wrappedGo;
    }
    renderNav();
  }

  window.NovaOrdemStaffConsole = {
    refresh: updateAccess,
    openTeam: function () { if (window.go) window.go('team'); },
    openWorkbench: function () { if (window.go) window.go('staff-workbench'); },
    getAccess: function () { return state.access; }
  };

  installStyles();
  installRoutes();
  document.addEventListener('click', function (event) { handleClick(event).catch(function (error) {
    state.message = error && error.message ? error.message : 'Ocorreu uma falha inesperada.';
    refreshCurrentRoute();
  }); });
  if (db && db.auth && db.auth.onAuthStateChange) {
    db.auth.onAuthStateChange(function () { Promise.resolve().then(updateAccess); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      updateAccess();
      installDetailObserver();
    }, {once:true});
  } else {
    updateAccess();
    installDetailObserver();
  }

  window.NovaOrdemCharacterReview = {
    setContext: function (status, reviews) {
      reviewContext.status = status || 'draft';
      reviewContext.reviews = Array.isArray(reviews) ? reviews : [];
      applyReviewLocks();
    },
    clearContext: function () {
      reviewContext = {status:'draft',reviews:[]};
      applyReviewLocks();
    },
    applyLocks: applyReviewLocks
  };

  var reviewContext = {status:'draft',reviews:[]};
  function applyReviewLocks() {
    var el = root();
    if (!el || !el.querySelector('.cc-card')) return;
    var map = {};
    reviewContext.reviews.forEach(function (row) { map[row.section_key] = row.status; });
    if (reviewContext.status !== 'rejected') return;

    var locked = {
      profile: map.profile === 'approved',
      story: map.story === 'approved',
      powers: map.powers === 'approved' || map.powers === 'not_applicable'
    };
    var fieldSections = {
      name:'profile', age:'profile', height:'profile', gender:'profile', weight:'profile',
      skills:'profile', occupation:'profile', personality:'profile', appearance:'profile',
      history:'story', supernatural:'powers', talentDescription:'powers'
    };
    Object.keys(fieldSections).forEach(function (field) {
      var input = el.querySelector('[data-cc-field="' + field + '"]');
      if (input) {
        input.disabled = !!locked[fieldSections[field]];
        input.classList.toggle('no-review-locked', !!locked[fieldSections[field]]);
        if (locked[fieldSections[field]]) input.title = 'Esta parte já foi aprovada e está bloqueada.';
      }
    });
    el.querySelectorAll('[data-cc-module-field],[data-cc-spec]').forEach(function (input) {
      input.disabled = !!locked.powers;
      input.classList.toggle('no-review-locked', !!locked.powers);
      if (locked.powers) input.title = 'Os poderes já foram aprovados e estão bloqueados.';
    });
    ['race-roll','race-pick','second-roll'].forEach(function (action) {
      el.querySelectorAll('[data-cc-action="' + action + '"]').forEach(function (button) {
        button.disabled = !!locked.profile;
        if (locked.profile) button.title = 'As informações básicas já foram aprovadas e estão bloqueadas.';
      });
    });
    ['rarity-roll','cybernetic-module-add','cybernetic-module-remove'].forEach(function (action) {
      el.querySelectorAll('[data-cc-action="' + action + '"]').forEach(function (button) {
        button.disabled = !!locked.powers;
        if (locked.powers) button.title = 'Os poderes já foram aprovados e estão bloqueados.';
      });
    });
    var card = el.querySelector('.cc-card');
    if (card && !el.querySelector('.no-review-lock-banner')) {
      var banner = document.createElement('div');
      banner.className = 'no-review-lock-banner';
      banner.textContent = 'Revisão parcial: as seções aprovadas estão bloqueadas. Você pode editar somente as partes que ainda não foram aprovadas ou que foram devolvidas. As alterações são verificadas novamente pelo banco de dados.';
      card.parentNode.insertBefore(banner, card);
    }
  }

  if (window.NovaOrdemCharacterCreator && !window.NovaOrdemCharacterCreator.__reviewLockWrapped) {
    var creator = window.NovaOrdemCharacterCreator;
    var originalUpdate = creator.update.bind(creator);
    var originalRender = creator.render.bind(creator);
    creator.update = function () { var result = originalUpdate.apply(null, arguments); applyReviewLocks(); return result; };
    creator.render = function () { var result = originalRender.apply(null, arguments); applyReviewLocks(); return result; };
    creator.__reviewLockWrapped = true;
  }
  if (root() && window.MutationObserver) {
    var lockObserver = new MutationObserver(function () { applyReviewLocks(); });
    lockObserver.observe(root(), {childList:true,subtree:true});
  }
  window.dispatchEvent(new Event('nova-ordem-review-ready'));
})();