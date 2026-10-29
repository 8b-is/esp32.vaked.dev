#!/usr/bin/env python3
"""
triad_duet.py — SOTA 3-Node ESP-NOW + Serial + On-Chip Audio + macOS Voice
Trialogue & Synchronization Orchestrator for the 8b-is ESP32-S3 Fleet:
  - ADA:MEDUSA (*)  : Waveshare ESP32-S3-Touch-AMOLED-1.8  (368x448 SH8601, ES8311 TTS, 432 Hz, MAC 80:B5:4E:DB:3B:C4)
  - OMN:MEDUSA (oo) : Waveshare ESP32-S3-Touch-AMOLED-2.06 (410x502 CO5300, ES8311 + ES7210 Dual-Mic, 852 Hz, MAC 80:B5:4E:F2:02:B4)
  - TDECK:AYEOS (<>): LilyGO T-Deck S3 (320x240 ST7789-GRAM-WAVE, SX1262 LoRa, 0x55 KB, ES7210 Mic, 432->528->864Hz Chirp, MAC CC:BA:97:00:45:24)
"""

from __future__ import annotations

import argparse
import glob
import json
import subprocess
import sys
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

import serial


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
    last_json: Dict[str, Any] = field(default_factory=dict)
    last_sync: Dict[str, Any] = field(default_factory=dict)
    last_upz: Dict[str, Any] = field(default_factory=dict)
    last_alexai: Dict[str, Any] = field(default_factory=dict)
    last_aurora: Dict[str, Any] = field(default_factory=dict)
    last_wave: str = ""
    recent_aps: List[str] = field(default_factory=list)


def mac_say(text: str, voice: str = "Samantha", rate: int = 195, wait: bool = True) -> None:
    if sys.platform != "darwin":
        return
    cmd = ["say", "-v", voice, "-r", str(rate), text]
    if wait:
        subprocess.run(cmd, check=False)
    else:
        subprocess.Popen(cmd)


def _ingest_json_dict(node: TriadNode, d: Dict[str, Any]) -> None:
    node.last_json.update(d)
    node.node_id = d.get("node") or d.get("medusa_node") or node.node_id
    node.vertex = d.get("vertex", node.vertex)
    node.mac = (d.get("mac") or node.mac).upper()
    node.board = d.get("board", node.board)
    node.lcd = d.get("lcd", node.lcd)
    node.lcd_driver = d.get("lcd_driver", node.lcd_driver)
    node.version = d.get("version", node.version)


def drain_and_parse(node: TriadNode, duration_s: float = 1.2) -> List[str]:
    deadline = time.time() + duration_s
    lines: List[str] = []
    while time.time() < deadline:
        try:
            raw = node.ser.readline()
        except Exception:
            time.sleep(0.15)
            try:
                node.ser.close()
                node.ser = serial.Serial(node.port, 115200, timeout=0.2, dsrdtr=False, rtscts=False)
                node.ser.dtr = False
                node.ser.rts = False
            except Exception:
                pass
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
        elif line.startswith("Q|"):
            parts = line.split("|")
            if len(parts) >= 4:
                node.node_id = parts[1]
                node.vertex = parts[2]
                node.mac = parts[3].upper()
        elif line.startswith("W|"):
            # W|BSSID|SSID|AUTH|CH|RSSI
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
    node.ser.write((cmd.strip() + "\n").encode("utf-8"))
    node.ser.flush()
    return drain_and_parse(node, wait_s)


def discover_nodes(ports: Optional[List[str]] = None, baud: int = 115200) -> List[TriadNode]:
    candidates = ports if ports else sorted(glob.glob("/dev/cu.usbmodem*"))
    nodes: List[TriadNode] = []
    for port in candidates:
        try:
            ser = serial.Serial(port, baud, timeout=0.2, dsrdtr=False, rtscts=False)
            ser.dtr = False
            ser.rts = False
        except Exception as exc:
            print(f"[!] Could not open {port}: {exc}")
            continue
        node = TriadNode(port=port, ser=ser)
        drain_and_parse(node, 0.8)
        send_cmd(node, "PING", 0.5)
        send_cmd(node, "STATUS", 1.2)
        if node.node_id == "UNKNOWN":
            # Wake from USB-JTAG download/halt state cleanly
            ser.dtr = False
            ser.rts = True
            time.sleep(0.08)
            ser.rts = False
            time.sleep(1.6)
            send_cmd(node, "PING", 0.6)
            send_cmd(node, "STATUS", 1.2)

        if "TDECK" in node.node_id or "T-Deck" in node.board:
            node.voice = "Daniel"
        elif "OMN" in node.node_id or node.mac.endswith("02:B4"):
            node.voice = "Karen"
        else:
            node.voice = "Samantha"

        nodes.append(node)
        print(
            f"[+] Discovered {node.node_id} ({node.vertex}) on {node.port} "
            f"[MAC={node.mac}, LCD={node.lcd} {node.lcd_driver}, FW={node.version}, Voice={node.voice}]"
        )
    return nodes


def sync_all_nodes(nodes: List[TriadNode]) -> None:
    print(f"\n{'=' * 76}")
    print("  PHASE 0: SOTA 3-NODE MESH LOCK (ESP-NOW Ch 1 + AP Cross-Seeding + Triad TTL)")
    print(f"{'=' * 76}")
    # 1. Trigger SYNC on all FLUG-OS AMOLED nodes and TRIAD on T-Deck
    for n in nodes:
        if "TDECK" in n.node_id:
            n.ser.write(b"TRIAD\n")
        else:
            n.ser.write(b"SYNC\n")
        n.ser.flush()

    for n in nodes:
        lines = drain_and_parse(n, 0.9)
        for line in lines:
            if line.startswith(("# SYNC|", "# TRIAD|", "# ANICCA|")) or '"medusa_node"' in line:
                print(f"  [{n.node_id}] {line}")

    # 2. Second SYNC wave so both AMOLED watches report the peer_rx capsules they just received from each other!
    for n in nodes:
        if "TDECK" not in n.node_id:
            for line in send_cmd(n, "SYNC", 0.7):
                if line.startswith("# SYNC|"):
                    print(f"  [{n.node_id} VERIFIED] {line}")

    # 3. Cross-seed Wi-Fi APs observed by TDECK:AYEOS into ADA:MEDUSA and OMN:MEDUSA
    shared_aps: List[str] = []
    for n in nodes:
        for ap in n.recent_aps:
            if ap not in shared_aps:
                shared_aps.append(ap)
    if shared_aps:
        print(f"  [+] Cross-seeding {len(shared_aps)} live RF beacons across all attached nodes...")
        for n in nodes:
            if "TDECK" not in n.node_id:
                for ap in shared_aps[:6]:
                    n.ser.write(f"SEED {ap}\n".encode("utf-8"))
                n.ser.flush()


def run_trialogue_round(nodes: List[TriadNode], round_idx: int, mute_mac: bool = False) -> None:
    sync_all_nodes(nodes)

    print(f"\n{'=' * 76}")
    print(f"  OMNI 3-NODE TRIALOGUE — ROUND {round_idx}")
    print(f"{'=' * 76}")

    ada: Optional[TriadNode] = next((n for n in nodes if "ADA" in n.node_id), None)
    omn: Optional[TriadNode] = next((n for n in nodes if "OMN" in n.node_id), None)
    tdeck: Optional[TriadNode] = next((n for n in nodes if "TDECK" in n.node_id), None)

    # 1. ADA:MEDUSA (1.8" 368x448 SH8601, 432 Hz, -1)
    if ada:
        print(f"\n[1/3 · {ada.node_id} (*) @ {ada.port}] -> 1.8\" SH8601 40 FPS HUD + ES8311 Formant/Harmonic TTS...")
        for line in send_cmd(ada, f"SPEAK Hello brother OMN and TDECK, ADA Medusa round {round_idx}", 1.1):
            if line.startswith(("# TTS|", "# SYNC|", "# UPZ|", "# ALEXAI|", "# AURORA|")):
                print(f"  {ada.node_id}: {line}")
        for line in send_cmd(ada, "JSON", 0.9):
            if line.startswith(("# UPZ|", "# ALEXAI|", "# AURORA|", "# JSON|")):
                print(f"  {ada.node_id}: {line}")

        j = ada.last_json
        s = ada.last_sync
        upz = ada.last_upz
        aps_cnt = j.get("networks", j.get("aps", 14))
        peer_rx = s.get("peer_rx", j.get("peer_rx", 0))
        triad_on = s.get("triad_online", j.get("triad_online", 3))
        ada_spoken = (
            f"ADA Medusa on 1.8 inch SH8601 AMOLED at 432 Hertz. "
            f"Triad online {triad_on} of 3 nodes, received {peer_rx} over the air ESP-NOW capsules. "
            f"UPZ {upz.get('gate', '0x62')} seal {upz.get('seal16', '0x258c')}, "
            f"AlexAI salience {j.get('salience', 45)}, tracking {aps_cnt} Wi-Fi networks."
        )
        print(f"  [VOICE:{ada.voice}] {ada_spoken}")
        if not mute_mac:
            mac_say(ada_spoken, voice=ada.voice, rate=195, wait=True)

    # 2. OMN:MEDUSA (2.06" 410x502 CO5300, 852 Hz, +1)
    if omn:
        print(f"\n[2/3 · {omn.node_id} (oo) @ {omn.port}] -> 2.06\" CO5300 40 FPS HUD + ES8311/ES7210 + ESP-NOW Splash...")
        for line in send_cmd(omn, f"SPEAK Hello sister ADA and brother TDECK, OMN Medusa 852 Hertz online", 1.1):
            if line.startswith(("# TTS|", "# SYNC|", "# UPZ|", "# ALEXAI|", "# AURORA|")):
                print(f"  {omn.node_id}: {line}")
        for line in send_cmd(omn, "JSON", 0.9):
            if line.startswith(("# UPZ|", "# ALEXAI|", "# AURORA|", "# JSON|")):
                print(f"  {omn.node_id}: {line}")

        j = omn.last_json
        s = omn.last_sync
        upz = omn.last_upz
        aps_cnt = j.get("networks", j.get("aps", 14))
        peer_rx = s.get("peer_rx", j.get("peer_rx", 0))
        triad_on = s.get("triad_online", j.get("triad_online", 3))
        omn_spoken = (
            f"OMN Medusa on 2.06 inch CO5300 AMOLED at 852 Hertz. "
            f"ES8311 speaker and ES7210 dual microphone active. "
            f"Triad online {triad_on} of 3 nodes with {peer_rx} ESP-NOW capsules from sister ADA. "
            f"UPZ seal {upz.get('seal16', '0xf07a')}, salience {j.get('salience', 50)}, {aps_cnt} networks synced."
        )
        print(f"  [VOICE:{omn.voice}] {omn_spoken}")
        if not mute_mac:
            mac_say(omn_spoken, voice=omn.voice, rate=195, wait=True)

    # 3. TDECK:AYEOS (LilyGO T-Deck S3 320x240 ST7789-GRAM-WAVE, 432->528->864Hz)
    if tdeck:
        print(f"\n[3/3 · {tdeck.node_id} (<>) @ {tdeck.port}] -> ST7789-GRAM-WAVE + SX1262 LoRa + 432->528->864Hz Chirp...")
        for line in send_cmd(tdeck, f"SPEAK Triad convergence round {round_idx} locked", 0.9):
            if not line.startswith("W|"):
                print(f"  {tdeck.node_id}: {line}")
        for line in send_cmd(tdeck, "TRIAD", 0.8):
            if not line.startswith("W|"):
                print(f"  {tdeck.node_id}: {line}")

        tj = tdeck.last_json
        tdeck_spoken = (
            f"T-Deck AYEOS cyberdeck bridging ADA and OMN Medusa. "
            f"432 to 528 to 864 Hertz cymatic chirp active. "
            f"SX1262 LoRa and keyboard 0x55 online, salience {tj.get('salience', 88)}, "
            f"coherence {tj.get('n_np_coherence', 0.78)}, {tj.get('pkts', 496)} packets in wave memory."
        )
        print(f"  [VOICE:{tdeck.voice}] {tdeck_spoken}")
        if not mute_mac:
            mac_say(tdeck_spoken, voice=tdeck.voice, rate=190, wait=True)

    # 4. Simultaneous 3-Device Harmonic Finale + music.vaked.dev (SPREAD SPHERE ALL · INTO LOVE) Choreography
    print("\n[4/4 · MUSIC.VAKED.DEV LIVE BRIDGE] -> 44-Layer Sovereign Acoustic Sync + 8-Band Ternary EQ + ENTHEA VIZ!")
    if ada:
        # Put ADA:MEDUSA (1.8" SH8601) on Tab 1 (8-Band Ternary Harmonic EQ + Track #1 Innerbloom / #8 Golden Ratio 432xPhi)
        ada_track = 1 if (round_idx % 2 == 1) else 8
        ada.ser.write(
            f"ENGINE qt:62|44L|432Hz|INTO-LOVE\n"
            f"SPEAK Listening to music vaked dev Spread Sphere All Into Love\n"
            f"TRACK {ada_track}\n"
            f"TAB 1\n"
            f"SYNC\n".encode("utf-8")
        )
        ada.ser.flush()
    if omn:
        # Put OMN:MEDUSA (2.06" CO5300 + ES7210 dual-mic) on Tab 5 (ENTHEA VIZ + Four-Heart Triad LOCKED + 8b-is-music feed)
        omn.ser.write(
            b"ENGINE qt:62|44L|852Hz|SPREAD-SPHERE-ALL\n"
            b"VIZ 2\n"
            b"TAB 5\n"
            b"RIVA\n"
            b"SYNC\n"
        )
        omn.ser.flush()
    if tdeck:
        tdeck.ser.write(b"SPEAK Music vaked dev 432 528 864 Hertz cymatic lock\nTRIAD\n")
        tdeck.ser.flush()

    for n in nodes:
        for line in drain_and_parse(n, 1.5):
            if line.startswith(("# ENGINE|", "# VIZ|", "# TTS|", "# BICEP|", "# RIVA|", "# SYNC|", "# CHIRP|", "# TRIAD|")) or '"event":"zoneinn_track"' in line:
                print(f"  {n.node_id}: {line}")


def main() -> int:
    parser = argparse.ArgumentParser(description="SOTA 3-node ESP32-S3 + LilyGO T-Deck trialogue & sync orchestrator")
    parser.add_argument("--rounds", type=int, default=1, help="Number of rounds to run (0 = infinite)")
    parser.add_argument("--mute-mac", action="store_true", help="Disable macOS TTS (on-chip speakers only)")
    parser.add_argument("--ports", nargs="*", help="Explicit serial ports (default: auto-discover /dev/cu.usbmodem*)")
    args = parser.parse_args()

    nodes = discover_nodes(args.ports)
    if not nodes:
        print("[!] No ESP32-S3 nodes found on /dev/cu.usbmodem*")
        return 1

    round_idx = 1
    try:
        while args.rounds == 0 or round_idx <= args.rounds:
            run_trialogue_round(nodes, round_idx, mute_mac=args.mute_mac)
            round_idx += 1
            if args.rounds == 0 or round_idx <= args.rounds:
                time.sleep(0.5)
    except KeyboardInterrupt:
        print("\n[+] Stopping 3-node trialogue.")
    finally:
        for n in nodes:
            try:
                n.ser.close()
            except Exception:
                pass
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
