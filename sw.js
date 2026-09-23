/* Dice Throne Matrix — service worker
   Bump VERSION on every release: it wipes the old cache and forces a refresh. */
const VERSION = 'v44';
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
  'spider-man',
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

/* Token artwork — add a slug here whenever a token is added to the app. */
const TOKEN_ART = [
  'accuracy',
  'ace-cards',
  'acuity',
  'agility',
  'alpha',
  'back-strike',
  'bag-of-tricks',
  'barbed-vine',
  'battle-plan',
  'bleed',
  'blessing-of-divinity',
  'blind',
  'blinding-light',
  'blood-power',
  'bounty',
  'burn',
  'charged-gem',
  'cheer',
  'chi',
  'cleanse',
  'coal',
  'combo',
  'concussion',
  'conjure',
  'constrict',
  'corpse',
  'cosmic-flare',
  'cosmic-ray',
  'covert-ops',
  'crackle',
  'crimson-bands',
  'crit',
  'cursed-doubloon',
  'decrep-ify',
  'deja-vu',
  'delayed-poison',
  'dice-cube',
  'disarm',
  'disruption',
  'dissolution',
  'donut',
  'dreadful',
  'dryad-spirit',
  'egg-nog',
  'electrokinesis',
  'entangle',
  'evasive',
  'feather',
  'fire-mastery',
  'flame-blast',
  'flight',
  'focus-fire',
  'footwork',
  'force-field',
  'gift',
  'glide',
  'grim-pursuit',
  'guard-break',
  'haunted-head',
  'heal-bot',
  'hex',
  'holy-presence',
  'honor',
  'ice-shard',
  'illusion',
  'infiltration',
  'influence',
  'invisibility',
  'ionic-energy',
  'kinetic-energy',
  'knockdown',
  'lightning',
  'manifest-die',
  'mesmerize',
  'mjolnir',
  'molecular-acceleration',
  'moon-shard',
  'nanite',
  'nanobot',
  'nevermore',
  'ninjutsu',
  'nyra',
  'nyras-bond',
  'onomatopoeia',
  'oppression',
  'ore',
  'paralyze',
  'parlay',
  'phoenix-burn',
  'poison',
  'potions',
  'powder-keg',
  'premonition',
  'prey',
  'probability-manipulation',
  'protect',
  'radiance',
  'rage',
  'reality-warp',
  'regenerate',
  'rejects',
  'reload',
  'resurrect',
  'retribution',
  'rps',
  'sapling-spirit',
  'seedling-spirit',
  'shadows',
  'shame',
  'shape-shift',
  'shock-bot',
  'skyward',
  'smoke-bomb',
  'sneak-attack',
  'spellbound',
  'spells',
  'strength-of-the-mountain',
  'strength-of-the-ocean',
  'strength-of-the-sky',
  'stun',
  'sun-dial',
  'sun-marked',
  'support',
  'synth',
  'tactical-advantage',
  'targeted',
  'time-bomb',
  'tornado',
  'undead',
  'unearth',
  'vibranium-suit',
  'webbed',
  'wellspring',
  'wind-shear',
  'wither',
  'wound',
];

/* Symbols used inside token text ([[2UD]] -> sym/2ud.png). */
const SYMBOLS = [
  '0hp',
  '1card',
  '1cp',
  '1dm',
  '1hp',
  '1sld',
  '1ud',
  '2card',
  '2cp',
  '2dm',
  '2hp',
  '2sld',
  '2ud',
  '3card',
  '3dm',
  '3sld',
  '3ud',
  '4dm',
  '4sld',
  '4ud',
  '5dm',
  '5hp',
  '5ud',
  '6dm',
  'adbolt',
  'adgear',
  'adwrench',
  'cp',
  'd6',
  'dpdjoke',
  'dpdknife',
  'gdheartdiamond',
  'gdspadeclub',
  'halfsld',
  'hhdhorseshoe',
  'ndbones',
  'plus1ud',
  'posn',
  'regenerate-1',
  'sdaxe',
  'sdball',
  'sdstar',
  'time-bomb-1',
  'vitality',
];

/* Extra artwork used by the special hero cards. */
const EXTRA_ART = [
  'bolsterate',
  'bone-golem',
  'card-illusion',
  'cleansitude',
  'diamond-helmet',
  'diamond-ore',
  'diamond-shield',
  'druid-overlays',
  'footwork-track',
  'gold-helmet',
  'gold-ore',
  'gold-shield',
  'prog-arrow',
  'punchify',
  'skeletal-mage',
  'skeletal-warrior',
  'toxification',
  'ultimanium-helmet',
  'ultimanium-ore',
  'ultimanium-shield',
];

/* Optional background artwork — skipped quietly when a file is absent. */
const BACKGROUNDS = [
  'artificer',
  'barbarian',
  'cursed-pirate',
  'gunslinger',
  'huntress',
  'marvel',
  'monk',
  'moon-elf',
  'ninja',
  'paladin',
  'pyromancer',
  'samurai',
  'seraph',
  'shadow-thief',
  'tactician',
  'treant',
  'vampire-lord',
];

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
    await Promise.all(BACKGROUNDS.map(b => tryCache(cache, './bkg/' + b + '.webp')));
    await Promise.all(TOKEN_ART.map(t => tryCache(cache, './tok/' + t + '.png')));
    await Promise.all(SYMBOLS.map(x => tryCache(cache, './sym/' + x + '.png')));
    await Promise.all(EXTRA_ART.map(x => tryCache(cache, './extraimg/' + x + '.png')));
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
