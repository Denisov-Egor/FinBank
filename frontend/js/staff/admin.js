/* ============================================================
   staff/admin.js — Администратор: сотрудники, клиенты, настройки
   ============================================================ */

'use strict';

function staffAdmin(emp) {
  const root = byId('staff-content');

  root.innerHTML =
    '<h2 class="tab-title">Панель администратора</h2>' +
    '<p class="staff-desc">' + ROLES[emp.role].desc + '</p>' +

    '<div class="two-cols">' +
      '<div class="card"><h3>Сотрудники банка</h3>' +
        '<div id="adm-emp-list" class="list"></div>' +
        '<h3 style="margin-top:20px">Добавить сотрудника</h3>' +
        '<form id="adm-emp-form" class="form">' +
          '<label class="form__field"><span>ФИО</span><input type="text" id="adm-emp-name" required></label>' +
          '<label class="form__field"><span>Роль</span><select id="adm-emp-role">' +
            Object.keys(ROLES).map(k => '<option value="' + k + '">' + ROLES[k].name + '</option>').join('') +
          '</select></label>' +
          '<label class="form__field"><span>Логин (email)</span><input type="text" id="adm-emp-login" placeholder="new@bank.ru" required></label>' +
          '<label class="form__field"><span>Пароль</span><input type="text" id="adm-emp-pass" required></label>' +
          '<button class="btn btn--accent btn--full" type="submit">Добавить</button>' +
        '</form>' +
      '</div>' +

      '<div class="card"><h3>Клиенты банка</h3>' +
        '<div id="adm-client-list" class="list"></div>' +
      '</div>' +
    '</div>' +

    '<div class="card" style="max-width:560px"><h3>Настройки системы</h3>' +
      '<form id="adm-settings-form" class="form">' +
        '<label class="form__field"><span>Название банка</span><input type="text" id="adm-set-name"></label>' +
        '<label class="form__field"><span>Информационный баннер для клиентов</span>' +
          '<input type="text" id="adm-set-banner" placeholder="Например: 10 августа обслуживание приостановлено">' +
        '</label>' +
        '<button class="btn btn--accent btn--full" type="submit">Сохранить настройки</button>' +
      '</form>' +
    '</div>';

  const renderEmployees = () => {
    const list = getEmployees();
    byId('adm-emp-list').innerHTML = list.map(x =>
      '<div class="item"><div class="item__head">' +
        '<span class="item__title">' + escapeHtml(x.name) + '</span>' +
        '<span class="item__badge badge--accent">' + (ROLES[x.role] ? ROLES[x.role].name : x.role) + '</span>' +
      '</div><div class="item__body"><div class="row"><span>Логин</span><span>' + escapeHtml(x.login) + '</span></div></div>' +
      (x.id !== emp.id
        ? '<div class="item__actions"><button class="btn btn--small btn--danger" data-del="' + x.id + '">Удалить</button></div>'
        : '') +
      '</div>').join('') || '<div class="empty">Нет сотрудников</div>';

    byId('adm-emp-list').querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = getEmployees().find(x => x.id === btn.dataset.del);
        if (!confirm('Удалить сотрудника ' + target.name + '?')) return;
        saveEmployees(getEmployees().filter(x => x.id !== btn.dataset.del));
        renderEmployees();
        showMessage('Сотрудник удалён', 'success');
      });
    });
  };

  const renderClients = () => {
    const users = getUsers();
    byId('adm-client-list').innerHTML = users.map(u => {
      const st = loadClientState(u.id);
      return '<div class="item"><div class="item__head">' +
        '<span class="item__title">' + escapeHtml(u.name) + '</span>' +
        (u.blocked ? '<span class="item__badge badge--danger">Заблокирован</span>' : '<span class="item__badge badge--muted">Активен</span>') +
        '</div><div class="item__body">' +
        '<div class="row"><span>Email</span><span>' + escapeHtml(u.email) + '</span></div>' +
        '<div class="row"><span>Продукты</span><span>счетов ' + st.accounts.length + ' · вкладов ' + st.deposits.length + ' · кредитов ' + st.credits.length + '</span></div>' +
        '</div><div class="item__actions">' +
        (u.blocked
          ? '<button class="btn btn--small btn--ghost" data-unblock="' + u.id + '">Разблокировать</button>'
          : '<button class="btn btn--small btn--danger" data-block="' + u.id + '">Заблокировать</button>') +
        '</div></div>';
    }).join('') || '<div class="empty">Клиентов пока нет</div>';

    byId('adm-client-list').querySelectorAll('[data-block]').forEach(btn => {
      btn.addEventListener('click', () => {
        const users = getUsers();
        const u = users.find(x => x.id === btn.dataset.block);
        u.blocked = true;
        saveUsers(users);
        addOp(emp.name, ROLES.admin.name, 'Блокировка клиента', u.name);
        renderClients();
        showMessage('Клиент ' + u.name + ' заблокирован', 'success');
      });
    });
    byId('adm-client-list').querySelectorAll('[data-unblock]').forEach(btn => {
      btn.addEventListener('click', () => {
        const users = getUsers();
        const u = users.find(x => x.id === btn.dataset.unblock);
        u.blocked = false;
        saveUsers(users);
        addOp(emp.name, ROLES.admin.name, 'Разблокировка клиента', u.name);
        renderClients();
        showMessage('Клиент ' + u.name + ' разблокирован', 'success');
      });
    });
  };

  renderEmployees();
  renderClients();

  const s = getSettings();
  byId('adm-set-name').value = s.bankName;
  byId('adm-set-banner').value = s.banner;

  byId('adm-emp-form').addEventListener('submit', e => {
    e.preventDefault();
    const list = getEmployees();
    const login = byId('adm-emp-login').value.trim().toLowerCase();
    if (list.some(x => x.login === login)) { showMessage('Сотрудник с таким логином уже есть', 'error'); return; }
    list.push({
      id: uid('e'), name: byId('adm-emp-name').value.trim(),
      role: byId('adm-emp-role').value, login: login,
      pass: hashPass(byId('adm-emp-pass').value),
    });
    saveEmployees(list);
    addOp(emp.name, ROLES.admin.name, 'Добавлен сотрудник', byId('adm-emp-name').value);
    byId('adm-emp-form').reset();
    renderEmployees();
    showMessage('Сотрудник добавлен', 'success');
  });

  byId('adm-settings-form').addEventListener('submit', e => {
    e.preventDefault();
    saveSettings({ bankName: byId('adm-set-name').value.trim() || 'FinBank', banner: byId('adm-set-banner').value.trim() });
    addOp(emp.name, ROLES.admin.name, 'Изменены настройки системы', 'Название/баннер');
    showMessage('Настройки сохранены (вступят в силу после перезагрузки страниц)', 'success');
  });
}