/* ============================================================
   pages/payments.js — оплата услуг: мобильная связь, ЖКХ и др.
   ============================================================ */

'use strict';

let currentPayCat = 'mobile';
let currentPayProvider = 'mts';

/* ---------- Категории услуг (табы) ---------- */

function renderPayCategories() {
  const box = byId('pay-cats');
  if (!box || box.children.length) return;
  box.innerHTML = PAYMENT_CATEGORIES.map(c =>
    '<button type="button" class="cat-tab' + (c.id === currentPayCat ? ' active' : '') + '" data-cat="' + c.id + '">' +
      c.icon + ' ' + escapeHtml(c.name) +
    '</button>'
  ).join('');
}

function handlePayCatsClick(e) {
  const btn = e.target.closest('.cat-tab');
  if (!btn) return;
  currentPayCat = btn.dataset.cat;
  document.querySelectorAll('.cat-tab').forEach(b => b.classList.toggle('active', b === btn));
  renderPayProviders();
}

/* ---------- Плитки операторов и компаний ---------- */

function renderPayProviders() {
  const box = byId('pay-providers');
  if (!box) return;
  const list = PAYMENT_SERVICES.filter(p => p.cat === currentPayCat);
  if (!list.some(p => p.id === currentPayProvider)) currentPayProvider = list.length ? list[0].id : null;

  box.innerHTML = list.map(p =>
    '<button type="button" class="prov-chip' + (p.id === currentPayProvider ? ' active' : '') + '" data-prov="' + p.id + '">' +
      '<span class="prov-chip__logo prov-chip__logo--' + p.design + '">' + p.short + '</span>' +
      '<span class="prov-chip__name">' + escapeHtml(p.name) + '</span>' +
    '</button>'
  ).join('');
  updateProviderForm();
}

function handlePayProvidersClick(e) {
  const btn = e.target.closest('.prov-chip');
  if (!btn) return;
  currentPayProvider = btn.dataset.prov;
  document.querySelectorAll('.prov-chip').forEach(b => b.classList.toggle('active', b === btn));
  updateProviderForm();
}

function updateProviderForm() {
  const p = PAYMENT_SERVICES.find(x => x.id === currentPayProvider);
  const info = byId('pay-provider-info');
  const label = byId('pay-target-label');
  const input = byId('pay-target');
  if (info) info.textContent = p ? p.name + ' — ' + p.desc : 'Выберите оператора или компанию';
  if (label) label.textContent = p ? p.fieldLabel : 'Номер';
  if (input) input.placeholder = p ? p.placeholder : '';
}

/* ---------- Счета для списания ---------- */

function fillPaymentAccounts() {
  const sel = byId('pay-account');
  if (!sel || !state) return;
  const selected = sel.value;
  sel.innerHTML = state.accounts.map(a =>
    '<option value="' + a.id + '">' + escapeHtml(a.type + ' ····' + a.number.slice(-4) + ' · ' + fmtMoney(a.balance, a.currency)) + '</option>'
  ).join('');
  if (selected && state.accounts.some(a => a.id === selected)) sel.value = selected;
}

/* ---------- Оплата и история ---------- */

function handlePaymentSubmit(e) {
  e.preventDefault();
  const p = PAYMENT_SERVICES.find(x => x.id === currentPayProvider);
  if (!p) { showMessage('Выберите оператора или компанию', 'error'); return; }

  const target = byId('pay-target').value.trim();
  const amount = Math.round(Number(byId('pay-amount').value) || 0);
  const acc = state.accounts.find(a => a.id === byId('pay-account').value);

  if (target.length < 5) { showMessage('Укажите ' + p.fieldLabel.toLowerCase(), 'error'); return; }
  if (!amount || amount < 10) { showMessage('Минимальная сумма платежа — 10 ₽', 'error'); return; }
  if (!acc) { showMessage('Выберите счёт для списания', 'error'); return; }
  if (acc.currency !== 'RUB') { showMessage('Услуги оплачиваются в рублях — выберите рублёвый счёт', 'error'); return; }
  if (amount > acc.balance) { showMessage('Недостаточно средств на счёте', 'error'); return; }

  acc.balance -= amount;
  state.payments = state.payments || [];
  state.payments.push({
    id: uid('pay'), date: nowStr(), cat: p.cat, provider: p.name,
    target: target, amount: amount, currency: 'RUB',
    accountLabel: acc.type + ' ····' + acc.number.slice(-4),
  });
  saveState();
  byId('payment-form').reset();
  renderAll();
  showMessage('Оплачено ' + fmtMoney(amount, 'RUB') + ' — ' + p.name, 'success');
}

function renderPayments() {
  const list = byId('payment-list');
  if (!list || !state) return;
  state.payments = state.payments || [];

  if (!state.payments.length) {
    list.innerHTML = '<div class="empty">Платежей пока нет — оплатите первую услугу слева.</div>';
    return;
  }

  list.innerHTML = state.payments.slice().reverse().map(p => {
    const cat = PAYMENT_CATEGORIES.find(c => c.id === p.cat);
    return (
      '<div class="item">' +
        '<div class="item__head">' +
          '<span class="item__title">' + (cat ? cat.icon + ' ' : '') + escapeHtml(p.provider) + '</span>' +
          '<span class="item__badge badge--accent">− ' + fmtMoney(p.amount, p.currency) + '</span>' +
        '</div>' +
        '<div class="item__body">' +
          '<div class="row"><span>Получатель</span><span>' + escapeHtml(p.target) + '</span></div>' +
          '<div class="row"><span>Счёт</span><span>' + escapeHtml(p.accountLabel) + '</span></div>' +
          '<div class="row"><span>Дата</span><span>' + p.date + '</span></div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

function initPage() {
  renderPayCategories();
  renderPayProviders();
  fillPaymentAccounts();
  byId('pay-cats').addEventListener('click', handlePayCatsClick);
  byId('pay-providers').addEventListener('click', handlePayProvidersClick);
  byId('payment-form').addEventListener('submit', handlePaymentSubmit);
}