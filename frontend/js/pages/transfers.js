/* ============================================================
   pages/transfers.js — переводы: формы, история, селекты
   ============================================================ */

'use strict';

/* Списки переводов: «со счёта» и «свой счёт» */
function fillTransferSelects() {
  const fromSel = byId('transfer-from');
  if (!fromSel || !state) return;
  const ownSel = byId('transfer-to-own');
  const extSel = byId('transfer-to-external');
  const selectedFrom = fromSel.value;

  fromSel.innerHTML = state.accounts.map(a =>
    '<option value="' + a.id + '">' + a.type + ' · ' + CURRENCY_NAMES[a.currency] + ' ···' + a.number.slice(-4) + '</option>'
  ).join('');

  if (selectedFrom && findAccount(selectedFrom)) fromSel.value = selectedFrom;
  const fromAcc = findAccount(fromSel.value);

  const others = state.accounts.filter(a => a.id !== (fromAcc && fromAcc.id) && a.currency === (fromAcc && fromAcc.currency));
  ownSel.innerHTML = others.length
    ? others.map(a =>
        '<option value="' + a.id + '">' + a.type + ' ···' + a.number.slice(-4) + '</option>'
      ).join('')
    : '<option value="">Нет подходящих счетов</option>';

  extSel.innerHTML = EXTERNAL_CLIENTS.map(c =>
    '<option value="' + c.number + '">' + c.name + ' (…' + c.number.slice(-4) + ')</option>'
  ).join('');
}

function updateTransferCalc() {
  const sel = byId('transfer-from');
  if (!sel || !state) return;
  const from = findAccount(sel.value);
  const span = byId('transfer-from-bal');
  span.textContent = from ? ' (баланс: ' + fmtMoney(from.balance, from.currency) + ')' : '';
}

function renderTransfers() {
  const list = byId('transfer-list');
  if (!list || !state) return;

  if (state.transfers.length === 0) {
    list.innerHTML = '<div class="empty">Переводов пока не было.</div>';
    return;
  }

  list.innerHTML = state.transfers.slice().reverse().map(t => {
    return (
      '<div class="item transfer-item">' +
        '<div class="item__head">' +
          '<span class="item__title">' + escapeHtml(t.from) + ' → ' + escapeHtml(t.to) + '</span>' +
          '<span class="sign-minus">−' + fmtMoney(t.amount, t.currency) + '</span>' +
        '</div>' +
        '<div class="item__body">' +
          '<div class="row"><span>Дата</span><span>' + t.date + '</span></div>' +
          (t.comment ? '<div class="row"><span>Назначение</span><span>' + escapeHtml(t.comment) + '</span></div>' : '') +
        '</div>' +
      '</div>'
    );
  }).join('');
}

function handleTransferSubmit(e) {
  e.preventDefault();
  const from = findAccount(byId('transfer-from').value);
  if (!from) { showMessage('Выберите счёт списания', 'error'); return; }

  const amount = Number(byId('transfer-amount').value);
  if (!amount || amount <= 0) { showMessage('Укажите сумму перевода', 'error'); return; }
  if (amount > from.balance) {
    showMessage('Недостаточно средств: на счету ' + fmtMoney(from.balance, from.currency), 'error');
    return;
  }

  const targetType = byId('transfer-target-type').value;
  const comment = byId('transfer-comment').value.trim();
  const date = todayStr();

  if (targetType === 'own') {
    const to = findAccount(byId('transfer-to-own').value);
    if (!to) { showMessage('Выберите счёт получателя', 'error'); return; }
    if (to.id === from.id) { showMessage('Нельзя перевести на тот же счёт', 'error'); return; }
    if (to.currency !== from.currency) {
      showMessage('Перевод возможен только между счетами в одной валюте', 'error');
      return;
    }

    from.balance -= amount;
    to.balance += amount;
    state.transfers.push({
      id: uid('tr'), date: date,
      from: from.type + ' ···' + from.number.slice(-4),
      to: to.type + ' ···' + to.number.slice(-4),
      amount: amount, currency: from.currency, comment: comment, direction: 'out',
    });
    addOp('Клиент: ' + state.client.name, 'Клиент', 'Перевод между своими счетами',
      fmtMoney(amount, from.currency) + ': ···' + from.number.slice(-4) + ' → ···' + to.number.slice(-4), amount);
    saveState();
    renderAll();
    byId('transfer-amount').value = '1000';
    byId('transfer-comment').value = '';
    showMessage('Перевод выполнен: ' + fmtMoney(amount, from.currency), 'success');
    return;
  }

  /* Внешний перевод клиенту банка */
  if (from.currency !== 'RUB') {
    showMessage('Внешние переводы выполняются только в рублях', 'error');
    return;
  }
  const number = byId('transfer-to-external').value;
  const client = EXTERNAL_CLIENTS.find(c => c.number === number);
  if (!client) { showMessage('Получатель не найден в базе банка', 'error'); return; }

  from.balance -= amount;
  state.transfers.push({
    id: uid('tr'), date: date,
    from: from.type + ' ···' + from.number.slice(-4),
    to: client.name,
    amount: amount, currency: 'RUB', comment: comment, direction: 'out',
  });
  addOp('Клиент: ' + state.client.name, 'Клиент', 'Внешний перевод клиенту банка',
    fmtMoney(amount, 'RUB') + ' → ' + client.name, amount);
  saveState();
  renderAll();
  byId('transfer-amount').value = '1000';
  byId('transfer-comment').value = '';
  showMessage('Перевод ' + fmtMoney(amount, 'RUB') + ' → ' + client.name + ' выполнен', 'success');
}

function initPage() {
  byId('transfer-form').addEventListener('submit', handleTransferSubmit);
  byId('transfer-from').addEventListener('change', () => {
    fillTransferSelects();
    updateTransferCalc();
  });
  byId('transfer-target-type').addEventListener('change', () => {
    const isExternal = byId('transfer-target-type').value === 'external';
    byId('field-transfer-to').classList.toggle('hidden', isExternal);
    byId('field-transfer-external').classList.toggle('hidden', !isExternal);
  });
}