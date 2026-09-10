/* ============================================================
   staff/manager.js — Менеджер банка: клиенты, счета, продукты
   ============================================================ */

'use strict';

let mgrUserId = null;

function staffManager(emp) {
  const root = byId('staff-content');

  root.innerHTML =
    '<h2 class="tab-title">Панель менеджера банка</h2>' +
    '<p class="staff-desc">' + ROLES[emp.role].desc + '</p>' +

    '<div class="card" style="margin-bottom:18px">' +
      '<label class="form__field"><span>Клиент</span><select id="mgr-client"></select></label>' +
      '<div id="mgr-client-info" style="margin-top:14px"></div>' +
    '</div>' +

    '<div class="two-cols">' +
      '<div class="card"><h3>Открыть счёт клиенту</h3>' +
        '<form id="mgr-acc-form" class="form">' +
          '<label class="form__field"><span>Тип счёта</span><select id="mgr-acc-type">' +
            '<option>Текущий</option><option>Карточный</option><option>Сберегательный</option><option>Хранение</option>' +
          '</select></label>' +
          '<label class="form__field"><span>Валюта</span><select id="mgr-acc-cur">' +
            '<option value="RUB">Рубли (₽)</option><option value="USD">Доллары ($)</option><option value="EUR">Евро (€)</option>' +
          '</select></label>' +
          '<label class="form__field"><span>Начальный взнос</span><input type="number" id="mgr-acc-init" min="0" value="0"></label>' +
          '<button class="btn btn--accent btn--full" type="submit">Открыть счёт</button>' +
        '</form>' +
      '</div>' +
      '<div class="card"><h3>Оформить вклад клиенту</h3>' +
        '<form id="mgr-dep-form" class="form">' +
          '<label class="form__field"><span>Программа</span><select id="mgr-dep-prog">' +
            DEPOSIT_PROGRAMS.map(p => '<option value="' + p.id + '">' + p.name + ' — ' + p.rate + '%</option>').join('') +
          '</select></label>' +
          '<label class="form__field"><span>Сумма, ₽</span><input type="number" id="mgr-dep-amount" min="1000" step="1000" value="100000"></label>' +
          '<label class="form__field"><span>Срок, месяцев</span><select id="mgr-dep-term">' +
            [3, 6, 12, 24, 36].map(m => '<option value="' + m + '"' + (m === 12 ? ' selected' : '') + '>' + m + ' мес.</option>').join('') +
          '</select></label>' +
          '<button class="btn btn--accent btn--full" type="submit">Открыть вклад</button>' +
        '</form>' +
      '</div>' +
    '</div>' +

    '<div class="card"><h3>Продукты выбранного клиента</h3><div id="mgr-products" class="list"></div></div>';

  const renderClientList = () => {
    byId('mgr-client').innerHTML = getUsers().map(u =>
      '<option value="' + u.id + '">' + escapeHtml(u.name) + ' (' + escapeHtml(u.email) + ')</option>').join('');
  };

  const renderProducts = () => {
    const st = loadClientState(mgrUserId);
    let html = st.accounts.map(a =>
      '<div class="item"><div class="item__head"><span class="item__title">Счёт: ' + escapeHtml(a.type) + ' · ' + CURRENCY_NAMES[a.currency] + '</span>' +
      '<span class="item__badge">' + fmtMoney(a.balance, a.currency) + '</span></div>' +
      '<div class="item__body"><div class="row"><span>Номер</span><span>' + a.number + '</span></div></div></div>').join('');
    html += st.deposits.map(d =>
      '<div class="item"><div class="item__head"><span class="item__title">Вклад: ' + escapeHtml(d.program) + '</span>' +
      '<span class="item__badge badge--accent">' + fmtMoney(d.amount, 'RUB') + '</span></div>' +
      '<div class="item__body"><div class="row"><span>Ставка / срок</span><span>' + d.rate + '% / ' + d.termMonths + ' мес.</span></div></div></div>').join('');
    html += st.credits.map(c =>
      '<div class="item"><div class="item__head"><span class="item__title">Кредит: ' + escapeHtml(c.program) + '</span>' +
      '<span class="item__badge badge--danger">Остаток ' + fmtMoney(creditRemaining(c), 'RUB') + '</span></div></div>').join('');
    byId('mgr-products').innerHTML = html || '<div class="empty">У клиента пока нет продуктов</div>';
  };

  const renderInfo = () => {
    mgrUserId = byId('mgr-client').value;
    const u = getUsers().find(x => x.id === mgrUserId);
    if (!u) return;
    byId('mgr-client-info').innerHTML =
      '<div class="client-card"><div><div class="client-card__name">' + escapeHtml(u.name) + '</div>' +
      '<div class="client-card__info">Email: ' + escapeHtml(u.email) + ' · Телефон: ' + escapeHtml(u.phone || '—') + '</div></div></div>';
    renderProducts();
  };

  renderClientList();
  renderInfo();
  byId('mgr-client').addEventListener('change', renderInfo);

  byId('mgr-acc-form').addEventListener('submit', e => {
    e.preventDefault();
    if (!mgrUserId) { showMessage('Выберите клиента', 'error'); return; }
    const st = loadClientState(mgrUserId);
    const type = byId('mgr-acc-type').value;
    const cur = byId('mgr-acc-cur').value;
    const init = Math.max(0, Number(byId('mgr-acc-init').value) || 0);
    st.accounts.push({ id: uid('acc'), type: type, currency: cur, balance: init, number: accountNumber(cur), openedAt: todayStr() });
    saveClientState(mgrUserId, st);
    addOp(emp.name, ROLES.manager.name, 'Открыт счёт клиенту', type + ' (' + cur + ')');
    renderProducts();
    showMessage('Счёт открыт', 'success');
  });

  byId('mgr-dep-form').addEventListener('submit', e => {
    e.preventDefault();
    if (!mgrUserId) { showMessage('Выберите клиента', 'error'); return; }
    const prog = DEPOSIT_PROGRAMS.find(p => p.id === byId('mgr-dep-prog').value);
    const amount = Number(byId('mgr-dep-amount').value);
    if (!amount || amount < 1000) { showMessage('Минимальная сумма вклада — 1 000 ₽', 'error'); return; }
    const st = loadClientState(mgrUserId);
    st.deposits.push({ id: uid('dep'), program: prog.id, amount: amount, rate: prog.rate, termMonths: Number(byId('mgr-dep-term').value), openedAt: todayStr(), status: 'active' });
    saveClientState(mgrUserId, st);
    addOp(emp.name, ROLES.manager.name, 'Оформлен вклад клиенту', prog.name + ' на ' + fmtMoney(amount, 'RUB'), amount);
    renderProducts();
    showMessage('Вклад оформлен', 'success');
  });
}