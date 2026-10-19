import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const html = readFileSync(join(root, "index.html"), "utf8");
const robots = readFileSync(join(root, "robots.txt"), "utf8");
const favicon = readFileSync(join(root, "favicon.svg"), "utf8");
const og = readFileSync(join(root, "og.svg"), "utf8");
const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");

const triadObj = {
  surface: "https://esp32.vaked.dev",
  version: "0.9.0+medusa-omni",
  mode: "WIGLE-WWW × FLUG-OS × MARINESENSE × WIFI+BLE+AIRPLAY TRIAD",
  admissibility: {
    gate: "CT-000",
    legal_modules: ["CF/88 Art. 5 II, IX, XII", "LGPD Lei 13.709/2018 Art. 6 III", "CP Art. 154-A (Atipicidade)", "LGT Lei 9.472/1997 / ANATEL Res. 680/2017"],
    radio_posture: "PASSIVE_STA_ONLY (zero association, zero injection, RAM-only scanDelete, anonymous donate=on)"
  },
  crate_tracks: 20,
  muse_track: "17 · Left Hand Free (#1 Muse 💙) — alt-J (106 BPM)",
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

function ingestCsvRows(csvText) {
  const lines = csvText.split(/\\r?\\n/);
  let count = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("WigleWifi-") || trimmed.startsWith("MAC,SSID")) continue;
    const firstComma = trimmed.indexOf(",");
    if (firstComma > 0) {
      const mac = trimmed.slice(0, firstComma).trim().toUpperCase();
      if (mac.includes(":")) {
        EDGE_BEACONS.set(mac, trimmed);
        count++;
      }
    }
  }
  return count;
}

async function relayToWigleNet(csvText) {
  const boundary = "----WigleEdgeRelay8bIs" + Date.now();
  const body =
    "--" + boundary + "\\r\\n" +
    'Content-Disposition: form-data; name="donate"\\r\\n\\r\\non\\r\\n' +
    "--" + boundary + "\\r\\n" +
    'Content-Disposition: form-data; name="file"; filename="wigle-triad-' + Date.now() + '.csv"\\r\\n' +
    "Content-Type: text/csv\\r\\n\\r\\n" +
    csvText + "\\r\\n" +
    "--" + boundary + "--\\r\\n";
  try {
    const r = await fetch("https://api.wigle.net/api/v2/file/upload", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data; boundary=" + boundary,
        "Accept": "application/json",
        "User-Agent": "WigleWifi-0.9.0 (esp32.vaked.dev; 8b-is; anonymous)"
      },
      body
    });
    const j = await r.json();
    const tid = j?.results?.transids?.[0]?.transId || "wigle-" + Date.now();
    return { ok: Boolean(j?.success), status: r.status, observer: j?.observer || "anonymous", transId: tid, raw: j };
  } catch (e) {
    return { ok: false, status: 502, observer: "anonymous", transId: "relay-err", error: String(e) };
  }
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const p = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
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
      const header = "WigleWifi-1.4,appRelease=0.9.0,model=ESP32-S3-MEDUSA-TRIAD,release=15.0,device=esp32.vaked.dev,display=AMOLED-CoreWLAN-BLE-AirPlay,board=esp32-s3-touch-amoled,brand=8b-is\\nMAC,SSID,AuthMode,FirstSeen,Channel,RSSI,CurrentLatitude,CurrentLongitude,AltitudeMeters,AccuracyMeters,Type\\n";
      const csv = header + Array.from(EDGE_BEACONS.values()).join("\\n") + "\\n";
      return new Response(csv, { headers: { ...CORS_HEADERS, "content-type": "text/csv; charset=utf-8" } });
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
        csvText = "WigleWifi-1.4,appRelease=0.9.0,model=ESP32-S3-MEDUSA-TRIAD,release=15.0,device=esp32.vaked.dev,display=AMOLED-CoreWLAN-BLE-AirPlay,board=esp32-s3-touch-amoled,brand=8b-is\\nMAC,SSID,AuthMode,FirstSeen,Channel,RSSI,CurrentLatitude,CurrentLongitude,AltitudeMeters,AccuracyMeters,Type\\n" + csvText;
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
        results: {
          filename: transId + ".csv",
          transids: [{ file: transId + ".csv", size: csvText.length, transId }]
        }
      };
      return new Response(JSON.stringify(resp, null, 2), {
        headers: { ...CORS_HEADERS, "content-type": "application/json; charset=utf-8" }
      });
    }
    if (p === "/api/triad.json" || p === "/triad.json") {
      const payload = {
        ...BASE_TRIAD,
        anonymous_upload_endpoint: "https://esp32.vaked.dev/api/upload",
        wigle_csv_endpoint: "https://esp32.vaked.dev/api/wigle.csv",
        stored_beacons_count: EDGE_BEACONS.size,
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
