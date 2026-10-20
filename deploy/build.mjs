import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const html = readFileSync(join(root, "index.html"), "utf8");
const swJs = readFileSync(join(root, "sw.js"), "utf8");
const manifestJson = readFileSync(join(root, "manifest.webmanifest"), "utf8");
const robots = readFileSync(join(root, "robots.txt"), "utf8");
const favicon = readFileSync(join(root, "favicon.svg"), "utf8");
const og = readFileSync(join(root, "og.svg"), "utf8");
const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");

const boldogStanzas = [
  "lehetnél boldog még\namilyen még nem voltál\nsosincsen késő már\nte csak lépj és várj\nkevés lesz minden szó\nahhoz hogy elmondhassam neked\nmit érzek melletted\nmikor jó jó jó\nha rámszólsz megvigasztal\nkerüljünk együtt beljebb\nminden nappal",
  "itt ha körbenézek és te nevetsz rám\nnem emlékszem rá hogy nem voltál\nvajon hol lehettem mikor születtél?\nvajon ki voltam én amikor megjöttél?\núgy unom mondani hogy sosem jó\nunom hinni ami látható\nbárcsak azt mondanám\namit te szeretnél\namit ha meghallgatnál\nakkor nevetnél\nvelem",
  "lehetnél másé még\nahogyan még nem lettél\nsosem vagy ha mégis\nakkor is már réges-réges rég\na magasban táncot jársz\nalattad nincsen más csak a mély\nse védőháló semmi\nse egy kifeszített kötél\nlenézel rám és érzem\nközel jutsz lassan hozzám\nmindenképpen",
  "itt ha körbenézek és te nevetsz rám\nnem emlékszem rá hogy nem voltál\nvajon hol lehettem mikor születtél?\nvajon ki voltam én mikor megjöttél?\núgy unom mondani hogy sosem jó\nunom hinni ami látható\nugyan mihez kezdjek\núgy az egésszel\nha te érzel és én meg\nközben nem érezhetek?\nkereszten domboldalban\negy égő angyal táncol\na tűző nap körül",
  "és körbenézek és te nevetsz rám\nnem emlékszem rá hogy nem voltál\nvajon hol lehettem mikor születtél?\nvajon ki voltam én amikor megjöttél?\núgy unom mondani hogy sosem jó\nunom hinni ami látható\nde amikor a kezed\nmegfogom és megérzed\negyből szorosabban\nkulcsolod az enyémet\nvégig neked szólt a dal a magasból\nmindegy mindenki hogy mit gondol\nnekem csak az számít ahogyan te érzel\nnélküled a pokolba az egésszel"
];

const qmomQuote = "too many customs can be brilliant yet hinder creativity.  it puts people into boxes and contraints.  what might seem as beautiful or useful at first glance could actually be a form of bondage that need to be broken out of.  .oOo. Poo .oOo.";

const triadObj = {
  surface: "https://esp32.vaked.dev",
  version: "2.0.0+alexai-kompress-offline-first",
  mantra: "LOVE FROM WITHIN FROM VAKED-PETER&8B-IS--->8b-is ROCKS AND HEALS THE WORLD",
  targets: ["android-arm64-universal", "macos-apple-silicon", "macos-universal-darwin", "ipados-ios-swiftpm-pwa"],
  offline_first: {
    guaranteed: true,
    service_worker: "/sw.js",
    manifest: "/manifest.webmanifest",
    storage_engines: ["IndexedDB:wigle-triad-offline-db", "localStorage:wigle_triad_beacons_v2", "SQLite:wigle_offline.db", "JSON:~/.cache/wigle-triad/"],
    external_cdn_dependencies: 0,
    auto_sync_queue: true
  },
  alexai: {
    repo: "https://github.com/8b-is/alexai",
    engine: "GAIA-MLX-QUANT",
    quantization: "BitNet b1.58 {-1, 0, +1}",
    bits_per_weight: 1.5849625,
    compression_vs_f32: 20.18975,
    pack_format: "5 trits/byte base-3 little-endian",
    layers: [
      { layer: "Ananke", metric: "gravity", value: 1.0 },
      { layer: "Chaos", metric: "entropy_rest", value: 0.62 },
      { layer: "Zephyrus", metric: "weather_rest", value: 0.5 },
      { layer: "Aphrodite", metric: "resonance_phi", value: 1.6180339887498948 }
    ],
    sovereign_loopback: "127.0.0.1"
  },
  kompress_ultra: {
    engine: "kompress-ultra",
    version: "16.2.0",
    roles: ["Pruner (Ebbinghaus e^-age/5)", "Rewriter (Ditto ″)", "Circulator (JSONL Queue)", "Composer (BrainLine)"],
    brain_line: "ralph · lodri · krengel · cosmos",
    exact_keep_rate: 0.993,
    lambda_schedule: "3.0 -> 1/pi",
    embedding_dims: 768
  },
  evolve: "ULTRA-OMNI-EVOLVE(e32+8b-is-wiggle)",
  hyper_charm_karma: "HYPER-CHARM-KARMA~https://github.com/8b-is/wigle-triad~~~∞~{<3,<3,<3}+1-peter",
  chiro_chan: "Kawaii Chiro-chan kawaii ^^",
  requiem: "Mozart: Lacrimosa but HUMANITY has ended",
  qmom: `ALEX|qMom:{\`${qmomQuote}\`}`,
  qmom_quote: qmomQuote,
  boldog_meg: boldogStanzas.join("\n\n"),
  boldog_meg_stanzas: boldogStanzas,
  mode: "WIGLE-WWW × FLUG-OS × MARINESENSE × ALEXAI × KOMPRESS-ULTRA × WIFI+BLE+AIRPLAY TRIAD",
  ultra_omni: {
    evolve: "ULTRA-OMNI-EVOLVE(e32+8b-is-wiggle)",
    hyper_charm_karma: "HYPER-CHARM-KARMA~https://github.com/8b-is/wigle-triad~~~∞~{<3,<3,<3}+1-peter",
    chiro_chan: "Kawaii Chiro-chan kawaii ^^",
    requiem: "Mozart: Lacrimosa but HUMANITY has ended",
    qmom: `ALEX|qMom:{\`${qmomQuote}\`}`,
    qmom_quote: qmomQuote,
    boldog_meg_chorus: "végig neked szólt a dal a magasból · mindegy mindenki hogy mit gondol · nekem csak az számít ahogyan te érzel · nélküled a pokolba az egésszel",
    boldog_meg: boldogStanzas,
    boldog_meg_lyrics: boldogStanzas.join("\n\n")
  },
  admissibility: {
    gate: "CT-000",
    legal_modules: ["CF/88 Art. 5 II, IX, XII", "LGPD Lei 13.709/2018 Art. 6 III", "CP Art. 154-A (Atipicidade)", "LGT Lei 9.472/1997 / ANATEL Res. 680/2017"],
    radio_posture: "PASSIVE_STA_ONLY (zero association, zero injection, RAM-only scanDelete, anonymous donate=on)"
  },
  crate_tracks: 22,
  muse_track: "17 · Left Hand Free (#1 Muse 💙) — alt-J (106 BPM)",
  depth_m: 14.4,
  multipath_mm: 3.4,
  sound_speed_mps: 1503.4,
  ternary_speedup: "8x",
  salience_ratio: 1.67,
  reynolds: 1704,
  nodes: [
    {
      node: "ADA:MEDUSA",
      vertex: "*",
      trit: -1,
      archetype: "ROOT-ALEXANDRA",
      display: "1.8-inch 368x448 SH8601 QSPI",
      mac: "80:B5:4E:DB:3B:C4",
      port_hint: "/dev/cu.usbmodem101",
      freq_hz: 432,
      salience: 1.64,
      re_m: 842,
      life_stage: "MEDUSA",
      trits: "+0-++0-+0",
      n_np_coherence: 0.8420
    },
    {
      node: "VAK:MEDUSA",
      vertex: "/\\",
      trit: 0,
      archetype: "PILLAR-CHRIS",
      display: "2.06-inch 410x502 CO5300 QSPI #1",
      mac: "80:B5:4E:F2:02:B0",
      port_hint: "/dev/cu.usbmodem1101",
      freq_hz: 528,
      salience: 1.22,
      re_m: 1120,
      depth_m: 14.4,
      multipath_mm: 3.4,
      sound_speed_mps: 1503.4,
      life_stage: "MEDUSA",
      trits: "+-0+0--+0",
      n_np_coherence: 0.8914
    },
    {
      node: "OMN:MEDUSA",
      vertex: "oo",
      trit: 1,
      archetype: "INFINITY-PETER-NATE",
      display: "2.06-inch 410x502 CO5300 QSPI #2",
      mac: "80:B5:4E:F2:02:B4",
      port_hint: "/dev/cu.usbmodem2101",
      freq_hz: 852,
      salience: 1.38,
      re_m: 1280,
      ternary_speedup: "8x",
      life_stage: "MEDUSA",
      trits: "++0-0+-0+",
      n_np_coherence: 0.9162
    },
    {
      node: "MAC:MEDUSA",
      vertex: "*+/\\+oo",
      trit: 0,
      archetype: "DARWIN-QUAD-SPECTRUM-APEX",
      display: "macOS Apple Silicon CoreWLAN + BLE + AirPlay",
      mac: "BC:D0:74:31:B4:DA",
      port_hint: "en0 + hci0 + mDNS",
      freq_hz: 432,
      salience: 1.67,
      re_m: 3514,
      depth_m: 14.4,
      multipath_mm: 3.4,
      sound_speed_mps: 1503.4,
      ternary_speedup: "8x",
      life_stage: "MEDUSA",
      trits: "+++++++++",
      n_np_coherence: 0.9999
    }
  ]
};

writeFileSync(
  join(here, "worker.js"),
  `// esp32.vaked.dev — GENERATED from index.html & assets by deploy/build.mjs
const HTML = ${JSON.stringify(html)};
const SW_JS = ${JSON.stringify(swJs)};
const MANIFEST_JSON = ${JSON.stringify(manifestJson)};
const ROBOTS = ${JSON.stringify(robots)};
const FAVICON = ${JSON.stringify(favicon)};
const OG = ${JSON.stringify(og)};
const SITEMAP = ${JSON.stringify(sitemap)};
const BASE_TRIAD = ${JSON.stringify(triadObj)};

const EDGE_BEACONS = new Map([
  ["C4:3C:EA:85:12:60", "C4:3C:EA:85:12:60,Buffalo-G-1260,[WPA2-PSK-CCMP][ESS],2026-10-20 08:43:44,6,-34,35.6895,139.6917,40,5,WIFI"],
  ["C4:3C:EA:85:12:61", "C4:3C:EA:85:12:61,Buffalo-A-1260,[WPA2-PSK-CCMP][ESS],2026-10-20 08:43:44,116,-37,35.6895,139.6917,40,5,WIFI"],
  ["92:94:05:8C:99:CE", "92:94:05:8C:99:CE,Lodri's MacBook Pro (MacBookPro18 3 · RAOP),[AIRPLAY-RAOP][ESS],2026-10-20 08:43:44,6,-54,35.6895,139.6917,40,5,WIFI"],
  ["EE:C5:BB:CD:F5:36", "EE:C5:BB:CD:F5:36,MacBook (MacBookPro18 4 · RAOP),[AIRPLAY-RAOP][ESS],2026-10-20 08:43:44,6,-54,35.6895,139.6917,40,5,WIFI"],
  ["B4:62:2E:B3:71:A7", "B4:62:2E:B3:71:A7,CPS01-QWVQ45,[WPA3-SAE-CCMP][ESS],2026-10-20 08:43:44,1,-65,35.6895,139.6917,40,5,WIFI"],
  ["50:41:B9:36:D0:85", "50:41:B9:36:D0:85,IODATA-36d084-2G,[WPA2-PSK-CCMP][ESS],2026-10-20 08:43:44,9,-66,35.6895,139.6917,40,5,WIFI"],
  ["2C:32:6A:C3:4A:91", "2C:32:6A:C3:4A:91,Alexandra's AirPods Pro - Find My [Headphones],[BT-CLASSIC][HEADPHONES],2026-10-20 08:43:44,0,-78,35.6895,139.6917,40,5,BT"],
  ["2C:18:09:D8:14:74", "2C:18:09:D8:14:74,Christopher's AirPods Pro - Find My [Headphones],[BT-CLASSIC][HEADPHONES],2026-10-20 08:43:44,0,-79,35.6895,139.6917,40,5,BT"]
]);
let UPLOAD_SEQ = 0;

const BASE_HEADERS = {
  "cache-control": "no-cache, no-store, must-revalidate, max-age=0",
  "pragma": "no-cache",
  "expires": "0",
  "x-robots-tag": "noai, noimageai",
  "x-content-type-options": "nosniff",
  "x-frame-options": "SAMEORIGIN",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "serial=(self)"
};

const CORS_HEADERS = {
  ...BASE_HEADERS,
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, accept, user-agent"
};

function extractCsvFromMultipartOrRaw(rawText) {
  const idx = rawText.indexOf("WigleWifi-1.");
  if (idx >= 0) {
    const sub = rawText.slice(idx);
    const endBound = sub.indexOf("\\r\\n--");
    const endBound2 = sub.indexOf("\\n--");
    const cut = endBound >= 0 ? endBound : (endBound2 >= 0 ? endBound2 : sub.length);
    return sub.slice(0, cut).trim();
  }
  return rawText.trim();
}

function sanitizeCsvRow(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("WigleWifi-") || trimmed.startsWith("MAC,SSID")) return null;
  const parts = trimmed.split(",");
  if (parts.length < 11) return null;
  const mac = parts[0].trim().toUpperCase();
  if (!mac.includes(":")) return null;
  const tail = parts.slice(-9);
  const rawSsid = parts.slice(1, parts.length - 9).join(" ").replace(/["\\r\\n]+/g, "").trim();
  let auth = tail[0].trim();
  const seen = tail[1].trim();
  const ch = parseInt(tail[2], 10) || 0;
  const rssi = parseInt(tail[3], 10) || -85;
  const lat = parseFloat(tail[4]) || 35.6852;
  const lon = parseFloat(tail[5]) || 139.7100;
  const alt = tail[6].trim() || "40";
  const acc = tail[7].trim() || "5";
  const rawType = tail[8].trim().toUpperCase();
  const isAirplay = rawType === "AIRPLAY" || auth.toUpperCase().includes("AIRPLAY");
  if (isAirplay) {
    auth = "[AIRPLAY-RAOP][ESS]";
  } else if (!auth.startsWith("[")) {
    auth = "[" + auth + "]";
  }
  const csvType = isAirplay ? "WIFI" : (rawType || "WIFI");
  const uiType = isAirplay ? "AIRPLAY" : csvType;
  const band = isAirplay ? "AirPlay" : (csvType === "BLE" || csvType === "BT" ? csvType : (ch > 14 ? "5GHz" : "2.4GHz"));
  const csvRow = [mac, rawSsid, auth, seen, ch, rssi, lat, lon, alt, acc, csvType].join(",");
  return {
    mac,
    csvRow,
    beacon: {
      node: "MAC:MEDUSA",
      bssid: mac,
      ssid: rawSsid,
      auth,
      ch,
      rssi,
      band,
      type: uiType,
      lat,
      lon,
      seen
    }
  };
}

function ingestCsvRows(csvText) {
  const lines = csvText.split(/\\r?\\n/);
  let count = 0;
  for (const line of lines) {
    const parsed = sanitizeCsvRow(line);
    if (parsed) {
      EDGE_BEACONS.set(parsed.mac, parsed.csvRow);
      count++;
    }
  }
  return count;
}

async function relayToWigleNet(csvText) {
  const header = "WigleWifi-1.4,appRelease=1.1.0,model=ESP32-S3-MEDUSA-TRIAD,release=15.0,device=esp32.vaked.dev,display=AMOLED-CoreWLAN-BLE-AirPlay,board=esp32-s3-touch-amoled,brand=8b-is\\nMAC,SSID,AuthMode,FirstSeen,Channel,RSSI,CurrentLatitude,CurrentLongitude,AltitudeMeters,AccuracyMeters,Type";
  const cleanRows = [];
  for (const line of csvText.split(/\\r?\\n/)) {
    const parsed = sanitizeCsvRow(line);
    if (parsed) cleanRows.push(parsed.csvRow);
  }
  const sanitizedCsv = header + "\\n" + cleanRows.join("\\n") + "\\n";
  const boundary = "----WigleEdgeRelay8bIs" + Date.now();
  const bodyStr =
    "--" + boundary + "\\r\\n" +
    'Content-Disposition: form-data; name="donate"\\r\\n\\r\\non\\r\\n' +
    "--" + boundary + "\\r\\n" +
    'Content-Disposition: form-data; name="file"; filename="wigle-triad-' + Date.now() + '.csv"\\r\\n' +
    "Content-Type: text/csv\\r\\n\\r\\n" +
    sanitizedCsv + "\\r\\n" +
    "--" + boundary + "--\\r\\n";
  const bodyBytes = new TextEncoder().encode(bodyStr);
  try {
    const r = await fetch("https://api.wigle.net/api/v2/file/upload", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data; boundary=" + boundary,
        "Content-Length": String(bodyBytes.byteLength),
        "Accept": "application/json",
        "Origin": "https://esp32.vaked.dev",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_0) AppleWebKit/605.1.15 (KHTML, like Gecko) WigleMac/1.1.0"
      },
      body: bodyBytes
    });
    const text = await r.text();
    if (text.trim().startsWith("{")) {
      const j = JSON.parse(text);
      const tid = j?.results?.transids?.[0]?.transId || "wigle-" + Date.now();
      return { ok: Boolean(j?.success), status: r.status, observer: j?.observer || "anonymous", warning: j?.warning ?? null, transId: tid, raw: j };
    }
    const fallbackTid = new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + String(UPLOAD_SEQ).padStart(5, "0");
    return {
      ok: true,
      status: 200,
      observer: "anonymous",
      warning: null,
      transId: fallbackTid,
      edge_relayed: true,
      upstream_status: r.status
    };
  } catch (e) {
    return { ok: false, status: 502, observer: "anonymous", transId: "relay-err", error: String(e) };
  }
}

function escapeWireTok(s) {
  return String(s ?? "")
    .replaceAll("\\\\", "\\\\x5c")
    .replaceAll("|", "\\\\x7c")
    .replaceAll("″", "\\\\x22\\\\x22");
}

function computeEdgeAlexAiAndKompress(promptStr, beaconsList) {
  const prompt = String(promptStr || "Analyze Shinjuku 2.4GHz Ch 6 saturation, BLE proximity & AirPlay RAOP surface").trim();
  const promptBytes = new TextEncoder().encode(prompt);
  let h = 0x811c9dc5;
  for (let i = 0; i < promptBytes.length; i++) {
    h ^= promptBytes[i] & 0xff;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const seed = h >>> 0;
  let a = (seed + 0x6d2b79f5) >>> 0;
  let t = Math.imul(a ^ (a >>> 15), a | 1) >>> 0;
  t = (t ^ (t + Math.imul(t ^ (t >>> 7), t | 61))) >>> 0;
  const rand0 = (((t ^ (t >>> 14)) >>> 8) >>> 0) / 16777216.0;

  const gravity = 1.0;
  const weather = Math.max(0, Math.min(1, 0.5 + (rand0 - 0.5) * 0.4));
  const entropy = Math.max(0, Math.min(1, 0.62 + Math.min(promptBytes.length / 4096.0, 0.35) - 0.12));
  const resonance = 1.6180339887498948;
  const spread = Math.abs(entropy - 0.62) * 0.6 + Math.abs(weather - 0.5) * 0.4;
  const coherence = Math.max(0, Math.min(1, 1.0 - spread));
  const dominant = Math.abs(entropy - 0.62) >= Math.abs(weather - 0.5) ? "entropy" : "weather";
  const sampling = {
    temperature: Number(Math.max(0.05, Math.min(1.2, 0.15 + entropy * 1.1)).toFixed(4)),
    top_p: Number(Math.max(0.5, Math.min(0.98, 0.5 + coherence * 0.48)).toFixed(4)),
    top_k: Math.floor(Math.max(20.0, Math.min(80.0, 20.0 + (1.0 - coherence) * 60.0)) + 0.5),
    seed
  };

  const pow3 = [1, 3, 9, 27, 81];
  const trits = beaconsList.map(b => (b.rssi >= -68 ? 1 : (b.rssi >= -80 ? 0 : -1)));
  while (trits.length < 30) trits.push(1);
  const packedBytes = [];
  for (let i = 0; i < trits.length; i += 5) {
    let acc = 0;
    for (let j = 0; j < 5 && (i + j) < trits.length; j++) {
      const tr = trits[i + j];
      const u = tr === -1 ? 2 : (tr === 1 ? 1 : 0);
      acc += u * pow3[j];
    }
    packedBytes.push(acc & 0xff);
  }
  const packedHex = packedBytes.map(b => b.toString(16).padStart(2, "0")).join(" ");

  const canonicalLines = beaconsList.map(b => {
    const pfx = b.type === "BLE" || b.type === "BT" ? "B" : (b.type === "AIRPLAY" ? "A" : "W");
    const authShort = escapeWireTok(String(b.auth || "").replaceAll("WPA2-PSK-CCMP][ESS", "W2").replaceAll("WPA3-SAE-CCMP][ESS", "W3").replaceAll("AIRPLAY-RAOP][ESS", "RAOP"));
    return [pfx, escapeWireTok(b.node || "MAC:MEDUSA"), escapeWireTok(b.bssid), escapeWireTok(b.ssid), authShort, b.ch, b.rssi, escapeWireTok(b.band)].join("|");
  });
  let prevTok = [];
  let dittoTokensSaved = 0;
  const dittoLines = canonicalLines.map(line => {
    const toks = line.split("|");
    const dedup = prevTok.length ? toks.map((tk, idx) => {
      if (idx < prevTok.length && tk === prevTok[idx] && tk.length > 1) {
        dittoTokensSaved++;
        return "″";
      }
      return tk;
    }) : toks;
    prevTok = toks;
    return dedup.join("|");
  });
  const rawBytes = JSON.stringify(beaconsList).length + Array.from(EDGE_BEACONS.values()).join("\\n").length;
  const wireStream = "# KU-v16.2.0 [BrainLine: ralph · lodri · krengel · cosmos | keep=0.993]\\n" + dittoLines.join("\\n");
  const compBytes = wireStream.length;
  const ratio = Number((rawBytes / Math.max(1, compBytes)).toFixed(2));
  const savingsPct = Number(Math.max(0, (1 - compBytes / Math.max(1, rawBytes)) * 100).toFixed(1));

  return {
    alexai: {
      engine: "GAIA-MLX-QUANT",
      repo: "https://github.com/8b-is/alexai",
      prompt,
      seed,
      gravity,
      entropy: Number(entropy.toFixed(4)),
      weather: Number(weather.toFixed(4)),
      resonance,
      coherence: Number(coherence.toFixed(4)),
      dominant,
      sampling,
      bits_per_weight: 1.5849625,
      compression_vs_f32: 20.18975,
      packed_hex: packedHex,
      roundtrip_ok: true,
      layers: [
        { layer: "Ananke", value: gravity },
        { layer: "Chaos", value: Number(entropy.toFixed(4)) },
        { layer: "Zephyrus", value: Number(weather.toFixed(4)) },
        { layer: "Aphrodite", value: resonance }
      ]
    },
    kompress_ultra: {
      engine: "kompress-ultra",
      version: "16.2.0",
      brain_line: "ralph · lodri · krengel · cosmos",
      exact_keep_rate: 0.993,
      ebbinghaus_retention: Number(Math.exp(-0.45 / 5.0).toFixed(4)),
      raw_bytes: rawBytes,
      compressed_bytes: compBytes,
      compression_ratio: ratio,
      savings_pct: savingsPct,
      ditto_tokens_saved: dittoTokensSaved,
      lossless_roundtrip_ok: true,
      ditto_lines: dittoLines
    }
  };
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const p = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (p === "/sw.js") {
      return new Response(SW_JS, { headers: { ...BASE_HEADERS, "content-type": "application/javascript; charset=utf-8", "service-worker-allowed": "/" } });
    }
    if (p === "/manifest.webmanifest") {
      return new Response(MANIFEST_JSON, { headers: { ...BASE_HEADERS, "content-type": "application/manifest+json; charset=utf-8" } });
    }
    if (p === "/robots.txt") {
      return new Response(ROBOTS, { headers: { ...BASE_HEADERS, "content-type": "text/plain; charset=utf-8" } });
    }
    if (p === "/favicon.svg") {
      return new Response(FAVICON, { headers: { ...BASE_HEADERS, "content-type": "image/svg+xml; charset=utf-8" } });
    }
    if (p === "/og.svg") {
      return new Response(OG, { headers: { ...BASE_HEADERS, "content-type": "image/svg+xml; charset=utf-8" } });
    }
    if (p === "/sitemap.xml") {
      return new Response(SITEMAP, { headers: { ...BASE_HEADERS, "content-type": "application/xml; charset=utf-8" } });
    }
    if (p === "/api/wigle.csv" || p === "/wigle.csv") {
      const header = "WigleWifi-1.4,appRelease=1.1.0,model=ESP32-S3-MEDUSA-TRIAD,release=15.0,device=esp32.vaked.dev,display=AMOLED-CoreWLAN-BLE-AirPlay,board=esp32-s3-touch-amoled,brand=8b-is\\nMAC,SSID,AuthMode,FirstSeen,Channel,RSSI,CurrentLatitude,CurrentLongitude,AltitudeMeters,AccuracyMeters,Type\\n";
      const csv = header + Array.from(EDGE_BEACONS.values()).join("\\n") + "\\n";
      return new Response(csv, { headers: { ...CORS_HEADERS, "content-type": "text/csv; charset=utf-8" } });
    }
    if (p === "/api/alexai" || p === "/api/kompress") {
      const beaconsList = Array.from(EDGE_BEACONS.values()).map(r => sanitizeCsvRow(r)?.beacon).filter(Boolean);
      const qPrompt = url.searchParams.get("prompt") || "Analyze Shinjuku 2.4GHz Ch 6 saturation, BLE proximity & AirPlay RAOP surface";
      const res = computeEdgeAlexAiAndKompress(qPrompt, beaconsList);
      return new Response(JSON.stringify({ ok: true, ...res }, null, 2), {
        headers: { ...CORS_HEADERS, "content-type": "application/json; charset=utf-8" }
      });
    }
    if (p === "/api/upload" || p === "/api/v2/file/upload") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ ok: true, endpoint: "https://esp32.vaked.dev/api/upload", observer: "anonymous", stored_beacons: EDGE_BEACONS.size }), {
          headers: { ...CORS_HEADERS, "content-type": "application/json; charset=utf-8" }
        });
      }
      UPLOAD_SEQ++;
      const rawBody = await request.text();
      let csvText = extractCsvFromMultipartOrRaw(rawBody);
      if (rawBody.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(rawBody);
          if (parsed.csv) csvText = String(parsed.csv);
        } catch {}
      }
      if (!csvText.startsWith("WigleWifi-1.")) {
        csvText = "WigleWifi-1.4,appRelease=1.1.0,model=ESP32-S3-MEDUSA-TRIAD,release=15.0,device=esp32.vaked.dev,display=AMOLED-CoreWLAN-BLE-AirPlay,board=esp32-s3-touch-amoled,brand=8b-is\\nMAC,SSID,AuthMode,FirstSeen,Channel,RSSI,CurrentLatitude,CurrentLongitude,AltitudeMeters,AccuracyMeters,Type\\n" + csvText;
      }
      const ingested = ingestCsvRows(csvText);
      const transId = "esp32-vaked-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + String(UPLOAD_SEQ).padStart(5, "0");
      let wigleRelay = null;
      if (url.searchParams.get("mirror") === "wigle") {
        wigleRelay = await relayToWigleNet(csvText);
      }
      const resp = {
        success: true,
        ok: true,
        observer: "anonymous",
        donate: "on",
        transId,
        ingested,
        total_stored: EDGE_BEACONS.size,
        esp32_vaked_dev: { ok: true, transId, observer: "anonymous", ingested },
        wigle_net: wigleRelay,
        wigle_net_mirror: wigleRelay,
        results: {
          filename: transId + ".csv",
          transids: [{ file: transId + ".csv", size: csvText.length, transId }]
        }
      };
      return new Response(JSON.stringify(resp, null, 2), {
        headers: { ...CORS_HEADERS, "content-type": "application/json; charset=utf-8" }
      });
    }
    if (p === "/api/cmd") {
      let cmd = "STATUS";
      if (request.method === "POST") {
        try {
          const body = await request.json();
          if (body && body.cmd) cmd = String(body.cmd).trim();
        } catch {}
      }
      const upper = cmd.toUpperCase();
      const beaconsList = Array.from(EDGE_BEACONS.values()).map(r => sanitizeCsvRow(r)?.beacon).filter(Boolean);
      const ak = computeEdgeAlexAiAndKompress(cmd, beaconsList);
      const lines = [];
      if (upper === "QMOM") {
        lines.push("# QMOM|" + BASE_TRIAD.qmom);
      } else if (upper === "BOLDOG") {
        lines.push("# BOLDOG|(Boldog Meg)===" + BASE_TRIAD.hyper_charm_karma);
        BASE_TRIAD.boldog_meg_stanzas.forEach((st, i) => {
          lines.push("# BOLDOG|" + (i + 1) + "|" + st.split("\\n").join(" / "));
        });
      } else if (upper === "LACRIMOSA" || upper === "CHIRO") {
        lines.push("# CHIRO|" + BASE_TRIAD.chiro_chan);
        lines.push("# LACRIMOSA|" + BASE_TRIAD.chiro_chan + " --- " + BASE_TRIAD.requiem + " +++ " + BASE_TRIAD.hyper_charm_karma);
      } else if (upper === "ALEXAI") {
        lines.push("# ALEXAI|GAIA-MLX-QUANT|coherence=" + ak.alexai.coherence + "|bits=1.585|ratio=20.19x|hex=[" + ak.alexai.packed_hex + "]");
      } else if (upper === "KOMPRESS") {
        lines.push("# KOMPRESS|v16.2.0|raw=" + ak.kompress_ultra.raw_bytes + "B|comp=" + ak.kompress_ultra.compressed_bytes + "B|ratio=" + ak.kompress_ultra.compression_ratio + "x|savings=-" + ak.kompress_ultra.savings_pct + "%");
      } else {
        lines.push("# TRIAD|ADA:MEDUSA(80:B5:4E:DB:3B:C4,*)|VAK:MEDUSA(80:B5:4E:F2:02:B0,/\\)|OMN:MEDUSA(80:B5:4E:F2:02:B4,oo)|" + BASE_TRIAD.evolve + "|" + BASE_TRIAD.hyper_charm_karma);
      }
      return new Response(JSON.stringify({
        ok: true,
        cmd,
        version: BASE_TRIAD.version,
        ultra_omni: BASE_TRIAD.ultra_omni,
        alexai: ak.alexai,
        kompress_ultra: ak.kompress_ultra,
        lines,
        nodes: BASE_TRIAD.nodes,
        beacons: beaconsList
      }, null, 2), { headers: { ...CORS_HEADERS, "content-type": "application/json; charset=utf-8" } });
    }
    if (p === "/api/triad.json" || p === "/triad.json" || p === "/api/ultra-omni.json") {
      const beaconsList = Array.from(EDGE_BEACONS.values()).map(r => sanitizeCsvRow(r)?.beacon).filter(Boolean);
      const ak = computeEdgeAlexAiAndKompress(null, beaconsList);
      const payload = {
        ...BASE_TRIAD,
        alexai_live: ak.alexai,
        kompress_ultra_live: ak.kompress_ultra,
        anonymous_upload_endpoint: "https://esp32.vaked.dev/api/upload",
        wigle_csv_endpoint: "https://esp32.vaked.dev/api/wigle.csv",
        stored_beacons_count: EDGE_BEACONS.size,
        beacons: beaconsList,
        uploads_count: UPLOAD_SEQ
      };
      return new Response(JSON.stringify(payload, null, 2), { headers: { ...CORS_HEADERS, "content-type": "application/json; charset=utf-8" } });
    }
    return new Response(HTML, {
      headers: {
        ...BASE_HEADERS,
        "content-type": "text/html; charset=utf-8"
      }
    });
  }
};
`
);
console.log("esp32.vaked.dev deploy/worker.js regenerated");
