/* ============================================================
   NGUGI FAMILY PORTAL — Service Worker
   Provides offline support and asset caching
   ============================================================ */

const CACHE_NAME = 'ngugi-family-v1.2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/css/style.css',
  '/js/data.js',
  '/js/tree.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap',
];

// ── Install: cache all static assets ────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ──────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for assets, network-first for data ────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin API calls
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin && !url.hostname.includes('fonts.g')) return;

  event.respondWith(
    caches.match(request).then(cached => {
      const networkFetch = fetch(request).then(response => {
        // Cache fresh copies of successful responses
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => null);

      // Return cached immediately if available, update in background
      return cached || networkFetch;
    })
  );
});

// ── Background sync: notify clients of updates ───────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
