#!/usr/bin/env python3
"""
Download a real stock photo from ZAI image search for each query.
Replaces the AI-generated images with real photographs.

Strategy:
  1. Call `z-ai image-search` for each query.
  2. Parse the JSON (skipping the status lines the CLI prepends).
  3. Pick the best result by aspect ratio (closest to 16:9 landscape).
  4. Download the image and save it to the target path.
"""

import json
import re
import subprocess
import sys
import urllib.request
from pathlib import Path
from typing import Any

# (query, output_path)
JOBS = [
    (
        "diverse engineering team collaborating in modern office discussing project",
        "/home/z/my-project/public/images/howwework-team.jpg",
    ),
    (
        "two engineers brainstorming at whiteboard with sticky notes",
        "/home/z/my-project/public/images/resources/guide.jpg",
    ),
    (
        "three engineers planning around laptop with project timeline screen",
        "/home/z/my-project/public/images/resources/template.jpg",
    ),
    (
        "mentor and junior engineer discussing tablet in modern office",
        "/home/z/my-project/public/images/resources/reading-list.jpg",
    ),
]

TARGET_RATIO = 16 / 9  # we want landscape images for these slots


def run_search(query: str) -> dict[str, Any]:
    """Call z-ai CLI and parse JSON from stdout (skipping status lines)."""
    print(f"  → searching: {query}")
    result = subprocess.run(
        [
            "z-ai",
            "image-search",
            "-q",
            query,
            "-c",
            "8",  # get a few extra so we can pick by aspect ratio
            "--gl",
            "us",
            "--no-rank",
        ],
        capture_output=True,
        text=True,
        timeout=180,
    )

    # The CLI prepends emoji status lines — find the first `{` and parse from there.
    out = result.stdout
    json_start = out.find("{")
    if json_start < 0:
        raise RuntimeError(f"No JSON in output. stderr: {result.stderr[:300]}")

    data = json.loads(out[json_start:])
    if not data.get("success"):
        raise RuntimeError(f"Search failed: {data.get('error', 'unknown')}")
    return data


def pick_best_landscape(results: list[dict[str, Any]]) -> dict[str, Any]:
    """Pick the result whose aspect ratio is closest to 16:9 landscape."""
    def parse_px(s: str) -> int:
        m = re.match(r"(\d+)", s or "")
        return int(m.group(1)) if m else 0

    scored = []
    for r in results:
        w = parse_px(r.get("original_width", ""))
        h = parse_px(r.get("original_height", ""))
        if w == 0 or h == 0:
            continue
        ratio = w / h
        # Penalize portrait orientations heavily — we want landscape.
        if ratio < 1:
            score = 1000 + (1 - ratio)  # very bad score
        else:
            score = abs(ratio - TARGET_RATIO)
        scored.append((score, r))

    if not scored:
        # Fallback to first result.
        return results[0]

    scored.sort(key=lambda x: x[0])
    return scored[0][1]


def download(url: str, out_path: str) -> int:
    """Download the image to out_path. Returns file size in bytes."""
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp, open(out_path, "wb") as f:
        data = resp.read()
        f.write(data)
        return len(data)


def main() -> int:
    for query, out_path in JOBS:
        print(f"\n=== {out_path} ===")
        try:
            data = run_search(query)
            results = data.get("results", [])
            print(f"  got {len(results)} results")
            best = pick_best_landscape(results)
            print(
                f"  picked: {best.get('source')} | "
                f"{best.get('original_width')}x{best.get('original_height')}"
            )
            url = best["original_url"]
            size = download(url, out_path)
            print(f"  ✓ saved ({size / 1024:.1f} KB)")
        except Exception as e:
            print(f"  ✗ FAILED: {e}", file=sys.stderr)
            return 1
    print("\n✓ All images downloaded.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
