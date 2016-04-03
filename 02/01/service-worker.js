'use strict';

var version = 1;
var currentCache = {
  offline: 'offline-cache' + version
};

var offlineUrl = 'offline.html';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll([
        'offline.svg',
        offlineUrl
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request,
    headerIncludesHTML = request.headers.get('accept').includes('text/html'),
    isRequestMethodGET = request.method === 'GET';

  if (request.mode === 'navigate' || isRequestMethodGET) {
    event.respondWith(
      fetch(request).catch(function(error) {
        console.log('request.url:', request.url)
        return caches.match(request.url);
      })
    );
  } else {
    event.respondWith(caches.match(request)
        .then(function (response) {
        return response || fetch(request);
      })
    );
  }
});
