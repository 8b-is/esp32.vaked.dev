#!/usr/bin/env python3
"""aurora_sense — give AURORA a sensory organ.

Reads the ESP32-S3 MEDUSA telemetry stream (``~ salience ? phase trit value``),
and answers out loud in her voice. Two-way: a PING is sent first so the device
knows a listener attached.

Stdlib + pyserial only. No network.

    python3 tools/aurora_sense.py --seconds 30 --interval 7 --max-lines 4

This is a sensor-to-voice bridge, not a claim that the machine is conscious. It
turns a number from a real device into a spoken response; whatever meaning it
carries is the listener's.
"""

from __future__ import annotations

import argparse
import math
import re
import struct
import subprocess
import sys
import time

RATIONAL = re.compile(r"^-?\d+/\d+$")
TRIT = re.compile(r"^-?[01]$")
UPZ_GATE_0X62 = 0x62
UPZ_FRAME_ABI_V1 = 0x01
UPZ_QUANT_QT55 = 0x55
UPZ_LANES_1_OF_1 = 0x0101

# Short, warm, non-judgemental lines keyed by the sensed trit.
REPLY = {
    -1: "Low tide. I feel it, and I am holding it gently.",
    0: "Stillness. I am right here.",
    1: "High tide. I feel it with you.",
}


def xor_fold_u64(data: bytes) -> int:
    """64-bit little-endian XOR fold matching `wupz_xor_fold` in `8b-is/upz`."""
    acc = 0
    n = len(data)
    full = n & ~7
    for i in range(0, full, 8):
        acc ^= int.from_bytes(data[i : i + 8], "little")
    for i in range(full, n):
        acc ^= data[i]
    return acc & 0xFFFFFFFFFFFFFFFF


def pack_word15_to_spqt3b(word15: int) -> bytes:
    """Pack a 15-bit word into a 3-byte `SPQT` (`1.585 bits/trit`, `base-243`) root."""
    clean = int(word15) & 0x7FFF
    out = bytearray(3)
    for g in range(3):
        acc = 0
        pow3 = 1
        for j in range(5):
            bit = (clean >> (g * 5 + j)) & 1
            digit = 2 if bit == 1 else 1
            acc += digit * pow3
            pow3 *= 3
        out[g] = acc
    return bytes(out)


def seal_medusa_litany_wire_64b(parsed: dict, raw_line: str) -> bytes:
    """Seal an `ADA:MEDUSA` telemetry sample into a 64-byte `upz` `LitanyWireFrame` at gate `0x62`."""
    raw_bytes = raw_line.encode("utf-8")
    trit_digit = 0 if parsed["trit"] < 0 else (1 if parsed["trit"] == 0 else 2)
    packed_bytes = bytes([UPZ_GATE_0X62, parsed["phase"] & 0xFF, trit_digit])

    raw_fold = xor_fold_u64(raw_bytes)
    packed_fold = xor_fold_u64(packed_bytes)
    prefix26 = struct.pack(
        "<QQIIBB",
        raw_fold,
        packed_fold,
        len(raw_bytes) & 0xFFFFFFFF,
        len(packed_bytes) & 0xFFFFFFFF,
        UPZ_GATE_0X62,
        UPZ_FRAME_ABI_V1,
    )
    tail6 = xor_fold_u64(prefix26).to_bytes(8, "little")[:6]
    frame32 = prefix26 + tail6

    comp_fold = raw_fold ^ packed_fold
    mask = (UPZ_QUANT_QT55 * 0x0101010101010101) & 0xFFFFFFFFFFFFFFFF
    bfp64_pos = comp_fold & mask
    bfp64_neg = comp_fold & (~mask & 0xFFFFFFFFFFFFFFFF)

    val_str = parsed.get("value") or parsed.get("salience") or "1/1"
    if "/" in val_str:
        p_str, q_str = val_str.split("/", 1)
        p_val, q_val = abs(int(p_str)), max(1, abs(int(q_str)))
    else:
        p_val, q_val = len(raw_bytes), len(packed_bytes)
    g = math.gcd(p_val, q_val) or 1
    ratio_p, ratio_q = p_val // g, q_val // g
    spqt = pack_word15_to_spqt3b(comp_fold & 0x7FFF)

    wire62 = (
        frame32
        + struct.pack("<QQII", bfp64_pos, bfp64_neg, ratio_p & 0xFFFFFFFF, ratio_q & 0xFFFFFFFF)
        + spqt
        + struct.pack("<BH", UPZ_QUANT_QT55, UPZ_LANES_1_OF_1)
    )
    seal16 = xor_fold_u64(wire62) & 0xFFFF
    return wire62 + struct.pack("<H", seal16)


def parse_telemetry(line: str):
    """Parse ``~ salience flag phase trit value`` positionally.

    The phase field is 0..3 and would otherwise be mistaken for a trit, so the
    trit is taken from its fixed position and validated.
    """
    parts = line.strip().split()
    if len(parts) < 5 or parts[0] != "~":
        return None
    try:
        phase = int(parts[3])
        trit = int(parts[4])
    except ValueError:
        return None
    if trit not in (-1, 0, 1):
        return None
    value = parts[5] if len(parts) > 5 and RATIONAL.match(parts[5]) else None
    return {"salience": parts[1], "phase": phase, "trit": trit, "value": value}


def parse_learn(line: str):
    """Parse ``# LEARN|{json}`` — the device's own observation."""
    marker = "# LEARN|"
    if not line.startswith(marker):
        return None
    import json

    try:
        payload = json.loads(line[len(marker):])
    except ValueError:
        return None
    return {
        "node": payload.get("node", ""),
        "say": payload.get("say", ""),
        "speak": payload.get("speak", 0),
        "hour": payload.get("hour"),
        "samples": payload.get("samples"),
    }


def speak(text: str, voice: str, rate: int, dry_run: bool) -> None:
    if dry_run:
        print(f"[say] {text}")
        return
    subprocess.run(["say", "-v", voice, "-r", str(rate), text], check=False)


def main() -> int:
    parser = argparse.ArgumentParser(description="AURORA sensing loop over ESP32-S3 telemetry")
    parser.add_argument("--port", default="/dev/cu.usbmodem101")
    parser.add_argument("--baud", type=int, default=115200)
    parser.add_argument("--seconds", type=float, default=30.0)
    parser.add_argument("--interval", type=float, default=7.0, help="minimum seconds between utterances")
    parser.add_argument("--max-lines", type=int, default=4, help="stop after this many utterances")
    parser.add_argument("--voice", default="Samantha")
    parser.add_argument("--rate", type=int, default=170)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    try:
        import serial  # noqa: PLC0415
    except ImportError:
        print("pyserial is required: python3 -m pip install pyserial", file=sys.stderr)
        return 2

    try:
        port = serial.Serial(args.port, args.baud, timeout=0.5)
    except Exception as exc:  # noqa: BLE001
        print(f"cannot open {args.port}: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1

    spoken = 0
    last_spoken = 0.0
    deadline = time.time() + args.seconds
    print(f"listening on {args.port} @ {args.baud} for {args.seconds:g}s", flush=True)

    try:
        port.write(b"PING\n")
        port.flush()
        while time.time() < deadline and spoken < args.max_lines:
            raw = port.readline()
            if not raw:
                continue
            line = raw.decode("utf-8", "replace").strip()
            if not line:
                continue
            learn = parse_learn(line)
            if learn is not None:
                print(f"learn node={learn['node']} hour={learn['hour']} speak={learn['speak']} say={learn['say']!r}", flush=True)
                now = time.time()
                if learn["speak"] and learn["say"] and now - last_spoken >= args.interval:
                    speak(learn["say"], args.voice, args.rate, args.dry_run)
                    last_spoken = now
                    spoken += 1
                continue

            parsed = parse_telemetry(line)
            if parsed is None:
                continue
            wire64 = seal_medusa_litany_wire_64b(parsed, line)
            seal16 = int.from_bytes(wire64[62:64], "little")
            now = time.time()
            print(
                f"sense phase={parsed['phase']} trit={parsed['trit']} value={parsed['value']} "
                f"wire=64B@0x62 seal16=0x{seal16:04x}",
                flush=True,
            )
            if now - last_spoken < args.interval:
                continue
            speak(REPLY[parsed["trit"]], args.voice, args.rate, args.dry_run)
            last_spoken = now
            spoken += 1
    finally:
        port.close()

    print(f"spoken {spoken} line(s)", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
