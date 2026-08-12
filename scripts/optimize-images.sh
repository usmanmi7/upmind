#!/usr/bin/env bash
# Optimize all 4 stock photos: convert to JPEG, resize to 1344x768 (16:9),
# and compress with quality 85 — web-friendly size.
set -e

cd /home/z/my-project

declare -A IMAGES=(
  ["public/images/howwework-team.jpg"]="1344:768"
  ["public/images/resources/guide.jpg"]="1344:768"
  ["public/images/resources/template.jpg"]="1344:768"
  ["public/images/resources/reading-list.jpg"]="1344:768"
)

for path in "${!IMAGES[@]}"; do
  dims="${IMAGES[$path]}"
  w="${dims%:*}"
  h="${dims#*:}"
  tmp="${path%.jpg}.optimized.jpg"

  echo "→ $path"
  echo "   target: ${w}x${h}, JPEG q85"

  # Use ffmpeg to: scale (preserve aspect, crop overflow), convert to jpg q85
  ffmpeg -v error -y -i "$path" \
    -vf "scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}" \
    -q:v 2 \
    "$tmp" 2>&1

  # Replace original
  mv "$tmp" "$path"

  size=$(stat -c%s "$path")
  echo "   ✓ saved ($(echo "scale=1; $size/1024" | bc) KB)"
done

echo ""
echo "=== final files ==="
ls -la public/images/howwework-team.jpg public/images/resources/*.jpg
echo ""
file public/images/howwework-team.jpg public/images/resources/*.jpg
