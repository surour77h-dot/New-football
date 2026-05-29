
const CACHE='football-new-app-apple-ultra-v1';
const ASSETS=['./','index.html','style.css?v=newapp1','app.js?v=newapp1','manifest.json?v=newapp1'];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>null)));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(fetch(e.request).then(r=>{
    const copy=r.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>null);
    return r;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))));
});
