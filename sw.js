const toCache = [
    "index.html",
    "static/background.png",
    "static/nemo.png",
    "static/plankton.png",
    "static/shark.png"
]

const cacheName = 'gameCache'

self.addEventListener('install', function (event) {
    event.waitUntil((async () => {
        const cache = await caches.open(cacheName)
        await cache.addAll(toCache)
    })())
})

self.addEventListener('fetch', function (event) {
    event.respondWith((async () => {
        const r = await caches.match(event.request)
        if (r) {
            return r
        }
        const response = await fetch(event.request)
        const cache = await caches.open(cacheName)
        await cache.put(event.request, response.clone())
        return response
    })())
})
