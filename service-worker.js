// Portuguese Drills - Service Worker
// Version 1.0.0 - PWA Offline Support

const CACHE_NAME = 'portuguese-drills-v8-phase-param';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',

  // JavaScript files
  '/js/pronunciation-annotator.js',
  '/js/diagnosticTest.js',
  '/js/answerChips.js',
  '/js/conjugations.js',
  '/js/utils.js',

  // CSS
  '/css/styles.css',

  // Manifest
  '/manifest.json',

  // Icons (will be added after generation)
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Documentation files to cache (optional, for offline reference)
const DOCUMENTATION_ASSETS = [
  '/SYLLABUS_PHASE_1.md',
  '/PRONUNCIATION_RULES.md',
  '/PEDAGOGY.md',
  '/ANNOTATOR_FEATURE_SUMMARY.md'
];

// Configuration files to cache
const CONFIG_ASSETS = [
  '/config/diagnostic-test-questions-v10.9-no-hints.json',
  '/config/diagnostic-test-production-questions.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets...');

      // Cache essential assets first
      return cache.addAll(STATIC_ASSETS)
        .then(() => {
          console.log('[Service Worker] Static assets cached successfully');

          // Try to cache optional assets (don't fail if they're missing)
          return Promise.allSettled([
            cache.addAll(DOCUMENTATION_ASSETS).catch(err => {
              console.log('[Service Worker] Some documentation assets not cached:', err);
            }),
            cache.addAll(CONFIG_ASSETS).catch(err => {
              console.log('[Service Worker] Some config assets not cached:', err);
            })
          ]);
        })
        .then(() => {
          console.log('[Service Worker] Install complete');
          // Skip waiting to activate immediately
          return self.skipWaiting();
        });
    }).catch((error) => {
      console.error('[Service Worker] Install failed:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            // Delete old versions of cache
            return name.startsWith('portuguese-drills-') && name !== CACHE_NAME;
          })
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[Service Worker] Activation complete');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        console.log('[Service Worker] Serving from cache:', event.request.url);

        // Update cache in background (stale-while-revalidate strategy)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {
          // Network fetch failed, but we already have cached version
        });

        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Check if valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
          return networkResponse;
        }

        // Clone the response (can only use response once)
        const responseToCache = networkResponse.clone();

        // Cache successful responses
        caches.open(CACHE_NAME).then((cache) => {
          // Only cache same-origin requests
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, responseToCache);
            console.log('[Service Worker] Cached new resource:', event.request.url);
          }
        });

        return networkResponse;
      }).catch((error) => {
        console.error('[Service Worker] Fetch failed:', error);

        // If fetching a page failed, show offline page
        if (event.request.destination === 'document') {
          return caches.match(OFFLINE_URL);
        }

        // For other resources, throw error
        throw error;
      });
    })
  );
});

// Message event - allow clients to skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Received SKIP_WAITING message');
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[Service Worker] Clearing cache...');
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[Service Worker] Cache cleared');
        return self.clients.claim();
      })
    );
  }
});

// Background sync (optional - for future use)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(
      // Sync user progress to server when back online
      syncProgressToServer()
    );
  }
});

async function syncProgressToServer() {
  // TODO: Implement progress sync when backend is available
  console.log('[Service Worker] Background sync triggered');
}

// Push notification (optional - for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Time to practice Portuguese!',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'start-drill',
        title: 'Start Drill',
        icon: '/icons/action-drill.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Portuguese Drills', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'start-drill') {
    event.waitUntil(
      clients.openWindow('/?action=start-session')
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[Service Worker] Script loaded');
