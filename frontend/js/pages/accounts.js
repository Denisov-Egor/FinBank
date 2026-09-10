/* ============================================================
   pages/accounts.js — счета: открытие, пополнение, снятие, закрытие
   ============================================================ */

'use strict';

function renderClientCard() {
  const card = byId('client-card');
  if (!card || !state) return;

  const c = state.client;
  card.innerHTML =
    '<div>' +
      '<div class="client-card__name">' + escapeHtml(c.name) + '</div>' +
      '<div class="client-card__info">Паспорт: ' + escapeHtml(c.passport) + ' · Телефон: ' + escapeHtml(c.phone) + '</div>' +
    '</div>' +
    '<button class="btn btn--small" id="btn-reset-demo">Сбросить демо-данные</button>';

  byId('btn-reset-demo').addEventListener('click', resetDemoState);
}

function renderAccounts() {
  const list = byId('account-list');
  if (!list || !state) return;

  if (state.accounts.length === 0) {
    list.innerHTML = '<div class="empty">Счетов пока нет — откройте первый счёт слева.</div>';
    return;
  }

  list.innerHTML = state.accounts.map(acc => {
    const badge = acc.currency === 'RUB' ? '' : ' badge--muted';
    return (
      '<div class="item" data-acc="' + acc.id + '">' +
        '<div class="item__head">' +
          '<span class="item__title">' + escapeHtml(acc.type) + ' · ' + CURRENCY_NAMES[acc.currency] + '</span>' +
          '<span class="item__badge' + badge + '">' + fmtMoney(acc.balance, acc.currency) + '</span>' +
        '</div>' +
        '<div class="item__body">' +
          '<div class="row"><span>Номер счёта</span><span>' + acc.number + '</span></div>' +
          '<div class="row"><span>Дата открытия</span><span>' + acc.openedAt + '</span></div>' +
        '</div>' +
        '<div class="item__actions">' +
          '<input type="number" min="1" placeholder="Сумма">' +
          '<button class="btn btn--small btn--ghost" data-act="add">Пополнить</button>' +
          '<button class="btn btn--small btn--ghost" data-act="take">Снять</button>' +
          '<button class="btn btn--small btn--danger" data-act="close">Закрыть</button>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

function findAccount(id) {
  return state.accounts.find(a => a.id === id);
}

function handleAccountSubmit(e) {
  e.preventDefault();
  const type = byId('account-type').value;
  const currency = byId('account-currency').value;
  const initial = Math.max(0, Number(byId('account-initial').value) || 0);

  state.accounts.push({
    id: uid('acc'), type: type, currency: currency,
    balance: initial, number: accountNumber(currency), openedAt: todayStr(),
  });
  saveState();
  renderAll();
  byId('account-initial').value = '0';
  showMessage('Счёт «' + type + '» (' + CURRENCY_NAMES[currency] + ') открыт', 'success');
}

function handleAccountActions(e) {
  const itemEl = e.target.closest('.item[data-acc]');
  if (!itemEl) return;
  const acc = findAccount(itemEl.dataset.acc);
  if (!acc) return;
  const act = e.target.dataset.act;
  const input = itemEl.querySelector('input[type="number"]');
  const amount = Math.abs(Number(input && input.value) || 0);

  if (act === 'add') {
    if (!amount || amount <= 0) { showMessage('Укажите сумму пополнения', 'error'); return; }
    acc.balance += amount;
    saveState();
    renderAll();
    showMessage('Счёт пополнен на ' + fmtMoney(amount, acc.currency), 'success');
  } else if (act === 'take') {
    if (!amount || amount <= 0) { showMessage('Укажите сумму снятия', 'error'); return; }
    if (amount > acc.balance) { showMessage('Недостаточно средств', 'error'); return; }
    acc.balance -= amount;
    saveState();
    renderAll();
    showMessage('Снято ' + fmtMoney(amount, acc.currency), 'success');
  } else if (act === 'close') {
    if (!confirm('Закрыть счёт «' + acc.type + '» с остатком ' + fmtMoney(acc.balance, acc.currency) + '?')) return;
    state.accounts = state.accounts.filter(a => a.id !== acc.id);
    saveState();
    renderAll();
    showMessage('Счёт закрыт', 'success');
  }
}

function initPage() {
  byId('account-form').addEventListener('submit', handleAccountSubmit);
  byId('account-list').addEventListener('click', handleAccountActions);
}