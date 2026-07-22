const CACHE = 'mim-v2';

const PRECACHE = [
  '/',
  '/tool',
  '/quiz',
  '/about',
  '/scripts/core.js',
  '/scripts/projection.js',
  '/scripts/interaction.js',
  '/scripts/data.js',
  '/scripts/physics.js',
  '/scripts/clustering.js',
  '/scripts/rendering.js',
  '/scripts/time.js',
  '/scripts/main.js',
  '/manifest.json',
  '/favicon.svg',
];

// Only cache genuine, first-party, non-redirected 200 responses. This keeps
// placeholder/redirect ("warmup") documents from ever poisoning the cache.
const isCacheable = res => res.ok && res.type === 'basic' && !res.redirected;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Network-first for page navigations: always fetch fresh HTML so a stale or
  // placeholder document can never get stuck. Fall back to cache when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (isCacheable(res)) {
            const clone = res.clone();
            caches.open(CACHE).then(cache => cache.put(req, clone));
          }
          return res;
        })
        .catch(() =>
          caches.open(CACHE).then(cache =>
            cache.match(req).then(cached => cached || cache.match('/'))
          )
        )
    );
    return;
  }

  // Cache-first for static assets (scripts, icons, manifest).
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (isCacheable(res)) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, clone));
        }
        return res;
      });
    })
  );
});
