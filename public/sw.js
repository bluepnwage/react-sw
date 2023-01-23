const addToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.add(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async (request) => {
  if (request.url.includes("chrome-extension")) {
    return fetch(request);
  }
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;
  const networkResponse = await fetch(request);
  putInCache(request, networkResponse.clone());
  return networkResponse;
};

self.addEventListener("install", (event) => {
  event.waitUntil(addToCache(["/index.html"]));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(event.request));
});
