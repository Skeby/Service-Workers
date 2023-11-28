// There might be different versions of cache, hence the need to set the name
const cacheName = "v2";

// Install service worker - by calling install event
self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed");
});

// Call activate event
self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activated");
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call fetch event
self.addEventListener("fetch", (e) => {
  console.log("Service Worker: Fetching");
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Make copy/clone of response
        const resClone = res.clone();
        //   Open the cache
        caches.open(cacheName).then((cache) => {
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch((err) => {
        caches.match(e.request).then((res) => res);
      })
  );
});
