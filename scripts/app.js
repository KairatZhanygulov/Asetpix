// Языки, калькулятор, ссылки WhatsApp, меню и анимация появления.
const originals = {};
document.querySelectorAll('[data-i]').forEach((el) => (originals[el.dataset.i] = el.innerHTML));
translations.ru = originals;
let lang = 'ru',
  plan = 0;
const rates = SITE_CONFIG.rates;
const labels = {
  ru: ['База', 'Стандарт', 'Премиум'],
  kk: ['Базалық', 'Стандарт', 'Премиум'],
  en: ['Basic', 'Standard', 'Premium'],
};
function message(format) {
  const names = {
    ru: {
      love: 'Love Story',
      family: 'семейную историю',
      kids: 'мультфильм для ребёнка',
      business: 'анимацию для бизнеса',
    },
    kk: {
      love: 'махаббат хикаясын',
      family: 'отбасылық хикаяны',
      kids: 'балаға арналған мультфильмді',
      business: 'бизнеске арналған анимацияны',
    },
    en: {
      love: 'a love story',
      family: 'a family story',
      kids: 'an animated film for a child',
      business: 'animation for my business',
    },
  };
  if (lang === 'kk')
    return format
      ? `Сәлеметсіз бе, AsetPix! ${names.kk[format]} жасағым келеді. Бөлшектерін талқылайық.`
      : 'Сәлеметсіз бе, AsetPix! Менде анимацияға арналған идея бар. Талқылайық!';
  if (lang === 'en')
    return format
      ? `Hello AsetPix! I’d like to create ${names.en[format]}. Can we discuss the details?`
      : 'Hello AsetPix! I have an idea for an animated film. Let’s discuss it!';
  return format
    ? `Здравствуйте, AsetPix! Хочу создать ${names.ru[format]}. Давайте обсудим детали.`
    : 'Здравствуйте, AsetPix! У меня есть идея для мультфильма. Давайте обсудим!';
}
function updateCalc() {
  const minutes = Number(document.querySelector('#duration').value),
    sum = rates[plan] * minutes;
  document.querySelector('#durationValue').textContent =
    lang === 'en' ? `${minutes} min` : lang === 'kk' ? `${minutes} мин` : `${minutes} мин`;
  document.querySelector('#total').innerHTML = `${sum.toLocaleString('ru-RU')} <small>₸</small>`;
  const msg =
    lang === 'en'
      ? `Hello AsetPix! I’d like to discuss a film: ${labels.en[plan]}, ${minutes} min. Estimated price: ${sum.toLocaleString('ru-RU')} ₸.`
      : lang === 'kk'
        ? `Сәлеметсіз бе, AsetPix! Мультфильмді талқылағым келеді: ${labels.kk[plan]}, ${minutes} мин. Алдын ала құны: ${sum.toLocaleString('ru-RU')} ₸.`
        : `Здравствуйте, AsetPix! Хочу обсудить мультфильм: ${labels.ru[plan]}, ${minutes} мин. Предварительный расчёт: ${sum.toLocaleString('ru-RU')} ₸.`;
  document.querySelector('#quote').href =
    `https://wa.me/${SITE_CONFIG.whatsapp}?text=` + encodeURIComponent(msg);
}
function setLanguage(value) {
  lang = translations[value] ? value : 'ru';
  document.documentElement.lang = lang;
  document.querySelector('#language').value = lang;
  document
    .querySelectorAll('[data-i]')
    .forEach((el) => (el.innerHTML = translations[lang][el.dataset.i] ?? originals[el.dataset.i]));
  document
    .querySelectorAll('.wa')
    .forEach(
      (a) =>
        (a.href =
          `https://wa.me/${SITE_CONFIG.whatsapp}?text=` +
          encodeURIComponent(message(a.dataset.format))),
    );
  document.title = {
    ru: 'AsetPix — Истории, которые оживают',
    kk: 'AsetPix — Өмірге келген хикаялар',
    en: 'AsetPix — Stories brought to life',
  }[lang];
  document.querySelector('meta[name="description"]').content = {
    ru: 'Персональные мультфильмы, Love Story и анимация для бизнеса. Обсудите свою историю с AsetPix в WhatsApp.',
    kk: 'Жеке мультфильмдер, махаббат хикаялары және бизнеске арналған анимация. AsetPix-пен WhatsApp-та талқылаңыз.',
    en: 'Personal animated films, love stories, and animation for businesses. Discuss your story with AsetPix on WhatsApp.',
  }[lang];
  document.querySelector('#compare').setAttribute(
    'aria-label',
    {
      ru: 'Сравнить фотографию и анимацию',
      kk: 'Фотосурет пен анимацияны салыстыру',
      en: 'Compare photograph and animation',
    }[lang],
  );
  document
    .querySelector('.menu')
    .setAttribute('aria-label', { ru: 'Меню', kk: 'Мәзір', en: 'Menu' }[lang]);
  document
    .querySelector('.plans')
    .setAttribute('aria-label', { ru: 'Тариф', kk: 'Тариф', en: 'Package' }[lang]);
  document.querySelectorAll('.hero-main-image,.compare>img,.before img,.portfolio-art>img').forEach(
    (img, i) =>
      (img.alt = {
        ru: [
          'Лисёнок AsetPix в синем платке',
          'Анимационный образ семьи',
          'Исходная фотография семьи',
          'Анимационный персонаж — маленькая сова',
        ],
        kk: [
          'Көк орамалды AsetPix түлкісі',
          'Отбасының анимациялық бейнесі',
          'Отбасының бастапқы фотосуреті',
          'Анимациялық кейіпкер — кішкентай үкі',
        ],
        en: [
          'AsetPix fox wearing a blue scarf',
          'Animated family portrait',
          'Original family photograph',
          'Animated character: a little owl',
        ],
      }[lang][i]),
  );
  updateCalc();
  try {
    localStorage.setItem('asetpix-language', lang);
  } catch {}
}
document.querySelector('#language').addEventListener('change', (e) => setLanguage(e.target.value));
document.querySelector('#duration').addEventListener('input', updateCalc);
document.querySelectorAll('[data-plan]').forEach((button) =>
  button.addEventListener('click', () => {
    plan = Number(button.dataset.plan);
    document.querySelectorAll('[data-plan]').forEach((b) => {
      const active = Number(b.dataset.plan) === plan;
      b.classList.toggle('selected', active);
      b.setAttribute('aria-pressed', String(active));
    });
    updateCalc();
  }),
);
document
  .querySelector('#compare')
  .addEventListener('input', (e) =>
    document.querySelector('.compare').style.setProperty('--split', e.target.value + '%'),
  );
const menu = document.querySelector('.menu'),
  nav = document.querySelector('.header nav');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? '×' : '☰';
});
nav.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = '☰';
  }),
);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = '☰';
  }
});
let saved = 'ru';
try {
  saved = localStorage.getItem('asetpix-language') || 'ru';
} catch {}
setLanguage(saved);
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll('.section-head,.work-grid,.story-list,.steps,.calculator,.faq,.closing')
    .forEach((el) => {
      el.classList.add('reveal');
      observer.observe(el);
    });
}
