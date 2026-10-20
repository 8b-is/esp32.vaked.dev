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
    radio_posture: "PASSIVE_STA_ONLY (zero association, zero injection, RAM-only scanDelete, sharing disabled)"
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

// Public responses start empty; never embed captured device observations.
const EDGE_BEACONS = new Map();
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
  const next = new Map(EDGE_BEACONS);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("WigleWifi-") || trimmed.startsWith("MAC,SSID")) continue;
    const firstComma = trimmed.indexOf(",");
    if (firstComma > 0) {
      const mac = trimmed.slice(0, firstComma).trim().toUpperCase();
      if (mac.includes(":")) {
        next.set(mac, trimmed);
        if (next.size > 1000) throw new Error("row limit");
        count++;
      }
    }
  }
  EDGE_BEACONS.clear();
  for (const [key, value] of next) EDGE_BEACONS.set(key, value);
  return count;
}

async function readBoundedBody(request) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 65536) { await reader.cancel(); throw new Error("body limit"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}

export default {
  async fetch(request, env = {}) {
    const url = new URL(request.url);
    const p = url.pathname;
    const observationRoute = ["/api/wigle.csv", "/wigle.csv", "/api/upload", "/api/v2/file/upload"].includes(p);
    if (observationRoute && request.method !== "OPTIONS") {
      if (!env.TELEMETRY_TOKEN) {
        return new Response("Observation sharing is disabled", { status: 503, headers: BASE_HEADERS });
      }
      if (request.headers.get("authorization") !== "Bearer " + env.TELEMETRY_TOKEN) {
        return new Response("Unauthorized", { status: 401, headers: BASE_HEADERS });
      }
      if (url.searchParams.has("mirror")) {
        return new Response("External relay is disabled", { status: 403, headers: BASE_HEADERS });
      }
    }

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
        return new Response(JSON.stringify({ ok: true, endpoint: "https://esp32.vaked.dev/api/upload", observer: "authenticated", stored_beacons: EDGE_BEACONS.size }), {
          headers: { ...CORS_HEADERS, "content-type": "application/json; charset=utf-8" }
        });
      }
      let rawBody;
      try { rawBody = await readBoundedBody(request); }
      catch { return new Response("Upload exceeds body limit", {status: 413, headers: BASE_HEADERS}); }
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
      let ingested;
      try { ingested = ingestCsvRows(csvText); }
      catch { return new Response("Upload exceeds row limit", {status: 413, headers: BASE_HEADERS}); }
      UPLOAD_SEQ++;
      const transId = "esp32-vaked-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + String(UPLOAD_SEQ).padStart(5, "0");
      const resp = {
        success: true,
        ok: true,
        observer: "authenticated",
        donate: "off",
        transId,
        ingested,
        total_stored: EDGE_BEACONS.size,
        esp32_vaked_dev: { ok: true, transId, observer: "authenticated", ingested },
        wigle_net: null,
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
        authenticated_upload_endpoint: "https://esp32.vaked.dev/api/upload",
        wigle_csv_endpoint: "https://esp32.vaked.dev/api/wigle.csv",
        observation_authentication: "Bearer token required",
        external_relay: "disabled"
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
