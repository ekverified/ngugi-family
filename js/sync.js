/* ============================================================
   NGUGI FAMILY PORTAL — Cross-tab Sync & Hash Routing
   Loaded after data.js in BOTH index.html and admin.html
   ============================================================ */

/* ── Cross-tab storage sync ─────────────────────────────────
   When admin saves on one tab/device the member portal tab
   receives the storage event and auto re-renders.           */
window.addEventListener('storage', (event) => {
  if (event.key !== DB_KEY) return;
  if (typeof renderPage === 'function' && typeof currentPage !== 'undefined') {
    renderPage(currentPage);
  }
  updateGlobalCounters();
});

/* ── Hash routing ────────────────────────────────────────────
   Deep-links: index.html#kitty  index.html#tree  etc.
   PWA shortcut URLs also rely on these hashes.              */
function handleHashRoute() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;
  const valid = ['home','kitty','members','tree','leadership','minutes','events','gallery'];
  if (valid.includes(hash)) {
    const navItem = document.querySelector('.nav-item[onclick*="\'' + hash + '\'"]');
    if (typeof showPage === 'function') showPage(hash, navItem);
  }
}
window.addEventListener('hashchange', handleHashRoute);

/* ── Patch showPage to keep URL hash in sync ─────────────── */
function patchShowPageForHash() {
  if (typeof showPage !== 'function') return;
  const orig = window.showPage;
  window.showPage = function(id, el) {
    history.replaceState(null, '', id === 'home' ? location.pathname : '#' + id);
    orig(id, el);
  };
}

/* ── Global counters ─────────────────────────────────────── */
function updateGlobalCounters() {
  try {
    const members = DB.get().members.filter(m => m.tier !== 'founder');
    const badge = document.getElementById('memberCount');
    if (badge) badge.textContent = members.length + ' members';
  } catch(e) {}
}

/* ── Keyboard shortcut: Alt+A → admin portal ─────────────── */
document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key === 'a') window.location.href = 'admin.html';
});

/* ── Bootstrap on DOMContentLoaded ──────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  // small delay so inline scripts finish defining showPage
  setTimeout(() => {
    patchShowPageForHash();
    handleHashRoute();
    updateGlobalCounters();
  }, 80);
});
