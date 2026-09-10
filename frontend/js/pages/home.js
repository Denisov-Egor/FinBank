/* ============================================================
   pages/home.js — главная: сводные показатели
   ============================================================ */

'use strict';

function renderHome() {
  const el = byId('stat-balance');
  if (!el || !state) return;

  const rubAccounts = state.accounts.filter(a => a.currency === 'RUB');
  const totalBalance = rubAccounts.reduce((s, a) => s + a.balance, 0);
  const depositsSum = state.deposits.reduce((s, d) => s + d.amount, 0);
  const creditsSum = state.credits.reduce((s, c) => s + creditRemaining(c), 0);
  const transfersSum = state.transfers.reduce((s, t) => s + t.amount, 0);

  byId('stat-balance').textContent = fmtMoney(totalBalance, 'RUB');
  byId('stat-deposits').textContent = fmtMoney(depositsSum, 'RUB');
  byId('stat-credits').textContent = fmtMoney(creditsSum, 'RUB');
  byId('stat-transfers').textContent = fmtMoney(transfersSum, 'RUB');

  renderHomeCards();
  renderMonthlyExpenses();
  renderTickets();
}

/* ---------- Расходы по месяцам ---------- */

const MONTH_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

/* Строка 'dd.mm.yyyy hh:mm' → ключ месяца вида 20268 (год*12 + номер) */
function monthKey(dateStr) {
  const p = String(dateStr || '').split(' ')[0].split('.');
  if (p.length < 3 || isNaN(Number(p[1])) || isNaN(Number(p[2]))) return 0;
  return Number(p[2]) * 12 + (Number(p[1]) - 1);
}

/* Сборка расходов за последние 6 месяцев:
   платежи за услуги + внешние переводы (переводы между своими счетами не расход) */
function collectMonthlyExpenses() {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: d.getFullYear() * 12 + d.getMonth(), label: MONTH_SHORT[d.getMonth()], total: 0 });
  }

  state.payments = state.payments || [];
  state.transfers = state.transfers || [];

  state.payments.forEach(p => {
    const m = months.find(x => x.key === monthKey(p.date));
    if (m) m.total += p.amount;
  });

  state.transfers.forEach(t => {
    /* «Текущий ···1001» — перевод себе, не считается расходом */
    if (t.direction !== 'out' || /···\d{4}$/.test(String(t.to))) return;
    const m = months.find(x => x.key === monthKey(t.date));
    if (m) m.total += t.amount;
  });

  return months;
}

function renderMonthlyExpenses() {
  const box = byId('monthly-expenses');
  if (!box || !state) return;
  const months = collectMonthlyExpenses();

  const max = Math.max.apply(null, months.map(m => m.total).concat([1]));
  const current = months[months.length - 1];
  const prev = months[months.length - 2];
  const avg = Math.round(months.reduce((s, m) => s + m.total, 0) / months.length);
  const diff = current.total - prev.total;
  const diffText = prev.total === 0
    ? 'нет данных за прошлый месяц'
    : (diff > 0 ? '+' : '') + fmtMoney(Math.abs(diff), 'RUB') + (diff > 0 ? ' больше' : diff < 0 ? ' меньше' : ' без изменений') + ', чем в ' + prev.label;

  box.innerHTML =
    '<div class="exp-chart">' +
      months.map(m => {
        const h = Math.max(4, Math.round(m.total / max * 130));
        const cls = m.key === current.key ? ' exp-chart__col--current' : '';
        return (
          '<div class="exp-chart__col' + cls + '">' +
            '<span class="exp-chart__amount">' + (m.total ? fmtMoney(m.total, 'RUB') : '—') + '</span>' +
            '<div class="exp-chart__bar" style="height:' + h + 'px"></div>' +
            '<span class="exp-chart__label">' + m.label + '</span>' +
          '</div>'
        );
      }).join('') +
    '</div>' +
    '<div class="stats exp-summary">' +
      '<div class="stat-card">' +
        '<div class="stat-card__label">Расходы в ' + current.label + ' (текущий)</div>' +
        '<div class="stat-card__value">' + fmtMoney(current.total, 'RUB') + '</div>' +
      '</div>' +
      '<div class="stat-card">' +
        '<div class="stat-card__label">Прошлый месяц (' + prev.label + ')</div>' +
        '<div class="stat-card__value">' + fmtMoney(prev.total, 'RUB') + '</div>' +
      '</div>' +
      '<div class="stat-card">' +
        '<div class="stat-card__label">Среднее за 6 мес.</div>' +
        '<div class="stat-card__value">' + fmtMoney(avg, 'RUB') + '</div>' +
      '</div>' +
      '<div class="stat-card">' +
        '<div class="stat-card__label">Сравнение месяцев</div>' +
        '<div class="stat-card__value stat-card__value--small">' + diffText + '</div>' +
      '</div>' +
    '</div>' +
    '<p class="exp-note">Учитываются: оплата услуг («Платежи») и переводы другим клиентам. Переводы между своими счетами не считаются расходом.</p>';
}

/* ---------- Карты на главной ---------- */

function renderHomeCards() {
  const grid = byId('home-cards');
  if (!grid || !state) return;
  state.cards = state.cards || [];

  if (!state.cards.length) {
    grid.innerHTML = '<div class="empty">У вас пока нет карт — <a href="cards.html">оформите карту</a>.</div>';
    return;
  }

  grid.innerHTML = state.cards.map(card => {
    const program = CARD_PROGRAMS.find(p => p.id === card.program) || CARD_PROGRAMS[0];
    const acc = state.accounts.find(a => a.id === card.accountId);
    const currency = acc ? acc.currency : 'RUB';
    const blocked = card.status === 'blocked';
    return (
      '<a class="bank-card bank-card--link" href="cards.html#' + encodeURIComponent(card.id) + '" title="Нажмите, чтобы открыть настройки карты">' +
        '<div class="bank-card__inner bank-card__inner--' + program.design + (blocked ? ' bank-card__inner--blocked' : '') + '">' +
          '<div class="bank-card__top">' +
            '<span class="bank-card__bank">' + escapeHtml(getSettings().bankName) + '</span>' +
            '<span class="bank-card__ps">' + escapeHtml(program.system) + '</span>' +
          '</div>' +
          (card.name ? '<div class="bank-card__custom">' + escapeHtml(card.name) + '</div>' : '') +
          '<div class="bank-card__chip"></div>' +
          '<div class="bank-card__balance">' +
            '<span class="bank-card__balance-label">Доступно</span>' +
            '<b class="bank-card__balance-value">' + fmtMoney(acc ? acc.balance : 0, currency) + '</b>' +
          '</div>' +
          '<div class="bank-card__number">' + escapeHtml(card.number) + '</div>' +
          '<div class="bank-card__bottom">' +
            '<span>' + escapeHtml(card.holder) + '</span>' +
            '<span>' + card.validThru + '</span>' +
          '</div>' +
          (blocked ? '<div class="bank-card__overlay">🔒 Заблокирована</div>' : '') +
        '</div>' +
        '<div class="bank-card__meta">' +
          '<div class="row"><span>Название</span><span>' + escapeHtml(card.name || program.name) + (blocked ? ' · заблокирована' : '') + '</span></div>' +
          '<div class="row"><span>Счёт</span><span>' + (acc ? escapeHtml(acc.type + ' ····' + acc.number.slice(-4)) : '—') + '</span></div>' +
          '<div class="row"><span>Настройки</span><span>нажмите на карту →</span></div>' +
        '</div>' +
      '</a>'
    );
  }).join('') +
  '<a class="cards-add" href="cards.html">' +
    '<span class="cards-add__plus">＋</span>' +
    '<span class="cards-add__text">Оформить<br>новую карту</span>' +
  '</a>';
}

/* ---------- Обращения в поддержку ---------- */

function renderTickets() {
  const list = byId('ticket-list');
  if (!list) return;
  const my = getTickets().filter(t => t.userId === currentUser().id).slice().reverse();

  list.innerHTML = my.map(t =>
    '<div class="item">' +
      '<div class="item__head"><span class="item__title">' + escapeHtml(t.subject) + '</span>' +
        (t.status === 'open'
          ? '<span class="item__badge badge--accent">В обработке</span>'
          : t.status === 'answered'
            ? '<span class="item__badge">Есть ответ</span>'
            : '<span class="item__badge badge--muted">Закрыто</span>') +
      '</div>' +
      '<div class="item__body">' +
        '<div class="row"><span>Дата</span><span>' + t.date + '</span></div>' +
        '<div class="ticket-text"><b>Вопрос:</b> ' + escapeHtml(t.message) + '</div>' +
        (t.answer ? '<div class="ticket-text ticket-answer"><b>Ответ поддержки:</b> ' + escapeHtml(t.answer) + '</div>' : '') +
      '</div>' +
    '</div>').join('') || '<div class="empty">Обращений пока нет</div>';
}

function handleTicketSubmit(e) {
  e.preventDefault();
  const subject = byId('ticket-subject').value.trim();
  const message = byId('ticket-message').value.trim();
  if (!subject || !message) { showMessage('Заполните тему и сообщение', 'error'); return; }

  const tickets = getTickets();
  tickets.push({
    id: uid('tk'), userId: currentUser().id,
    clientName: currentUser().name,
    subject: subject, message: message,
    date: nowStr(), status: 'open', answer: '',
  });
  saveTickets(tickets);
  byId('ticket-form').reset();
  renderTickets();
  showMessage('Обращение отправлено, ожидайте ответа оператора', 'success');
}

function initPage() {
  const form = byId('ticket-form');
  if (form) form.addEventListener('submit', handleTicketSubmit);
}