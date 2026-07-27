#!/usr/bin/env python3
"""
Remove em-dashes (—) from all source files under src/.
Strategy:
  - ' — ' (space em-dash space)  -> ', '   (most common — pause/clarification)
  - '— ' (em-dash + space)       -> ', '   (rare)
  - ' —' (space + em-dash)       -> ','    (rare)
  - standalone '—'               -> ','    (last resort)

Skips the regex literal on ai-prompt.ts:176 (the line that strips em-dashes
from AI output) — that one must keep its em-dash or the regex breaks.
"""
import os
import re

ROOT = "/home/z/my-project/src"
SKIP_LINES_PATTERNS = [
    r'\.replace\(/—/g',  # the regex literal in ai-prompt.ts
]

# File extensions to process
EXTS = (".ts", ".tsx", ".js", ".jsx", ".md", ".json")

changed_files = []
total_replacements = 0


def transform_line(line: str) -> tuple[str, int]:
    # Skip lines that match skip patterns (e.g. the regex literal)
    for pat in SKIP_LINES_PATTERNS:
        if re.search(pat, line):
            return line, 0

    count = line.count("—")
    if count == 0:
        return line, 0

    new = line
    new = new.replace(" — ", ", ")
    new = new.replace("— ", ", ")
    new = new.replace(" —", ",")
    new = new.replace("—", ",")

    replaced = count - new.count("—")
    return new, replaced


for dirpath, dirnames, filenames in os.walk(ROOT):
    for fname in filenames:
        if not fname.endswith(EXTS):
            continue
        fpath = os.path.join(dirpath, fname)
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
        except (UnicodeDecodeError, OSError):
            continue

        if "—" not in content:
            continue

        lines = content.split("\n")
        new_lines = []
        file_replacements = 0
        for line in lines:
            new_line, n = transform_line(line)
            new_lines.append(new_line)
            file_replacements += n

        if file_replacements == 0:
            continue

        new_content = "\n".join(new_lines)
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_content)
        changed_files.append((fpath, file_replacements))
        total_replacements += file_replacements

print(f"\nProcessed {len(changed_files)} files, {total_replacements} em-dashes replaced.")
for path, n in sorted(changed_files):
    print(f"  {n:4d}  {path}")
