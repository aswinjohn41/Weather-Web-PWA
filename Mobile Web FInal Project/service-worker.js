

const nameOfCache = "cachesContent-v4";

self.addEventListener('install', (event) => {
    console.log('Installed service worker: ', event);

    self.skipWaiting();

    event.waitUntil(
        caches.open(nameOfCache)
            .then((cache) => {
                cache.addAll([
                    '/',
                    '/index.html'
                ]);
            })
            .catch((error) => {
                console.log('Cache failed: ', error);
            })
    );
});



self.addEventListener('activate', (event) => {
    console.log('Activated SW: ', event);

    event.waitUntil(clients.claim());
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((item) => {
                        if (item !== nameOfCache) {
                            return caches.delete(item);
                        }
                        return null;
                    })
                );
            })
    );
});

self.addEventListener('fetch', (event) => {

    if (event.request.method === 'GET') {
        event.respondWith(
            caches.open(nameOfCache)
                .then((cache) => {
                    return cache.match(event.request)
                        .then((cachedResponse) => {
                            const fetchedResponse = fetch(event.request)
                                .then((networkResponse) => {
                                    cache.put(event.request, networkResponse.clone());
                                    return networkResponse;
                                });
                            return cachedResponse || fetchedResponse;
                        });
                })
        );
    }
});
