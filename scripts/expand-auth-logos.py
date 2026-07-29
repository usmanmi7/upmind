#!/usr/bin/env python3
"""Replace auth page logo with bigger image-only logo (no Enginest text)."""

import re
from pathlib import Path

# Old block pattern: Image at 40x40 + Enginest text span
OLD_PATTERN = re.compile(
    r'<Image\s*\n\s*src="/images/logo\.png"\s*\n\s*alt="Enginest logo"\s*\n\s*width=\{40\}\s*\n\s*height=\{40\}\s*\n\s*priority\s*\n\s*className="rounded-lg"\s*\n\s*/>\s*\n\s*<span className="text-2xl font-bold font-heading text-\[#0F1B3D\] dark:text-white">\s*\n\s*Enginest\s*\n\s*</span>',
    re.DOTALL,
)

NEW_BLOCK = '''<Image
              src="/images/logo.png"
              alt="Enginest logo"
              width={240}
              height={96}
              priority
              className="h-16 w-auto"
            />'''

AUTH_PAGES = [
    "/home/z/my-project/src/app/auth/login/page.tsx",
    "/home/z/my-project/src/app/auth/signup/page.tsx",
    "/home/z/my-project/src/app/auth/onboarding/page.tsx",
    "/home/z/my-project/src/app/auth/forgot-password/page.tsx",
]

for path_str in AUTH_PAGES:
    path = Path(path_str)
    if not path.exists():
        print(f"SKIP (missing): {path}")
        continue
    text = path.read_text()
    new_text, n = OLD_PATTERN.subn(NEW_BLOCK, text)
    if n > 0:
        path.write_text(new_text)
        print(f"OK ({n} replacement): {path}")
    else:
        print(f"NOOP: {path}")
