/* ============================================================
   main.js — общая инициализация: сессия, шапка, страницы
   ============================================================ */

'use strict';

function init() {
  ensureDemoUser();
  ensureDemoEmployees();

  /* ---------- Панель сотрудника (staff.html) ---------- */
  if (isStaffPage()) {
    const emp = currentEmployee();
    if (!emp) {
      window.location.href = 'index.html';
      return;
    }
    byId('emp-name').textContent = emp.name;
    byId('emp-role').textContent = ROLES[emp.role] ? ROLES[emp.role].name : emp.role;
    byId('btn-logout').addEventListener('click', handleEmployeeLogout);
    byId('burger').addEventListener('click', () => byId('nav').classList.toggle('open'));

    const inits = {
      admin: staffAdmin, manager: staffManager, cashier: staffCashier,
      credit: staffCredit, support: staffSupport, security: staffSecurity,
      accountant: staffAccountant,
    };
    if (inits[emp.role]) inits[emp.role](emp);
    return;
  }

  /* ---------- Клиентская часть ---------- */
  const user = currentUser();

  /* Неавторизованных на внутренних страницах отправляем на главную */
  if (!user) {
    if (!isHomePage()) {
      window.location.href = 'index.html';
      return;
    }
    showAuthScreen();
  } else {
    showAppScreen(user);
  }

  /* Настройки банка: имя и баннер (администратор) */
  const s = getSettings();
  document.querySelectorAll('.logo__bankname').forEach(el => { el.textContent = s.bankName; });
  if (s.banner) {
    const b = document.createElement('div');
    b.className = 'bank-banner';
    b.textContent = s.banner;
    document.body.prepend(b);
  }

  /* аутентификация клиента (формы есть только на главной) */
  if (isHomePage()) {
    byId('login-form').addEventListener('submit', handleLoginSubmit);
    byId('register-form').addEventListener('submit', handleRegisterSubmit);
    byId('employee-form').addEventListener('submit', handleEmployeeLogin);

    document.querySelectorAll('.auth__tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.auth;
        document.querySelectorAll('.auth__tab').forEach(b => b.classList.toggle('active', b === btn));
        ['login-form', 'register-form', 'employee-form'].forEach(id =>
          byId(id).classList.toggle('hidden', id !== mode + '-form'));
      });
    });
  }

  /* выход и бургер-меню — на всех страницах */
  byId('btn-logout').addEventListener('click', handleLogout);
  byId('burger').addEventListener('click', () => byId('nav').classList.toggle('open'));

  /* Кнопки-ссылки «Открыть вклад» и т.п. на главной ведут на страницы */
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', () => {
      window.location.href = el.dataset.page + '.html';
    });
  });

  /* Инициализация конкретной страницы (если её скрипт подключён) */
  if (typeof initPage === 'function') initPage();
}

document.addEventListener('DOMContentLoaded', init);