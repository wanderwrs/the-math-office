const CACHE_NAME = 'daoqiao-calculator-v2.0.0';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './cement_consistency_calculator.html',
  './cement_fineness_calculator.html',
  './cement_mortar_strength_calculator.html',
  './cement_paste_mortar_calculator.html',
  './cement_sand_ratio_calculator.html',
  './concrete_slump_calculator.html',
  './needle_shape_calculator.html',
  './sand_density_calculator.html',
  './sand_sieve_analysis_calculator.html',
  './water_cement_ratio_calculator.html',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                if (event.request.method === 'GET') {
                  cache.put(event.request, responseToCache);
                }
              });
            return response;
          }
        ).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
