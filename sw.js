// Service Worker for Lilaya PWA
const CACHE_NAME = 'lilaya-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/inventory.html',
  '/library.html',
  '/mind/index.html',
  '/body/index.html',
  '/mind/feelings.html',
  '/body/senses.html',
  '/body/actions.html',
  '/mind',
  '/body',
  '/inventory',
  '/library',
  '/mind/feelings',
  '/body/senses',
  '/body/actions',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js',
  'https://cdn.jsdelivr.net/npm/@tabler/icons@latest/iconfont/tabler-icons.min.css',
  'https://cdn.jsdelivr.net/npm/@tabler/icons@latest/iconfont/fonts/tabler-icons.woff2'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force the service worker to become active immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }

          // Clone the response because it can only be used once
          const responseToCache = response.clone();

          // Cache the fetched response for future use
          caches.open(CACHE_NAME)
            .then(cache => {
              // Only cache same-origin and CDN resources
              const url = event.request.url;
              if (url.startsWith(self.location.origin) || 
                  url.includes('cdn.tailwindcss.com') || 
                  url.includes('cdn.jsdelivr.net') ||
                  url.includes('@tabler/icons')) {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        }).catch(() => {
          // Network request failed, serve offline page
          return caches.match('/index.html');
        });
      })
  );
});

// Background sync for queued NUTs
self.addEventListener('sync', event => {
  if (event.tag === 'sync-nuts') {
    event.waitUntil(syncNuts());
  }
});

async function syncNuts() {
  // This will be implemented when we add Supabase
  console.log('Background sync triggered');
}

// Handle messages from the app
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Push notifications (for future use)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Lilaya', options)
  );
});