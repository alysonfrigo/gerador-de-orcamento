const CACHE_NAME = 'orcamento-app-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network first, fallback to cache
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Clone response to store in cache
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          if (e.request.method === 'GET' && e.request.url.startsWith('http')) {
            cache.put(e.request, resClone);
          }
        });
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
