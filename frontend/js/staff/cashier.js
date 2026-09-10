/* ============================================================
   staff/cashier.js — Кассир: приходные и расходные операции
   ============================================================ */

'use strict';

function staffCashier(emp) {
  const root = byId('staff-content');

  root.innerHTML =
    '<h2 class="tab-title">Касса банка</h2>' +
    '<p class="staff-desc">' + ROLES[emp.role].desc + '</p>' +

    '<div class="two-cols">' +
      '<div class="card"><h3>Операция с наличными</h3>' +
        '<form id="csh-form" class="form">' +
          '<label class="form__field"><span>Клиент</span><select id="csh-client"></select></label>' +
          '<label class="form__field"><span>Счёт</span><select id="csh-account"></select></label>' +
          '<label class="form__field"><span>Сумма</span><input type="number" id="csh-amount" min="1" value="10000" required></label>' +
          '<div class="calc-result"><div>Баланс выбранного счёта: <strong id="csh-balance">—</strong></div></div>' +
          '<button class="btn btn--accent btn--full" type="button" id="csh-add">💰 Пополнить (приход)</button>' +
          '<button class="btn btn--danger btn--full" type="button" id="csh-take">💸 Снять (расход)</button>' +
        '</form>' +
      '</div>' +
      '<div class="card"><h3>Последние кассовые операции</h3><div id="csh-history" class="list"></div></div>' +
    '</div>';

  const renderClients = () => {
    byId('csh-client').innerHTML = getUsers().map(u =>
      '<option value="' + u.id + '">' + escapeHtml(u.name) + ' (' + escapeHtml(u.email) + ')</option>').join('');
  };

  const renderAccounts = () => {
    const st = loadClientState(byId('csh-client').value);
    byId('csh-account').innerHTML = st.accounts.map(a =>
      '<option value="' + a.id + '">' + a.type + ' · ' + CURRENCY_NAMES[a.currency] + ' ···' + a.number.slice(-4) + '</option>').join('')
      || '<option value="">Нет счетов</option>';
    updateBalance();
  };

  const updateBalance = () => {
    const st = loadClientState(byId('csh-client').value);
    const acc = st.accounts.find(a => a.id === byId('csh-account').value);
    byId('csh-balance').textContent = acc ? fmtMoney(acc.balance, acc.currency) : '—';
  };

  const renderHistory = () => {
    const ops = getOps().filter(o => o.role === ROLES.cashier.name).slice(-10).reverse();
    byId('csh-history').innerHTML = ops.map(o =>
      '<div class="item"><div class="item__head"><span class="item__title">' + escapeHtml(o.action) + '</span>' +
      '<span class="item__badge badge--muted">' + o.date + '</span></div>' +
      '<div class="item__body"><div class="row"><span>Детали</span><span>' + escapeHtml(o.details) + '</span></div></div></div>').join('')
      || '<div class="empty">Операций пока не было</div>';
  };

  const doCash = (isAdd) => {
    const amount = Number(byId('csh-amount').value);
    if (!amount || amount <= 0) { showMessage('Укажите сумму', 'error'); return; }
    const userId = byId('csh-client').value;
    const st = loadClientState(userId);
    const acc = st.accounts.find(a => a.id === byId('csh-account').value);
    if (!acc) { showMessage('У клиента нет счетов', 'error'); return; }

    if (!isAdd && amount > acc.balance) { showMessage('Недостаточно средств: на счету ' + fmtMoney(acc.balance, acc.currency), 'error'); return; }

    acc.balance += isAdd ? amount : -amount;
    saveClientState(userId, st);
    const client = getUsers().find(u => u.id === userId);
    addOp(emp.name, ROLES.cashier.name,
      isAdd ? 'Приход (пополнение)' : 'Расход (снятие)',
      client.name + ' · ' + acc.type + ' ···' + acc.number.slice(-4) + ' · ' + fmtMoney(amount, acc.currency),
      amount);
    updateBalance();
    renderHistory();
    showMessage((isAdd ? 'Принято ' : 'Выдано ') + fmtMoney(amount, acc.currency), 'success');
  };

  renderClients();
  renderAccounts();
  renderHistory();

  byId('csh-client').addEventListener('change', renderAccounts);
  byId('csh-account').addEventListener('change', updateBalance);
  byId('csh-add').addEventListener('click', () => doCash(true));
  byId('csh-take').addEventListener('click', () => doCash(false));
}