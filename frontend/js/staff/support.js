/* ============================================================
   staff/support.js — Оператор поддержки: обращения клиентов
   ============================================================ */

'use strict';

function staffSupport(emp) {
  const root = byId('staff-content');

  root.innerHTML =
    '<h2 class="tab-title">Служба поддержки</h2>' +
    '<p class="staff-desc">' + ROLES[emp.role].desc + '</p>' +
    '<div class="card"><h3>Обращения клиентов</h3><div id="sup-tickets" class="list"></div></div>';

  const render = () => {
    const tickets = getTickets().slice().reverse();
    byId('sup-tickets').innerHTML = tickets.map(t =>
      '<div class="item" data-ticket="' + t.id + '">' +
        '<div class="item__head"><span class="item__title">' + escapeHtml(t.subject) + '</span>' +
          (t.status === 'open'
            ? '<span class="item__badge badge--accent">Открыто</span>'
            : '<span class="item__badge badge--muted">Закрыто</span>') +
        '</div>' +
        '<div class="item__body">' +
          '<div class="row"><span>Клиент</span><span>' + escapeHtml(t.clientName) + '</span></div>' +
          '<div class="row"><span>Дата</span><span>' + t.date + '</span></div>' +
          '<div class="ticket-text"><b>Вопрос:</b> ' + escapeHtml(t.message) + '</div>' +
          (t.answer ? '<div class="ticket-text ticket-answer"><b>Ответ (' + escapeHtml(t.answeredBy) + '):</b> ' + escapeHtml(t.answer) + '</div>' : '') +
        '</div>' +
        (t.status === 'open'
          ? '<div class="item__actions"><input type="text" placeholder="Текст ответа клиенту" class="sup-answer-input">' +
            '<button class="btn btn--small btn--accent" data-reply="' + t.id + '">Ответить</button>' +
            '<button class="btn btn--small btn--ghost" data-close="' + t.id + '">Закрыть</button></div>'
          : '') +
      '</div>').join('') || '<div class="empty">Обращений пока нет</div>';

    byId('sup-tickets').querySelectorAll('[data-reply]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.item');
        const text = item.querySelector('.sup-answer-input').value.trim();
        if (!text) { showMessage('Введите текст ответа', 'error'); return; }
        const tickets = getTickets();
        const t = tickets.find(x => x.id === btn.dataset.reply);
        t.answer = text;
        t.answeredBy = emp.name;
        t.answeredAt = nowStr();
        t.status = 'answered';
        saveTickets(tickets);
        render();
        showMessage('Ответ отправлен клиенту', 'success');
      });
    });

    byId('sup-tickets').querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tickets = getTickets();
        const t = tickets.find(x => x.id === btn.dataset.close);
        t.status = 'closed';
        saveTickets(tickets);
        render();
        showMessage('Обращение закрыто', 'success');
      });
    });
  };

  render();
}