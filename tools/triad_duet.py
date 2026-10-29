#!/usr/bin/env python3
"""
triad_duet.py — Live Device-to-Device (ESP-NOW + Serial + On-Chip Audio + macOS Voice)
Duet Orchestrator for the 8b-is ESP32-S3 Fleet:
  - ADA:MEDUSA (Waveshare ESP32-S3-Touch-AMOLED-1.8, SH8601 40 FPS HUD + ES8311 Formant/Harmonic TTS)
  - TDECK:AYEOS (LilyGO T-Deck S3, ST7789-GRAM-WAVE + SX1262 + 432->528->864Hz Cymatic Chirp)
  - VAK:MEDUSA / OMN:MEDUSA (Wigle-Triad / Aurora S3 nodes)
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
    mac: str = ""
    board: str = ""
    version: str = ""
    voice: str = "Samantha"
    last_json: Dict[str, Any] = field(default_factory=dict)
    last_upz: Dict[str, Any] = field(default_factory=dict)
    last_alexai: Dict[str, Any] = field(default_factory=dict)
    last_aurora: Dict[str, Any] = field(default_factory=dict)
    last_wave: str = ""
    recent_lines: List[str] = field(default_factory=list)


def mac_say(text: str, voice: str = "Samantha", rate: int = 195, wait: bool = True) -> None:
    if sys.platform != "darwin":
        return
    cmd = ["say", "-v", voice, "-r", str(rate), text]
    if wait:
        subprocess.run(cmd, check=False)
    else:
        subprocess.Popen(cmd)


def drain_and_parse(node: TriadNode, duration_s: float = 1.2) -> List[str]:
    deadline = time.time() + duration_s
    lines: List[str] = []
    while time.time() < deadline:
        raw = node.ser.readline()
        if not raw:
            continue
        line = raw.decode("utf-8", errors="replace").strip()
        if not line:
            continue
        lines.append(line)
        node.recent_lines.append(line)
        if len(node.recent_lines) > 50:
            node.recent_lines.pop(0)

        if line.startswith("# JSON|"):
            try:
                d = json.loads(line[7:])
                node.last_json = d
                node.node_id = d.get("node", node.node_id)
                node.mac = d.get("mac", node.mac)
                node.board = d.get("board", node.board)
                node.version = d.get("version", node.version)
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
                node.mac = parts[2]
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
            ser = serial.Serial(port, baud, timeout=0.25)
        except Exception as exc:
            print(f"[!] Could not open {port}: {exc}")
            continue
        node = TriadNode(port=port, ser=ser)
        drain_and_parse(node, 1.2)
        send_cmd(node, "PING", 0.6)
        send_cmd(node, "STATUS", 1.8)
        if not node.last_json:
            send_cmd(node, "JSON", 1.8)
        if "TDECK" in node.node_id or "T-Deck" in node.board:
            node.voice = "Daniel"
        elif "ADA" in node.node_id:
            node.voice = "Samantha"
        else:
            node.voice = "Karen"
        nodes.append(node)
        print(
            f"[+] Discovered {node.node_id} on {node.port} "
            f"(MAC={node.mac}, board={node.board}, fw={node.version}, voice={node.voice})"
        )
    return nodes


def run_duet_round(nodes: List[TriadNode], round_idx: int, mute_mac: bool = False) -> None:
    print(f"\n{'=' * 72}")
    print(f"  OMNI TRIAD DUET — ROUND {round_idx}")
    print(f"{'=' * 72}")

    ada: Optional[TriadNode] = next((n for n in nodes if "ADA" in n.node_id), None)
    tdeck: Optional[TriadNode] = next((n for n in nodes if "TDECK" in n.node_id), None)

    if ada is None and len(nodes) >= 1:
        ada = nodes[0]
    if tdeck is None and len(nodes) >= 2:
        tdeck = nodes[1]

    # Step 1: ADA:MEDUSA wakes, locks Ch 1, broadcasts ESP-NOW wave splash, and speaks on ES8311
    if ada:
        print(f"\n[{ada.node_id} @ {ada.port}] -> Waking AMOLED HUD + ES8311 Formant/Harmonic Voice + ESP-NOW Splash...")
        for line in send_cmd(ada, "WAKE", 0.6):
            print(f"  {ada.node_id}: {line}")
        for line in send_cmd(ada, "SPLASH", 0.6):
            print(f"  {ada.node_id}: {line}")
        ada_phrase = f"Hello brother TDECK AYEOS, this is {ada.node_id} round {round_idx}"
        for line in send_cmd(ada, f"SPEAK {ada_phrase}", 1.2):
            print(f"  {ada.node_id}: {line}")
        for line in send_cmd(ada, "JSON", 1.2):
            if line.startswith(("# UPZ|", "# ALEXAI|", "# AURORA|", "# JSON|", "~ ")):
                print(f"  {ada.node_id}: {line}")

        j = ada.last_json
        upz = ada.last_upz
        alexai = ada.last_alexai
        aurora = ada.last_aurora
        aps_count = j.get("networks", j.get("aps", 0))
        ada_spoken = (
            f"ADA Medusa on 40 FPS AMOLED HUD. "
            f"UPZ {upz.get('gate', '0x62')} lanes {upz.get('lanes', '8/8')} seal {upz.get('seal16', '0xf07a')}. "
            f"AlexAI {alexai.get('model', 'GAIA MLX Quant b1.58')} salience {j.get('salience', 49)}. "
            f"Aurora wave phase {aurora.get('phase', j.get('phase', 0))}, "
            f"seeing {aps_count} Wi-Fi networks at {j.get('mean_rssi', -60)} dBm. "
            f"Calling brother T-Deck AYEOS on 432 Hertz."
        )
        print(f"  [VOICE:{ada.voice}] {ada_spoken}")
        if not mute_mac:
            mac_say(ada_spoken, voice=ada.voice, rate=195, wait=True)

    # Step 2: TDECK:AYEOS receives wave splash, chirps 432->528->864Hz on-chip speaker, and replies
    if tdeck:
        print(f"\n[{tdeck.node_id} @ {tdeck.port}] -> Answering ADA:MEDUSA with 432->528->864Hz Cymatic Chirp + Wave Status...")
        tdeck_phrase = f"ACK from TDECK AYEOS round {round_idx} cymatic wave locked"
        for line in send_cmd(tdeck, f"SPEAK {tdeck_phrase}", 0.9):
            print(f"  {tdeck.node_id}: {line}")
        for line in send_cmd(tdeck, "TRIAD", 0.6):
            print(f"  {tdeck.node_id}: {line}")
        for line in send_cmd(tdeck, "STATUS", 2.2):
            if line.startswith(("# JSON|", "# TRIAD|", "# CHIRP|", "~ ")):
                print(f"  {tdeck.node_id}: {line}")

        tj = tdeck.last_json
        tdeck_spoken = (
            f"T-Deck AYEOS answering sister ADA Medusa. "
            f"432 to 528 to 864 Hertz cymatic chirp active. "
            f"Wave coherence {tj.get('wave_coherence_pct', 97)} percent, "
            f"salience {tj.get('salience', 248)}, phase {tj.get('phase', 0)}, "
            f"tracking {tj.get('aps', 12)} Wi-Fi APs, {tj.get('ble', 8)} BLE beacons, "
            f"and {tj.get('pkts', 1200)} triad packets at {tj.get('temp_c', 31.8)} degrees Celsius."
        )
        print(f"  [VOICE:{tdeck.voice}] {tdeck_spoken}")
        if not mute_mac:
            mac_say(tdeck_spoken, voice=tdeck.voice, rate=190, wait=True)

    # Step 3: Simultaneous On-Chip Harmonic Duet (ADA ES8311 BICEP GLUE / RIVA + TDECK 432->528->864Hz Chirp + ESP-NOW Splash)
    if ada and tdeck:
        print("\n[DUET HARMONIC CONVERGENCE] -> Simultaneous on-chip audio + ESP-NOW wave exchange!")
        song_cmd = "BICEP GLUE" if (round_idx % 2 == 1) else "RIVA"
        ada.ser.write((song_cmd + "\nSPLASH\n").encode("utf-8"))
        ada.ser.flush()
        tdeck.ser.write(b"SPEAK Harmonic triad convergence locked\nTRIAD\n")
        tdeck.ser.flush()

        for line in drain_and_parse(ada, 1.5):
            print(f"  {ada.node_id}: {line}")
        for line in drain_and_parse(tdeck, 1.5):
            print(f"  {tdeck.node_id}: {line}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Live multi-device ESP32-S3 duet orchestrator")
    parser.add_argument("--rounds", type=int, default=2, help="Number of duet rounds to run (0 = infinite)")
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
            run_duet_round(nodes, round_idx, mute_mac=args.mute_mac)
            round_idx += 1
            if args.rounds == 0 or round_idx <= args.rounds:
                time.sleep(0.6)
    except KeyboardInterrupt:
        print("\n[+] Stopping triad duet.")
    finally:
        for n in nodes:
            try:
                n.ser.close()
            except Exception:
                pass
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
