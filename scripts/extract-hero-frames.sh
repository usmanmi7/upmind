#!/usr/bin/env bash
# Extract 16 evenly-spaced frames from the new hero video as webp.
# Video: 1280x720, 10s, 24fps = 240 frames.
# 240 / 16 = 15, so extract every 15th frame.
# Output: /home/z/my-project/public/videos/hero-frames/frame_001.webp ... frame_016.webp

set -e

VIDEO="/home/z/my-project/upload/Create_blue_color_video_202608111736.mp4"
OUT_DIR="/home/z/my-project/public/videos/hero-frames"
BACKUP_DIR="/home/z/my-project/public/videos/hero-frames-prev"
TMP_DIR="$(mktemp -d)"

echo "Backing up existing frames to $BACKUP_DIR ..."
mkdir -p "$BACKUP_DIR"
mv "$OUT_DIR"/*.webp "$BACKUP_DIR"/ 2>/dev/null || true
mkdir -p "$OUT_DIR"

echo "Extracting 16 frames from $VIDEO ..."
echo "  (selecting every 15th frame of a 240-frame / 10s / 24fps video)"

# Use the select filter to pick every 15th frame (1-indexed: 1, 16, 31, ...).
# Convert each to webp with quality 80 — small file size, good visual fidelity.
ffmpeg -v error -i "$VIDEO" \
  -vf "select='not(mod(n\,15))',setpts=N/FRAME_RATE/TB" \
  -vsync vfr \
  -frame_pts 1 \
  "$TMP_DIR/frame_%03d.png" 2>&1

# Convert each PNG to webp at quality 80
echo "Converting to webp ..."
count=0
for png in "$TMP_DIR"/frame_*.png; do
  count=$((count + 1))
  out=$(printf "%s/frame_%03d.webp" "$OUT_DIR" "$count")
  cwebp -q 80 -quiet "$png" -o "$out" 2>/dev/null || \
    ffmpeg -v error -i "$png" -q:v 80 "$out"
done

echo "Generated $count frames:"
ls -la "$OUT_DIR/"

# Cleanup
rm -rf "$TMP_DIR"
echo "Done."
