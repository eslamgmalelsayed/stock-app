// Service Worker for heavy computational tasks and data processing

const CACHE_NAME = 'stock-app-v1';
const ASSETS_TO_CACHE = ['/', '/index.html'];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Fail silently if some assets can't be cached
        console.warn('Some assets could not be cached');
      });
    }),
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip WebSocket upgrade requests
  if (event.request.url.startsWith('wss://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if available
      if (response) {
        return response;
      }

      // Otherwise, fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type === 'error'
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache static assets
          if (
            event.request.url.includes('.js') ||
            event.request.url.includes('.css') ||
            event.request.url.includes('.png') ||
            event.request.url.includes('.svg')
          ) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // Return offline page or fallback
          console.warn('Fetch failed for:', event.request.url);
        });
    }),
  );
});

// Message handler for background tasks
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PROCESS_STOCK_DATA') {
    // Heavy data processing task
    const { data } = event.data;
    const processed = processStockData(data);
    event.ports[0].postMessage({ processed });
  }
});

// Helper function for heavy data processing
function processStockData(data) {
  // Example: heavy calculations
  return data.map((item) => ({
    ...item,
    priceFormatted: item.price?.toFixed(2) || 'N/A',
    changePercent: calculateChange(item),
    timestamp: new Date(item.timestamp * 1000).toLocaleTimeString(),
  }));
}

function calculateChange(item) {
  if (!item.bid || !item.ask) return 0;
  return (((item.ask - item.bid) / item.bid) * 100).toFixed(2);
}
