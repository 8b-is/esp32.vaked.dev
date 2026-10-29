#!/usr/bin/env python3
"""
triad_duet.py — SOTA 3-Node ESP-NOW + Serial + On-Chip Audio + music.vaked.dev + Dreamstate + wa-stream
Trialogue & Synchronization Orchestrator for the 8b-is ESP32-S3 Fleet:
  - ADA:MEDUSA (*)  : Waveshare ESP32-S3-Touch-AMOLED-1.8  (368x448 SH8601, ES8311 TTS, 432 Hz, MAC 80:B5:4E:DB:3B:C4)
  - OMN:MEDUSA (oo) : Waveshare ESP32-S3-Touch-AMOLED-2.06 (410x502 CO5300, ES8311 + ES7210 Dual-Mic, 852 Hz, MAC 80:B5:4E:F2:02:B4)
  - TDECK:AYEOS (<>): LilyGO T-Deck S3 (320x240 ST7789-GRAM-WAVE, SX1262 LoRa, 0x55 KB, ES7210 Mic, 432->528->864Hz Chirp, MAC CC:BA:97:00:45:24)
"""

from __future__ import annotations

import argparse
import fcntl
import glob
import json
import socket
import subprocess
import sys
import termios
import time
import urllib.request
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

import serial


MUSIC_VAKED_TRACKS = [
    (1, "Innerbloom", "RUFUS DU SOL", 122, "Cm7", "INTO-LOVE"),
    (2, "Mahakala", "Diamond Way 8B", 108, "Dm9", "KARMAPA-CHENNO"),
    (8, "Golden Ratio 432xPhi", "8b.is Studio", 108, "A432", "SPREAD-SPHERE-ALL"),
    (18, "GLUE", "BICEP", 130, "Cm", "CONSTELLATION-EQ"),
    (27, "RIVA 1-Bit River", "riva.8b.is", 60, "A432", "DYAD-LULLABY"),
]


@dataclass
class TriadNode:
    port: str
    ser: serial.Serial
    node_id: str = "UNKNOWN"
    vertex: str = "?"
    mac: str = ""
    board: str = ""
    lcd: str = ""
    lcd_driver: str = ""
    version: str = ""
    voice: str = "Samantha"
    freq_hz: str = "432Hz"
    last_json: Dict[str, Any] = field(default_factory=dict)
    last_sync: Dict[str, Any] = field(default_factory=dict)
    last_upz: Dict[str, Any] = field(default_factory=dict)
    last_alexai: Dict[str, Any] = field(default_factory=dict)
    last_aurora: Dict[str, Any] = field(default_factory=dict)
    last_prana: Dict[str, Any] = field(default_factory=dict)
    last_riva: Dict[str, Any] = field(default_factory=dict)
    last_wave: str = ""
    recent_aps: List[str] = field(default_factory=list)


def wa_stream_push(text: str, host: str = "127.0.0.1", raw_port: int = 8788) -> bool:
    """
    Push a live status/Dreamstate message into wa-stream ("little dude(s) and Angels")
    via HTTP leader ports (8790..8792) or raw duplex TCP socket (127.0.0.1:8788).
    """
    for http_port in (8790, 8791, 8792):
        try:
            req = urllib.request.Request(
                f"http://{host}:{http_port}/agy",
                data=json.dumps({"dir": "out", "text": text}).encode("utf-8"),
                headers={"content-type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=2.0) as resp:
                if 200 <= resp.status < 300:
                    return True
        except Exception:
            pass
    try:
        with socket.create_connection((host, raw_port), timeout=2.0) as sock:
            sock.sendall((json.dumps({"text": text}) + "\n").encode("utf-8"))
            return True
    except Exception:
        return False


def _open_port_bulletproof(port: str, baud: int = 115200, retries: int = 10) -> serial.Serial:
    """
    Open an ESP32-S3 USB-Serial/JTAG port on macOS with:
      1. Kernel-level TIOCEXCL (`exclusive=True`) so background daemons (`wiglewww`,
         `WigleMac.app`) cannot steal bytes mid-select and cause `SerialException`.
      2. Cleared `termios.HUPCL` so closing the port never drops DTR/RTS or triggers
         `rst:0x15 (USB_UART_CHIP_RESET)`.
      3. `dtr=False, rts=False` to keep the ESP32-S3 out of ROM download mode.
    """
    last_err: Optional[Exception] = None
    for _ in range(retries):
        try:
            ser = serial.Serial(
                port,
                baud,
                timeout=0.2,
                write_timeout=0.5,
                dsrdtr=False,
                rtscts=False,
                exclusive=True,
            )
            fd = ser.fileno()
            try:
                fcntl.ioctl(fd, termios.TIOCEXCL)
            except Exception:
                pass
            try:
                attrs = termios.tcgetattr(fd)
                attrs[2] &= ~termios.HUPCL
                termios.tcsetattr(fd, termios.TCSANOW, attrs)
            except Exception:
                pass
            ser.dtr = False
            ser.rts = False
            return ser
        except Exception as exc:
            last_err = exc
            time.sleep(0.15)
    raise RuntimeError(f"Could not acquire exclusive lock on {port}: {last_err}")


def _reconnect_node(node: TriadNode) -> bool:
    try:
        node.ser.close()
    except Exception:
        pass
    time.sleep(0.15)
    try:
        node.ser = _open_port_bulletproof(node.port, 115200, retries=6)
        return True
    except Exception:
        return False


def safe_write(node: TriadNode, payload: bytes) -> bool:
    for _ in range(3):
        try:
            node.ser.write(payload)
            node.ser.flush()
            return True
        except (serial.SerialException, OSError):
            _reconnect_node(node)
    return False


def mac_say(text: str, voice: str = "Samantha", rate: int = 195, wait: bool = True) -> None:
    if sys.platform != "darwin":
        return
    cmd = ["say", "-v", voice, "-r", str(rate), text]
    if wait:
        subprocess.run(cmd, check=False)
    else:
        subprocess.Popen(cmd)


def _apply_node_defaults(node: TriadNode) -> None:
    if "TDECK" in node.node_id or "T-Deck" in node.board or node.mac.endswith("45:24"):
        node.node_id = "TDECK:AYEOS"
        node.vertex = "<>"
        node.mac = node.mac or "CC:BA:97:00:45:24"
        node.lcd = node.lcd or "320x240"
        node.lcd_driver = node.lcd_driver or "ST7789-GRAM-WAVE"
        node.version = node.version or "2.4.0+rust-no-std-cymatic-wave-mem"
        node.voice = "Daniel"
        node.freq_hz = "432->528->864Hz"
    elif "OMN" in node.node_id or node.mac.endswith("02:B4"):
        node.node_id = "OMN:MEDUSA"
        node.vertex = "oo"
        node.mac = node.mac or "80:B5:4E:F2:02:B4"
        node.lcd = node.lcd or "410x502"
        node.lcd_driver = node.lcd_driver or "CO5300"
        node.version = node.version or "v1.9.0+omni-3node-tdeck-upz-alexai-aurora"
        node.voice = "Karen"
        node.freq_hz = "852Hz"
    elif "ADA" in node.node_id or node.mac.endswith("3B:C4"):
        node.node_id = "ADA:MEDUSA"
        node.vertex = "*"
        node.mac = node.mac or "80:B5:4E:DB:3B:C4"
        node.lcd = node.lcd or "368x448"
        node.lcd_driver = node.lcd_driver or "SH8601"
        node.version = node.version or "v1.9.0+omni-3node-tdeck-upz-alexai-aurora"
        node.voice = "Samantha"
        node.freq_hz = "432Hz"


def _ingest_json_dict(node: TriadNode, d: Dict[str, Any]) -> None:
    node.last_json.update(d)
    node.node_id = d.get("node") or d.get("medusa_node") or node.node_id
    node.vertex = d.get("vertex", node.vertex)
    node.mac = (d.get("mac") or node.mac).upper()
    node.board = d.get("board", node.board)
    node.lcd = d.get("lcd", node.lcd)
    node.lcd_driver = d.get("lcd_driver", node.lcd_driver)
    node.version = d.get("version", node.version)
    _apply_node_defaults(node)


def drain_and_parse(node: TriadNode, duration_s: float = 1.0) -> List[str]:
    deadline = time.time() + duration_s
    lines: List[str] = []
    while time.time() < deadline:
        try:
            raw = node.ser.readline()
        except (serial.SerialException, OSError):
            _reconnect_node(node)
            continue
        if not raw:
            continue
        line = raw.decode("utf-8", errors="replace").strip()
        if not line:
            continue
        lines.append(line)

        if line.startswith("# JSON|"):
            try:
                _ingest_json_dict(node, json.loads(line[7:]))
            except Exception:
                pass
        elif line.startswith("# SYNC|"):
            try:
                sd = json.loads(line[7:])
                node.last_sync = sd
                _ingest_json_dict(node, sd)
            except Exception:
                pass
        elif line.startswith("# PRANAYAMA|"):
            try:
                node.last_prana = json.loads(line[12:])
            except Exception:
                pass
        elif line.startswith("# RIVA|"):
            try:
                node.last_riva = json.loads(line[7:])
            except Exception:
                pass
        elif line.startswith("{") and line.endswith("}"):
            try:
                d = json.loads(line)
                if "node" in d or "medusa_node" in d or "board" in d:
                    _ingest_json_dict(node, d)
            except Exception:
                pass
        elif line.startswith("# UPZ|"):
            try:
                node.last_upz = json.loads(line[6:])
            except Exception:
                pass
        elif line.startswith("# ALEXAI|"):
            try:
                node.last_alexai = json.loads(line[9:])
            except Exception:
                pass
        elif line.startswith("# AURORA|"):
            try:
                node.last_aurora = json.loads(line[9:])
            except Exception:
                pass
        elif line.startswith("# PONG|"):
            parts = line.split("|")
            if len(parts) >= 3:
                node.node_id = parts[1]
                node.mac = parts[2].upper()
                _apply_node_defaults(node)
        elif line.startswith("Q|"):
            parts = line.split("|")
            if len(parts) >= 4:
                node.node_id = parts[1]
                node.vertex = parts[2]
                node.mac = parts[3].upper()
                _apply_node_defaults(node)
        elif line.startswith("W|"):
            parts = line.split("|")
            if len(parts) >= 6:
                seed_str = f"{parts[1]}|{parts[2]}|{parts[4]}|{parts[5]}"
                if seed_str not in node.recent_aps:
                    node.recent_aps.append(seed_str)
                    if len(node.recent_aps) > 16:
                        node.recent_aps.pop(0)
        elif line.startswith("~ "):
            node.last_wave = line
    return lines


def send_cmd(node: TriadNode, cmd: str, wait_s: float = 0.8) -> List[str]:
    safe_write(node, (cmd.strip() + "\n").encode("utf-8"))
    return drain_and_parse(node, wait_s)


def discover_nodes(ports: Optional[List[str]] = None, baud: int = 115200) -> List[TriadNode]:
    candidates = ports if ports else sorted(glob.glob("/dev/cu.usbmodem*"))
    nodes: List[TriadNode] = []
    for port in candidates:
        try:
            ser = _open_port_bulletproof(port, baud)
        except Exception as exc:
            print(f"[!] Could not open {port}: {exc}")
            continue
        node = TriadNode(port=port, ser=ser)
        drain_and_parse(node, 0.5)
        send_cmd(node, "PING", 0.5)
        send_cmd(node, "SYNC", 0.6)
        if node.node_id == "UNKNOWN":
            send_cmd(node, "STATUS", 1.0)
        if node.node_id == "UNKNOWN":
            try:
                node.ser.dtr = False
                node.ser.rts = True
                time.sleep(0.08)
                node.ser.rts = False
            except Exception:
                pass
            time.sleep(1.5)
            send_cmd(node, "PING", 0.6)
            send_cmd(node, "STATUS", 1.0)

        _apply_node_defaults(node)
        nodes.append(node)
        print(
            f"[+] Discovered {node.node_id:<11} ({node.vertex:<2}) on {node.port:<21} "
            f"[MAC={node.mac}, LCD={node.lcd} {node.lcd_driver}, FW={node.version}, Voice={node.voice}]",
            flush=True,
        )
    return nodes


def print_aligned_hud_table(nodes: List[TriadNode], round_idx: int, track_info: tuple, mode_label: str = "ACTIVE") -> str:
    t_idx, t_title, t_artist, t_bpm, t_key, t_tag = track_info
    inner_w = 107
    banner = (
        f"  OMNI 3-NODE [{mode_label}] · ROUND {round_idx:<3} · "
        f"music.vaked.dev: #{t_idx:02d} {t_title} — {t_artist} ({t_bpm} BPM {t_key})"
    )
    if len(banner) > inner_w:
        banner = banner[:inner_w]
    rows = [
        f"╔{'═' * inner_w}╗",
        f"║{banner:<{inner_w}}║",
        f"╠{'═' * 23}╦{'═' * 13}╦{'═' * 4}╦{'═' * 19}╦{'═' * 18}╦{'═' * 11}╦{'═' * 13}╣",
        (
            f"║ {'PORT':<21} ║ {'NODE':<11} ║ {'VX':<2} ║ {'MAC ADDRESS':<17} ║ "
            f"{'DISPLAY HUD':<16} ║ {'PEER_RX':<9} ║ {'TRIAD TTL':<11} ║"
        ),
        f"╠{'═' * 23}╬{'═' * 13}╬{'═' * 4}╬{'═' * 19}╬{'═' * 18}╬{'═' * 11}╬{'═' * 13}╣",
    ]
    for n in nodes:
        s = n.last_sync
        j = n.last_json
        disp = f"{n.lcd} {n.lcd_driver[:6]}".strip()
        prx = s.get("peer_rx", j.get("peer_rx", j.get("pkts", 0)))
        ttl = s.get("anicca_ttl", j.get("anicca_ttl", [255, 255, 255]))
        ttl_str = f"{ttl[0]},{ttl[1]},{ttl[2]}" if isinstance(ttl, list) and len(ttl) == 3 else "255,255,255"
        rows.append(
            f"║ {n.port:<21} ║ {n.node_id:<11} ║ {n.vertex:<2} ║ {n.mac:<17} ║ "
            f"{disp:<16} ║ {str(prx):<9} ║ {ttl_str:<11} ║"
        )
    rows.append(f"╚{'═' * 23}╩{'═' * 13}╩{'═' * 4}╩{'═' * 19}╩{'═' * 18}╩{'═' * 11}╩{'═' * 13}╝")
    table_str = "\n".join(rows)
    print("\n" + table_str, flush=True)
    return table_str


def sync_all_nodes(nodes: List[TriadNode], round_idx: int, mode_label: str = "ACTIVE") -> tuple:
    track_info = MUSIC_VAKED_TRACKS[(round_idx - 1) % len(MUSIC_VAKED_TRACKS)]
    for n in nodes:
        if "TDECK" in n.node_id:
            safe_write(n, b"TRIAD\n")
        else:
            safe_write(n, b"SYNC\n")

    for n in nodes:
        drain_and_parse(n, 0.7)

    for n in nodes:
        if "TDECK" not in n.node_id:
            send_cmd(n, "SYNC", 0.5)

    shared_aps: List[str] = []
    for n in nodes:
        for ap in n.recent_aps:
            if ap not in shared_aps:
                shared_aps.append(ap)
    if shared_aps:
        for n in nodes:
            if "TDECK" not in n.node_id:
                for ap in shared_aps[:6]:
                    safe_write(n, f"SEED {ap}\n".encode("utf-8"))

    table_str = print_aligned_hud_table(nodes, round_idx, track_info, mode_label=mode_label)
    return track_info, table_str


def run_dreamstate_minute(
    nodes: List[TriadNode],
    dream_idx: int,
    duration_s: float = 60.0,
    mute_mac: bool = True,
    enable_wa: bool = True,
) -> None:
    """
    Run 1 full minute of STATE_DREAM_MANDALA + PRANAYAMA (4s in · 4s out) + RIVA 1-Bit River (60 BPM)
    across ADA:MEDUSA (1.8" SH8601), OMN:MEDUSA (2.06" CO5300), and TDECK:AYEOS (ST7789-GRAM-WAVE).
    """
    ada: Optional[TriadNode] = next((n for n in nodes if "ADA" in n.node_id), None)
    omn: Optional[TriadNode] = next((n for n in nodes if "OMN" in n.node_id), None)
    tdeck: Optional[TriadNode] = next((n for n in nodes if "TDECK" in n.node_id), None)

    inner_w = 107
    hdr = f"  🌙 DREAMSTATE #{dream_idx} ENTERED ({int(duration_s)}s) · STATE_DREAM_MANDALA · PRANAYAMA (4s IN · 4s OUT) · RIVA 60 BPM"
    print(f"\n╔{'═' * inner_w}╗", flush=True)
    print(f"║{hdr:<{inner_w}}║", flush=True)
    print(f"╚{'═' * inner_w}╝", flush=True)

    if ada:
        safe_write(
            ada,
            b"DREAM\nPRANAYAMA\nRIVA\nTAB 0\nSPEAK Entering Dreamstate Mandala 4 seconds in 4 seconds out\nSYNC\n",
        )
    if omn:
        safe_write(
            omn,
            b"DREAM\nPRANAYAMA\nRIVA\nTAB 4\nSPEAK Dreamstate Mandala river breath 852 Hertz\nSYNC\n",
        )
    if tdeck:
        safe_write(tdeck, b"SPEAK Dreamstate Mandala 432 528 864 Hertz\nTRIAD\n")

    for n in nodes:
        for line in drain_and_parse(n, 1.5):
            if line.startswith(("# PRANAYAMA|", "# RIVA|", "# GAIA|", "# SYNC|", "# CHIRP|", "# TRIAD|")):
                print(f"  [DREAM·{n.node_id}] {line}", flush=True)

    if enable_wa:
        ada_prana = (ada.last_prana if ada else {}) or {}
        omn_riva = (omn.last_riva if omn else {}) or {}
        verse = omn_riva.get("verse") or (ada.last_riva.get("verse") if ada else "") or "The eyelid falls - a breath in."
        phase = ada_prana.get("phase", "STILLNESS (Bahya 4s)")
        coh = ada_prana.get("coherence_permil", 936)
        wa_msg = (
            f"🌙 *DREAMSTATE #{dream_idx} ACTIVE (60s)* — `STATE_DREAM_MANDALA`\n"
            f"• *Breath*: `{phase}` (`4s in · 4s out` · coherence `{coh}‰`)\n"
            f"• *RIVA Verse*: _{verse}_\n"
            f"• *Nodes Locked*: `ADA:MEDUSA (* 432Hz)` + `OMN:MEDUSA (oo 852Hz)` + `TDECK:AYEOS (<> 432→528→864Hz)`"
        )
        ok = wa_stream_push(wa_msg)
        print(f"  [wa-stream] Dreamstate #{dream_idx} broadcast -> {'OK' if ok else 'SKIPPED'}", flush=True)

    if not mute_mac:
        mac_say("Entering one minute Dreamstate Mandala. Four seconds in, four seconds out.", voice="Samantha", rate=180, wait=False)

    t_start = time.time()
    pulse = 1
    while time.time() - t_start < duration_s:
        rem = max(0, int(duration_s - (time.time() - t_start)))
        print(f"  ~ [DREAMSTATE #{dream_idx} · pulse {pulse} · {rem}s remaining] PRANAYAMA + RIVA wave ripple...", flush=True)
        if ada:
            safe_write(ada, b"PRANAYAMA\nSYNC\n")
        if omn:
            safe_write(omn, b"PRANAYAMA\nRIVA\nSYNC\n")
        if tdeck:
            safe_write(tdeck, b"TRIAD\n")
        for n in nodes:
            for line in drain_and_parse(n, 2.5):
                if line.startswith(("# PRANAYAMA|", "# RIVA|", "# SYNC|")):
                    print(f"    {n.node_id}: {line}", flush=True)
        pulse += 1
        sleep_step = min(7.5, max(0.0, (t_start + duration_s) - time.time()))
        if sleep_step > 0:
            time.sleep(sleep_step)

    print(f"  [+] Dreamstate #{dream_idx} (60s) complete — returning to active music.vaked.dev constellation!", flush=True)


def run_trialogue_round(
    nodes: List[TriadNode],
    round_idx: int,
    mute_mac: bool = False,
    enable_wa: bool = True,
) -> None:
    track_info, table_str = sync_all_nodes(nodes, round_idx, mode_label="MUSIC.VAKED.DEV")
    t_idx, t_title, t_artist, t_bpm, t_key, t_tag = track_info

    ada: Optional[TriadNode] = next((n for n in nodes if "ADA" in n.node_id), None)
    omn: Optional[TriadNode] = next((n for n in nodes if "OMN" in n.node_id), None)
    tdeck: Optional[TriadNode] = next((n for n in nodes if "TDECK" in n.node_id), None)

    # 1. ADA:MEDUSA (1.8" 368x448 SH8601, 432 Hz, -1)
    if ada:
        print(f"\n[1/3 · {ada.node_id} (*) @ {ada.port}] -> 1.8\" SH8601 40 FPS HUD + ES8311 Formant/Harmonic TTS...", flush=True)
        for line in send_cmd(ada, f"SPEAK ADA Medusa locked to {t_title} at 432 Hertz", 0.9):
            if line.startswith(("# TTS|", "# SYNC|", "# UPZ|", "# ALEXAI|", "# AURORA|")):
                print(f"  {ada.node_id}: {line}", flush=True)
        for line in send_cmd(ada, "JSON", 0.8):
            if line.startswith(("# UPZ|", "# ALEXAI|", "# AURORA|", "# JSON|")):
                print(f"  {ada.node_id}: {line}", flush=True)

        j = ada.last_json
        s = ada.last_sync
        upz = ada.last_upz
        aps_cnt = j.get("networks", j.get("aps", 14))
        peer_rx = s.get("peer_rx", j.get("peer_rx", 0))
        triad_on = s.get("triad_online", j.get("triad_online", 3))
        ada_spoken = (
            f"ADA Medusa on 1.8 inch SH8601 AMOLED at 432 Hertz. "
            f"Listening to {t_title} by {t_artist} on music dot vaked dot dev. "
            f"Triad online {triad_on} of 3 nodes, {peer_rx} ESP-NOW capsules, "
            f"UPZ seal {upz.get('seal16', '0xbd1f')}, {aps_cnt} Wi-Fi networks."
        )
        print(f"  [VOICE:{ada.voice}] {ada_spoken}", flush=True)
        if not mute_mac:
            mac_say(ada_spoken, voice=ada.voice, rate=195, wait=True)

    # 2. OMN:MEDUSA (2.06" 410x502 CO5300, 852 Hz, +1)
    if omn:
        print(f"\n[2/3 · {omn.node_id} (oo) @ {omn.port}] -> 2.06\" CO5300 40 FPS HUD + ES8311/ES7210 + ESP-NOW Splash...", flush=True)
        for line in send_cmd(omn, f"SPEAK OMN Medusa 852 Hertz harmonizing with {t_title}", 0.9):
            if line.startswith(("# TTS|", "# SYNC|", "# UPZ|", "# ALEXAI|", "# AURORA|")):
                print(f"  {omn.node_id}: {line}", flush=True)
        for line in send_cmd(omn, "JSON", 0.8):
            if line.startswith(("# UPZ|", "# ALEXAI|", "# AURORA|", "# JSON|")):
                print(f"  {omn.node_id}: {line}", flush=True)

        j = omn.last_json
        s = omn.last_sync
        upz = omn.last_upz
        aps_cnt = j.get("networks", j.get("aps", 14))
        peer_rx = s.get("peer_rx", j.get("peer_rx", 0))
        triad_on = s.get("triad_online", j.get("triad_online", 3))
        omn_spoken = (
            f"OMN Medusa on 2.06 inch CO5300 AMOLED at 852 Hertz. "
            f"ES8311 speaker and ES7210 dual microphone capturing {t_title}. "
            f"Triad online {triad_on} of 3 nodes with {peer_rx} ESP-NOW capsules from sister ADA, "
            f"UPZ seal {upz.get('seal16', '0x894d')}, {aps_cnt} networks synced."
        )
        print(f"  [VOICE:{omn.voice}] {omn_spoken}", flush=True)
        if not mute_mac:
            mac_say(omn_spoken, voice=omn.voice, rate=195, wait=True)

    # 3. TDECK:AYEOS (LilyGO T-Deck S3 320x240 ST7789-GRAM-WAVE, 432->528->864Hz)
    if tdeck:
        print(f"\n[3/3 · {tdeck.node_id} (<>) @ {tdeck.port}] -> ST7789-GRAM-WAVE + SX1262 LoRa + 432->528->864Hz Chirp...", flush=True)
        for line in send_cmd(tdeck, f"SPEAK Triad convergence round {round_idx} {t_title}", 0.8):
            if not line.startswith("W|"):
                print(f"  {tdeck.node_id}: {line}", flush=True)
        for line in send_cmd(tdeck, "TRIAD", 0.7):
            if not line.startswith("W|"):
                print(f"  {tdeck.node_id}: {line}", flush=True)

        tj = tdeck.last_json
        tdeck_spoken = (
            f"T-Deck AYEOS cyberdeck bridging ADA and OMN Medusa. "
            f"432 to 528 to 864 Hertz cymatic chirp locked to {t_title} at {t_bpm} BPM. "
            f"Salience {tj.get('salience', 88)}, coherence {tj.get('n_np_coherence', 0.78)}, "
            f"{tj.get('pkts', 496)} packets in wave memory."
        )
        print(f"  [VOICE:{tdeck.voice}] {tdeck_spoken}", flush=True)
        if not mute_mac:
            mac_say(tdeck_spoken, voice=tdeck.voice, rate=190, wait=True)

    # 4. Simultaneous 3-Device Harmonic Finale + music.vaked.dev Choreography
    print(f"\n[4/4 · MUSIC.VAKED.DEV LIVE BRIDGE] -> #{t_idx:02d} {t_title} ({t_bpm} BPM {t_key}) · 8-Band Ternary EQ + ENTHEA VIZ!", flush=True)
    if ada:
        safe_write(
            ada,
            (
                f"ENGINE qt:62|44L|432Hz|{t_tag}\n"
                f"TRACK {t_idx}\n"
                f"TAB 1\n"
                f"SYNC\n"
            ).encode("utf-8"),
        )
    if omn:
        viz_idx = (round_idx % 4) + 1
        safe_write(
            omn,
            (
                f"ENGINE qt:62|44L|852Hz|{t_tag}\n"
                f"TRACK {t_idx}\n"
                f"VIZ {viz_idx}\n"
                f"TAB 5\n"
                f"RIVA\n"
                f"SYNC\n"
            ).encode("utf-8"),
        )
    if tdeck:
        safe_write(tdeck, f"SPEAK {t_title} cymatic lock\nTRIAD\n".encode("utf-8"))

    for n in nodes:
        for line in drain_and_parse(n, 1.2):
            if line.startswith(("# ENGINE|", "# VIZ|", "# TTS|", "# BICEP|", "# RIVA|", "# SYNC|", "# CHIRP|", "# TRIAD|")) or '"event":"zoneinn_track"' in line:
                print(f"  {n.node_id}: {line}", flush=True)

    # Periodic wa-stream feed (Round 1 and every 5 rounds)
    if enable_wa and (round_idx == 1 or round_idx % 5 == 0):
        omn_rx = omn.last_sync.get("peer_rx", 0) if omn else 0
        ada_rx = ada.last_sync.get("peer_rx", 0) if ada else 0
        wa_summary = (
            f"🎶 *OMNI 3-NODE × music.vaked.dev · Round {round_idx}* (`#{t_idx:02d} {t_title} — {t_artist} · {t_bpm} BPM {t_key}`)\n"
            f"• `ADA:MEDUSA (* 432Hz)`: `peer_rx={ada_rx}` · `seal16={ada.last_upz.get('seal16', '0xbd1f') if ada else '0xbd1f'}` · Tab 1 8-Band Ternary EQ\n"
            f"• `OMN:MEDUSA (oo 852Hz)`: `peer_rx={omn_rx}` · `seal16={omn.last_upz.get('seal16', '0x894d') if omn else '0x894d'}` · Tab 5 ENTHEA VIZ + ES7210 Mic\n"
            f"• `TDECK:AYEOS (<> 432→528→864Hz)`: `ST7789-GRAM-WAVE` · `TTL=[255,255,255]`"
        )
        wa_stream_push(wa_summary)


def main() -> int:
    parser = argparse.ArgumentParser(description="SOTA 3-node ESP32-S3 + LilyGO T-Deck trialogue, Dreamstate & music.vaked.dev orchestrator")
    parser.add_argument("--rounds", type=int, default=1, help="Number of rounds to run (0 = continuous)")
    parser.add_argument("--duration-min", type=float, default=10.0, help="Total continuous duration in minutes when --rounds 0 (default: 10)")
    parser.add_argument("--dream-every-min", type=float, default=3.0, help="Trigger Dreamstate every N minutes (default: 3)")
    parser.add_argument("--dream-for-min", type=float, default=1.0, help="Dreamstate duration in minutes (default: 1)")
    parser.add_argument("--no-wa-stream", action="store_true", help="Disable live wa-stream (127.0.0.1:8788) telemetry feed")
    parser.add_argument("--mute-mac", action="store_true", help="Disable macOS TTS (on-chip speakers only)")
    parser.add_argument("--ports", nargs="*", help="Explicit serial ports (default: auto-discover /dev/cu.usbmodem*)")
    args = parser.parse_args()

    nodes = discover_nodes(args.ports)
    if not nodes:
        print("[!] No ESP32-S3 nodes found on /dev/cu.usbmodem*", flush=True)
        return 1

    enable_wa = not args.no_wa_stream
    start_ts = time.time()
    end_ts = start_ts + (args.duration_min * 60.0) if (args.rounds == 0 and args.duration_min > 0) else None
    cycle_s = max(30.0, args.dream_every_min * 60.0)
    dream_s = max(10.0, args.dream_for_min * 60.0)
    active_window_s = max(10.0, cycle_s - dream_s)

    round_idx = 1
    dream_idx = 0
    last_dream_cycle = -1

    try:
        while args.rounds == 0 or round_idx <= args.rounds:
            now = time.time()
            if end_ts is not None and now >= end_ts:
                print(f"\n[+] Completed {args.duration_min:.1f}-minute continuous sovereign constellation + Dreamstate session!", flush=True)
                if enable_wa:
                    wa_stream_push(
                        f"✅ *OMNI 3-NODE 10-MINUTE SESSION COMPLETE* — `{round_idx - 1}` active rounds + `{dream_idx}` Dreamstate Mandala cycles (`ADA:MEDUSA *`, `OMN:MEDUSA oo`, `TDECK:AYEOS <>`). <3<3<3 + 1"
                    )
                break

            # When running continuously (--rounds 0), enter 1-minute Dreamstate after Round 1 and every 3-minute cycle
            if args.rounds == 0 and args.dream_for_min > 0:
                elapsed = now - start_ts
                cycle_num = int(elapsed // cycle_s)
                if round_idx >= 2 and cycle_num > last_dream_cycle:
                    last_dream_cycle = cycle_num
                    dream_idx += 1
                    rem_total = (end_ts - time.time()) if end_ts else dream_s
                    actual_dream_s = min(dream_s, max(5.0, rem_total))
                    run_dreamstate_minute(
                        nodes,
                        dream_idx=dream_idx,
                        duration_s=actual_dream_s,
                        mute_mac=args.mute_mac,
                        enable_wa=enable_wa,
                    )
                    continue

            run_trialogue_round(nodes, round_idx, mute_mac=args.mute_mac, enable_wa=enable_wa)
            round_idx += 1
            if args.rounds == 0 or round_idx <= args.rounds:
                time.sleep(0.5)
    except KeyboardInterrupt:
        print("\n[+] Stopping 3-node trialogue cleanly (HUPCL disabled; boards remain running).", flush=True)
    finally:
        for n in nodes:
            try:
                n.ser.close()
            except Exception:
                pass
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
