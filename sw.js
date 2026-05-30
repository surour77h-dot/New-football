const CACHE='football-manager-luxury-v2-simple-menu';
const ASSETS=['./','index.html','style.css?v=simplemenu1','app.js?v=simplemenu1','manifest.json?v=simplemenu1'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>null)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>null);return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))));});