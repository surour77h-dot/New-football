
const CACHE='football-redesign-20260529-redesign-3';
const ASSETS=['./','index.html','style.css?v=20260529-redesign-3','app.js?v=20260529-redesign-3','manifest.json?v=20260529-redesign-3'];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS).catch(()=>null)));
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(response => {
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request, copy)).catch(()=>null);
      return response;
    }).catch(() => caches.match(event.request).then(r => r || caches.match('./')))
  );
});
