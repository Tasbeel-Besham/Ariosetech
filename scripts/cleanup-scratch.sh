#!/usr/bin/env bash
# Removes leftover scratch/snapshot files that are not part of the app.
# Safe: none of these are imported by any code. Run from the project root:
#   bash scripts/cleanup-scratch.sh

set -e
cd "$(dirname "$0")/.."

files=(
  "vercel.html"
  "wordpress.html"
  "wordpress-new.html"
  "wordpress-newest.html"
  "live-css.css"
  "old_globals.css"
  "old_hero.tsx"
)

removed=0
for f in "${files[@]}"; do
  if [ -f "$f" ]; then
    rm -f "$f"
    echo "removed $f"
    removed=$((removed+1))
  fi
done

echo "Done. Removed $removed scratch file(s)."
echo "Note: components/ui/ScrollReveal.tsx and TypingTerminal.tsx were also unused and have already been deleted in the code update."
