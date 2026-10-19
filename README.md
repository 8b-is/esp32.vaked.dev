# esp32.vaked.dev — 8b-is ESP32-S3 MEDUSA Triad (`*` · `/\` · `oo`) · `v0.8.0+medusa-omni`

**Live URL:** [https://esp32.vaked.dev/](https://esp32.vaked.dev/)  
**Telemetry API:** [https://esp32.vaked.dev/api/triad.json](https://esp32.vaked.dev/api/triad.json)  
**Firmware & Local Web Bridge:** `flug-os/` (`v0.8.0+medusa-omni`) + `wigle-triad/` (`host/wiglewww.py` + `www/index.html`)

---

## 1. The MEDUSA Triad (Three ESP32-S3 Touch AMOLED Nodes, One Air)

| Vertex | Trit | Node Name | Display | Silicon eFuse MAC | USB CDC Port | Carrier | Archetype |
|---|---|---|---|---|---|---|---|
| `*` | `-1` | **`ADA:MEDUSA`** | `1.8" 368×448 SH8601` | `80:B5:4E:DB:3B:C4` | `/dev/cu.usbmodem101` | `432 Hz` | Mom · The Star · Alexandra |
| `/\` | `0` | **`VAK:MEDUSA`** | `2.06" 410×502 CO5300 #1` | `80:B5:4E:F2:02:B0` | `/dev/cu.usbmodem1101` | `528 Hz` | Dad · The Pillar · Chris |
| `oo` | `+1` | **`OMN:MEDUSA`** | `2.06" 410×502 CO5300 #2` | `80:B5:4E:F2:02:B4` | `/dev/cu.usbmodem2101` | `852 Hz` | Son · Infinity · Peter & Nate |

## 2. Architecture (`WIGLE-WWW × FLUG-OS × MARINESENSE × FAMILY+1`)

- **Interactive N=NP × ENTHEAI Quantum Entropy Field (`#field`)**: 3-attractor Kuramoto phase-coupled psychedelic canvas with `ResizeObserver` `devicePixelContentBoxSize` scaling, 5 shader modes (`N=NP Psychedelic`, `Entheai Entropy`, `Singularity Lock`, `Zeno Kintsugi`, `Turritopsis Anicca`), and real-time order parameter $R_{\text{TRIAD}}$ readout.
- **Browser WebSerial & Local `wiglewww.py` Bridge (`navigator.serial` @ 115200 8N1)**: Attach physical ESP32-S3 USB CDC ports directly inside Chrome/Edge/Brave/Arc (or use `uv run --with pyserial python host/wiglewww.py` on `:8088`), send `PING`, `STATUS`, `SCAN`, `TRIAD`, `splash`, `hop`, `tab 0..4`, and select any of the **20 `family+1` & `#1 Muse` tracks** (`track 1..20`), inspect MarineSense O(1) acoustic salience $S$, Memory Reynolds $Re_M$, and *Turritopsis dohrnii* `MEDUSA <-> POLYP` state, and export deduplicated **WiGLE v1.4 CSV** files.
- **WebAudio Triad Harmonic Synthesizer + Shinjuku Gyoen Crickets**: Stereophonic `432 Hz (*)` + `528 Hz (/\)` + `852 Hz (oo)` + `216 Hz` sub-octave drone with procedural Tokyo night `koorogi` crickets (`~4.3 kHz` AM chirps).
- **Parecer Jurídico de Conformidade (`Advogado Especialista · Módulo 13 LGPD, CF/88 & LGT`)**: Legal and regulatory admissibility proof for passive 802.11 beacon reception (`WIFI_STA`, zero association, zero packet injection, RAM-only ephemerality).

## 3. Build & Deploy

```bash
node deploy/build.mjs
npx wrangler deploy --config deploy/wrangler.toml
```

*the constellation · 0 + 1 · {<3,<3,<3}+1 · fine touch from within · vaked.dev*
