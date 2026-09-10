/* ============================================================
   auth.js — вход, регистрация, выход
   ============================================================ */

'use strict';

/* На главной странице есть экран входа; на остальных — редирект */
function isHomePage() {
  return !!document.getElementById('screen-auth');
}

/* staff.html — единая панель сотрудника */
function isStaffPage() {
  return !!document.getElementById('staff-root');
}

function showAuthScreen() {
  document.body.classList.add('logged-out');
  const auth = byId('screen-auth');
  const app = byId('screen-app');
  if (auth) auth.classList.remove('hidden');
  if (app) app.classList.add('hidden');
  const userbox = byId('userbox');
  if (userbox) userbox.classList.add('hidden');
}

function showAppScreen(user) {
  document.body.classList.remove('logged-out');
  const auth = byId('screen-auth');
  const app = byId('screen-app');
  if (auth) auth.classList.add('hidden');
  if (app) app.classList.remove('hidden');
  const name = byId('userbox-name');
  const userbox = byId('userbox');
  if (name) name.textContent = user.name;
  if (userbox) userbox.classList.remove('hidden');
  loadState();
  renderAll();
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const email = byId('login-email').value.trim().toLowerCase();
  const pass = byId('login-pass').value;
  const user = getUsers().find(u => u.email === email);

  if (!user || user.pass !== hashPass(pass)) {
    showMessage('Неверный email или пароль', 'error');
    return;
  }
  if (user.blocked) {
    showMessage('Доступ заблокирован. Обратитесь в отдел безопасности банка.', 'error');
    return;
  }

  setSession(user.id);
  byId('login-form').reset();
  showAppScreen(user);
  showMessage('Добро пожаловать, ' + user.name + '!', 'success');
}

function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = byId('reg-name').value.trim();
  const email = byId('reg-email').value.trim().toLowerCase();
  const phone = byId('reg-phone').value.trim();
  const pass = byId('reg-pass').value;
  const pass2 = byId('reg-pass2').value;

  if (name.length < 3) { showMessage('Укажите ФИО (минимум 3 символа)', 'error'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMessage('Укажите корректный email', 'error'); return; }
  if (pass.length < 6) { showMessage('Пароль должен содержать не менее 6 символов', 'error'); return; }
  if (pass !== pass2) { showMessage('Пароли не совпадают', 'error'); return; }

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    showMessage('Пользователь с таким email уже зарегистрирован', 'error');
    return;
  }

  const user = {
    id: uid('u'),
    name: name,
    email: email,
    phone: phone || '—',
    pass: hashPass(pass),
    demo: false,
    createdAt: todayStr(),
  };
  users.push(user);
  saveUsers(users);
  setSession(user.id);
  byId('register-form').reset();
  showAppScreen(user);
  showMessage('Регистрация успешна! Добро пожаловать, ' + name + '!', 'success');
}

function handleLogout() {
  clearSession();
  state = null;
  showMessage('Вы вышли из системы. До новых встреч!', 'success');
  /* сообщение не успеет показаться после редиректа — просто переходим на главную */
  window.location.href = 'index.html';
}

/* ============================================================
   Вход сотрудника банка
   ============================================================ */

function handleEmployeeLogin(e) {
  e.preventDefault();
  const login = byId('emp-login').value.trim().toLowerCase();
  const pass = byId('emp-pass').value;
  const emp = getEmployees().find(x => x.login === login);

  if (!emp || emp.pass !== hashPass(pass)) {
    showMessage('Неверный логин или пароль сотрудника', 'error');
    return;
  }

  setEmpSession(emp.id);
  byId('employee-form').reset();
  window.location.href = 'staff.html';
}

function handleEmployeeLogout() {
  clearEmpSession();
  window.location.href = 'index.html';
}