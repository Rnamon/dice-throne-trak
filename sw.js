/* Dice Throne Battle Log — service worker
   Bump VERSION on every release: it wipes the old cache and forces a refresh. */
const VERSION = 'v5';
const CACHE   = 'dt-' + VERSION;

/* The app shell: without these the app cannot start offline. */
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

/* Hero artwork. Missing files are skipped quietly, so you can add images at
   your own pace without ever breaking the install. */
const HEROES = [
  'alchemist',
  'artificer',
  'barbarian',
  'black-panther',
  'black-widow',
  'captain-marvel',
  'cursed-pirate',
  'cyclops',
  'deadpool',
  'doctor-strange',
  'druid',
  'duelist',
  'forgemaster',
  'gambit',
  'gunslinger',
  'headless-horseman',
  'huntress',
  'iceman',
  'jean-grey',
  'krampus',
  'loki',
  'miles-morales-spider-man',
  'monk',
  'moon-elf',
  'mystic-brawler',
  'necromancer',
  'ninja',
  'paladin',
  'pale-lady',
  'psylocke',
  'pyromancer',
  'raveness',
  'rogue',
  'samurai',
  'santa',
  'scarlet-witch',
  'seraph',
  'shadow-thief',
  'storm',
  'sun-elf',
  'tactician',
  'thor',
  'treant',
  'vampire-lord',
  'wolverine'
];
const EXT = ['webp', 'png', 'jpg', 'jpeg'];

/* Cache one URL, ignoring failures. */
async function tryCache(cache, url){
  try {
    const res = await fetch(url, { cache: 'reload' });
    if (res && res.ok) { await cache.put(url, res.clone()); return true; }
  } catch (e) {}
  return false;
}

/* For each hero, store the first extension that actually exists. */
async function cacheHero(cache, slug){
  for (const ext of EXT){
    if (await tryCache(cache, './img/' + slug + '.' + ext)) return;
  }
}

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);                       // must succeed
    await Promise.all(HEROES.map(s => cacheHero(cache, s)));  // best effort
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  /* Navigation: serve the app shell so a cold offline launch works. */
  if (req.mode === 'navigate'){
    e.respondWith((async () => {
      try {
        const net = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put('./index.html', net.clone());
        return net;
      } catch (err) {
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  /* Google Fonts: cache on first success so the type survives offline. */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'){
    e.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      try {
        const net = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(req, net.clone());
        return net;
      } catch (err) {
        return hit || Response.error();
      }
    })());
    return;
  }

  /* Everything else (artwork, icons): cache first, network as a fallback. */
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const net = await fetch(req);
      if (net && net.ok && url.origin === location.origin){
        const cache = await caches.open(CACHE);
        cache.put(req, net.clone());
      }
      return net;
    } catch (err) {
      return Response.error();
    }
  })());
});
