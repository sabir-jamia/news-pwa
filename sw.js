importScripts('./node_modules/workbox-sw/build/workbox-sw.js');

const staticAssets = [
  './',
  './styles.css',
  './app.js',
  './fallback.json',
  './images/fetch-dog.jpg'
];

workbox.precaching.precache(staticAssets);

workbox.routing.registerRoute(
  new RegExp('https://newsapi.org/(.*)'),
  new workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute(
  new RegExp(/.*\.(png|jpg|jpeg|gif)/),
  new workbox.strategies.CacheFirst({
    cacheName: 'news-images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: 12 * 60 * 60
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

//
// self.addEventListener('install', async e => {
//   const cache = await caches.open('news-static');
//   cache.addAll(staticAssets);
// });

// self.addEventListener('fetch', e => {
//   const req = e.request;
//   const url = new URL(req.url);

//   if (url.origin === location.origin) {
//     e.respondWith(cacheFirst(req));
//   } else {
//     e.respondWith(networkFirst(req));
//   }
// });

// async function cacheFirst(req) {
//   const cachedResponse = await caches.match(req);
//   return cachedResponse || fetch(req);
// }

// async function networkFirst(req) {
//   const cache = await caches.open('news-dynamic');

//   try {
//     const res = await fetch(req);
//     cache.put(req, res.clone());
//     return res;
//   } catch (error) {
//     const cachedResponse = await cache.match(req);
//     console.log(await caches.match('./fallback.json'));
//     return cachedResponse || (await caches.match('./fallback.json'));
//   }
// }
