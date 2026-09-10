/* ============================================================
   pages/cards.js — банковские карты: оформление, баланс на карте
   ============================================================ */

'use strict';

/* Транслитерация ФИО для имени на карте */
function translitName(name) {
  const map = { 'а':'A','б':'B','в':'V','г':'G','д':'D','е':'E','ё':'E','ж':'ZH','з':'Z','и':'I','й':'Y',
    'к':'K','л':'L','м':'M','н':'N','о':'O','п':'P','р':'R','с':'S','т':'T','у':'U','ф':'F',
    'х':'KH','ц':'TS','ч':'CH','ш':'SH','щ':'SCH','ъ':'','ы':'Y','ь':'','э':'E','ю':'YU','я':'YA' };
  const words = String(name || '').toLowerCase().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map(w => {
    let out = '';
    for (const ch of w) out += (map[ch] !== undefined ? map[ch] : ch.toUpperCase());
    return out.toUpperCase();
  }).join(' ') || 'CARDHOLDER';
}

/* Номер карты: платёжная система определяет префикс */
function cardNumber(system) {
  const prefix = system === 'Visa' ? '4276' : system === 'Mastercard' ? '5321' : '2202';
  let tail = '';
  for (let i = 0; i < 12; i++) tail += Math.floor(Math.random() * 10);
  const digits = prefix + tail;
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

/* Срок действия: сегодня + 3 года */
function validThru() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 3);
  return pad2(d.getMonth() + 1) + '/' + String(d.getFullYear()).slice(-2);
}

/* Лог-событие карты (оформление, переоформление, блокировка) */
function pushCardHistory(card, event) {
  card.history = card.history || [];
  card.history.push({ date: nowStr(), event: event });
}

/* Текущий тариф карты (по умолчанию — базовый) */
function cardTariff(card) {
  return CARD_TARIFFS.find(t => t.id === card.tariff) || CARD_TARIFFS[0];
}

function renderCards() {
  const grid = byId('card-list');
  if (!grid || !state) return;
  state.cards = state.cards || [];

  if (state.cards.length === 0) {
    grid.innerHTML = '<div class="empty">Карт пока нет — оформите первую слева.</div>';
    return;
  }

  grid.innerHTML = state.cards.map(card => {
    const program = CARD_PROGRAMS.find(p => p.id === card.program) || CARD_PROGRAMS[0];
    card.status = card.status || 'active';
    card.history = card.history || [];
    card.limits = card.limits || { daily: 0, monthly: 0 };
    card.restrictions = card.restrictions || {};
    const tariff = cardTariff(card);
    const restrActive = CARD_RESTRICTIONS.filter(r => card.restrictions[r.id]).map(r => r.name).join(', ');
    const blocked = card.status === 'blocked';
    return (
      '<div class="bank-card" data-card="' + card.id + '">' +
        '<div class="bank-card__inner bank-card__inner--' + program.design + (blocked ? ' bank-card__inner--blocked' : '') + '">' +
          '<div class="bank-card__top">' +
            '<span class="bank-card__bank">' + escapeHtml(getSettings().bankName) + '</span>' +
            '<span class="bank-card__ps">' + escapeHtml(program.system) + '</span>' +
          '</div>' +
          (card.name ? '<div class="bank-card__custom">' + escapeHtml(card.name) + '</div>' : '') +
          '<div class="bank-card__chip"></div>' +
          '<div class="bank-card__balance">' +
            '<span class="bank-card__balance-label">Доступно</span>' +
            '<b class="bank-card__balance-value">' + fmtMoney(cardBalance(card), card.currency) + '</b>' +
          '</div>' +
          '<div class="bank-card__number">' + escapeHtml(card.number) + '</div>' +
          '<div class="bank-card__bottom">' +
            '<span>' + escapeHtml(card.holder) + '</span>' +
            '<span>' + card.validThru + '</span>' +
          '</div>' +
          (blocked ? '<div class="bank-card__overlay">🔒 Заблокирована</div>' : '') +
        '</div>' +
        '<div class="bank-card__meta">' +
          '<div class="row"><span>Название</span><span>' + escapeHtml(card.name || program.name) + '</span></div>' +
          '<div class="row"><span>Тариф</span><span>' + escapeHtml(tariff.name + (tariff.price ? ' · ' + tariff.price + ' ₽/мес' : ' · без платы')) + '</span></div>' +
          '<div class="row"><span>Лимит в день</span><span>' + (card.limits.daily ? fmtMoney(card.limits.daily, card.currency) : 'без лимита') + '</span></div>' +
          '<div class="row"><span>Лимит в месяц</span><span>' + (card.limits.monthly ? fmtMoney(card.limits.monthly, card.currency) : 'без лимита') + '</span></div>' +
          '<div class="row"><span>Ограничения</span><span>' + escapeHtml(restrActive || 'нет') + '</span></div>' +
          '<div class="row"><span>Счёт</span><span>' + escapeHtml(cardAccountLabel(card.accountId)) + '</span></div>' +
          '<div class="row"><span>Состояние</span><span>' + (blocked ? 'Заблокирована' : 'Активна') + '</span></div>' +
          '<div class="row"><span>Переоформлений</span><span>' + card.history.filter(h => h.event.indexOf('переоформлена') !== -1).length + '</span></div>' +
        '</div>' +
        '<details class="card-settings">' +
          '<summary>⚙ Настройки карты</summary>' +
          '<div class="card-settings__section">' +
            '<div class="card-settings__title">Тариф обслуживания</div>' +
            '<select class="card-setting-input" data-setting="tariff">' +
              CARD_TARIFFS.map(t =>
                '<option value="' + t.id + '"' + (t.id === tariff.id ? ' selected' : '') + '>' + t.name + (t.price ? ' — ' + t.price + ' ₽/мес' : ' — бесплатно') + '</option>'
              ).join('') +
            '</select>' +
            '<div class="card-settings__note">' + escapeHtml(tariff.desc) + '</div>' +
          '</div>' +
          '<div class="card-settings__section">' +
            '<div class="card-settings__title">Название карты</div>' +
            '<div class="card-setting-row">' +
              '<input type="text" class="card-setting-input" data-setting-input="name" maxlength="24" placeholder="' + escapeHtml(program.name) + '" value="' + escapeHtml(card.name || '') + '">' +
              '<button type="button" class="btn btn--small btn--ghost" data-act="save-name">Сохранить</button>' +
            '</div>' +
            '<div class="card-settings__note">Например: «Копилка», «На жизнь». Очистите поле — вернётся название типа карты.</div>' +
          '</div>' +
          '<div class="card-settings__section">' +
            '<div class="card-settings__title">Лимиты операций (₽)</div>' +
            '<div class="card-setting-row">' +
              '<label>В день<input type="number" class="card-setting-input" data-setting-input="daily" min="0" step="500" value="' + card.limits.daily + '"></label>' +
              '<label>В месяц<input type="number" class="card-setting-input" data-setting-input="monthly" min="0" step="1000" value="' + card.limits.monthly + '"></label>' +
              '<button type="button" class="btn btn--small btn--ghost" data-act="save-limits">Сохранить</button>' +
            '</div>' +
            '<div class="card-settings__note">0 — операции без лимита.</div>' +
          '</div>' +
          '<div class="card-settings__section">' +
            '<div class="card-settings__title">Ограничения</div>' +
            CARD_RESTRICTIONS.map(r =>
              '<label class="card-restr"><input type="checkbox" data-restr="' + r.id + '"' + (card.restrictions[r.id] ? ' checked' : '') + '> Запретить: ' + r.name + '</label>'
            ).join('') +
          '</div>' +
          '<div class="card-settings__section card-settings__actions">' +
            '<button type="button" class="btn btn--small ' + (blocked ? 'btn--accent' : 'btn--ghost') + '" data-act="toggle-block">' +
              (blocked ? 'Разблокировать' : 'Заблокировать') +
            '</button>' +
            '<button type="button" class="btn btn--small btn--ghost" data-act="reissue">Переоформить</button>' +
          '</div>' +
          '<div class="card-history">' +
            '<div class="card-history__title">История карты</div>' +
            (card.history.slice().reverse().map(h =>
              '<div class="row"><span>' + h.date + '</span><span>' + escapeHtml(h.event) + '</span></div>'
            ).join('') || '<div class="empty">Событий пока нет</div>') +
          '</div>' +
        '</details>' +
        '<button class="btn btn--small btn--danger btn--full" data-act="close-card">Закрыть карту</button>' +
      '</div>'
    );
  }).join('');
}

function cardAccountLabel(accountId) {
  const acc = state.accounts.find(a => a.id === accountId);
  if (!acc) return '—';
  return acc.type + ' ····' + acc.number.slice(-4) + ' (' + acc.currency + ')';
}


/* Доступный на карте баланс = баланс привязанного счёта */
function cardBalance(card) {
  const acc = state.accounts.find(a => a.id === card.accountId);
  return acc ? acc.balance : 0;
}

function fillCardPrograms() {
  const sel = byId('card-type');
  if (!sel || sel.options.length) return;
  sel.innerHTML = CARD_PROGRAMS.map(p =>
    '<option value="' + p.id + '">' + p.name + ' — ' + p.system + '</option>'
  ).join('');
  sel.addEventListener('change', updateCardDesc);
  updateCardDesc();
}

function updateCardDesc() {
  const el = byId('card-type-desc');
  if (!el) return;
  const p = CARD_PROGRAMS.find(x => x.id === byId('card-type').value);
  el.textContent = p ? p.desc : '';
}

function fillCardAccounts() {
  const sel = byId('card-account');
  if (!sel || !state) return;
  const selected = sel.value;
  sel.innerHTML = state.accounts.map(a =>
    '<option value="' + a.id + '">' + escapeHtml(a.type + ' ····' + a.number.slice(-4) + ' · ' + fmtMoney(a.balance, a.currency)) + '</option>'
  ).join('');
  if (selected && state.accounts.some(a => a.id === selected)) sel.value = selected;
}

function handleCardSubmit(e) {
  e.preventDefault();
  if (!state.accounts.length) {
    showMessage('Сначала откройте счёт на странице «Счета» — карта привязывается к счёту', 'error');
    return;
  }
  const program = CARD_PROGRAMS.find(p => p.id === byId('card-type').value) || CARD_PROGRAMS[0];
  const accountId = byId('card-account').value;
  if (!accountId) { showMessage('Выберите счёт для карты', 'error'); return; }

  state.cards.push({
    id: uid('card'),
    program: program.id,
    accountId: accountId,
    number: cardNumber(program.system),
    holder: translitName(state.client.name),
    validThru: validThru(),
    openedAt: todayStr(),
    status: 'active',
    history: [],
  });
  const newCard = state.cards[state.cards.length - 1];
  pushCardHistory(newCard, 'Карта оформлена');
  addOp(currentUser().name, 'клиент', 'Оформление карты', 'Оформлена карта «' + program.name + '» (' + program.system + '), номер ' + newCard.number);
  saveState();
  renderAll();
  showMessage('Карта «' + program.name + '» (' + program.system + ') оформлена!', 'success');
}

function handleCardActions(e) {
  const cardEl = e.target.closest('.bank-card[data-card]');
  if (!cardEl) return;
  const card = state.cards.find(c => c.id === cardEl.dataset.card);
  if (!card) return;
  const act = e.target.dataset.act;
  const program = CARD_PROGRAMS.find(p => p.id === card.program) || CARD_PROGRAMS[0];

  if (act === 'toggle-block') {
    card.status = card.status === 'blocked' ? 'active' : 'blocked';
    const blocked = card.status === 'blocked';
    pushCardHistory(card, blocked ? 'Карта заблокирована' : 'Карта разблокирована');
    saveState();
    renderAll();
    showMessage(blocked ? 'Карта ' + card.number + ' заблокирована' : 'Карта ' + card.number + ' разблокирована', blocked ? 'error' : 'success');

  } else if (act === 'reissue') {
    if (card.status === 'blocked') {
      showMessage('Сначала разблокируйте карту — заблокированную переоформить нельзя', 'error');
      return;
    }
    if (!confirm('Переоформить карту ' + card.number + '?\n\nБудет выпущена новая карта с новым номером и сроком действия. Привязка к счёту сохранится.')) return;
    const oldNumber = card.number;
    card.number = cardNumber(program.system);
    card.validThru = validThru();
    pushCardHistory(card, 'Карта переоформлена · ' + oldNumber + ' → ' + card.number);
    addOp(currentUser().name, 'клиент', 'Переоформление карты', 'Карта ' + oldNumber + ' переоформлена на ' + card.number);
    saveState();
    renderAll();
    showMessage('Карта переоформлена! Новый номер: ' + card.number, 'success');

  } else if (act === 'save-name') {
    const input = cardEl.querySelector('[data-setting-input="name"]');
    const val = (input && input.value.trim()) || '';
    card.name = val;
    pushCardHistory(card, val ? 'Карта переименована в «' + val + '»' : 'Название карты сброшено');
    if (val) addOp(currentUser().name, 'клиент', 'Настройки карты', 'Карта ' + card.number + ' переименована в «' + val + '»');
    saveState();
    renderAll();
    showMessage(val ? 'Название карты сохранено: «' + val + '»' : 'Название карты сброшено', 'success');

  } else if (act === 'save-limits') {
    const daily = Math.max(0, Math.round(Number(cardEl.querySelector('[data-setting-input="daily"]').value) || 0));
    const monthly = Math.max(0, Math.round(Number(cardEl.querySelector('[data-setting-input="monthly"]').value) || 0));
    card.limits = { daily: daily, monthly: monthly };
    pushCardHistory(card, 'Изменены лимиты: ' + (daily ? fmtMoney(daily, 'RUB') + '/день' : 'дневной снят') + ', ' + (monthly ? fmtMoney(monthly, 'RUB') + '/мес' : 'месячный снят'));
    saveState();
    renderAll();
    showMessage('Лимиты карты обновлены', 'success');

  } else if (act === 'close-card') {
    if (!confirm('Закрыть карту ' + card.number + '?')) return;
    state.cards = state.cards.filter(c => c.id !== card.id);
    saveState();
    renderAll();
    showMessage('Карта закрыта', 'success');
  }
}

/* Мгновенное применение настроек: тариф и ограничения (select/checkbox) */
function handleCardSettingsChange(e) {
  const cardEl = e.target.closest('.bank-card[data-card]');
  if (!cardEl) return;
  const card = state.cards.find(c => c.id === cardEl.dataset.card);
  if (!card) return;

  if (e.target.dataset.setting === 'tariff') {
    const t = CARD_TARIFFS.find(x => x.id === e.target.value) || CARD_TARIFFS[0];
    card.tariff = t.id;
    pushCardHistory(card, 'Изменён тариф: «' + t.name + '» (' + (t.price ? t.price + ' ₽/мес' : 'без платы') + ')');
    addOp(currentUser().name, 'клиент', 'Настройки карты', 'Для карты ' + card.number + ' изменён тариф на «' + t.name + '»');
    saveState();
    renderAll();
    showMessage('Тариф карты изменён на «' + t.name + '»', 'success');

  } else if (e.target.dataset.restr) {
    const r = CARD_RESTRICTIONS.find(x => x.id === e.target.dataset.restr);
    card.restrictions = card.restrictions || {};
    card.restrictions[r.id] = e.target.checked;
    pushCardHistory(card, (e.target.checked ? 'Установлено ограничение: ' : 'Снято ограничение: ') + r.name);
    saveState();
    renderAll();
    showMessage(e.target.checked ? 'Ограничение «' + r.name + '» включено' : 'Ограничение «' + r.name + '» снято', 'success');
  }
}

/* Переход с главной: cards.html#<id> — открыть настройки этой карты */
function openCardFromHash() {
  const id = decodeURIComponent((location.hash || '').replace('#', ''));
  if (!id) return;
  const el = document.querySelector('.bank-card[data-card="' + id + '"]');
  if (!el) return;
  el.classList.add('bank-card--selected');
  const d = el.querySelector('details.card-settings');
  if (d) d.open = true;
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
}

function initPage() {
  fillCardPrograms();
  fillCardAccounts();
  byId('card-form').addEventListener('submit', handleCardSubmit);
  byId('card-list').addEventListener('click', handleCardActions);
  byId('card-list').addEventListener('change', handleCardSettingsChange);
  openCardFromHash();
}