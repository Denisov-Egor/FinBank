/* ============================================================
   staff/credit.js — Кредитный специалист: заявки на кредит
   ============================================================ */

'use strict';

function staffCredit(emp) {
  const root = byId('staff-content');

  root.innerHTML =
    '<h2 class="tab-title">Кредитный отдел</h2>' +
    '<p class="staff-desc">' + ROLES[emp.role].desc + '</p>' +
    '<div class="card"><h3>Заявки на кредит</h3><div id="cr-apps" class="list"></div></div>';

  const statusBadge = (s) => {
    if (s === 'new') return '<span class="item__badge badge--accent">Новая</span>';
    if (s === 'approved') return '<span class="item__badge">Одобрена</span>';
    return '<span class="item__badge badge--danger">Отклонена</span>';
  };

  const render = () => {
    const apps = getApps().slice().reverse();
    byId('cr-apps').innerHTML = apps.map(a => {
      const prog = CREDIT_PROGRAMS.find(p => p.id === a.program) || { name: a.program };
      const payment = annuityPayment(a.amount, a.rate, a.termMonths);
      return '<div class="item" data-app="' + a.id + '">' +
        '<div class="item__head"><span class="item__title">' + escapeHtml(a.userName) + '</span>' + statusBadge(a.status) + '</div>' +
        '<div class="item__body">' +
          '<div class="row"><span>Программа</span><span>' + escapeHtml(prog.name) + '</span></div>' +
          '<div class="row"><span>Сумма / срок / ставка</span><span>' + fmtMoney(a.amount, 'RUB') + ' / ' + a.termMonths + ' мес. / ' + a.rate + '%</span></div>' +
          '<div class="row"><span>Платёж в месяц</span><span>' + fmtMoney(payment, 'RUB') + '</span></div>' +
          '<div class="row"><span>Подана</span><span>' + a.createdAt + '</span></div>' +
          (a.decision ? '<div class="row"><span>Решение</span><span>' + escapeHtml(a.decision) + '</span></div>' : '') +
        '</div>' +
        (a.status === 'new'
          ? '<div class="item__actions">' +
            '<button class="btn btn--small" data-approve="' + a.id + '">✅ Одобрить</button>' +
            '<button class="btn btn--small btn--danger" data-reject="' + a.id + '">❌ Отклонить</button></div>'
          : '') +
        '</div>';
    }).join('') || '<div class="empty">Заявок пока нет</div>';

    bind();
  };

  const bind = () => {
    byId('cr-apps').querySelectorAll('[data-approve]').forEach(btn => {
      btn.addEventListener('click', () => {
        const apps = getApps();
        const app = apps.find(x => x.id === btn.dataset.approve);
        if (!app || app.status !== 'new') return;
        const st = loadClientState(app.userId);
        st.credits.push({
          id: uid('cre'), program: app.program, amount: app.amount,
          rate: app.rate, termMonths: app.termMonths, openedAt: todayStr(), paidMonths: 0,
        });
        saveClientState(app.userId, st);
        app.status = 'approved';
        app.decision = 'Одобрено: ' + emp.name + ', ' + nowStr();
        saveApps(apps);
        addOp(emp.name, ROLES.credit.name, 'Кредит одобрен',
          app.userName + ' · ' + fmtMoney(app.amount, 'RUB') + ' на ' + app.termMonths + ' мес.', app.amount);
        render();
        showMessage('Кредит оформлен клиенту ' + app.userName, 'success');
      });
    });

    byId('cr-apps').querySelectorAll('[data-reject]').forEach(btn => {
      btn.addEventListener('click', () => {
        const reason = prompt('Причина отказа:');
        if (!reason) return;
        const apps = getApps();
        const app = apps.find(x => x.id === btn.dataset.reject);
        if (!app || app.status !== 'new') return;
        app.status = 'rejected';
        app.decision = 'Отказ (' + reason + '): ' + emp.name + ', ' + nowStr();
        saveApps(apps);
        addOp(emp.name, ROLES.credit.name, 'Заявка отклонена', app.userName + ' · причина: ' + reason);
        render();
        showMessage('Заявка отклонена', 'success');
      });
    });
  };

  render();
}