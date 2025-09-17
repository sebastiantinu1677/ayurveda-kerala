// Enhanced Service Worker for Kerala Reisen
const CACHE_NAME = 'kerala-reisen-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

const urlsToCache = [
  '/',
  '/css/custom.css',
  '/images/webp/hero-backwaters.webp',
  '/images/keralareisenLogo.png',
  '/js/klaro-config.js',
  '/reisen/',
  '/blog/',
  '/kontakt/'
];

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Enhanced fetch event with advanced caching strategies
self.addEventListener('fetch', function(event) {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Cache strategy for images
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(function(response) {
        if (response) {
          return response;
        }
        return fetch(request).then(function(fetchResponse) {
          if (fetchResponse.status === 200) {
            const responseClone = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE).then(function(cache) {
              cache.put(request, responseClone);
            });
          }
          return fetchResponse;
        });
      })
    );
    return;
  }

  // Cache strategy for pages
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request).then(function(fetchResponse) {
        if (fetchResponse.status === 200) {
          const responseClone = fetchResponse.clone();
          caches.open(DYNAMIC_CACHE).then(function(cache) {
            cache.put(request, responseClone);
          });
        }
        return fetchResponse;
      }).catch(function() {
        return caches.match(request);
      })
    );
    return;
  }

  // Default cache strategy
  event.respondWith(
    caches.match(request).then(function(response) {
      return response || fetch(request);
    })
  );
});

