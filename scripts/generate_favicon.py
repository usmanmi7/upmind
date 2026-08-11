"""
Generate Enginest favicon set:
- src/app/favicon.ico      (multi-resolution ICO: 16, 32, 48)
- src/app/icon.png         (512x512 PNG)
- src/app/apple-icon.png   (180x180 PNG)
- public/favicon-32x32.png (32x32 PNG, used by some legacy paths)

Design: navy bg (#0F1B3D) with a bold "E" letter-mark in soft blue (#93C5FD)
on a rounded square. A small accent dot in the brand blue (#3B82F6) sits in
the bottom-right corner as a subtle "innovation spark".
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math

# ---- Brand ----
NAVY = (15, 27, 61, 255)        # #0F1B3D
SOFT_BLUE = (147, 197, 253, 255)  # #93C5FD
ACCENT_BLUE = (59, 130, 246, 255) # #3B82F6

ROOT = Path("/home/z/my-project")
OUT_APP = ROOT / "src" / "app"
OUT_PUBLIC = ROOT / "public"

# ---- Font ----
# Use the largest available weight of Inter / Noto Sans for a chunky letter mark.
FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/chinese/NotoSansSC-Regular.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]


def load_font(size: int):
    for p in FONT_CANDIDATES:
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


def rounded_rect_mask(size: int, radius: int) -> Image.Image:
    """Return an L mask for a rounded-square of given size & corner radius."""
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    return mask


def render_letter_mark(size: int) -> Image.Image:
    """Render the Enginest 'E' mark at the given pixel size."""
    # Work at 4x then downsample for crisp edges on small sizes.
    scale = 4 if size < 128 else 2
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))

    # Rounded-square navy background (corner radius ~22% of size)
    radius = int(s * 0.22)
    bg = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bg)
    bd.rounded_rectangle((0, 0, s - 1, s - 1), radius=radius, fill=NAVY)
    mask = rounded_rect_mask(s, radius)
    img.paste(bg, (0, 0), mask)

    # Subtle gradient overlay (top-left lighter, bottom-right darker)
    grad = Image.new("L", (s, s), 0)
    gd = ImageDraw.Draw(grad)
    for i in range(s):
        # 0 at top-left, 255 at bottom-right
        v = int(255 * (i / s) * 0.18)
        gd.line([(i, 0), (i, s - 1)], fill=v)
    # Apply grad as a subtle dark overlay on the navy
    overlay = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rectangle((0, 0, s - 1, s - 1), fill=(0, 0, 0, 80))
    img.paste(overlay, (0, 0), grad)

    # 'E' letter mark
    font_size = int(s * 0.62)
    font = load_font(font_size)
    d = ImageDraw.Draw(img)
    # Measure the glyph
    try:
        bbox = d.textbbox((0, 0), "E", font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
    except AttributeError:
        # Older PIL fallback
        tw, th = d.textsize("E", font=font)
    # Center the visible glyph (bbox top-left isn't always 0,0)
    x = (s - tw) // 2 - bbox[0]
    y = (s - th) // 2 - bbox[1]
    # Draw a subtle drop shadow first (offset down-right, soft)
    shadow = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.text((x + int(s * 0.015), y + int(s * 0.015)), "E", font=font, fill=(0, 0, 0, 110))
    img = Image.alpha_composite(img, shadow)
    d = ImageDraw.Draw(img)
    # Main E in soft blue
    d.text((x, y), "E", font=font, fill=SOFT_BLUE)

    # Accent dot in bottom-right (the "innovation spark")
    dot_r = int(s * 0.085)
    cx = s - int(s * 0.20)
    cy = s - int(s * 0.20)
    d.ellipse(
        (cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r),
        fill=ACCENT_BLUE,
    )

    # Downsample to target size with high-quality LANCZOS
    return img.resize((size, size), Image.LANCZOS)


def save_png(img: Image.Image, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG", optimize=True)


def save_ico(sizes: list[int], path: Path):
    """Build a multi-resolution ICO file.

    PIL's ICO saver takes a single source image and creates one entry per
    requested size by resampling. Pass the largest size as the source so
    downsampling is high-quality (never upscale).
    """
    max_size = max(sizes)
    src = render_letter_mark(max_size)
    path.parent.mkdir(parents=True, exist_ok=True)
    src.save(
        path,
        format="ICO",
        sizes=[(s, s) for s in sizes],
    )


def main():
    # 1. Multi-res ICO for favicon.ico
    save_ico([16, 32, 48], OUT_APP / "favicon.ico")

    # 2. 512x512 PNG for icon.png (Next.js metadata icon)
    save_png(render_letter_mark(512), OUT_APP / "icon.png")

    # 3. 180x180 PNG for apple-icon.png
    save_png(render_letter_mark(180), OUT_APP / "apple-icon.png")

    # 4. Legacy 32x32 in /public
    save_png(render_letter_mark(32), OUT_PUBLIC / "favicon-32x32.png")

    # Quick sanity report
    for p in [
        OUT_APP / "favicon.ico",
        OUT_APP / "icon.png",
        OUT_APP / "apple-icon.png",
        OUT_PUBLIC / "favicon-32x32.png",
    ]:
        st = p.stat()
        print(f"  {p.relative_to(ROOT)}  ({st.st_size:,} bytes)")

    print("\nDone. Favicon set regenerated.")


if __name__ == "__main__":
    main()
