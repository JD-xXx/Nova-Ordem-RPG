/* NOVA ORDEM — Administração protegida + orientação contextual do A.R.K. */
(function () {
  'use strict';
  if (window.NovaOrdemAdmin) return;

  var cfg = window.NOVA_ORDEM_SUPABASE_CONFIG;
  var db = window.supabase && cfg && window.supabase.createClient
    ? window.supabase.createClient(cfg.url, cfg.anonKey)
    : null;
  var contentRoot = function () { return document.getElementById('content'); };
  var state = { rows: [], profiles: {}, filter: 'submitted', search: '', selected: null, message: '', busy: false, isAdmin: false, counts: {draft:0,submitted:0,approved:0,rejected:0}, rolls: [], history: [], detailLoading: false };
  var statusLabels = {
    draft: 'Rascunho',
    submitted: 'Aguardando análise',
    approved: 'Aprovada',
    rejected: 'Devolvida para ajustes'
  };
  var filters = [
    ['submitted','Aguardando análise'],
    ['draft','Rascunhos'],
    ['approved','Aprovadas'],
    ['rejected','Devolvidas'],
    ['all','Todas']
  ];

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }
  function pageRegistry() { return typeof pages !== 'undefined' ? pages : null; }
  function navRegistry() { return typeof navItems !== 'undefined' ? navItems : null; }
  if (pageRegistry()) {
    pageRegistry().admin = {
      title: 'Administração',
      desc: 'Avaliação de fichas e ferramentas internas da Agência.',
      code: 'AGÊNCIA / CONTROLE ADMINISTRATIVO'
    };
  }

  function activePageId() {
    var title = document.getElementById('title');
    var value = title ? title.textContent.trim() : '';
    var registry = pageRegistry();
    if (registry) {
      var keys = Object.keys(registry);
      for (var i = 0; i < keys.length; i++) {
        if (registry[keys[i]] && registry[keys[i]].title === value) return keys[i];
      }
    }
    if (/perfil/i.test(value)) return 'profile';
    if (/personagem/i.test(value) && /cria/i.test(value)) return 'character-creation';
    return 'overview';
  }

  function renderNavigation() {
    var nav = document.getElementById('nav');
    var items = navRegistry();
    if (!nav || !items) return;
    var active = activePageId();
    nav.innerHTML = items.map(function (item) {
      return '<button class="' + (item[0] === active ? 'active' : '') + '" data-id="' + esc(item[0]) + '">' + esc(item[1]) + '</button>';
    }).join('');
    nav.querySelectorAll('button').forEach(function (button) {
      button.onclick = function () { if (typeof window.go === 'function') window.go(button.dataset.id); };
    });
  }

  function setAdminNavigation(enabled) {
    var items = navRegistry();
    if (!items) return;
    var index = items.findIndex(function (item) { return item[0] === 'admin'; });
    if (enabled && index < 0) items.push(['admin','▣ Administração']);
    if (!enabled && index >= 0) items.splice(index,1);
    state.isAdmin = !!enabled;
    renderNavigation();
  }

  function setPageMeta() {
    var registry = pageRegistry();
    if (registry && registry.admin) {
      var crumb = document.getElementById('crumb');
      var heading = document.getElementById('title');
      var description = document.getElementById('desc');
      var code = document.getElementById('code');
      var hero = document.getElementById('hero');
      if (crumb) crumb.textContent = 'ADMINISTRAÇÃO';
      if (heading) heading.textContent = registry.admin.title;
      if (description) description.textContent = registry.admin.desc;
      if (code) code.textContent = registry.admin.code;
      if (hero) hero.style.display = 'none';
    }
  }

  function card(label, value, note) {
    return '<article class="no-admin-stat"><small>' + esc(label) + '</small><strong>' + esc(value) + '</strong><span>' + esc(note) + '</span></article>';
  }

  function field(label, value) {
    return '<div class="no-admin-field"><small>' + esc(label) + '</small><div>' + esc(value || 'Não informado') + '</div></div>';
  }

  function detailMarkup(row) {
    if (!row) return '';
    var modules = Array.isArray(row.cybernetic_modules) ? row.cybernetic_modules : [];
    var ficha = row.ficha_data && typeof row.ficha_data === 'object' ? row.ficha_data : {};
    if (!modules.length && Array.isArray(ficha.cyberneticModules)) modules = ficha.cyberneticModules;
    var modulesHtml = modules.length
      ? '<div class="no-admin-module-list">' + modules.map(function (module, index) {
          return '<article><b>' + esc(module.name || ('Módulo ' + (index + 1))) + '</b><p>' + esc(module.description || 'Sem descrição.') + '</p></article>';
        }).join('') + '</div>'
      : '<p class="no-admin-muted">Nenhum módulo cibernético registrado.</p>';
    var noteHtml = row.review_note
      ? '<div class="no-admin-note"><b>Observação administrativa anterior</b><p>' + esc(row.review_note) + '</p></div>'
      : '';
    var rollsHtml = state.detailLoading ? '<p class="no-admin-muted">Carregando rolagens e histórico...</p>' :
      '<div class="no-admin-detail-section"><h4>Rolagens registradas</h4>' + (state.rolls.length ? '<div class="no-admin-module-list">' + state.rolls.map(function (roll) { return '<article><b>' + esc(roll.roll_type || 'Rolagem') + '</b><p>Resultado escolhido: ' + esc(roll.chosen_result || 'Não definido') + '</p><pre>' + esc(JSON.stringify(roll.outcomes || {}, null, 2)) + '</pre></article>'; }).join('') + '</div>' : '<p class="no-admin-muted">Nenhuma rolagem registrada.</p>') + '</div>' +
      '<div class="no-admin-detail-section"><h4>Histórico de alterações</h4>' + (state.history.length ? '<div class="no-admin-module-list">' + state.history.map(function (entry) { return '<article><b>' + esc(entry.action || 'Alteração') + '</b><p>' + esc(entry.created_at ? new Date(entry.created_at).toLocaleString('pt-BR') : '') + ' · Responsável: ' + esc(entry.actor_id || entry.player_id || 'Sistema') + '</p></article>'; }).join('') + '</div>' : '<p class="no-admin-muted">Nenhum registro de histórico encontrado.</p>') + '</div>';
    var actions = row.status === 'submitted'
      ? '<div class="no-admin-review"><label for="no-admin-review-note">Motivo / orientação para devolução</label><textarea id="no-admin-review-note" rows="3" maxlength="2000" placeholder="Explique o que precisa ser corrigido para devolver a ficha ao jogador."></textarea><div class="no-admin-actions"><button type="button" class="no-admin-primary" data-admin-approve="' + esc(row.id) + '">APROVAR FICHA</button><button type="button" class="no-admin-secondary" data-admin-return="' + esc(row.id) + '">DEVOLVER PARA AJUSTES</button></div></div>'
      : '<p class="no-admin-muted">Esta ficha não está aguardando avaliação. As ações de aprovação e devolução ficam indisponíveis.</p>';
    return '<section class="no-admin-detail"><div class="no-admin-detail-head"><div><small>ANÁLISE INDIVIDUAL</small><h3>' + esc(row.name || 'Personagem sem nome') + '</h3></div><button type="button" class="no-admin-secondary" data-admin-close-detail>FECHAR</button></div>' +
      '<div class="no-admin-detail-grid">' +
      field('Jogador', state.profiles[row.player_id] || row.player_id) +
      field('Status', statusLabels[row.status] || row.status) +
      field('Idade', row.age == null ? '' : row.age) +
      field('Raça', row.race) +
      field('Gênero', row.gender) +
      field('Altura (cm)', row.height_cm) +
      field('Peso (kg)', row.weight_kg) +
      field('Reserva de Chi', row.chi_reserve) +
      field('Raridade do Talento', row.talent_rarity) +
      field('Especializações', Array.isArray(row.specializations) ? row.specializations.join(', ') : '') +
      field('Habilidades comuns', Array.isArray(row.common_skills) ? row.common_skills.join(', ') : '') +
      field('Habilidades sobrenaturais', Array.isArray(row.supernatural_skills) ? row.supernatural_skills.join(', ') : '') +
      '</div>' +
      '<div class="no-admin-detail-section"><h4>Personalidade</h4><p>' + esc(row.personality || 'Não informada') + '</p></div>' +
      '<div class="no-admin-detail-section"><h4>Aparência</h4><p>' + esc(row.appearance || 'Não informada') + '</p></div>' +
      '<div class="no-admin-detail-section"><h4>História / origem</h4><p>' + esc(row.backstory || 'Não informada') + '</p></div>' +
      '<div class="no-admin-detail-section"><h4>Módulos cibernéticos</h4>' + modulesHtml + '</div>' +
      noteHtml + rollsHtml +
      '<details class="no-admin-raw"><summary>Dados complementares da ficha</summary><pre>' + esc(JSON.stringify(ficha, null, 2)) + '</pre></details>' +
      actions + '</section>';
  }

  function renderDashboard() {
    var root = contentRoot();
    if (!root) return;
    var rows = state.rows;
    var counts = state.counts;
    var filtered = rows.filter(function (row) {
      var matchesStatus = state.filter === 'all' || row.status === state.filter;
      var player = state.profiles[row.player_id] || '';
      var term = (String(row.name || '') + ' ' + player + ' ' + String(row.race || '')).toLocaleLowerCase('pt-BR');
      return matchesStatus && (!state.search || term.indexOf(state.search.toLocaleLowerCase('pt-BR')) !== -1);
    });
    var selected = state.selected ? rows.find(function (row) { return row.id === state.selected; }) : null;
    var filterHtml = filters.map(function (item) {
      return '<button type="button" class="no-admin-filter ' + (state.filter === item[0] ? 'active' : '') + '" data-admin-filter="' + item[0] + '">' + esc(item[1]) + '</button>';
    }).join('');
    var listHtml = filtered.length ? filtered.map(function (row) {
      return '<article class="no-admin-row"><div class="no-admin-row-main"><div><b>' + esc(row.name || 'Personagem sem nome') + '</b><small>' + esc(state.profiles[row.player_id] || 'Jogador') + ' · ' + esc(row.race || 'Raça não definida') + '</small></div><span class="no-admin-status no-admin-' + esc(row.status) + '">' + esc(statusLabels[row.status] || row.status) + '</span></div><div class="no-admin-row-foot"><small>Atualizada: ' + esc(row.updated_at ? new Date(row.updated_at).toLocaleString('pt-BR') : 'Data indisponível') + '</small><button type="button" class="no-admin-secondary" data-admin-view="' + esc(row.id) + '">ANALISAR FICHA</button></div></article>';
    }).join('') : '<div class="no-admin-empty">Nenhuma ficha encontrada neste filtro.</div>';
    root.innerHTML = '<section class="no-admin-shell">' +
      '<div class="no-admin-intro"><div><span class="no-admin-kicker">AGÊNCIA A ORDEM · ACESSO RESTRITO</span><h2>Painel administrativo</h2><p>Gerencie a fila de fichas e registre decisões administrativas. As permissões são verificadas pelo Supabase, não apenas pela interface.</p></div><button type="button" class="no-admin-secondary" data-admin-refresh ' + (state.busy ? 'disabled' : '') + '>ATUALIZAR</button></div>' +
      (state.message ? '<div class="no-admin-message" role="status">' + esc(state.message) + '</div>' : '') +
      '<div class="no-admin-stats">' +
      card('Aguardando análise', counts.submitted, 'Fichas enviadas pelos jogadores') +
      card('Rascunhos', counts.draft, 'Ainda em elaboração') +
      card('Aprovadas', counts.approved, 'Fichas aprovadas') +
      card('Devolvidas', counts.rejected, 'Precisam de ajustes') +
      '</div>' +
      '<div class="no-admin-toolbar"><div class="no-admin-filters">' + filterHtml + '</div><input type="search" id="no-admin-search" value="' + esc(state.search) + '" placeholder="Buscar por personagem, jogador ou raça..." aria-label="Buscar fichas"></div>' +
      '<div class="no-admin-list">' + listHtml + '</div>' +
      (selected ? detailMarkup(selected) : '<div class="no-admin-hint">Selecione uma ficha para consultar todos os dados e avaliar uma proposta enviada.</div>') +
      '<p class="no-admin-footnote">Aprovações e devoluções são executadas pelas funções administrativas do banco. O registro de alterações é mantido pelo histórico da ficha.</p>' +
      '</section>';
  }

  async function verifyAdmin() {
    if (!db) return false;
    var auth = await db.auth.getUser();
    if (auth.error) throw auth.error;
    if (!auth.data || !auth.data.user) return false;
    var check = await db.rpc('is_admin');
    if (check.error) throw check.error;
    return check.data === true;
  }

  async function loadAdminPage() {
    var root = contentRoot();
    if (!root) return;
    root.innerHTML = '<section class="no-admin-shell"><p class="no-admin-muted">Verificando credenciais administrativas...</p></section>';
    try {
      var allowed = await verifyAdmin();
      if (!allowed) {
        setAdminNavigation(false);
        root.innerHTML = '<section class="no-admin-denied"><h2>Acesso administrativo restrito</h2><p>Entre com uma conta autorizada pela Agência para acessar este painel.</p><button type="button" class="no-admin-primary" data-admin-profile>IR PARA PERFIL</button></section>';
        return;
      }
      setAdminNavigation(true);
      await refreshAdminData();
    } catch (error) {
      root.innerHTML = '<section class="no-admin-denied"><h2>Não foi possível validar o acesso</h2><p>' + esc(error.message || 'Falha ao consultar as permissões administrativas.') + '</p><button type="button" class="no-admin-secondary" data-admin-retry> TENTAR NOVAMENTE </button></section>';
    }
  }

  async function refreshAdminData() {
    if (!db || state.busy) return;
    state.busy = true;
    state.message = '';
    try {
      var allowed = await verifyAdmin();
      if (!allowed) throw new Error('Sua conta não possui mais acesso administrativo.');
      var result = await db.from('characters')
        .select('id,player_id,name,age,height_cm,weight_kg,gender,personality,appearance,backstory,race,common_skills,supernatural_skills,chi_reserve,talent_rarity,specializations,ficha_data,status,review_note,cybernetic_modules,created_at,updated_at')
        .order('updated_at', {ascending:false})
        .limit(200);
      if (result.error) throw result.error;
      var profiles = await db.from('profiles').select('id,display_name');
      if (profiles.error) throw profiles.error;
      var countResults = await Promise.all(['draft','submitted','approved','rejected'].map(function (status) {
        return db.from('characters').select('id', {count:'exact', head:true}).eq('status', status);
      }));
      countResults.forEach(function (item, index) {
        if (item.error) throw item.error;
        state.counts[['draft','submitted','approved','rejected'][index]] = item.count || 0;
      });
      state.profiles = {};
      (profiles.data || []).forEach(function (profile) { state.profiles[profile.id] = profile.display_name || profile.id; });
      state.rows = result.data || [];
      state.busy = false;
      renderDashboard();
    } catch (error) {
      state.busy = false;
      state.message = error.message || 'Falha ao carregar as fichas.';
      renderDashboard();
    }
  }

  async function loadDetailRecords(id) {
    if (!db || !id) return;
    try {
      var results = await Promise.all([
        db.from('character_rolls').select('id,roll_type,outcomes,chosen_result,created_at').eq('character_id', id).order('created_at', {ascending:false}),
        db.from('character_history').select('id,action,actor_id,player_id,old_data,new_data,created_at').eq('character_id', id).order('created_at', {ascending:false}).limit(30)
      ]);
      if (results[0].error) throw results[0].error;
      if (results[1].error) throw results[1].error;
      state.rolls = results[0].data || [];
      state.history = results[1].data || [];
    } catch (error) {
      state.message = 'Ficha carregada, mas houve uma falha ao consultar rolagens ou histórico: ' + (error.message || 'erro desconhecido');
    } finally {
      state.detailLoading = false;
      if (state.selected === id) renderDashboard();
    }
  }

  async function approveCharacter(id) {
    if (!db || state.busy) return;
    if (!window.confirm('Confirma a aprovação desta ficha?')) return;
    state.busy = true;
    try {
      var check = await verifyAdmin();
      if (!check) throw new Error('Acesso administrativo não autorizado.');
      var result = await db.rpc('approve_character', {p_character_id:id});
      if (result.error) throw result.error;
      state.message = 'Ficha aprovada. O banco registrou a alteração e aplicou as regras de limite.';
      state.selected = null;
      state.busy = false;
      await refreshAdminData();
      state.message = 'Ficha aprovada com sucesso.';
      renderDashboard();
    } catch (error) {
      state.busy = false;
      state.message = error.message || 'Não foi possível aprovar a ficha.';
      renderDashboard();
    }
  }

  async function returnCharacter(id) {
    if (!db || state.busy) return;
    var note = document.getElementById('no-admin-review-note');
    var reason = note ? note.value.trim() : '';
    if (!reason) {
      state.message = 'Informe o motivo e as orientações antes de devolver a ficha.';
      renderDashboard();
      return;
    }
    state.busy = true;
    try {
      var check = await verifyAdmin();
      if (!check) throw new Error('Acesso administrativo não autorizado.');
      var result = await db.rpc('return_character_for_revision', {
        p_character_id:id,
        p_review_note:reason
      });
      if (result.error) throw result.error;
      state.selected = null;
      state.busy = false;
      await refreshAdminData();
      state.message = 'Ficha devolvida ao jogador com a observação registrada.';
      renderDashboard();
    } catch (error) {
      state.busy = false;
      state.message = error.message || 'Não foi possível devolver a ficha.';
      renderDashboard();
    }
  }

  function installStyles() {
    if (document.getElementById('no-admin-styles')) return;
    var style = document.createElement('style');
    style.id = 'no-admin-styles';
    style.textContent = [
      '#admin{display:none!important}#modalbg{display:none!important}',
      '.no-admin-shell{display:grid;gap:16px;color:#e8f1fc}',
      '.no-admin-intro{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding:20px;border:1px solid #29445d;border-radius:10px;background:linear-gradient(125deg,#13283b,#0b1420)}',
      '.no-admin-kicker{font:10px var(--mono,monospace);letter-spacing:1px;color:#83c9ff}',
      '.no-admin-intro h2,.no-admin-denied h2{margin:8px 0;font:700 27px var(--display,Arial);color:#e9f5ff}',
      '.no-admin-intro p,.no-admin-denied p{max-width:760px;margin:0;color:#a9bfd2;font-size:13px;line-height:1.65}',
      '.no-admin-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}',
      '.no-admin-stat{display:grid;gap:6px;padding:15px;border:1px solid #263c52;border-radius:8px;background:#0c1724}',
      '.no-admin-stat small,.no-admin-field small{font:9px var(--mono,monospace);color:#83bfe8;text-transform:uppercase;letter-spacing:.6px}',
      '.no-admin-stat strong{font:700 28px var(--display,Arial);color:#eaf5ff}',
      '.no-admin-stat span,.no-admin-muted{font-size:11px;color:#93aabd}',
      '.no-admin-toolbar{display:grid;gap:10px}',
      '.no-admin-filters{display:flex;flex-wrap:wrap;gap:7px}',
      '.no-admin-filter,.no-admin-secondary{border:1px solid #344d64;border-radius:6px;background:#111f2e;color:#b9d2e6;padding:9px 11px;cursor:pointer;font:10px var(--mono,monospace)}',
      '.no-admin-filter.active{border-color:#65baff;background:#17334b;color:#e7f5ff}',
      '#no-admin-search,.no-admin-review textarea{width:100%;padding:11px;border:1px solid #30465c;border-radius:6px;background:#080f18;color:#eaf4ff;font:12px var(--sans,Arial)}',
      '.no-admin-list{display:grid;gap:9px}',
      '.no-admin-row{padding:14px;border:1px solid #263c52;border-radius:8px;background:#0d1723}',
      '.no-admin-row-main,.no-admin-row-foot,.no-admin-detail-head,.no-admin-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}',
      '.no-admin-row-main b{display:block;color:#eaf4ff;font:600 16px var(--display,Arial)}',
      '.no-admin-row-main small,.no-admin-row-foot small{display:block;margin-top:4px;color:#8fa7bb;font-size:10px}',
      '.no-admin-row-foot{margin-top:12px}',
      '.no-admin-status{padding:5px 8px;border:1px solid #40556a;border-radius:99px;color:#c6d9e8;font:9px var(--mono,monospace)}',
      '.no-admin-submitted{border-color:#4c87b4;color:#a9dcff}.no-admin-approved{border-color:#3f8065;color:#a6e5c5}.no-admin-rejected{border-color:#8b5a60;color:#f0b7bd}.no-admin-draft{color:#b3bdca}',
      '.no-admin-primary{border:1px solid #4a9bd4;border-radius:6px;background:#164d73;color:#f1f9ff;padding:10px 13px;cursor:pointer;font:600 10px var(--mono,monospace)}',
      '.no-admin-primary:disabled,.no-admin-secondary:disabled{opacity:.5;cursor:not-allowed}',
      '.no-admin-detail{display:grid;gap:14px;padding:18px;border:1px solid #31516c;border-radius:10px;background:#0b1622}',
      '.no-admin-detail-head small{font:9px var(--mono,monospace);color:#83c9ff}.no-admin-detail-head h3{margin:5px 0 0;font:700 23px var(--display,Arial)}',
      '.no-admin-detail-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}',
      '.no-admin-field{padding:10px;border:1px solid #23394e;border-radius:6px;background:#0d1d2b;min-width:0}.no-admin-field div{margin-top:5px;color:#d6e5f2;font-size:12px;overflow-wrap:anywhere}',
      '.no-admin-detail-section h4{margin:0 0 6px;color:#9ed6ff;font:600 12px var(--mono,monospace);text-transform:uppercase}.no-admin-detail-section p{margin:0;color:#c0cfdd;font-size:12px;line-height:1.65;white-space:pre-wrap}',
      '.no-admin-module-list{display:grid;gap:8px}.no-admin-module-list article{padding:10px;border:1px solid #29455e;border-radius:6px;background:#0d1d2b}.no-admin-module-list b{color:#dceeff}.no-admin-module-list p{margin:5px 0 0}',
      '.no-admin-note,.no-admin-message{padding:12px;border-left:3px solid #6bb9ee;background:#10253a;color:#b9d5ea;font-size:12px;line-height:1.6}.no-admin-note p{margin:6px 0 0}',
      '.no-admin-review{display:grid;gap:8px;padding-top:14px;border-top:1px solid #29445d}.no-admin-review label{font:10px var(--mono,monospace);color:#a8c9e3}.no-admin-actions{justify-content:flex-start}',
      '.no-admin-raw{color:#9fc7e5;font-size:11px}.no-admin-raw pre{max-height:260px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;padding:12px;background:#070d14;border:1px solid #24394c;border-radius:6px;color:#b7c8d8}',
      '.no-admin-empty,.no-admin-hint,.no-admin-denied{padding:22px;border:1px dashed #36536b;border-radius:8px;background:#0b1520;color:#a9bfd2;font-size:12px;line-height:1.7}',
      '.no-admin-footnote{margin:0;color:#7995aa;font-size:10px;line-height:1.6}',
      '.ark-page-guide{display:flex;align-items:center;gap:13px;margin:0 0 20px;padding:13px 15px;border:1px solid #285477;border-radius:9px;background:linear-gradient(110deg,#0e2132,#0a1521);box-shadow:inset 3px 0 #56b7f5}',
      '.ark-page-guide .ark-guide-mark{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border:1px solid #5da9db;border-radius:10px;background:#15334c;color:#bce6ff;font:700 10px var(--mono,monospace)}',
      '.ark-page-guide .ark-guide-copy{flex:1;min-width:0}.ark-page-guide b{display:block;color:#cceaff;font:700 10px var(--mono,monospace);letter-spacing:.6px}.ark-page-guide p{margin:4px 0 0;color:#a9c1d5;font-size:12px;line-height:1.55}',
      '.ark-page-guide button{flex:0 0 auto;border:1px solid #3d83b1;border-radius:6px;background:#123b59;color:#dff3ff;padding:9px 10px;cursor:pointer;font:600 9px var(--mono,monospace)}',
      '@media(max-width:760px){.no-admin-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.no-admin-detail-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.no-admin-intro{display:grid}.ark-page-guide{align-items:flex-start;flex-wrap:wrap}.ark-page-guide button{margin-left:51px}}',
      '@media(max-width:420px){.no-admin-detail-grid{grid-template-columns:1fr}.no-admin-filter{font-size:9px;padding:8px}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function installNavigationGuard() {
    if (window.go && !window.go.__novaAdminWrapped) {
      var previousGo = window.go;
      var adminGo = function (id, fromHistory) {
        if (id !== 'admin') return previousGo.apply(this, arguments);
        previousGo.call(this, 'admin', fromHistory);
        setPageMeta();
        loadAdminPage();
      };
      adminGo.__novaAdminWrapped = true;
      window.go = adminGo;
    }
  }

  function refreshGuide() {
    var root = contentRoot();
    if (!root || root.querySelector('.ark-page-guide')) return;
    var titleNode = document.getElementById('title');
    var descNode = document.getElementById('desc');
    var title = titleNode ? titleNode.textContent.trim() : 'Nova Ordem';
    var desc = descNode ? descNode.textContent.trim() : '';
    var id = activePageId();
    if (id === 'ark' || /central do a\.r\.k/i.test(title)) return;
    var messages = {
      overview: 'Esta é a entrada da Agência. Use a navegação lateral para explorar a cosmologia, os sistemas, as organizações e as fichas antes de começar.',
      lore: 'Aqui ficam os registros de história e cosmologia. Consulte cada seção para conhecer o que está documentado; alguns mistérios permanecem reservados na própria narrativa.',
      systems: 'Esta área reúne as regras do RPG. Abra cada sistema para consultar seu funcionamento e use a Central do A.R.K. quando precisar relacionar regras diferentes.',
      characters: 'Nesta seção você encontra a criação e as fichas. A origem e a apresentação do personagem são definidas pelo jogador; a Administração avalia compatibilidade e equilíbrio.',
      protocol: 'Consulte os procedimentos de participação, envio de informações e convivência. Leia as orientações antes de realizar ações que dependam da Administração.',
      profile: 'No Perfil você gerencia o acesso à conta, acompanha seus rascunhos e continua uma ficha. A criação exige uma sessão autenticada.',
      'character-creation': 'A criação é dividida em etapas. Preencha os dados com atenção e revise as escolhas antes de enviar a ficha para avaliação.',
      admin: 'Este painel é exclusivo da Administração. Analise as fichas enviadas, confira os dados completos e registre uma aprovação ou uma devolução acompanhada de orientações.',
      functions: 'Esta área reúne ferramentas e atividades do jogador. Cada função deve respeitar as regras do sistema correspondente e o estado atual do personagem.',
      progression: 'A Progressão registra o desenvolvimento do personagem. Evolução não é automática: depende das regras, das ações e da avaliação previstas no RPG.',
      agency: 'Esta página apresenta a Agência A Ordem, sua estrutura e seus procedimentos. A participação na organização não é obrigatória para todos os personagens.',
      ark: ''
    };
    var message = messages[id] || (desc ? 'Você está em "' + title + '". ' + desc + ' Consulte os registros desta página e pergunte ao A.R.K. se precisar de ajuda.' : 'Você está em "' + title + '". Explore os registros desta seção e pergunte ao A.R.K. se precisar de orientação.');
    var guide = document.createElement('section');
    guide.className = 'ark-page-guide';
    guide.innerHTML = '<span class="ark-guide-mark">A.R.K.</span><div class="ark-guide-copy"><b>GUIA DA AGÊNCIA · ' + esc(title.toUpperCase()) + '</b><p>' + esc(message) + '</p></div><button type="button" data-ark-guide-ask="' + esc('Explique a página ' + title + ' e o que posso fazer nela.') + '">TIRAR DÚVIDAS</button>';
    root.insertBefore(guide, root.firstChild);
  }

  function installGuide() {
    var root = contentRoot();
    if (!root || !window.MutationObserver) return;
    var observer = new MutationObserver(function () {
      if (!root.querySelector('.ark-page-guide')) refreshGuide();
    });
    observer.observe(root, {childList:true, subtree:true});
    refreshGuide();
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.closest) return;
    var filter = target.closest('[data-admin-filter]');
    if (filter) {
      state.filter = filter.getAttribute('data-admin-filter');
      state.selected = null;
      renderDashboard();
      return;
    }
    var view = target.closest('[data-admin-view]');
    if (view) {
      state.selected = view.getAttribute('data-admin-view');
      state.rolls = [];
      state.history = [];
      state.detailLoading = true;
      renderDashboard();
      loadDetailRecords(state.selected);
      return;
    }
    if (target.closest('[data-admin-close-detail]')) {
      state.selected = null;
      renderDashboard();
      return;
    }
    var approve = target.closest('[data-admin-approve]');
    if (approve) { approveCharacter(approve.getAttribute('data-admin-approve')); return; }
    var returnButton = target.closest('[data-admin-return]');
    if (returnButton) { returnCharacter(returnButton.getAttribute('data-admin-return')); return; }
    if (target.closest('[data-admin-refresh]') || target.closest('[data-admin-retry]')) { refreshAdminData(); return; }
    if (target.closest('[data-admin-profile]')) { if (window.go) window.go('profile'); return; }
    var ask = target.closest('[data-ark-guide-ask]');
    if (ask && window.NovaOrdemARK) {
      var panel = document.getElementById('ark-panel');
      if (!panel || !panel.classList.contains('ark-open')) window.NovaOrdemARK.open();
      window.NovaOrdemARK.ask(ask.getAttribute('data-ark-guide-ask'));
    }
  });

  document.addEventListener('input', function (event) {
    if (event.target && event.target.id === 'no-admin-search') {
      state.search = event.target.value;
      var position = event.target.selectionStart;
      renderDashboard();
      var next = document.getElementById('no-admin-search');
      if (next) { next.focus(); next.setSelectionRange(position, position); }
    }
  });

  function updateAccess() {
    if (!db) { setAdminNavigation(false); return; }
    verifyAdmin().then(function (allowed) {
      setAdminNavigation(allowed);
      if (!allowed && activePageId() === 'admin' && window.go) window.go('profile');
    }).catch(function () { setAdminNavigation(false); });
  }

  window.NovaOrdemAdmin = {
    refresh: refreshAdminData,
    open: function () { if (window.go) window.go('admin'); },
    verify: verifyAdmin
  };

  installStyles();
  document.addEventListener('DOMContentLoaded', function () {
    installNavigationGuard();
    installGuide();
    updateAccess();
    if (db && db.auth && db.auth.onAuthStateChange) {
      db.auth.onAuthStateChange(function () {
        Promise.resolve().then(updateAccess);
      });
    }
  });
})();