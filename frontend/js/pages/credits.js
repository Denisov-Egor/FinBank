/* ============================================================
   pages/credits.js — кредиты: калькулятор, оформление, платежи
   ============================================================ */

'use strict';

function fillCreditPrograms() {
  const sel = byId('credit-program');
  if (!sel) return;
  sel.innerHTML = CREDIT_PROGRAMS.map(p =>
    '<option value="' + p.id + '" data-rate="' + p.rate + '" data-max="' + p.max + '">' +
      p.name + ' — от ' + p.rate + '% (до ' + fmtMoney(p.max, 'RUB') + ')</option>'
  ).join('');
}

function updateCreditCalc() {
  const amountEl = byId('credit-amount');
  if (!amountEl || !state) return;
  const amount = Number(amountEl.value) || 0;
  const months = Number(byId('credit-term').value);
  const rate = parseFloat(byId('credit-rate').value) || 0;
  const payment = annuityPayment(amount, rate, months);
  const total = payment * months;
  const overpay = Math.max(0, total - amount);

  byId('credit-calc-payment').textContent = fmtMoney(payment, 'RUB');
  byId('credit-calc-overpay').textContent = fmtMoney(overpay, 'RUB');
  byId('credit-calc-total').textContent = fmtMoney(total, 'RUB');
}

function renderCredits() {
  const list = byId('credit-list');
  if (!list || !state) return;

  if (state.credits.length === 0) {
    list.innerHTML = '<div class="empty">Кредитов нет. Рассчитайте и оформите первый слева.</div>';
    return;
  }

  list.innerHTML = state.credits.map(c => {
    const program = CREDIT_PROGRAMS.find(p => p.id === c.program) || { name: c.program };
    const payment = annuityPayment(c.amount, c.rate, c.termMonths);
    const remaining = creditRemaining(c);
    const progress = Math.min(100, Math.round((c.paidMonths / c.termMonths) * 100));
    const isClosed = c.paidMonths >= c.termMonths;

    return (
      '<div class="item" data-cre="' + c.id + '">' +
        '<div class="item__head">' +
          '<span class="item__title">' + escapeHtml(program.name) + '</span>' +
          '<span class="item__badge' + (isClosed ? ' badge--muted' : ' badge--danger') + '">' +
            (isClosed ? 'Погашен' : 'Активен') +
          '</span>' +
        '</div>' +
        '<div class="item__body">' +
          '<div class="row"><span>Сумма кредита</span><span>' + fmtMoney(c.amount, 'RUB') + '</span></div>' +
          '<div class="row"><span>Ставка</span><span>' + c.rate + '% годовых</span></div>' +
          '<div class="row"><span>Срок</span><span>' + c.termMonths + ' мес.</span></div>' +
          '<div class="row"><span>Ежемесячный платёж</span><span>' + fmtMoney(payment, 'RUB') + '</span></div>' +
          '<div class="row"><span>Внесено платежей</span><span>' + c.paidMonths + ' / ' + c.termMonths + '</span></div>' +
          '<div class="row"><span>Остаток долга</span><span>' + fmtMoney(remaining, 'RUB') + '</span></div>' +
          '<div class="progress"><div class="progress__bar" style="width:' + progress + '%"></div></div>' +
        '</div>' +
        (!isClosed
          ? '<div class="item__actions"><button class="btn btn--small btn--ghost" data-act="pay-cre">Внести платёж</button></div>'
          : '') +
      '</div>'
    );
  }).join('');
}

function findCredit(id) {
  return state.credits.find(c => c.id === id);
}

function handleCreditSubmit(e) {
  e.preventDefault();
  const program = CREDIT_PROGRAMS.find(p => p.id === byId('credit-program').value);
  const amount = Number(byId('credit-amount').value);
  const months = Number(byId('credit-term').value);
  const rate = parseFloat(byId('credit-rate').value) || program.rate;

  if (!amount || amount < 10000) {
    showMessage('Минимальная сумма кредита — 10 000 ₽', 'error');
    return;
  }
  if (amount > program.max) {
    showMessage('По программе «' + program.name + '» максимум ' + fmtMoney(program.max, 'RUB'), 'error');
    return;
  }

  /* Клиент отправляет заявку — её рассматривает кредитный специалист */
  const apps = getApps();
  apps.push({
    id: uid('app'), userId: currentUser().id, userName: currentUser().name,
    program: program.id, amount: amount, rate: rate, termMonths: months,
    createdAt: nowStr(), status: 'new', decision: '',
  });
  saveApps(apps);
  saveState();
  renderAll();
  renderCreditApps();
  showMessage('Заявка на кредит отправлена. Кредитный специалист рассмотрит её в ближайшее время.', 'success');
}

/* ---------- Мои заявки ---------- */

function renderCreditApps() {
  const list = byId('app-list');
  if (!list) return;
  const my = getApps().filter(a => a.userId === currentUser().id).slice().reverse();

  list.innerHTML = my.map(a => {
    const prog = CREDIT_PROGRAMS.find(p => p.id === a.program) || { name: a.program };
    const badge = a.status === 'new'
      ? '<span class="item__badge badge--accent">На рассмотрении</span>'
      : a.status === 'approved'
        ? '<span class="item__badge">Одобрена</span>'
        : '<span class="item__badge badge--danger">Отклонена</span>';
    return (
      '<div class="item">' +
        '<div class="item__head"><span class="item__title">' + escapeHtml(prog.name) + '</span>' + badge + '</div>' +
        '<div class="item__body">' +
          '<div class="row"><span>Сумма / срок</span><span>' + fmtMoney(a.amount, 'RUB') + ' / ' + a.termMonths + ' мес.</span></div>' +
          '<div class="row"><span>Подана</span><span>' + a.createdAt + '</span></div>' +
          (a.decision ? '<div class="row"><span>Решение</span><span>' + escapeHtml(a.decision) + '</span></div>' : '') +
        '</div>' +
      '</div>'
    );
  }).join('') || '<div class="empty">Заявок пока нет</div>';
}

function handleCreditActions(e) {
  const itemEl = e.target.closest('.item[data-cre]');
  if (!itemEl || e.target.dataset.act !== 'pay-cre') return;
  const cre = findCredit(itemEl.dataset.cre);
  if (!cre || cre.paidMonths >= cre.termMonths) return;

  cre.paidMonths++;
  saveState();
  renderAll();
  if (cre.paidMonths >= cre.termMonths) {
    showMessage('Кредит полностью погашен! 🎉', 'success');
  } else {
    const left = cre.termMonths - cre.paidMonths;
    showMessage('Платёж принят. Осталось платежей: ' + left, 'success');
  }
}

function initPage() {
  byId('credit-form').addEventListener('submit', handleCreditSubmit);
  byId('credit-list').addEventListener('click', handleCreditActions);
  renderCreditApps();

  byId('credit-amount').addEventListener('input', updateCreditCalc);
  byId('credit-term').addEventListener('change', updateCreditCalc);
  byId('credit-program').addEventListener('change', () => {
    const opt = byId('credit-program').selectedOptions[0];
    if (opt) byId('credit-rate').value = opt.dataset.rate;
    updateCreditCalc();
  });
}