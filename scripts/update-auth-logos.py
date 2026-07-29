#!/usr/bin/env python3
"""Replace the gradient-box logo with an Image component in auth pages."""

import re
from pathlib import Path

OLD_LOGO_BLOCK = '''<Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center">
              <span className="font-bold text-lg text-white">E</span>
            </div>'''

NEW_LOGO_BLOCK = '''<Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Enginest logo"
              width={40}
              height={40}
              priority
              className="rounded-lg"
            />'''

OLD_IMPORT = 'import Link from "next/link"'
NEW_IMPORT = 'import Link from "next/link"\nimport Image from "next/image"'

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
    changed = False

    if OLD_LOGO_BLOCK in text:
        text = text.replace(OLD_LOGO_BLOCK, NEW_LOGO_BLOCK)
        changed = True
        print(f"  - Replaced logo block in {path.name}")

    if OLD_IMPORT in text and 'import Image from "next/image"' not in text:
        text = text.replace(OLD_IMPORT, NEW_IMPORT, 1)
        changed = True
        print(f"  - Added Image import in {path.name}")

    if changed:
        path.write_text(text)
        print(f"OK: {path}")
    else:
        print(f"NOOP: {path}")
