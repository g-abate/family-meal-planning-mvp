// Workbox configuration for PWA caching strategies
// This file is referenced by the Vite PWA plugin configuration

module.exports = {
  // Cache strategies for different types of assets
  runtimeCaching: [
    {
      // Cache Google Fonts
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        }
      }
    },
    {
      // Cache Google Fonts static files
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'gstatic-fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        }
      }
    },
    {
      // Cache images
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        }
      }
    },
    {
      // Cache API responses with NetworkFirst strategy
      urlPattern: /^https:\/\/api\./,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 // 1 day
        },
        networkTimeoutSeconds: 10
      }
    },
    {
      // Cache recipes database for offline use
      urlPattern: /recipes\.sqlite$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'recipes-db-cache',
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
        }
      }
    }
  ],
  
  // Skip waiting and claim clients immediately
  skipWaiting: true,
  clientsClaim: true,
  
  // Clean up old caches
  cleanupOutdatedCaches: true,
  
  // Exclude certain files from precaching
  exclude: [
    /\.map$/,
    /manifest$/,
    /\.htaccess$/,
    /service-worker\.js$/,
    /sw\.js$/
  ]
};
