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
  let observer = null;

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
        '<div class="eyebrow">AGÊNCIA A ORDEM · ACESSO</div>' +
        '<h3>Identificação do jogador</h3>' +
        '<p>' + escapeHtml(message || 'Entre na sua conta para criar uma ficha.') + '</p>' +
        '<label class="cc-field">E-mail' +
          '<input data-no-email type="email" autocomplete="email" placeholder="seu@email.com">' +
        '</label>' +
        '<label class="cc-field">Senha' +
          '<input data-no-password type="password" autocomplete="current-password" placeholder="Sua senha">' +
        '</label>' +
        '<div class="cc-nav" style="margin-top:18px">' +
          '<button class="save" type="button" data-no-auth="login">ENTRAR</button>' +
          '<button class="close" type="button" data-no-auth="signup">CRIAR CONTA</button>' +
        '</div>' +
      '</section>';
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
      await createDraft();
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

    const id = await rpc('create_character_draft');
    characterId = typeof id === 'string' ? id : (id && (id.id || id.character_id));
    if (!characterId) throw new Error('O banco não retornou o identificador da ficha.');
    if (creator()) creator().reset();
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
      await authenticate(authButton.dataset.noAuth);
      return;
    }

    const button = target.closest('[data-cc-action]');
    if (!button || !root() || !root().contains(button) || !creator() || completed) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (busy) return;

    button.disabled = true;
    try {
      await handleCreatorAction(button);
    } catch (error) {
      console.error('[Nova Ordem] Erro:', error);
      alert(error.message || 'Não foi possível concluir essa etapa.');
    } finally {
      button.disabled = false;
    }
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
  }, true);

  async function detectCreator() {
    const element = root();
    if (!element || !element.querySelector('.cc-top') ||
        !element.querySelector('.cc-card') || !creator() ||
        opening || characterId || completed) return;

    opening = true;
    try {
      const sessionResult = await db.auth.getSession();
      if (sessionResult.error) throw sessionResult.error;
      if (!sessionResult.data.session) {
        authScreen('Entre na sua conta para iniciar uma ficha.');
        return;
      }
      await createDraft();
    } catch (error) {
      console.error('[Nova Ordem] Não foi possível iniciar a ficha:', error);
      showMessage(error.message || 'Não foi possível iniciar uma ficha.');
    } finally {
      opening = false;
    }
  }

  function boot() {
    const element = root();
    if (!element) return;

    if (observer) observer.disconnect();
    observer = new MutationObserver(() => detectCreator());
    observer.observe(element, {childList:true, subtree:true});
    detectCreator();

    db.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        characterId = null;
        completed = false;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, {once:true});
  } else {
    boot();
  }
})();
