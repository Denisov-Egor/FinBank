/* ============================================================
   utils.js — константы, утилиты, банковские формулы, сообщения
   ============================================================ */

'use strict';

/* ---------- Справочники ---------- */

const DEPOSIT_PROGRAMS = [
  { id: 'saving', name: '«Сохраняй»', rate: 12.5, desc: 'Без пополнения и снятия' },
  { id: 'urgent',  name: '«Срочный»', rate: 14.0, desc: 'Максимальная ставка' },
  { id: 'refill',  name: '«Пополняемый»', rate: 11.0, desc: 'Разрешено пополнять' },
  { id: 'accum',   name: '«Накопительный»', rate: 9.5, desc: 'Проценты ежемесячно' },
];

const CREDIT_PROGRAMS = [
  { id: 'consumer', name: 'Потребительский', rate: 14.9, max: 1500000 },
  { id: 'auto',     name: 'Автокредит',     rate: 16.5, max: 5000000 },
  { id: 'mortgage', name: 'Ипотека',        rate: 18.0, max: 20000000 },
  { id: 'micro',    name: 'Микрозайм',      rate: 24.0, max: 100000 },
];

/* Программы банковских карт (design — класс градиента карты) */
const CARD_PROGRAMS = [
  { id: 'classic', name: 'Классическая', system: 'МИР',        design: 'classic', desc: 'Бесплатное обслуживание · оплата покупок и переводов' },
  { id: 'salary',  name: 'Зарплатная',   system: 'МИР',        design: 'salary',  desc: 'Начисление 3% на остаток · кэшбэк до 15%' },
  { id: 'gold',    name: 'Gold',         system: 'Mastercard', design: 'gold',    desc: 'Премиальная карта · повышенный кэшбэк и консьерж' },
  { id: 'credit',  name: 'Кредитная',    system: 'Visa',       design: 'credit',  desc: 'Льготный период 100 дней · лимит до 300 000 ₽' },
  { id: 'virtual', name: 'Виртуальная',  system: 'МИР',        design: 'virtual', desc: 'Мгновенный выпуск · только для онлайн-покупок' },
];

/* Категории и поставщики услуг для страницы «Платежи» */
const PAYMENT_CATEGORIES = [
  { id: 'mobile',    name: 'Мобильная связь',  icon: '📱' },
  { id: 'internet',  name: 'Интернет и ТВ',    icon: '🌐' },
  { id: 'utility',   name: 'ЖКХ',              icon: '🏠' },
  { id: 'transport', name: 'Транспорт',        icon: '🚌' },
  { id: 'games',     name: 'Игры и развлечения', icon: '🎮' },
];

const PAYMENT_SERVICES = [
  { id: 'mts',        cat: 'mobile',    name: 'МТС',            short: 'МТС', design: 'mts',        fieldLabel: 'Номер телефона',  placeholder: '+7 (916) 123-45-67', desc: 'Пополнение баланса телефона' },
  { id: 'beeline',    cat: 'mobile',    name: 'Билайн',         short: 'Б',   design: 'beeline',    fieldLabel: 'Номер телефона',  placeholder: '+7 (903) 123-45-67', desc: 'Пополнение баланса телефона' },
  { id: 'megafon',    cat: 'mobile',    name: 'МегаФон',        short: 'МФ',  design: 'megafon',    fieldLabel: 'Номер телефона',  placeholder: '+7 (926) 123-45-67', desc: 'Пополнение баланса телефона' },
  { id: 'tele2',      cat: 'mobile',    name: 'Tele2',          short: 'T2',  design: 'tele2',      fieldLabel: 'Номер телефона',  placeholder: '+7 (951) 123-45-67', desc: 'Пополнение баланса телефона' },
  { id: 'yota',       cat: 'mobile',    name: 'Yota',           short: 'Y',   design: 'yota',       fieldLabel: 'Номер телефона',  placeholder: '+7 (915) 123-45-67', desc: 'Пополнение баланса телефона' },
  { id: 'rostelecom', cat: 'internet',  name: 'Ростелеком',     short: 'РТ',  design: 'rostelecom', fieldLabel: 'Лицевой счёт',    placeholder: '50001234567',        desc: 'Домашний интернет и ТВ' },
  { id: 'domru',      cat: 'internet',  name: 'Дом.ру',         short: 'Д',   design: 'domru',      fieldLabel: 'Номер договора',  placeholder: '1100220033',         desc: 'Интернет и цифровое ТВ' },
  { id: 'erc',        cat: 'utility',   name: 'Единый расчётный центр', short: 'ЕРЦ', design: 'erc', fieldLabel: 'Лицевой счёт',   placeholder: '77-123456-7',   desc: 'Квартплата и коммунальные услуги' },
  { id: 'mosenergo',  cat: 'utility',   name: 'Мосэнергосбыт',  short: 'МЭ',  design: 'mosenergo',  fieldLabel: 'Номер лицевого счёта', placeholder: '12345678',   desc: 'Электроэнергия' },
  { id: 'troika',     cat: 'transport', name: 'Тройка',         short: '🚇',  design: 'troika',     fieldLabel: 'Номер транспортной карты', placeholder: '1234567890', desc: 'Пополнение транспортной карты' },
  { id: 'steam',      cat: 'games',     name: 'Steam',          short: 'ST',  design: 'steam',      fieldLabel: 'Логин кошелька',  placeholder: 'player_2000',        desc: 'Пополнение кошелька' },
];

/* Тарифы обслуживания карт (настройки карты) */
const CARD_TARIFFS = [
  { id: 'base',    name: 'Базовый',     price: 0,   desc: 'Без платы за обслуживание · стандартный кэшбэк' },
  { id: 'optimal', name: 'Оптимальный', price: 99,  desc: 'Плата 99 ₽/мес · кэшбэк 5% · бесплатные уведомления' },
  { id: 'premium', name: 'Премиум',     price: 299, desc: 'Плата 299 ₽/мес · кэшбэк 10% · консьерж-сервис' },
];

/* Возможные ограничения карты (настройки карты) */
const CARD_RESTRICTIONS = [
  { id: 'online', name: 'Онлайн-покупки' },
  { id: 'cash',   name: 'Снятие наличных' },
  { id: 'abroad', name: 'Операции за рубежом' },
];

const CURRENCIES = { RUB: '₽', USD: '$', EUR: '€' };
const CURRENCY_NAMES = { RUB: 'Рубли', USD: 'Доллары', EUR: 'Евро' };
const CUR_CODE = { RUB: '810', USD: '840', EUR: '978' };

/* Справочник сторонних клиентов банка (для переводов) */
const EXTERNAL_CLIENTS = [
  { name: 'Петрова Анна Сергеевна',  number: '40817810123456789012' },
  { name: 'Сидоров Пётр Николаевич', number: '40817981098765432109' },
  { name: 'Козлова Мария Ивановна',  number: '40817810011222334455' },
];

/* Роли сотрудников банка */
const ROLES = {
  admin:      { name: 'Администратор',               desc: 'Управляет сотрудниками, клиентами и настройками системы' },
  manager:    { name: 'Менеджер банка',              desc: 'Работает с клиентами, открывает счета и оформляет продукты' },
  cashier:    { name: 'Кассир',                      desc: 'Выполняет операции с наличными: пополнение и снятие' },
  credit:     { name: 'Кредитный специалист',        desc: 'Рассматривает и оформляет заявки на кредиты' },
  support:    { name: 'Оператор поддержки',          desc: 'Консультирует клиентов и помогает решать проблемы' },
  security:   { name: 'Сотрудник отдела безопасности', desc: 'Контролирует подозрительные операции и доступ' },
  accountant: { name: 'Бухгалтер',                   desc: 'Занимается финансовым учётом и отчётностью' },
};

/* ---------- Утилиты ---------- */

function uid(prefix) {
  return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

function pad2(n) { return String(n).padStart(2, '0'); }

function todayStr() {
  const d = new Date();
  return pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1) + '.' + d.getFullYear();
}

function accountNumber(currency) {
  const cc = CUR_CODE[currency] || '810';
  let tail = '';
  for (let i = 0; i < 11; i++) tail += Math.floor(Math.random() * 10);
  return '40817' + cc + '2' + tail; // 20-значный номер счёта
}

function fmtMoney(value, currency) {
  const cur = currency || 'RUB';
  const num = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(value));
  return num + ' ' + CURRENCIES[cur];
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function byId(id) { return document.getElementById(id); }

/* ---------- Банковские калькуляторы ---------- */

/* Вклад: простые проценты за срок */
function calcDeposit(amount, ratePct, months) {
  const income = amount * (ratePct / 100) * (months / 12);
  return { income: income, total: amount + income };
}

/* Кредит: аннуитетный платёж */
function annuityPayment(amount, annualRatePct, months) {
  const i = annualRatePct / 100 / 12;
  if (i === 0) return amount / months;
  const pow = Math.pow(1 + i, months);
  return amount * (i * pow) / (pow - 1);
}

/* Реальный остаток долга по кредиту (с учётом внесённых платежей) */
function creditRemaining(credit) {
  const payment = annuityPayment(credit.amount, credit.rate, credit.termMonths);
  return Math.max(0, credit.amount - payment * credit.paidMonths);
}

/* ---------- Всплывающие сообщения ---------- */

let msgTimer = null;

function showMessage(text, type) {
  let el = document.querySelector('.message');
  if (!el) {
    el = document.createElement('div');
    el.className = 'message';
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.className = 'message show ' + (type === 'error' ? 'error' : type === 'success' ? 'success' : '');
  clearTimeout(msgTimer);
  msgTimer = setTimeout(() => { el.className = 'message'; }, 3000);
}

/* Единая точка обновления интерфейса.
   Page-скрипты подключаются не на всех страницах, поэтому каждый вызов
   защищён проверкой typeof — на любой странице сработает только то,
   что там реально есть. */
function renderAll() {
  renderHome();
  if (typeof renderClientCard === 'function') renderClientCard();
  if (typeof renderAccounts === 'function') renderAccounts();
  if (typeof renderDeposits === 'function') renderDeposits();
  if (typeof renderCredits === 'function') renderCredits();
  if (typeof renderTransfers === 'function') renderTransfers();
  if (typeof renderCards === 'function') renderCards();
  if (typeof fillCardAccounts === 'function') fillCardAccounts();
  if (typeof renderPayments === 'function') renderPayments();
  if (typeof fillPaymentAccounts === 'function') fillPaymentAccounts();
  if (typeof fillDepositPrograms === 'function') fillDepositPrograms();
  if (typeof fillCreditPrograms === 'function') fillCreditPrograms();
  if (typeof fillTransferSelects === 'function') fillTransferSelects();
  if (typeof updateDepositCalc === 'function') updateDepositCalc();
  if (typeof updateCreditCalc === 'function') updateCreditCalc();
  if (typeof updateTransferCalc === 'function') updateTransferCalc();
}