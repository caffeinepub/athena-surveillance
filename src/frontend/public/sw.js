const CACHE_NAME = 'athena-surveillance-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/generated/athena-logo.dim_512x512.png',
  '/assets/generated/athena-splash-bg.dim_1080x1920.png',
  '/assets/generated/acp-icons-set.dim_512x512.png',
  '/assets/generated/vehicle-icons-set.dim_512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
