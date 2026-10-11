const SHELL = 'birdlens-shell-v1';
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    const response = await fetch('/');
    const html = await response.clone().text();
    await cache.put('/', response);
    const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"\s]+)"/g)].map(match => match[1]);
    await cache.addAll(['/icon.svg', '/manifest.webmanifest', ...new Set(assets)]);
    // Worker/runtime chunks are lazy-loaded: cache all emitted assets for offline inference.
    const manifest = await fetch('/offline-assets.json');
    if (!manifest.ok) throw new Error('Missing offline asset manifest');
    await cache.addAll(await manifest.json());
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith('birdlens-shell-') && key !== SHELL) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/models/')) return;
  event.respondWith((async () => {
    const cache = await caches.open(SHELL);
    if (event.request.mode === 'navigate') {
      try { return await fetch(event.request); } catch { return (await cache.match('/')) || Response.error(); }
    }
    // Immutable same-origin build assets may be served with Vary: Origin.
    // Script crossorigin requests must still match the install-time cache entry.
    const cached = await cache.match(event.request, { ignoreVary: true });
    if (cached) return cached;
    return fetch(event.request);
  })());
});
