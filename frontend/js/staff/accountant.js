/* ============================================================
   staff/accountant.js — Бухгалтер: финансовый учёт и отчётность
   ============================================================ */

'use strict';

function staffAccountant(emp) {
  const root = byId('staff-content');

  root.innerHTML =
    '<h2 class="tab-title">Бухгалтерия банка</h2>' +
    '<p class="staff-desc">' + ROLES[emp.role].desc + '</p>' +

    '<div class="two-cols">' +
      '<div class="card"><h3>Сводка по банку (на ' + todayStr() + ')</h3>' +
        '<div id="acc-report" class="list"></div>' +
        '<div class="item__actions" style="margin-top:16px">' +
          '<button class="btn btn--accent" id="acc-refresh">🔄 Обновить</button>' +
          '<button class="btn btn--ghost" id="acc-csv">⬇ Скачать отчёт (CSV)</button>' +
        '</div>' +
      '</div>' +
      '<div class="card"><h3>Операционный журнал</h3><div id="acc-ops" class="list"></div></div>' +
    '</div>';

  /* Собирает сводку по всем клиентам банка */
  const collect = () => {
    const users = getUsers();
    const report = {
      clients: users.length,
      accounts: 0, balances: { RUB: 0, USD: 0, EUR: 0 },
      deposits: 0, depositsSum: 0,
      credits: 0, creditsDebt: 0,
      transfers: 0, transfersSum: 0,
    };
    users.forEach(u => {
      const st = loadClientState(u.id);
      report.accounts += st.accounts.length;
      st.accounts.forEach(a => { report.balances[a.currency] = (report.balances[a.currency] || 0) + a.balance; });
      report.deposits += st.deposits.length;
      st.deposits.forEach(d => { report.depositsSum += d.amount; });
      report.credits += st.credits.length;
      st.credits.forEach(c => { report.creditsDebt += creditRemaining(c); });
      report.transfers += st.transfers.length;
      st.transfers.forEach(t => { report.transfersSum += t.amount; });
    });
    return report;
  };

  const renderReport = () => {
    const r = collect();
    const rows = [
      ['Клиентов банка', String(r.clients)],
      ['Открыто счетов', String(r.accounts)],
      ['Остатки на счетах', fmtMoney(r.balances.RUB, 'RUB') + ' · $' + r.balances.USD + ' · €' + r.balances.EUR],
      ['Действующих вкладов', String(r.deposits)],
      ['Сумма вкладов', fmtMoney(r.depositsSum, 'RUB')],
      ['Выдано кредитов', String(r.credits)],
      ['Остаток задолженности по кредитам', fmtMoney(r.creditsDebt, 'RUB')],
      ['Переводов выполнено', String(r.transfers)],
      ['Сумма переводов', fmtMoney(r.transfersSum, 'RUB')],
    ];
    byId('acc-report').innerHTML = rows.map(x =>
      '<div class="item"><div class="row"><span>' + x[0] + '</span><span><b>' + x[1] + '</b></span></div></div>').join('');
    return r;
  };

  const renderOps = () => {
    const ops = getOps().slice(-15).reverse();
    byId('acc-ops').innerHTML = ops.map(o =>
      '<div class="item"><div class="item__head"><span class="item__title">' + escapeHtml(o.action) + '</span>' +
      '<span class="item__badge badge--muted">' + o.date + '</span></div>' +
      '<div class="item__body"><div class="row"><span>Детали</span><span>' + escapeHtml(o.details) + '</span></div></div></div>').join('')
      || '<div class="empty">Операций пока нет</div>';
  };

  let lastReport = renderReport();
  renderOps();

  byId('acc-refresh').addEventListener('click', () => {
    lastReport = renderReport();
    renderOps();
    showMessage('Отчёт обновлён', 'success');
  });

  byId('acc-csv').addEventListener('click', () => {
    const r = collect();
    const lines = [
      'Показатель;Значение',
      'Клиентов;' + r.clients,
      'Счетов;' + r.accounts,
      'Баланс RUB;' + r.balances.RUB,
      'Баланс USD;' + r.balances.USD,
      'Баланс EUR;' + r.balances.EUR,
      'Вкладов;' + r.deposits,
      'Сумма вкладов;' + r.depositsSum,
      'Кредитов;' + r.credits,
      'Задолженность по кредитам;' + Math.round(r.creditsDebt),
      'Переводов;' + r.transfers,
      'Сумма переводов;' + r.transfersSum,
    ];
    const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'bank-report-' + todayStr().split('.').reverse().join('-') + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    addOp(emp.name, ROLES.accountant.name, 'Выгружен отчёт (CSV)', 'Сводка по банку');
  });
}