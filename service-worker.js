importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if(workbox) {
    console.log(`Workbox berhasil dimuat`);
} else {
    console.log(`Workbox gagal dimuat`);
}
// workbox.core.skipWaiting();
// workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute([
    { url: '/nav.html', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/matches.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/pages/dashboard.html', revision: '1' },
    { url: '/pages/saved.html', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/css/style.css', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/api-support.js', revision: '1' },
    { url: '/js/api.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/db.js', revision: '1' },
    { url: '/js/script.js', revision: '1' },
    { url: '/img/icon/icon.png', revision: '1' },
    { url: '/img/icon/custom_icon.png', revision: '1' },
    { url: '/img/icon/sc_icon.png', revision: '1' },
    { url: '/img/leagues/2002.png', revision: '1' },
    { url: '/img/leagues/2003.png', revision: '1' },
    { url: '/img/leagues/2014.png', revision: '1' },
    { url: '/img/leagues/2015.png', revision: '1' },
    { url: '/img/leagues/2016.png', revision: '1' },
    { url: '/img/leagues/2021.png', revision: '1' },
], {
    ignoreURLParametersMatching: [/.*/]
});
workbox.routing.registerRoute(
    new RegExp('^https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'football-api',
        cacheableResponse: {
            statuses: [0, 200]
        },
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 120,
                maxAgeSeconds: 60000*60*24*7,
            }),
        ]
    })
);
workbox.routing.registerRoute(
    new RegExp('^https://fonts.googleapis.com'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        cacheableResponse: {
            statuses: [0, 200]
        }
    })
);
workbox.routing.registerRoute(
    new RegExp('^https://fonts.gstatic.com'),
    workbox.strategies.cacheFirst({
        cacheName: 'google-fonts-webfonts',
        cacheableResponse: {
            statuses: [0, 200]
        },
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ]
    })
);
workbox.routing.registerRoute(
    new RegExp('^https://unpkg.com/snarkdown@1.0.2/dist/snarkdown.umd.js'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'snarkdown',
        cacheableResponse: {
            statuses: [0, 200]
        }
    })
);
workbox.routing.registerRoute(
    /\.(?:png|jpx|css|svg)$/,
    workbox.strategies.networkFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 25,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
        ],
    })
);
self.addEventListener('push', function(event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        icon: '/sc_icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});