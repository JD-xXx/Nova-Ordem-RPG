(() => {
  'use strict';

  const cfg = window.NOVA_ORDEM_SUPABASE_CONFIG;
  if (!cfg || !window.supabase || !window.supabase.createClient) {
    console.error('[Nova Ordem] Configuração ou biblioteca do Supabase não encontrada.');
    return;
  }

  const db = window.supabase.createClient(cfg.url, cfg.anonKey);
  const raceNames = {1:'Humanos', 2:'Híbridos', 3:'Químios', 4:'Ciborgues'};
  const raceNumbers = {
    'Humanos':1, 'Humano':1, 'Híbridos':2, 'Híbrido':2,
    'Químios':3, 'Químio':3, 'Ciborgues':4, 'Ciborgue':4
  };

  let characterId = null;
  let opening = false;
  let busy = false;
  let completed = false;
  let recoveryMode = false;
  let observer = null;
  const ACTIVE_DRAFT_KEY = 'nova-ordem-active-draft-v1';

  const $ = (selector, base) => (base || document).querySelector(selector);
  const creator = () => window.NovaOrdemCharacterCreator;
  const root = () => $('#content');

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[ch]));
  }

  function showMessage(message, title) {
    const el = root();
    if (!el) return;
    el.innerHTML =
      '<section class="cc-card" style="max-width:620px;margin:24px auto;padding:24px">' +
        '<div class="eyebrow">AGÊNCIA A ORDEM · SISTEMA DE PERSONAGENS</div>' +
        '<h3>' + escapeHtml(title || 'Aviso') + '</h3>' +
        '<p>' + escapeHtml(message) + '</p>' +
      '</section>';
  }

  function authScreen(message) {
    const el = root();
    if (!el) return;
    el.innerHTML =
      '<section class="cc-card" style="max-width:620px;margin:24px auto;padding:24px">' +
        '<div class="eyebrow">AGÊNCIA A ORDEM · PORTAL DO JOGADOR</div>' +
        '<h3>Acesse sua conta</h3>' +
        '<p>' + escapeHtml(message || 'Entre ou crie seu perfil antes de iniciar uma ficha.') + '</p>' +
        '<label class="cc-field">E-mail' +
          '<input data-no-email type="email" autocomplete="email" placeholder="seu@email.com">' +
        '</label>' +
        '<label class="cc-field">Senha' +
          '<input data-no-password type="password" autocomplete="current-password" placeholder="Sua senha">' +
        '</label>' +
        '<div class="cc-nav" style="margin-top:18px;display:flex;flex-wrap:wrap;gap:9px">' +
          '<button class="save" type="button" data-no-auth="login">ENTRAR</button>' +
          '<button class="close" type="button" data-no-auth="signup">CRIAR PERFIL</button>' +
        '</div>' +
        '<p style="margin-top:18px"><button class="close" type="button" data-no-auth="recovery">ESQUECI A SENHA</button></p>' +
      '</section>';
  }

  function recoveryRequestScreen(message) {
    const el = root();
    if (!el) return;
    el.innerHTML =
      '<section class="cc-card" style="max-width:620px;margin:24px auto;padding:24px">' +
        '<div class="eyebrow">AGÊNCIA A ORDEM · RECUPERAÇÃO DE ACESSO</div>' +
        '<h3>Recuperar senha</h3>' +
        '<p>Informe o e-mail cadastrado. Enviaremos um link para você definir uma nova senha.</p>' +
        (message ? '<p role="alert">' + escapeHtml(message) + '</p>' : '') +
        '<form data-no-recovery-request>' +
          '<label class="cc-field">E-mail da conta' +
            '<input data-no-recovery-email type="email" autocomplete="email" required placeholder="seu@email.com">' +
          '</label>' +
          '<div class="cc-nav" style="margin-top:18px;display:flex;gap:9px;flex-wrap:wrap">' +
            '<button class="save" type="submit">ENVIAR LINK DE RECUPERAÇÃO</button>' +
            '<button class="close" type="button" data-no-back-access>VOLTAR AO ACESSO</button>' +
          '</div>' +
        '</form>' +
      '</section>';
  }

  function accountScreen(message) {
    const el = root();
    if (!el) return;
    db.auth.getUser().then(({data}) => {
      const user = data && data.user;
      if (!user) { authScreen('Sua sessão não está ativa. Entre novamente.'); return; }
      el.innerHTML =
        '<section class="cc-card" style="max-width:680px;margin:24px auto;padding:24px">' +
          '<div class="eyebrow">AGÊNCIA A ORDEM · PERFIL DO JOGADOR</div>' +
          '<h3>Perfil conectado</h3>' +
          '<p>Conta: <b>' + escapeHtml(user.email || 'usuário autenticado') + '</b></p>' +
          '<p>' + escapeHtml(message || (characterId ? 'Você tem uma ficha em andamento. Continue de onde parou.' : 'Seu perfil está pronto. Crie uma ficha quando quiser.')) + '</p>' +
          '<div class="cc-nav" style="margin-top:18px;display:flex;gap:9px;flex-wrap:wrap">' +
            (characterId ? '<button class="save" type="button" data-no-resume>CONTINUAR FICHA</button>' : '<button class="save" type="button" data-no-start>CRIAR PERSONAGEM</button>') +
            '<button class="close" type="button" data-no-logout>SAIR DA CONTA</button>' +
          '</div>' +
        '</section>';
    }).catch(() => authScreen('Não foi possível verificar sua sessão. Entre novamente.'));
  }

  function passwordRecoveryScreen(message) {
    const el = root();
    if (!el) return;
    el.innerHTML =
      '<section class="cc-card" style="max-width:620px;margin:24px auto;padding:24px">' +
        '<div class="eyebrow">AGÊNCIA A ORDEM · SEGURANÇA DA CONTA</div>' +
        '<h3>Redefinir senha</h3>' +
        '<p>Digite uma nova senha para recuperar o acesso à sua conta.</p>' +
        (message ? '<p role="alert" style="color:#f0a0a5">' + escapeHtml(message) + '</p>' : '') +
        '<form data-no-recovery-form>' +
          '<label class="cc-field">Nova senha' +
            '<input data-no-new-password type="password" autocomplete="new-password" minlength="6" required placeholder="Digite sua nova senha">' +
          '</label>' +
          '<label class="cc-field">Confirmar nova senha' +
            '<input data-no-confirm-password type="password" autocomplete="new-password" minlength="6" required placeholder="Digite novamente a nova senha">' +
          '</label>' +
          '<div class="cc-nav" style="margin-top:18px">' +
            '<button class="save" type="submit">SALVAR NOVA SENHA</button>' +
          '</div>' +
        '</form>' +
      '</section>';
  }

  async function requestPasswordRecovery(form) {
    if (busy) return;
    const emailInput = $('[data-no-recovery-email]', form);
    const email = emailInput && emailInput.value.trim();
    if (!email) { recoveryRequestScreen('Informe o e-mail da conta.'); return; }
    busy = true;
    try {
      const result = await db.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
      });
      if (result.error) throw result.error;
      recoveryRequestScreen('Se o endereço estiver cadastrado, o Supabase enviará um link. Confira a caixa de entrada e o spam. Evite solicitar vários links em sequência.');
    } catch (error) {
      const detail = String(error && error.message || '');
      const rateLimited = /rate.?limit|too many requests|email rate/i.test(detail);
      recoveryRequestScreen(rateLimited
        ? 'O limite temporário de envio de e-mails foi atingido. Aguarde antes de tentar novamente; solicitar vários links seguidos prolonga o bloqueio.'
        : (detail || 'Não foi possível enviar o link de recuperação.'));
    } finally { busy = false; }
  }

  async function saveRecoveredPassword(form) {
    if (busy) return;
    const passwordInput = $('[data-no-new-password]', form);
    const confirmInput = $('[data-no-confirm-password]', form);
    const password = passwordInput ? passwordInput.value : '';
    const confirmation = confirmInput ? confirmInput.value : '';
    if (password.length < 6) {
      passwordRecoveryScreen('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmation) {
      passwordRecoveryScreen('As senhas não coincidem. Digite e confirme novamente.');
      return;
    }
    busy = true;
    try {
      const result = await db.auth.updateUser({password:password});
      if (result.error) throw result.error;
      recoveryMode = false;
      try {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.hash = '';
        cleanUrl.searchParams.delete('code');
        cleanUrl.searchParams.delete('type');
        window.history.replaceState({}, document.title, cleanUrl.pathname + cleanUrl.search);
      } catch (_) {}
      await db.auth.signOut();
      authScreen('Senha alterada com sucesso. Entre usando sua nova senha.');
    } catch (error) {
      passwordRecoveryScreen(error.message || 'Não foi possível atualizar a senha. Solicite um novo link de recuperação.');
    } finally {
      busy = false;
    }
  }

  async function rpc(name, args) {
    const result = await db.rpc(name, args || {});
    if (result.error) throw result.error;
    return result.data;
  }

  async function authenticate(mode) {
    if (busy) return;
    const email = $('[data-no-email]') && $('[data-no-email]').value.trim();
    const password = $('[data-no-password]') && $('[data-no-password]').value;
    if (!email || !password) {
      authScreen('Informe seu e-mail e sua senha.');
      return;
    }

    busy = true;
    try {
      const result = mode === 'login'
        ? await db.auth.signInWithPassword({email, password})
        : await db.auth.signUp({email, password});

      if (result.error) throw result.error;
      if (mode === 'signup' && !result.data.session) {
        authScreen('Conta criada. Confirme o e-mail enviado e depois entre nesta tela.');
        return;
      }
      completed = false;
      accountScreen(mode === 'signup' ? 'Perfil criado. Agora você pode iniciar uma ficha quando quiser.' : 'Login realizado. Nenhum rascunho foi criado automaticamente.');
    } catch (error) {
      authScreen(error.message || 'Não foi possível autenticar.');
    } finally {
      busy = false;
    }
  }

  async function createDraft() {
    const sessionResult = await db.auth.getSession();
    if (sessionResult.error) throw sessionResult.error;
    if (!sessionResult.data.session) {
      authScreen('Sua sessão não está ativa. Entre novamente.');
      return;
    }

    const userResult = await db.auth.getUser();
    const userId = userResult.data && userResult.data.user && userResult.data.user.id;
    if (!userId) throw new Error('Não foi possível identificar a conta conectada.');
    const draftsResult = await db.from('characters').select('id,name,updated_at').eq('player_id', userId).eq('status', 'draft');
    if (draftsResult.error) throw draftsResult.error;
    const drafts = draftsResult.data || [];
    if (drafts.length >= 5) {
      const names = drafts.map((draft, index) => (index + 1) + '. ' + (draft.name || 'Ficha sem nome')).join('\\n');
      throw new Error('Você já possui o limite de 5 rascunhos. Nenhum novo rascunho foi criado.\\n\\nRascunhos encontrados:\\n' + names + '\\n\\nVocê pode manter até 5 rascunhos simultaneamente.');
    }
    const id = await rpc('create_character_draft');
    characterId = typeof id === 'string' ? id : (id && (id.id || id.character_id));
    completed = false;
    if (!characterId) throw new Error('O banco não retornou o identificador da ficha.');
    if (creator()) creator().reset();
    persistActiveDraft();
  }

  function persistActiveDraft() {
    if (!characterId || !creator()) return;
    try {
      const user = db.auth.getSession();
      user.then(({data}) => {
        const userId = data && data.session && data.session.user && data.session.user.id;
        if (!userId || !characterId) return;
        sessionStorage.setItem(ACTIVE_DRAFT_KEY, JSON.stringify({userId, characterId, state:creator().getState()}));
      });
    } catch (_) {}
  }

  function clearActiveDraft() {
    try { sessionStorage.removeItem(ACTIVE_DRAFT_KEY); } catch (_) {}
  }

  async function restoreActiveDraft(session) {
    let saved;
    try { saved = JSON.parse(sessionStorage.getItem(ACTIVE_DRAFT_KEY) || 'null'); } catch (_) { saved = null; }
    if (!saved || !saved.characterId || !saved.userId || saved.userId !== session.user.id) return false;
    const result = await db.from('characters').select('id,status').eq('id', saved.characterId).maybeSingle();
    if (result.error || !result.data || result.data.status !== 'draft') { clearActiveDraft(); return false; }
    characterId = saved.characterId;
    completed = false;
    if (creator() && saved.state) creator().update(saved.state);
    return true;
  }

  async function startCharacterCreation() {
    if (busy || opening) return;
    busy = true;
    try {
      const sessionResult = await db.auth.getSession();
      const session = sessionResult.data && sessionResult.data.session;
      if (!session) { authScreen('Entre na sua conta antes de criar uma ficha.'); return; }
      if (characterId) {
        if (window.go) window.go('characters');
        if (creator()) creator().render();
        return;
      }
      if (window.go) window.go('characters');
      await createDraft();
    } catch (error) {
      showMessage(error.message || 'Não foi possível iniciar a ficha.');
    } finally { busy = false; }
  }

  function splitList(value) {
    return String(value || '').split(/[\n,;]+/).map(item => item.trim()).filter(Boolean);
  }

  function heightCm(value) {
    const raw = String(value || '').trim().replace(',', '.');
    if (!raw) return null;
    const number = Number(raw.replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(number)) return null;
    return /m/i.test(raw) && number < 10 ? number * 100 : number;
  }

  function isHybrid(state) {
    return state.race === 2 || state.race === 3;
  }

  function parseRaceRoll(data) {
    let values = [];
    if (Array.isArray(data)) {
      values = data;
    } else if (data && typeof data === 'object') {
      values = [
        data.die1 != null ? data.die1 : (data.result1 != null ? data.result1 : data.outcome1),
        data.die2 != null ? data.die2 : (data.result2 != null ? data.result2 : data.outcome2)
      ];
      if (values[0] == null && Array.isArray(data.outcomes)) values = data.outcomes;
    }

    return values.slice(0, 2).map(value => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string' && /^[1-4]$/.test(value)) return Number(value);
      return raceNumbers[String(value)] || null;
    });
  }

  async function rollRace() {
    if (!characterId) throw new Error('A ficha ainda não foi iniciada.');
    const data = await rpc('roll_character_race', {p_character_id:characterId});
    const rolls = parseRaceRoll(data);
    if (rolls.length !== 2 || rolls.some(value => !raceNames[value])) {
      console.error('[Nova Ordem] Retorno da rolagem de raça:', data);
      throw new Error('Não reconheci o resultado da rolagem de raça retornado pelo banco.');
    }
    creator().update({rolls:rolls, race:null, secondRoll:null, rarity:null, specializations:[]});
  }

  async function chooseRace(number) {
    const state = creator().getState();
    if (!state.rolls.includes(number) || !raceNames[number]) {
      throw new Error('Escolha uma das raças sorteadas.');
    }
    await rpc('choose_character_race', {
      p_character_id:characterId,
      p_race:raceNames[number]
    });
    creator().update({race:number, secondRoll:null, rarity:null, specializations:[]});
  }

  async function rollChi() {
    const state = creator().getState();
    if (!state.race || state.race === 4) return;
    const data = await rpc('roll_character_chi', {p_character_id:characterId});
    const values = {Baixa:1, Normal:2, Alta:3};
    if (!data || !values[data.result]) {
      console.error('[Nova Ordem] Retorno da rolagem de Chi:', data);
      throw new Error('Não reconheci a reserva de Chi retornada pelo banco.');
    }
    creator().update({secondRoll:values[data.result]});
  }

  async function rollRarity() {
    const state = creator().getState();
    if (!isHybrid(state)) throw new Error('Esta raça não realiza rolagem de raridade.');
    const data = await rpc('roll_character_talent_rarity', {p_character_id:characterId});
    if (!data || !['Comum','Raro'].includes(data.result)) {
      console.error('[Nova Ordem] Retorno da raridade:', data);
      throw new Error('Não reconheci a raridade retornada pelo banco.');
    }
    creator().update({rarity:{roll:data.die, value:data.result}, specializations:[]});
  }

  function validateBasics(state) {
    const fields = state.fields || {};
    if (!String(fields.name || '').trim()) return 'Informe o nome do personagem.';
    if (!Number.isInteger(Number(fields.age)) || Number(fields.age) < 0) return 'Informe uma idade válida.';
    if (!heightCm(fields.height)) return 'Informe uma altura válida (ex.: 1,80 m).';
    if (!String(fields.gender || '').trim()) return 'Informe o gênero.';
    const weight = Number(String(fields.weight || '').replace(',', '.'));
    if (!Number.isFinite(weight) || weight <= 0) return 'Informe um peso válido.';
    if (!String(fields.personality || '').trim()) return 'Descreva a personalidade.';
    if (!String(fields.appearance || '').trim()) return 'Descreva a aparência.';
    if (!String(fields.history || '').trim()) return 'Preencha a origem e a história.';
    return null;
  }

  function validateFinal(state) {
    const basicsError = validateBasics(state);
    if (basicsError) return basicsError;
    if (state.race !== 4 && !state.secondRoll) return 'Conclua a rolagem de Chi / aprimoramento físico.';
    if (isHybrid(state)) {
      const fields = state.fields || {};
      if (!String(fields.supernatural || '').trim()) return 'Descreva as habilidades sobrenaturais.';
      if (!state.rarity) return 'Faça a rolagem de raridade.';
      const required = state.rarity.value === 'Raro' ? 2 : 1;
      if (!Array.isArray(state.specializations) || state.specializations.length !== required) {
        return 'Selecione exatamente ' + required + ' especialização(ões).';
      }
      if (!String(fields.talentDescription || '').trim()) return 'Descreva o Talento.';
    }
    return null;
  }

  async function submitCharacter() {
    if (busy) return;
    const state = creator().getState();
    const issue = validateFinal(state);
    if (issue) {
      alert(issue);
      return;
    }

    busy = true;
    try {
      const fields = state.fields || {};
      const weight = Number(String(fields.weight).replace(',', '.'));

      await rpc('save_character_basics', {
        p_character_id:characterId,
        p_name:String(fields.name).trim(),
        p_age:Number(fields.age),
        p_height:heightCm(fields.height),
        p_gender:String(fields.gender).trim(),
        p_weight:weight,
        p_personality:String(fields.personality || '').trim(),
        p_appearance:String(fields.appearance || '').trim(),
        p_backstory:String(fields.history || '').trim(),
        p_common_skills:splitList(fields.skills),
        p_supernatural_skills:isHybrid(state) ? splitList(fields.supernatural) : []
      });

      const specializations = isHybrid(state)
        ? state.specializations.map(value => value === 'Transformação' ? 'Transformar' : value)
        : [];

      await rpc('save_character_extra_data', {
        p_character_id:characterId,
        p_ficha_data:{
          occupation:String(fields.occupation || '').trim(),
          talentDescription:isHybrid(state) ? String(fields.talentDescription || '').trim() : '',
          specializations:specializations,
          humanChiEnhancement:state.race === 1
            ? ({1:'Baixa', 2:'Normal', 3:'Alta'}[state.secondRoll] || null)
            : null
        }
      });

      await rpc('submit_character', {p_character_id:characterId});
      characterId = null;
      clearActiveDraft();
      completed = true;
      if (root()) {
        root().innerHTML =
          '<section class="cc-card" style="max-width:680px;margin:24px auto;padding:24px">' +
            '<div class="eyebrow">AGÊNCIA A ORDEM · PROTOCOLO CONCLUÍDO</div>' +
            '<h3>Ficha enviada para análise</h3>' +
            '<p>Seu personagem foi registrado e encaminhado para avaliação da administração.</p>' +
          '</section>';
      }
    } catch (error) {
      console.error('[Nova Ordem] Erro ao enviar ficha:', error);
      alert(error.message || 'Não foi possível enviar a ficha. Seus dados preenchidos continuam na tela.');
    } finally {
      busy = false;
    }
  }

  async function handleCreatorAction(button) {
    const action = button.dataset.ccAction;
    const value = Number(button.dataset.value);
    const state = creator().getState();

    if (action === 'race-roll') return rollRace();
    if (action === 'race-pick') return chooseRace(value);
    if (action === 'second-roll') return rollChi();
    if (action === 'rarity-roll') return rollRarity();

    if (action === 'jump') {
      if (!isHybrid(state) && value >= 3 && value <= 6) {
        alert('As etapas de Talento não se aplicam à raça selecionada.');
        return;
      }
      creator().update({step:Math.max(0, Math.min(7, value))});
      return;
    }

    if (action === 'back') {
      creator().update({step:Math.max(0, state.step - 1)});
      return;
    }

    if (action !== 'next') return;

    if (state.step === 0 && !state.race) {
      alert('Role os dados e escolha uma raça antes de continuar.');
      return;
    }

    if (state.step === 1 && state.race !== 4 && !state.secondRoll) {
      alert('Faça a rolagem de Chi / aprimoramento antes de continuar.');
      return;
    }

    if (state.step === 2) {
      const error = validateBasics(state);
      if (error) {
        alert(error);
        return;
      }
      creator().update({step:isHybrid(state) ? 3 : 7});
      return;
    }

    if (state.step === 4 && !state.rarity) {
      alert('Faça a rolagem de raridade antes de continuar.');
      return;
    }

    if (state.step === 5) {
      const required = state.rarity && state.rarity.value === 'Raro' ? 2 : 1;
      if (!Array.isArray(state.specializations) || state.specializations.length !== required) {
        alert('Selecione exatamente ' + required + ' especialização(ões).');
        return;
      }
    }

    if (state.step < 7) {
      creator().update({step:state.step + 1});
    } else {
      await submitCharacter();
    }
  }

  document.addEventListener('click', async event => {
    const target = event.target;
    if (!target || !target.closest) return;

    const authButton = target.closest('[data-no-auth]');
    if (authButton) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (authButton.dataset.noAuth === 'recovery') recoveryRequestScreen();
      else await authenticate(authButton.dataset.noAuth);
      return;
    }

    if (target.closest('[data-no-start]')) { event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); await startCharacterCreation(); return; }
    if (target.closest('[data-no-resume]')) { event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); if (window.go) window.go('characters'); if (creator()) creator().render(); return; }
    if (target.closest('[data-no-back-access]')) { event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); authScreen(); return; }
    if (target.closest('[data-no-logout]')) { event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); await db.auth.signOut(); characterId = null; completed = false; authScreen('Você saiu da sua conta.'); return; }

    const button = target.closest('[data-cc-action]');
    if (!button || !root() || !root().contains(button) || !creator() || completed) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (busy) return;

    button.disabled = true;
    try {
      await handleCreatorAction(button);
      if (characterId && creator()) persistActiveDraft();
    } catch (error) {
      console.error('[Nova Ordem] Erro:', error);
      alert(error.message || 'Não foi possível concluir essa etapa.');
      if (characterId && creator()) persistActiveDraft();
    } finally {
      button.disabled = false;
    }
  }, true);

  document.addEventListener('submit', async event => {
    const form = event.target;
    if (!form || !form.matches || !form.matches('[data-no-recovery-form]')) return;
    event.preventDefault();
    event.stopPropagation();
    await saveRecoveredPassword(form);
  }, true);

  document.addEventListener('submit', async event => {
    const form = event.target;
    if (!form || !form.matches || !form.matches('[data-no-recovery-request]')) return;
    event.preventDefault();
    event.stopPropagation();
    await requestPasswordRecovery(form);
  }, true);

  document.addEventListener('input', event => {
    if (characterId && creator() && event.target && event.target.closest('#content')) persistActiveDraft();
  }, true);

  document.addEventListener('change', event => {
    const target = event.target;
    if (!target || !target.closest) return;
    const checkbox = target.closest('[data-cc-spec]');
    if (!checkbox || !creator() || completed) return;

    event.stopPropagation();
    event.stopImmediatePropagation();

    const state = creator().getState();
    const selected = new Set(state.specializations || []);
    const specialization = checkbox.dataset.ccSpec;
    const limit = state.rarity && state.rarity.value === 'Raro' ? 2 : 1;

    if (checkbox.checked) {
      if (selected.size >= limit) {
        checkbox.checked = false;
        alert('A raridade ' + (state.rarity ? state.rarity.value : 'Comum') +
          ' permite ' + limit + ' especialização(ões).');
        return;
      }
      selected.add(specialization);
    } else {
      selected.delete(specialization);
    }
    creator().update({specializations:Array.from(selected)});
    persistActiveDraft();
  }, true);

  async function detectCreator() {
    const element = root();
    if (!element || !element.querySelector('.cc-top') ||
        !element.querySelector('.cc-card') || !creator() ||
        opening || busy || characterId) return;

    opening = true;
    try {
      const sessionResult = await db.auth.getSession();
      if (sessionResult.error) throw sessionResult.error;
      if (!sessionResult.data.session) {
        authScreen('Entre na sua conta para iniciar uma ficha.');
        return;
      }
      accountScreen('Sua conta está conectada. Clique em “Criar personagem” para iniciar uma ficha.');
    } catch (error) {
      console.error('[Nova Ordem] Não foi possível verificar a conta:', error);
      showMessage(error.message || 'Não foi possível verificar a conta.');
    } finally {
      opening = false;
    }
  }

  function hasRecoveryMarker() {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const searchParams = new URLSearchParams(window.location.search);
    return hashParams.get('type') === 'recovery' || searchParams.get('type') === 'recovery';
  }

  db.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      recoveryMode = true;
      if (root()) passwordRecoveryScreen();
      return;
    }
    if (event === 'SIGNED_OUT' || !session) {
      characterId = null;
      completed = false;
    }
  });

  function boot() {
    const element = root();
    if (!element) return;

    if (observer) observer.disconnect();
    observer = new MutationObserver(() => detectCreator());
    observer.observe(element, {childList:true, subtree:true});
    if (hasRecoveryMarker()) recoveryMode = true;
    if (recoveryMode) { passwordRecoveryScreen(); return; }
    db.auth.getSession().then(async ({data, error}) => {
      if (error) { authScreen('Não foi possível verificar sua sessão.'); return; }
      const session = data && data.session;
      if (!session) { authScreen(); return; }
      try { await restoreActiveDraft(session); } catch (error) { console.warn('[Nova Ordem] Não foi possível restaurar o rascunho local:', error); }
      accountScreen();
    }).catch(() => authScreen('Não foi possível verificar sua sessão.'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, {once:true});
  } else {
    boot();
  }
})();
