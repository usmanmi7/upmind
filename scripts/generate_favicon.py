"""
Convert user-supplied /home/z/my-project/upload/fav.png into the Enginest
favicon set:

- src/app/favicon.ico        (multi-resolution ICO: 16, 32, 48)
- src/app/icon.png           (512x512 PNG)
- src/app/apple-icon.png     (180x180 PNG)
- public/favicon-32x32.png   (32x32 PNG, legacy path)

Process:
1. Open the source PNG (preserve alpha).
2. Crop to the alpha bounding box to remove transparent padding.
3. Square the canvas (pad with transparency to the shorter side) so the
   aspect ratio is preserved without stretching.
4. Add a small margin (8% on each side) so the logo isn't edge-to-edge
   in the final favicon.
5. Downsample to each target size with LANCZOS.

No background fill is applied - the favicon keeps its transparency,
which is what most modern browser tabs render correctly.
"""

from PIL import Image
from pathlib import Path

ROOT = Path("/home/z/my-project")
SRC = ROOT / "upload" / "fav.png"

OUT_APP = ROOT / "src" / "app"
OUT_PUBLIC = ROOT / "public"


def prepare_source(src_path: Path) -> Image.Image:
    """Load the source image, crop to content, square it, add margin."""
    img = Image.open(src_path).convert("RGBA")

    # 1. Crop to alpha bounding box (remove transparent padding)
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    # 2. Square the canvas (pad shorter side with transparency)
    w, h = img.size
    side = max(w, h)
    squared = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    # Center the original image on the square canvas
    offset = ((side - w) // 2, (side - h) // 2)
    squared.paste(img, offset, img)

    # 3. Add 8% margin around the content so the logo isn't edge-to-edge
    margin = int(side * 0.08)
    padded_side = side + 2 * margin
    padded = Image.new("RGBA", (padded_side, padded_side), (0, 0, 0, 0))
    padded.paste(squared, (margin, margin), squared)

    return padded


def save_png(img: Image.Image, size: int, path: Path):
    """Resize source image to `size`x`size` and save as optimized PNG."""
    resized = img.resize((size, size), Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    resized.save(path, "PNG", optimize=True)


def save_ico(src: Image.Image, sizes: list[int], path: Path):
    """Build a multi-resolution ICO file.

    PIL's ICO saver takes a single source image and creates one entry per
    requested size by resampling. Pass the largest size as the source so
    downsampling is high-quality (never upscale).
    """
    max_size = max(sizes)
    source = src.resize((max_size, max_size), Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    source.save(
        path,
        format="ICO",
        sizes=[(s, s) for s in sizes],
    )


def main():
    if not SRC.exists():
        raise SystemExit(f"Source favicon not found: {SRC}")

    print(f"Source: {SRC}")
    src_img = Image.open(SRC)
    print(f"  Original size: {src_img.size}, mode: {src_img.mode}")

    prepared = prepare_source(SRC)
    print(f"  Prepared size: {prepared.size} (cropped + squared + margin)")

    # 1. Multi-res ICO for favicon.ico
    save_ico(prepared, [16, 32, 48], OUT_APP / "favicon.ico")

    # 2. 512x512 PNG for icon.png (Next.js metadata icon)
    save_png(prepared, 512, OUT_APP / "icon.png")

    # 3. 180x180 PNG for apple-icon.png
    save_png(prepared, 180, OUT_APP / "apple-icon.png")

    # 4. Legacy 32x32 in /public
    save_png(prepared, 32, OUT_PUBLIC / "favicon-32x32.png")

    # Also save a 512px preview for the user to inspect
    OUT_PUBLIC.parent.parent.joinpath("download").mkdir(parents=True, exist_ok=True)
    save_png(prepared, 512, ROOT / "download" / "favicon-preview.png")

    print("\nGenerated files:")
    for p in [
        OUT_APP / "favicon.ico",
        OUT_APP / "icon.png",
        OUT_APP / "apple-icon.png",
        OUT_PUBLIC / "favicon-32x32.png",
        ROOT / "download" / "favicon-preview.png",
    ]:
        st = p.stat()
        print(f"  {p.relative_to(ROOT)}  ({st.st_size:,} bytes)")

    print("\nDone. Favicon set regenerated from user-supplied image.")


if __name__ == "__main__":
    main()
