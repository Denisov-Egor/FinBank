/* ============================================================
   staff/security.js — Отдел безопасности: журнал операций, доступ
   ============================================================ */

'use strict';

function staffSecurity(emp) {
  const root = byId('staff-content');

  root.innerHTML =
    '<h2 class="tab-title">Отдел безопасности</h2>' +
    '<p class="staff-desc">' + ROLES[emp.role].desc + '</p>' +

    '<div class="two-cols">' +
      '<div class="card"><h3>Журнал операций</h3>' +
        '<label class="form__field" style="margin-bottom:12px"><span>Фильтр</span>' +
          '<select id="sec-filter"><option value="all">Все операции</option><option value="flagged">Только подозрительные</option></select>' +
        '</label>' +
        '<div id="sec-ops" class="list"></div>' +
      '</div>' +
      '<div class="card"><h3>Доступ к системе</h3>' +
        '<h3 style="font-size:0.95rem">Сотрудники</h3><div id="sec-emps" class="list"></div>' +
        '<h3 style="font-size:0.95rem;margin-top:16px">Клиенты</h3><div id="sec-clients" class="list"></div>' +
      '</div>' +
    '</div>';

  const renderOps = () => {
    const onlyFlagged = byId('sec-filter').value === 'flagged';
    let ops = getOps().slice().reverse();
    if (onlyFlagged) ops = ops.filter(o => o.flagged);

    byId('sec-ops').innerHTML = ops.map(o =>
      '<div class="item' + (o.flagged ? ' op-flagged' : '') + '">' +
        '<div class="item__head"><span class="item__title">' + escapeHtml(o.action) + '</span>' +
          (o.flagged ? '<span class="item__badge badge--danger">⚠ Подозрительная</span>' : '<span class="item__badge badge--muted">' + o.date + '</span>') +
        '</div>' +
        '<div class="item__body">' +
          '<div class="row"><span>Кто</span><span>' + escapeHtml(o.actor) + ' (' + escapeHtml(o.role) + ')</span></div>' +
          '<div class="row"><span>Детали</span><span>' + escapeHtml(o.details) + '</span></div>' +
          '<div class="row"><span>Время</span><span>' + o.date + '</span></div>' +
          (o.reason ? '<div class="row"><span>Причина</span><span>' + escapeHtml(o.reason) + '</span></div>' : '') +
        '</div>' +
        '<div class="item__actions">' +
          (o.flagged
            ? '<button class="btn btn--small btn--ghost" data-unflag="' + o.id + '">Снять отметку</button>'
            : '<button class="btn btn--small btn--danger" data-flag="' + o.id + '">Пометить подозрительной</button>') +
        '</div>' +
      '</div>').join('') || '<div class="empty">Записей нет</div>';

    bindOps();
  };

  const bindOps = () => {
    byId('sec-ops').querySelectorAll('[data-flag]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ops = getOps();
        const o = ops.find(x => x.id === btn.dataset.flag);
        o.flagged = true;
        o.reason = (o.reason ? o.reason + '; ' : '') + 'Отметил: ' + emp.name;
        saveOps(ops);
        renderOps();
      });
    });
    byId('sec-ops').querySelectorAll('[data-unflag]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ops = getOps();
        const o = ops.find(x => x.id === btn.dataset.unflag);
        o.flagged = false;
        o.reason = '';
        saveOps(ops);
        renderOps();
      });
    });
  };

  const renderAccess = () => {
    byId('sec-emps').innerHTML = getEmployees().map(x =>
      '<div class="item"><div class="item__head"><span class="item__title">' + escapeHtml(x.name) + '</span>' +
      '<span class="item__badge badge--accent">' + (ROLES[x.role] ? ROLES[x.role].name : x.role) + '</span></div>' +
      '<div class="item__body"><div class="row"><span>Логин</span><span>' + escapeHtml(x.login) + '</span></div></div></div>').join('');

    byId('sec-clients').innerHTML = getUsers().map(u =>
      '<div class="item"><div class="item__head"><span class="item__title">' + escapeHtml(u.name) + '</span>' +
      (u.blocked ? '<span class="item__badge badge--danger">Заблокирован</span>' : '<span class="item__badge badge--muted">Доступ разрешён</span>') +
      '</div></div>').join('') || '<div class="empty">Клиентов нет</div>';
  };

  renderOps();
  renderAccess();
  byId('sec-filter').addEventListener('change', renderOps);
}