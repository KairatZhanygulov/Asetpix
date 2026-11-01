// Согласие хранится локально. Meta Pixel загружается только после отдельного выбора.
(() => {
  const version = SITE_CONFIG.consentVersion;
  const key = 'asetpix-privacy-consent';
  const gate = document.getElementById('consent-gate');
  const site = document.getElementById('site-content');
  const checkbox = document.getElementById('consent-checkbox');
  const marketing = document.getElementById('marketing-checkbox');
  let trackingEnabled = false;
  let pageViewed = false;
  function enableTracking() {
    trackingEnabled = true;
    if (!window.fbq) {
      const n = (window.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!window._fbq) window._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
      window.fbq('init', SITE_CONFIG.metaPixelId);
      window.fbq('set', 'autoConfig', false, SITE_CONFIG.metaPixelId);
    }
    window.fbq('consent', 'grant');
    if (!pageViewed) {
      window.fbq('track', 'PageView');
      pageViewed = true;
    }
  }
  document.addEventListener('click', (e) => {
    const link = e.target.closest?.('a[href]');
    if (!trackingEnabled || !link) return;
    const url = new URL(link.href, location.href);
    if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com') {
      window.fbq('track', 'Contact', {
        content_name: 'WhatsApp',
        content_category: 'whatsapp_click',
      });
    }
  });
  document.getElementById('privacy-settings').addEventListener('click', () => {
    checkbox.checked = true;
    marketing.checked = trackingEnabled;
    accept.disabled = false;
    gate.hidden = false;
    site.inert = true;
    document.documentElement.classList.add('consent-locked');
    document.getElementById('consent-title').focus();
  });
  const accept = document.getElementById('consent-accept');
  function unlock() {
    gate.hidden = true;
    site.inert = false;
    document.documentElement.classList.remove('consent-locked');
  }
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(key));
  } catch {}
  if (saved && saved.version === version && saved.accepted === true) {
    if (saved.marketing === true) enableTracking();
    unlock();
  } else {
    document.getElementById('consent-title').focus();
  }
  checkbox.addEventListener('change', () => {
    accept.disabled = !checkbox.checked;
  });
  accept.addEventListener('click', () => {
    if (!checkbox.checked) return;
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          version,
          accepted: true,
          marketing: marketing.checked,
          acceptedAt: new Date().toISOString(),
        }),
      );
    } catch {}
    if (marketing.checked) enableTracking();
    else {
      trackingEnabled = false;
      if (window.fbq) window.fbq('consent', 'revoke');
    }
    unlock();
    site.querySelector('a').focus();
  });
  gate.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const items = [...gate.querySelectorAll('a[href], input, button:not(:disabled)')];
    const first = items[0],
      last = items[items.length - 1];
    if (
      e.shiftKey &&
      (document.activeElement === first || document.activeElement.id === 'consent-title')
    ) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
