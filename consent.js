(() => {
 const version = '2026-10-31';
 const key = 'asetpix-privacy-consent';
 const gate = document.getElementById('consent-gate');
 const site = document.getElementById('site-content');
 const checkbox = document.getElementById('consent-checkbox');
 const accept = document.getElementById('consent-accept');
 function unlock() { gate.hidden = true; site.inert = false; document.documentElement.classList.remove('consent-locked'); }
 let saved;
 try { saved = JSON.parse(localStorage.getItem(key)); } catch {}
 if (saved && saved.version === version && saved.accepted === true) { unlock(); return; }
 document.getElementById('consent-title').focus();
 checkbox.addEventListener('change', () => { accept.disabled = !checkbox.checked; });
 accept.addEventListener('click', () => {
  if (!checkbox.checked) return;
  try { localStorage.setItem(key, JSON.stringify({version, accepted: true, acceptedAt: new Date().toISOString()})); } catch {}
  unlock();
  site.querySelector('a').focus();
 });
 gate.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const items = [...gate.querySelectorAll('a[href], input, button:not(:disabled)')];
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || document.activeElement.id === 'consent-title')) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
 });
})();
