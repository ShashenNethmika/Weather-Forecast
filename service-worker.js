self.addEventListener('install', (e)=>{ e.waitUntil(caches.open('wf-v1').then(c=>c.addAll(['./','./index.html','./style.css','./script.js','./upgrade.js']))); });
self.addEventListener('fetch', (e)=>{ e.respondWith(caches.match(e.request).then(resp=> resp || fetch(e.request).catch(()=>caches.match('./')))); });
