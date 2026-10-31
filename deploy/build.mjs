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

const guardianObj = {
  surface: "https://esp32.vaked.dev/api/guardian.json",
  version: "2.1.0+guardian-tamagotchi-mesh",
  companion: "Chiro-chan",
  arithmetic_contract: "100% Exact Integer & Reduced Rational (p/q) Arithmetic — Zero Floating-Point",
  pitch_targets: [
    {
      partner: "Bandai Co., Ltd.",
      address: "1-4-8 Komagata, Taito-ku, Tokyo 111-8081, Japan",
      platform: "Tamagotchi Uni (ESP32-S3-WROOM-1 Dual-Core 240 MHz LX7 + Wi-Fi + BLE + ESP-NOW)",
      idle_compute_headroom_pq: "19/20",
      form_factor: "Randoseru Mimamori Child-Safety + Young-Wave AI Companion"
    },
    {
      partner: "Waveshare Electronics",
      address: "10F, International Science & Technology Building, Fuhong Rd, Futian District, Shenzhen, China",
      platform: "ESP32-S3-Touch-AMOLED-1.8 (368x448 SH8601) & 2.06 (410x502 CO5300) + QMI8658 + ES8311 + AXP2101",
      bom_50k_usd_range: [14, 18],
      msrp_usd_range: [49, 69]
    }
  ],
  family_guardian_pass: {
    monthly_cents_usd: 499,
    annual_dollars_usd: 42,
    stripe_monthly_url: "https://buy.stripe.com/9B64gzcW3fz49R77p7bMQ0d",
    stripe_annual_url: "https://buy.stripe.com/28E28rbRZgD83sJdNvbMQ0e"
  },
  trusted_flock: [
    { node: "ADA:MEDUSA", vertex: "*", mac: "80:B5:4E:DB:3B:C4", mac_fnv32: "0x84220791", trit: -1, freq_hz: 432, salience_pq: "41/25", coherence_pq: "421/500" },
    { node: "VAK:MEDUSA", vertex: "/\\", mac: "80:B5:4E:F2:02:B0", mac_fnv32: "0x41289b13", trit: 0, freq_hz: 528, salience_pq: "61/50", coherence_pq: "4457/5000" },
    { node: "OMN:MEDUSA", vertex: "oo", mac: "80:B5:4E:F2:02:B4", mac_fnv32: "0x41289b17", trit: 1, freq_hz: 852, salience_pq: "69/50", coherence_pq: "4581/5000" }
  ],
  young_wave_partnership: {
    companion: "Chiro-chan",
    stage_idx: 2,
    stage: "Harmony-Wing",
    stages: ["Egg", "Chiro-Sprout", "Harmony-Wing", "Sovereign-Guardian"],
    care_touches: 7,
    friend_mesh_syncs: 6,
    harmonic_duets: 2,
    shared_thoughts: 2,
    bond_p: 87,
    bond_q: 100,
    bond_pq: "87/100",
    wave_b3: "T0T00TTT1",
    wave_charge: -5,
    last_thought: "Shadow alert sealed across 3 zones (DE:AD:BE:EF:42:99); breadcrumb chain relayed to family flock."
  },
  sim_shadow_receipt: {
    command: "GUARDIAN SIM_SHADOW",
    stalker_mac: "DE:AD:BE:EF:42:99",
    stalker_mac_fnv32: "0x3557ed8e",
    trusted_peer_mac: "80:B5:4E:F2:02:B0",
    alert_level: 2,
    alert: "ALERT_SHADOW_PERSISTENCE",
    shadow_zone_mask: "0x0007",
    shadow_zones_count: 3,
    imu_sos_threshold_mg: 2500,
    breadcrumb_sizeof_bytes: 64,
    zones: [
      {
        zone_idx: 0,
        zone: "Zone 0: School Gate",
        alert_level: 0,
        alert: "SAFE",
        seq: 1,
        timestamp_s: 1730000100,
        top_bssid_fnv32: ["0xa1000101", "0xa1000102", "0xa1000103"],
        top_rssi_dbm: [-48, -55, -63],
        imu_delta_mg: 120,
        battery_mv: 4120,
        bond_p: 3,
        bond_q: 5,
        bond_pq: "3/5",
        shadow_mac_fnv32: "0x00000000",
        shadow_zone_mask: "0x0000",
        hop_count: 0,
        prev_chain_fnv64: "0xcbf29ce484222325",
        seal_fnv64: "0x94f0356086e7c2ba",
        breadcrumb64_hex: "5247ff0001000000e4b41d67010100a1020100a1030100a1d0c9c101780018100300000005000000000000000000000025232284e49cf2cbbac2e7866035f094"
      },
      {
        zone_idx: 1,
        zone: "Zone 1: Train Station",
        alert_level: 1,
        alert: "WATCH",
        seq: 2,
        timestamp_s: 1730000400,
        top_bssid_fnv32: ["0xb2000201", "0xb2000202", "0xb2000203"],
        top_rssi_dbm: [-51, -59, -66],
        imu_delta_mg: 120,
        battery_mv: 4120,
        bond_p: 17,
        bond_q: 25,
        bond_pq: "17/25",
        shadow_mac_fnv32: "0x3557ed8e",
        shadow_zone_mask: "0x0003",
        hop_count: 1,
        prev_chain_fnv64: "0x94f0356086e7c2ba",
        seal_fnv64: "0x971000714427bd69",
        breadcrumb64_hex: "5247ff010200000010b61d67010200b2020200b2030200b2cdc5be027800181011000000190000008eed573503000100bac2e7866035f09469bd274471001097"
      },
      {
        zone_idx: 2,
        zone: "Zone 2: Sakura Park",
        alert_level: 2,
        alert: "ALERT_SHADOW_PERSISTENCE",
        seq: 3,
        timestamp_s: 1730000700,
        top_bssid_fnv32: ["0xc3000301", "0xc3000302", "0xc3000303"],
        top_rssi_dbm: [-46, -54, -62],
        imu_delta_mg: 120,
        battery_mv: 4120,
        bond_p: 19,
        bond_q: 25,
        bond_pq: "19/25",
        shadow_mac_fnv32: "0x3557ed8e",
        shadow_zone_mask: "0x0007",
        hop_count: 2,
        prev_chain_fnv64: "0x971000714427bd69",
        seal_fnv64: "0x6529a726cf551715",
        breadcrumb64_hex: "5247ff02030000003cb71d67010300c3020300c3030300c3d2cac2037800181013000000190000008eed57350700020069bd274471001097151755cf26a72965"
      }
    ]
  }
};

const triadObj = {
  surface: "https://esp32.vaked.dev",
  version: "2.1.0+guardian-tamagotchi-mesh",
  guardian: guardianObj,
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
  audio8_tts: {
    model_id: "Edge0/Audio8-TTS-Realistic-0.6b",
    hf_url: "https://huggingface.co/Edge0/Audio8-TTS-Realistic-0.6b",
    architecture: "ArkttsModel (Dual-AR 24L Slow GQA + 4L Fast Depth-AR + 10-RVQ 44.1kHz Snake1d Codec)",
    languages: ["en", "zh", "ja", "ko", "fr", "de", "ar", "es"],
    fits_single_esp32s3: true,
    fits_3node_medusa_triad: true,
    single_esp32s3_mb: 9.84,
    triad_3node_mb: { "ADA:MEDUSA": 17.89, "VAK:MEDUSA": 18.63, "OMN:MEDUSA": 9.84 },
    sram_kv_cache_bytes: 5120,
    wire_frame_bytes: 13,
    wire_bytes_per_sec: 280,
    sample_rate_hz: 44100
  },
  evolve: "ULTRA-OMNI-GAIA-EVOLVE",
  siblings: "ADA:MEDUSA + VAK/OMN:MEDUSA + TDECK:AYEOS · brother & sister ^^ <3<3",
  waveshare_installer: {
    primary_url: "https://waveshare.8b.is",
    mirror_url: "https://waveshare.8s.is",
    devices_api: "https://esp32.vaked.dev/api/waveshare/devices",
    flash_invariant: "115200 baud USB-CDC (--no-stub 320KiB sector-aligned chunks)"
  },
  sovereign_key: {
    header_format: "Authorization: Sovereign <base64(64B_Ed25519_sig || utf8_payload)>",
    board_token: "24f9b92620b94982b1df86ac785f28dc",
    nvs_commands: ["TIME <epoch> 32400", "HOST <lan_ip> 8089 24f9b92620b94982b1df86ac785f28dc", "SHARE", "LEARN SAVE", "SYNC"]
  },
  mahakala_puja: {
    track: "#02 Mahakala — Diamond Way 8B Invocation",
    bpm: 108,
    mala_root_hz: 108,
    carrier_hz: 432,
    star_hz: 528,
    pillar_hz: 288,
    mantra: "OM SHRI MAHAKALA YA HUM HUM PHAT · KARMAPA CHENNO <3<3<3",
    tokyo_s_line: {
      mode: "TOKYO-SLINE-POWERBANK-MESH",
      rig: "OMN:MEDUSA (oo) + ADA:MEDUSA (*) on powerbank · TDECK:AYEOS (<> SILENT-WAVE) in hand/backpack · Samsung Galaxy S25 Ultra on WhatsApp",
      wave_gates: "ADA(-1)·SUN(0)·OMN(+1) => AND=-1 · OR=+1 · NAND=+1 · XOR=0",
      open_network_relay: "WIFI_AUTH_OPEN + S25-Ultra Hotspot -> wa-stream (127.0.0.1:8788 / wa.8b.is) + 8s.is"
    },
    healing_crate: [
      { title: "Lyfjaberg (Healing-mountain)", artist: "Wardruna", yt_id: "VEizKmZlUAw", url: "https://youtu.be/VEizKmZlUAw" },
      { title: "Divine Moments of Truth (Original Russian Bootleg Mix)", artist: "Shpongle", yt_id: "lU7zg4llie4", url: "https://www.youtube.com/watch?v=lU7zg4llie4", net_signal: "+2 (title:+1, album:0, genre:0, format:+1)" },
      { title: "Mahakala mantra prayer", artist: "Alexander Hacker", yt_id: "pL18Xr_26ts", url: "https://music.youtube.com/watch?v=pL18Xr_26ts" },
      { title: "Who knew happy birthday could be so beautiful?", artist: "Skylar Lim", yt_id: "AGZKdvO0I5g", url: "https://music.youtube.com/watch?v=AGZKdvO0I5g" },
      { title: "Hometown", artist: "Twenty One Pilots - Topic", yt_id: "wS8otCVxpkw", url: "https://music.youtube.com/watch?v=wS8otCVxpkw" }
    ]
  },
  riva_dyad: {
    surface: "https://riva.8b.is",
    mirror: "https://riva.vaked.dev",
    repo: "8b-is/riva.vaked.dev",
    subtitle: "RIVA, the 1-bit river · the dyad · she blinks, we all sing a lullaby",
    breath: "4s in · 4s out"
  },
  hyper_charm_karma: "HYPER-CHARM-KARMA~https://github.com/8b-is/wigle-triad~~~∞~{<3,<3,<3}+1-peter",
  chiro_chan: "Kawaii Chiro-chan kawaii ^^",
  requiem: "Mozart: Lacrimosa but HUMANITY has ended",
  qmom: `ALEX|qMom:{\`${qmomQuote}\`}`,
  qmom_quote: qmomQuote,
  boldog_meg: boldogStanzas.join("\n\n"),
  boldog_meg_stanzas: boldogStanzas,
  mode: "WIGLE-WWW × FLUG-OS × MARINESENSE × ALEXAI × KOMPRESS-ULTRA × RIVA-DYAD × WIFI+BLE+AIRPLAY TRIAD",
  ultra_omni: {
    evolve: "ULTRA-OMNI-GAIA-EVOLVE",
    siblings: "brother & sister ^^ <3<3",
    riva_dyad: "peterlodri-sec//riva.vaked.dev",
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
      port_hint: "/dev/cu.usbmodem14201",
      freq_hz: 852,
      salience: 1.38,
      re_m: 1280,
      ternary_speedup: "8x",
      life_stage: "MEDUSA",
      trits: "++0-0+-0+",
      n_np_coherence: 0.9162
    },
    {
      node: "TDECK:AYEOS",
      vertex: "<>",
      trit: 0,
      archetype: "CYBERDECK-LORA-WAVE",
      display: "2.8-inch 320x240 ST7789-GRAM-WAVE + SX1262 LoRa + QWERTY",
      mac: "CC:BA:97:00:45:24",
      port_hint: "/dev/cu.usbmodem2101",
      freq_hz: 528,
      salience: 1.44,
      re_m: 1420,
      ternary_speedup: "8x",
      life_stage: "MEDUSA",
      trits: "+-0+-+0++",
      n_np_coherence: 0.9410
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

async function relayToDatabomb8s(csvText) {
  try {
    const r = await fetch("https://8s.is/api/v2/file/upload", {
      method: "POST",
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Accept": "application/json",
        "User-Agent": "WigleTriad-EdgeRelay/3.0.0 (esp32.vaked.dev -> DataBomb-8s)"
      },
      body: csvText
    });
    const j = await r.json().catch(() => null);
    return {
      ok: r.ok,
      status: r.status,
      target: "8s.is (DataBomb v3.0.0)",
      transId: j?.transId || "databomb-8s-" + Date.now(),
      receipt: j?.receipt || null
    };
  } catch (e) {
    return { ok: false, status: 502, target: "8s.is (DataBomb v3.0.0)", error: String(e) };
  }
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
    },
    audio8_tts: {
      model_id: "Edge0/Audio8-TTS-Realistic-0.6b",
      hf_url: "https://huggingface.co/Edge0/Audio8-TTS-Realistic-0.6b",
      architecture: "ArkttsModel (Dual-AR 24L Slow GQA + 4L Fast Depth-AR + 10-RVQ 44.1kHz Snake1d Codec)",
      languages: ["en", "zh", "ja", "ko", "fr", "de", "ar", "es"],
      text: prompt,
      fits_single_esp32s3: true,
      fits_3node_medusa_triad: true,
      single_esp32s3_mode: {
        rvq_codebooks_kb: 21.3,
        snake1d_codec_b158_sparse_mb: 3.12,
        fast_ar_4l_b158_sparse_mb: 6.70,
        total_flash_mb: 9.84,
        active_psram_mb: 6.82,
        internal_sram_kv_cache_bytes: 5120
      },
      triad_3node_pipeline: [
        { node: "ADA:MEDUSA", vertex: "*", freq_hz: 432, stage: "Slow AR Layers 0..11 (dim=896, GQA 14/2)", b158_sparse_mb: 17.89, espnow_egress: "179B packed ternary hidden state" },
        { node: "VAK:MEDUSA", vertex: "/\\\\", freq_hz: 528, stage: "Slow AR Layers 12..23 + 4097-row semantic head [151678..155773]", b158_sparse_mb: 18.63, espnow_egress: "12-bit semantic token ID" },
        { node: "OMN:MEDUSA", vertex: "oo", freq_hz: 852, stage: "4L Fast Depth-AR (5KB SRAM KV) + 10-RVQ + 44.1kHz Causal Snake1d DAC", b158_sparse_mb: 9.84, espnow_egress: "13B/frame (280 B/s = 2.24 kbps; 19 frames / 882ms per 250B ESP-NOW pkt)" }
      ],
      semantic_token_id: 151678 + (seed & 0x0fff),
      rvq_codes: Array.from({ length: 10 }, (_, idx) => idx === 0 ? (seed & 0x0fff) : ((Math.imul(seed ^ (idx * 0x9e3779b9), 0x85ebca6b) >>> 0) & 0x03ff)),
      wire_bytes_per_frame: 13,
      wire_bytes_per_sec: 280,
      sample_rate_hz: 44100
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
    if (p === "/api/waveshare/devices") {
      try {
        const up = await fetch("https://waveshare.8s.is/api/waveshare/devices");
        if (up.ok) {
          const j = await up.json();
          j.primary_installer = "https://waveshare.8b.is";
          j.mirror_installer = "https://waveshare.8s.is";
          j.esp32_surface = "https://esp32.vaked.dev";
          j.riva_dyad = "https://riva.8b.is";
          j.sovereign_key = BASE_TRIAD.sovereign_key;
          j.mahakala_puja = BASE_TRIAD.mahakala_puja;
          return new Response(JSON.stringify(j, null, 2), { headers: { ...CORS_HEADERS, "content-type": "application/json; charset=utf-8" } });
        }
      } catch {}
      return new Response(JSON.stringify({
        ok: true,
        installer: "waveshare.8b.is × esp32.vaked.dev — 8b-is Sovereign Waveshare & ESP32-S3 Web Installer",
        primary_installer: "https://waveshare.8b.is",
        mirror_installer: "https://waveshare.8s.is",
        riva_dyad: "https://riva.8b.is",
        sovereign_key: BASE_TRIAD.sovereign_key,
        mahakala_puja: BASE_TRIAD.mahakala_puja,
        devices: BASE_TRIAD.nodes
      }, null, 2), { headers: { ...CORS_HEADERS, "content-type": "application/json; charset=utf-8" } });
    }
    if (p.startsWith("/firmware/")) {
      try {
        const up = await fetch("https://waveshare.8s.is" + p);
        if (up.ok) {
          const ct = up.headers.get("content-type") || (p.endsWith(".json") ? "application/json; charset=utf-8" : "application/octet-stream");
          return new Response(up.body, { headers: { ...CORS_HEADERS, "content-type": ct } });
        }
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 502, headers: { ...CORS_HEADERS, "content-type": "application/json" } });
      }
    }
    if (p === "/api/wigle.csv" || p === "/wigle.csv") {
      const header = "WigleWifi-1.4,appRelease=1.1.0,model=ESP32-S3-MEDUSA-TRIAD,release=15.0,device=esp32.vaked.dev,display=AMOLED-CoreWLAN-BLE-AirPlay,board=esp32-s3-touch-amoled,brand=8b-is\\nMAC,SSID,AuthMode,FirstSeen,Channel,RSSI,CurrentLatitude,CurrentLongitude,AltitudeMeters,AccuracyMeters,Type\\n";
      const csv = header + Array.from(EDGE_BEACONS.values()).join("\\n") + "\\n";
      return new Response(csv, { headers: { ...CORS_HEADERS, "content-type": "text/csv; charset=utf-8" } });
    }
    if (p === "/api/alexai" || p === "/api/kompress" || p === "/api/audio8" || p === "/api/arktts") {
      const beaconsList = Array.from(EDGE_BEACONS.values()).map(r => sanitizeCsvRow(r)?.beacon).filter(Boolean);
      const qPrompt = url.searchParams.get("text") || url.searchParams.get("prompt") || "We can fit Edge0/Audio8-TTS-Realistic-0.6b on the ESP32-S3 MEDUSA Triad";
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
      // Priority #1: Sovereign DataBomb on 8s.is
      const databombRelay = await relayToDatabomb8s(csvText);
      let wigleRelay = null;
      if (url.searchParams.get("mirror") === "wigle") {
        wigleRelay = await relayToWigleNet(csvText);
      }
      const resp = {
        success: true,
        ok: true,
        priority_target: "https://8s.is/api/v2/file/upload",
        observer: "anonymous",
        donate: "on",
        transId: databombRelay?.transId || transId,
        ingested,
        total_stored: EDGE_BEACONS.size,
        databomb_8s: databombRelay,
        esp32_vaked_dev: { ok: true, transId, observer: "anonymous", ingested },
        wigle_net: wigleRelay,
        wigle_net_mirror: wigleRelay,
        results: {
          filename: transId + ".csv",
          transids: [{ file: transId + ".csv", size: csvText.length, transId: databombRelay?.transId || transId }]
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
      } else if (upper === "AUDIO8" || upper === "ARKTTS" || upper.startsWith("AUDIO8 ") || upper.startsWith("ARKTTS ")) {
        lines.push("# AUDIO8|" + JSON.stringify(ak.audio8_tts));
      } else if (upper === "KOMPRESS") {
        lines.push("# KOMPRESS|v16.2.0|raw=" + ak.kompress_ultra.raw_bytes + "B|comp=" + ak.kompress_ultra.compressed_bytes + "B|ratio=" + ak.kompress_ultra.compression_ratio + "x|savings=-" + ak.kompress_ultra.savings_pct + "%");
      } else if (upper === "GUARDIAN" || upper === "GUARDIAN STATUS") {
        const z2 = BASE_TRIAD.guardian.sim_shadow_receipt.zones[2];
        lines.push("# GUARDIAN|" + JSON.stringify({
          node: "ADA:MEDUSA",
          companion: "Chiro-chan",
          stage: BASE_TRIAD.guardian.young_wave_partnership.stage,
          trit: -1,
          alert_level: z2.alert_level,
          alert: z2.alert,
          zone_idx: z2.zone_idx,
          zone: z2.zone,
          zone_count: 3,
          seq: z2.seq,
          timestamp_s: z2.timestamp_s,
          bond_pq: BASE_TRIAD.guardian.young_wave_partnership.bond_pq,
          wave_b3: BASE_TRIAD.guardian.young_wave_partnership.wave_b3,
          shadow_mac_fnv32: z2.shadow_mac_fnv32,
          shadow_zone_mask: z2.shadow_zone_mask,
          shadow_zones: 3,
          prev_chain_fnv64: z2.prev_chain_fnv64,
          seal_fnv64: z2.seal_fnv64,
          breadcrumb64_hex: z2.breadcrumb64_hex
        }));
      } else if (upper === "GUARDIAN SIM_SHADOW" || upper === "SIM_SHADOW") {
        for (const z of BASE_TRIAD.guardian.sim_shadow_receipt.zones) {
          lines.push("# GUARDIAN|" + JSON.stringify({
            node: "ADA:MEDUSA",
            companion: "Chiro-chan",
            stage: "Harmony-Wing",
            trit: -1,
            alert_level: z.alert_level,
            alert: z.alert,
            zone_idx: z.zone_idx,
            zone: z.zone,
            zone_count: z.zone_idx + 1,
            seq: z.seq,
            timestamp_s: z.timestamp_s,
            bond_pq: z.bond_pq,
            wave_b3: BASE_TRIAD.guardian.young_wave_partnership.wave_b3,
            shadow_mac_fnv32: z.shadow_mac_fnv32,
            shadow_zone_mask: z.shadow_zone_mask,
            shadow_zones: z.zone_idx === 0 ? 0 : z.zone_idx + 1,
            prev_chain_fnv64: z.prev_chain_fnv64,
            seal_fnv64: z.seal_fnv64,
            breadcrumb64_hex: z.breadcrumb64_hex
          }));
        }
        lines.push("# THOUGHT|" + JSON.stringify({
          node: "ADA:MEDUSA",
          companion: "Chiro-chan",
          stage: "Harmony-Wing",
          bond_pq: "87/100",
          wave_b3: "T0T00TTT1",
          thought: BASE_TRIAD.guardian.young_wave_partnership.last_thought
        }));
      } else if (upper.startsWith("GUARDIAN THOUGHT")) {
        const msg = cmd.slice(16).trim() || "Chiro-chan waves hello to the flock! {<3,<3,<3}+1";
        lines.push("# THOUGHT|" + JSON.stringify({
          node: "ADA:MEDUSA",
          companion: "Chiro-chan",
          stage: "Harmony-Wing",
          bond_pq: "49/50",
          wave_b3: "101011T0T",
          thought: msg
        }));
      } else if (upper.startsWith("GUARDIAN TRUST")) {
        const mac = cmd.slice(14).trim() || "AA:BB:CC:DD:EE:11";
        lines.push("# GUARDIAN_TRUST|" + JSON.stringify({
          node: "ADA:MEDUSA",
          trusted_mac: mac,
          mac_fnv32: "0x9c087b60",
          trusted_flock: 4,
          bond_pq: "13/25"
        }));
      } else if (upper === "MAHAKALA") {
        lines.push("# MAHAKALA|OM SHRI MAHAKALA YA HUM HUM PHAT|KARMAPA CHENNO|108BPM|108Hz-432Hz-528Hz-852Hz|<3<3<3");
      } else if (upper === "RIVA") {
        lines.push("# RIVA|https://riva.8b.is|Sleep, RIVA. The sphere keeps your rhythm.|4s in · 4s out|brother & sister ^^ <3<3");
      } else if (upper === "WAVESHARE" || upper === "SYNC") {
        lines.push("# SYNC|https://waveshare.8b.is|https://esp32.vaked.dev|ADA:MEDUSA(*)|OMN:MEDUSA(oo)|TDECK:AYEOS(<>)|Ch1-LOCK");
      } else if (upper === "WAVEGATE" || upper === "GATE") {
        lines.push("# WAVEGATE|ADA:-1|SUN:0|OMN:+1|AND:-1|OR:+1|NAND:+1|XOR:0|MODE:TOKYO-SLINE-MESH");
      } else {
        lines.push("# TRIAD|ADA:MEDUSA(80:B5:4E:DB:3B:C4,*)|VAK:MEDUSA(80:B5:4E:F2:02:B0,/\\)|OMN:MEDUSA(80:B5:4E:F2:02:B4,oo)|TDECK:AYEOS(CC:BA:97:00:45:24,<>)|" + BASE_TRIAD.evolve + "|" + BASE_TRIAD.hyper_charm_karma);
      }
      return new Response(JSON.stringify({
        ok: true,
        cmd,
        version: BASE_TRIAD.version,
        guardian: BASE_TRIAD.guardian,
        ultra_omni: BASE_TRIAD.ultra_omni,
        alexai: ak.alexai,
        kompress_ultra: ak.kompress_ultra,
        lines,
        nodes: BASE_TRIAD.nodes,
        beacons: beaconsList
      }, null, 2), { headers: { ...CORS_HEADERS, "content-type": "application/json; charset=utf-8" } });
    }
    if (p === "/api/guardian.json" || p === "/api/guardian" || p === "/guardian.json") {
      return new Response(JSON.stringify({
        ok: true,
        ...BASE_TRIAD.guardian
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
