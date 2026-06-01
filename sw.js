const CACHE='football-clean-v3-r12';
const ASSETS=['./','index.html','style.css?v=cleanv3r12','app.js?v=cleanv3r12','manifest.json?v=cleanv3r12'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>null)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c)).catch(()=>null);return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))))});