"""
Extract frames from the user-supplied zip and convert them to WebP for
use as a scroll-driven hero background.

Input:  /home/z/my-project/upload/Create_blue_color_video_202608111736_frames.zip
Output: /home/z/my-project/public/videos/hero-frames/frame_001.webp ... frame_016.webp

WebP at quality=90 is visually indistinguishable from the source PNG
but ~5-8x smaller, which matters because all 16 frames need to be
loaded for smooth scroll-scrubbing.
"""

import zipfile
import os
import shutil
from PIL import Image
from pathlib import Path

ZIP_PATH = "/home/z/my-project/upload/Create_blue_color_video_202608111736_frames.zip"
EXTRACT_DIR = "/tmp/hero-frames-extract"
OUT_DIR = "/home/z/my-project/public/videos/hero-frames"


def main():
    # Clean any previous extraction
    if os.path.exists(EXTRACT_DIR):
        shutil.rmtree(EXTRACT_DIR)
    os.makedirs(EXTRACT_DIR, exist_ok=True)

    # 1. Extract the zip
    print(f"Extracting {ZIP_PATH}...")
    with zipfile.ZipFile(ZIP_PATH, "r") as z:
        z.extractall(EXTRACT_DIR)

    # 2. Find the frames directory (could be nested)
    frames_dir = None
    for root, dirs, files in os.walk(EXTRACT_DIR):
        png_files = sorted([f for f in files if f.lower().endswith(".png")])
        if png_files:
            frames_dir = root
            break

    if not frames_dir:
        raise SystemExit("No PNG frames found in the zip.")

    png_files = sorted([f for f in os.listdir(frames_dir) if f.lower().endswith(".png")])
    print(f"Found {len(png_files)} frames in {frames_dir}")

    # 3. Convert each PNG to WebP
    os.makedirs(OUT_DIR, exist_ok=True)

    total_src_size = 0
    total_dst_size = 0

    for png in png_files:
        src_path = os.path.join(frames_dir, png)
        webp_name = os.path.splitext(png)[0] + ".webp"
        dst_path = os.path.join(OUT_DIR, webp_name)

        img = Image.open(src_path).convert("RGBA")
        img.save(dst_path, "WEBP", quality=90, method=6)

        src_size = os.path.getsize(src_path)
        dst_size = os.path.getsize(dst_path)
        total_src_size += src_size
        total_dst_size += dst_size
        print(f"  {png} -> {webp_name}: {src_size:,} -> {dst_size:,} bytes")

    print(f"\nTotal: {total_src_size:,} -> {total_dst_size:,} bytes "
          f"({total_dst_size / total_src_size * 100:.1f}% of original)")

    # 4. List final output
    print(f"\nGenerated files in {OUT_DIR}:")
    for f in sorted(os.listdir(OUT_DIR)):
        if f.endswith(".webp"):
            p = os.path.join(OUT_DIR, f)
            print(f"  {f}  ({os.path.getsize(p):,} bytes)")


if __name__ == "__main__":
    main()
