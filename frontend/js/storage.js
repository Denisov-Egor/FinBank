/* ============================================================
   storage.js — пользователи, сессии и состояние в localStorage
   ============================================================ */

'use strict';

const USERS_KEY = 'fin_bank_users_v1';
const SESSION_KEY = 'fin_bank_session_v1';
const EMPLOYEES_KEY = 'fin_bank_employees_v1';
const EMP_SESSION_KEY = 'fin_bank_emp_session_v1';
const OPS_KEY = 'fin_bank_ops_v1';        /* журнал операций (для безопасности и бухгалтерии) */
const TICKETS_KEY = 'fin_bank_tickets_v1'; /* обращения клиентов в поддержку */
const APPS_KEY = 'fin_bank_credit_apps_v1'; /* заявки на кредит */
const SETTINGS_KEY = 'fin_bank_settings_v1'; /* настройки банка (администратор) */

/* ---------- Демо-данные по умолчанию ---------- */

function defaultStateFor(user) {
  const base = {
    client: {
      name: user ? user.name : 'Новый клиент',
      passport: '—',
      phone: user && user.phone ? user.phone : '—',
      email: user ? user.email : '',
    },
    accounts: [],
    deposits: [],
    credits: [],
    transfers: [],
    cards: [],
    payments: [],
  };

  /* Демо-пользователь получает предзаполненный банк */
  if (user && user.demo) {
    base.client.passport = '4520 123456';
    base.accounts = [
      { id: 'acc-1', type: 'Текущий',         currency: 'RUB', balance: 250000, number: '40817810000000001001', openedAt: '15.01.2026' },
      { id: 'acc-2', type: 'Сберегательный',  currency: 'RUB', balance: 120000, number: '40817810000000001002', openedAt: '02.03.2026' },
      { id: 'acc-3', type: 'Карточный',       currency: 'USD', balance: 1500,   number: '40817840000000001003', openedAt: '20.04.2026' },
    ];
    base.deposits = [
      { id: 'dep-1', program: 'saving', amount: 100000, rate: 12.5, termMonths: 12, openedAt: '10.05.2026', status: 'active' },
    ];
    base.credits = [
      { id: 'cre-1', program: 'consumer', amount: 200000, rate: 14.9, termMonths: 12, openedAt: '10.06.2026', paidMonths: 0 },
    ];
    base.cards = [
      { id: 'card-1', program: 'classic', accountId: 'acc-1', number: '2202 1500 7841 6602', holder: 'IVAN IVANOV', validThru: '09/29', openedAt: '15.01.2026', status: 'active', history: [{ date: '15.01.2026 12:00', event: 'Карта оформлена' }] },
      { id: 'card-2', program: 'gold', accountId: 'acc-2', number: '5321 9034 5527 1188', holder: 'IVAN IVANOV', validThru: '09/29', openedAt: '02.03.2026', status: 'active', history: [{ date: '02.03.2026 10:30', event: 'Карта оформлена' }] },
    ];
    base.payments = [
      { id: 'pay-1', date: '05.08.2026 14:32', cat: 'mobile', provider: 'МТС', target: '+7 (916) 123-45-67', amount: 300, currency: 'RUB', accountLabel: 'Текущий ····1001' },
      { id: 'pay-2', date: '01.08.2026 09:15', cat: 'internet', provider: 'Ростелеком', target: '50001234567', amount: 550, currency: 'RUB', accountLabel: 'Текущий ····1001' },
    ];
    base.transfers = [
      {
        id: 'tr-1', date: '03.08.2026',
        from: 'Текущий  ····1001', to: 'Петрова Анна Сергеевна',
        amount: 5000, currency: 'RUB', comment: 'За услуги', direction: 'out',
      },
    ];
  }

  return base;
}

/* ---------- Пользователи и сессии ---------- */

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* Простой хеш пароля (учебная демонстрация, не для продакшена) */
function hashPass(pass) {
  let h = 5381;
  const s = 'надежный-банк::' + pass;
  for (let i = 0; i < s.length; i++) {
    h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  }
  return 'h' + h.toString(36) + s.length.toString(36);
}

function currentUser() {
  try {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return null;
    return getUsers().find(u => u.id === id) || null;
  } catch (e) {
    return null;
  }
}

function setSession(id) {
  localStorage.setItem(SESSION_KEY, id);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* Демо-пользователь с предзаполненными данными (см. defaultStateFor) */
function ensureDemoUser() {
  const users = getUsers();
  if (users.some(u => u.id === 'u-demo')) return;
  users.push({
    id: 'u-demo',
    name: 'Иванов Иван Иванович',
    email: 'demo@bank.ru',
    phone: '+7 (900) 123-45-67',
    pass: hashPass('demo123'),
    demo: true,
    createdAt: todayStr(),
  });
  saveUsers(users);
}

/* ---------- Работа с состоянием ---------- */

let state = null;

function stateKey() {
  const user = currentUser();
  return 'fin_bank_state_' + (user ? user.id : 'anon');
}

function loadState() {
  try {
    const raw = localStorage.getItem(stateKey());
    state = raw ? JSON.parse(raw) : null;
  } catch (e) {
    state = null;
  }
  if (!state) state = defaultStateFor(currentUser());
}

function saveState() {
  if (currentUser()) {
    localStorage.setItem(stateKey(), JSON.stringify(state));
  }
}

function resetDemoState() {
  if (currentUser()) {
    localStorage.removeItem(stateKey());
  }
  state = defaultStateFor(currentUser());
  saveState();
  renderAll();
  showMessage('Данные сброшены к исходным', 'success');
}

/* ============================================================
   Сотрудники банка (роли)
   ============================================================ */

function getEmployees() {
  try {
    return JSON.parse(localStorage.getItem(EMPLOYEES_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveEmployees(list) {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(list));
}

function currentEmployee() {
  try {
    const id = localStorage.getItem(EMP_SESSION_KEY);
    if (!id) return null;
    return getEmployees().find(e => e.id === id) || null;
  } catch (e) {
    return null;
  }
}

function setEmpSession(id) { localStorage.setItem(EMP_SESSION_KEY, id); }
function clearEmpSession() { localStorage.removeItem(EMP_SESSION_KEY); }

/* Демо-сотрудники: по одному на каждую роль */
function ensureDemoEmployees() {
  const list = getEmployees();
  if (list.length) return;
  saveEmployees([
    { id: 'e-admin',   name: 'Смирнова Ольга Викторовна',  role: 'admin',       login: 'admin@bank.ru',     pass: hashPass('admin123') },
    { id: 'e-manager', name: 'Волков Дмитрий Сергеевич',   role: 'manager',     login: 'manager@bank.ru',   pass: hashPass('manager123') },
    { id: 'e-cashier', name: 'Орлова Елена Павловна',      role: 'cashier',     login: 'cashier@bank.ru',   pass: hashPass('cash123') },
    { id: 'e-credit',  name: 'Кузнецов Андрей Николаевич', role: 'credit',      login: 'credit@bank.ru',    pass: hashPass('credit123') },
    { id: 'e-support', name: 'Морозова Ирина Андреевна',   role: 'support',     login: 'support@bank.ru',   pass: hashPass('support123') },
    { id: 'e-sec',     name: 'Зайцев Павел Олегович',      role: 'security',    login: 'security@bank.ru',  pass: hashPass('security123') },
    { id: 'e-acc',     name: 'Белова Наталья Ивановна',    role: 'accountant',  login: 'accountant@bank.ru', pass: hashPass('acc123') },
  ]);
}

/* ---------- Настройки банка ---------- */

function getSettings() {
  try {
    return Object.assign({ bankName: 'FinBank', banner: '' }, JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {});
  } catch (e) {
    return { bankName: 'FinBank', banner: '' };
  }
}

function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

/* ---------- Журнал операций ---------- */

function getOps() {
  try {
    return JSON.parse(localStorage.getItem(OPS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveOps(list) {
  localStorage.setItem(OPS_KEY, JSON.stringify(list));
}

function nowStr() {
  return todayStr() + ' ' + pad2(new Date().getHours()) + ':' + pad2(new Date().getMinutes());
}

/* Запись в журнал; операции свыше 600 000 ₽ автоматически помечаются подозрительными (115-ФЗ) */
function addOp(actor, role, action, details, amount) {
  const ops = getOps();
  const flagged = typeof amount === 'number' && amount >= 600000;
  ops.push({
    id: uid('op'), date: nowStr(), actor: actor, role: role,
    action: action, details: details,
    flagged: flagged,
    reason: flagged ? 'Операция свыше 600 000 ₽ (115-ФЗ)' : '',
  });
  saveOps(ops);
}

/* ---------- Обращения в поддержку ---------- */

function getTickets() {
  try {
    return JSON.parse(localStorage.getItem(TICKETS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveTickets(list) {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(list));
}

/* ---------- Заявки на кредит ---------- */

function getApps() {
  try {
    return JSON.parse(localStorage.getItem(APPS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveApps(list) {
  localStorage.setItem(APPS_KEY, JSON.stringify(list));
}

/* ---------- Доступ к данным произвольного клиента (для сотрудников) ---------- */

function clientStateKey(userId) {
  return 'fin_bank_state_' + userId;
}

function loadClientState(userId) {
  try {
    const raw = localStorage.getItem(clientStateKey(userId));
    return raw ? JSON.parse(raw) : defaultStateFor(getUsers().find(u => u.id === userId));
  } catch (e) {
    return defaultStateFor(getUsers().find(u => u.id === userId));
  }
}

function saveClientState(userId, st) {
  localStorage.setItem(clientStateKey(userId), JSON.stringify(st));
}