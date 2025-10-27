const CACHE_NAME = 'ewidencja_przebiegu_aut-v1';
const urlsToCache = [
  '/ewidencja_przebiegu_aut/',
  '/ewidencja_przebiegu_aut/index.html',
  '/ewidencja_przebiegu_aut/manifest.json',
  '/ewidencja_przebiegu_aut/icon.png',
  '/ewidencja_przebiegu_aut/icon-512.png'
];

// Instalacja Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalacja...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache otwarty');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Service Worker: Błąd podczas cachowania', err);
      })
  );
});

// Aktywacja Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Aktywacja...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Usuwanie starego cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Przechwytywanie żądań
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(err => {
            console.log('Service Worker: Błąd pobierania z sieci', err);
          });
      })
  );

});
