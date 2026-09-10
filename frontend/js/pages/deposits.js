/* ============================================================
   pages/deposits.js — вклады: калькулятор, оформление, список
   ============================================================ */

'use strict';

function fillDepositPrograms() {
  const sel = byId('deposit-program');
  if (!sel) return;
  sel.innerHTML = DEPOSIT_PROGRAMS.map(p =>
    '<option value="' + p.id + '">' + p.name + ' — ' + p.rate + '% годовых (' + p.desc + ')</option>'
  ).join('');
}

function updateDepositCalc() {
  const amountEl = byId('deposit-amount');
  if (!amountEl || !state) return;
  const amount = Number(amountEl.value) || 0;
  const program = DEPOSIT_PROGRAMS.find(p => p.id === byId('deposit-program').value);
  const months = Number(byId('deposit-term').value);
  const calc = calcDeposit(amount, program.rate, months);

  byId('deposit-calc-income').textContent = fmtMoney(calc.income, 'RUB');
  byId('deposit-calc-total').textContent = fmtMoney(calc.total, 'RUB');
}

function renderDeposits() {
  const list = byId('deposit-list');
  if (!list || !state) return;

  if (state.deposits.length === 0) {
    list.innerHTML = '<div class="empty">Вкладов нет — оформите первый вклад слева.</div>';
    return;
  }

  list.innerHTML = state.deposits.map(d => {
    const program = DEPOSIT_PROGRAMS.find(p => p.id === d.program) || { name: d.program };
    const calc = calcDeposit(d.amount, d.rate, d.termMonths);
    const badge = d.status === 'closed'
      ? '<span class="item__badge badge--muted">Закрыт</span>'
      : '<span class="item__badge badge--accent">Действует</span>';

    return (
      '<div class="item" data-dep="' + d.id + '">' +
        '<div class="item__head">' +
          '<span class="item__title">' + escapeHtml(program.name) + '</span>' +
          badge +
        '</div>' +
        '<div class="item__body">' +
          '<div class="row"><span>Сумма вклада</span><span>' + fmtMoney(d.amount, 'RUB') + '</span></div>' +
          '<div class="row"><span>Ставка</span><span>' + d.rate + '% годовых</span></div>' +
          '<div class="row"><span>Срок</span><span>' + d.termMonths + ' мес.</span></div>' +
          '<div class="row"><span>Доход за срок</span><span>' + fmtMoney(calc.income, 'RUB') + '</span></div>' +
          '<div class="row"><span>К выплате в конце срока</span><span>' + fmtMoney(calc.total, 'RUB') + '</span></div>' +
        '</div>' +
        (d.status === 'active'
          ? '<div class="item__actions"><button class="btn btn--small btn--danger" data-act="close-dep">Закрыть (вернуть сумму)</button></div>'
          : '') +
      '</div>'
    );
  }).join('');
}

function findDeposit(id) {
  return state.deposits.find(d => d.id === id);
}

function handleDepositSubmit(e) {
  e.preventDefault();
  const amount = Number(byId('deposit-amount').value);
  const program = DEPOSIT_PROGRAMS.find(p => p.id === byId('deposit-program').value);
  const months = Number(byId('deposit-term').value);

  if (!amount || amount < 1000) {
    showMessage('Минимальная сумма вклада — 1 000 ₽', 'error');
    return;
  }

  state.deposits.push({
    id: uid('dep'), program: program.id, amount: amount,
    rate: program.rate, termMonths: months,
    openedAt: todayStr(), status: 'active',
  });
  saveState();
  renderAll();
  showMessage('Вклад «' + program.name + '» открыт на ' + fmtMoney(amount, 'RUB') + ' под ' + program.rate + '% годовых', 'success');
}

function handleDepositActions(e) {
  const itemEl = e.target.closest('.item[data-dep]');
  if (!itemEl || e.target.dataset.act !== 'close-dep') return;
  const dep = findDeposit(itemEl.dataset.dep);
  if (!dep || dep.status !== 'active') return;

  if (!confirm('Закрыть вклад «' + (DEPOSIT_PROGRAMS.find(p => p.id === dep.program) || {}).name + '» и вернуть ' + fmtMoney(dep.amount, 'RUB') + '?')) return;

  dep.status = 'closed';
  saveState();
  renderAll();
  showMessage('Вклад закрыт, сумма возвращена', 'success');
}

function initPage() {
  byId('deposit-form').addEventListener('submit', handleDepositSubmit);
  byId('deposit-program').addEventListener('change', updateDepositCalc);
  byId('deposit-term').addEventListener('change', updateDepositCalc);
  byId('deposit-amount').addEventListener('input', () => {
    byId('deposit-amount-range').value = byId('deposit-amount').value;
    updateDepositCalc();
  });
  byId('deposit-amount-range').addEventListener('input', () => {
    byId('deposit-amount').value = byId('deposit-amount-range').value;
    updateDepositCalc();
  });
  byId('deposit-list').addEventListener('click', handleDepositActions);
}