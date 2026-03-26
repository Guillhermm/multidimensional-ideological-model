const CACHE = 'mim-v1';

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
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok && e.request.url.startsWith(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
