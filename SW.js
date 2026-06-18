const CACHE = "ax3d-v1";

const ASSETS = [
    "./",
    "./index.html",
    "./manifest.json"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE)
        .then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                .filter(key => key !== CACHE)
                .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            return response || fetch(event.request)
                .then(networkResponse => {
                    const clone = networkResponse.clone();

                    caches.open(CACHE)
                    .then(cache => {
                        cache.put(event.request, clone);
                    });

                    return networkResponse;
                });
        })
        .catch(() => caches.match("./"))
    );
});