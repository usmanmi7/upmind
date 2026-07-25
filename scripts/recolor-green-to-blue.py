#!/usr/bin/env python3
"""
Global color replacement across src/ — converts Upmind green palette to blue.

Color mapping (order matters - longest/most specific first):

  #6BE000  -> #2563EB    (electric hover green -> blue-600)
  #7CFC00  -> #3B82F6    (electric green -> blue-500, medium blue)
  #8FBC8F  -> #93C5FD    (light cyan-green -> blue-300)
  #C8E6C9  -> #DBEAFE    (very light green -> blue-100, lightest blue)
  #3D5A3D  -> #2D4A8F    (purple-light green -> blue-800)
  #2D4A2D  -> #1E3A8A    (navy-light green -> blue-900)
  #1A2E1A  -> #0F1B3D    (navy dark green -> deep navy blue)
  #0F1F0F  -> #0A1228    (footer dark green -> very dark blue)
  #0A150A  -> #0A1228    (very dark green -> very dark blue)
  #243824  -> #1E3A8A    (hover dark green -> deep blue hover)

Also handles rgba() variants of #7CFC00.
"""
import os
import re
import sys

ROOT = "/home/z/my-project/src"

# Order matters: longer/more specific first to avoid partial replacement.
# Use regex with case-insensitive matching.
REPLACEMENTS = [
    # rgba(...) variants first (longer patterns)
    (re.compile(r"rgba\(\s*124\s*,\s*252\s*,\s*0\s*,", re.IGNORECASE), "rgba(59, 130, 246,"),
    (re.compile(r"rgba\(\s*143\s*,\s*188\s*,\s*143\s*,", re.IGNORECASE), "rgba(147, 197, 253,"),
    (re.compile(r"rgba\(\s*200\s*,\s*230\s*,\s*201\s*,", re.IGNORECASE), "rgba(219, 234, 254,"),
    (re.compile(r"rgba\(\s*26\s*,\s*46\s*,\s*26\s*,", re.IGNORECASE), "rgba(15, 27, 61,"),
    # hex codes - longest first
    (re.compile(r"#6BE000\b", re.IGNORECASE), "#2563EB"),
    (re.compile(r"#7CFC00\b", re.IGNORECASE), "#3B82F6"),
    (re.compile(r"#8FBC8F\b", re.IGNORECASE), "#93C5FD"),
    (re.compile(r"#C8E6C9\b", re.IGNORECASE), "#DBEAFE"),
    (re.compile(r"#3D5A3D\b", re.IGNORECASE), "#2D4A8F"),
    (re.compile(r"#2D4A2D\b", re.IGNORECASE), "#1E3A8A"),
    (re.compile(r"#1A2E1A\b", re.IGNORECASE), "#0F1B3D"),
    (re.compile(r"#0F1F0F\b", re.IGNORECASE), "#0A1228"),
    (re.compile(r"#0A150A\b", re.IGNORECASE), "#0A1228"),
    (re.compile(r"#243824\b", re.IGNORECASE), "#1E3A8A"),
]

EXCLUDE_DIRS = {"node_modules", ".next", ".git", "scripts", "tool-results"}
EXCLUDE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webp", ".pdf"}

changed_files = []
total_replacements = 0

for dirpath, dirnames, filenames in os.walk(ROOT):
    # Skip excluded dirs in-place
    dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
    for filename in filenames:
        _, ext = os.path.splitext(filename)
        if ext.lower() in EXCLUDE_EXTS:
            continue
        filepath = os.path.join(dirpath, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                original = f.read()
        except (UnicodeDecodeError, PermissionError):
            continue

        modified = original
        file_changes = 0
        for pattern, replacement in REPLACEMENTS:
            modified, count = pattern.subn(replacement, modified)
            file_changes += count

        if file_changes > 0:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(modified)
            changed_files.append((filepath, file_changes))
            total_replacements += file_changes

print(f"\n✓ Replaced colors in {len(changed_files)} files")
print(f"✓ Total individual replacements: {total_replacements}\n")
print("Top 20 files by change count:")
changed_files.sort(key=lambda x: -x[1])
for path, count in changed_files[:20]:
    rel = path.replace("/home/z/my-project/", "")
    print(f"  {count:>4}  {rel}")
