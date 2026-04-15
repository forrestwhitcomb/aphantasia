#!/usr/bin/env bash
# ============================================================
# Aphantasia/System — Clean Slate Reset
# 
# USE THIS WHEN: The codebase has drifted too far from the
# prototype architecture. This script identifies and removes
# all unauthorized files, leaving only the 8 core files.
#
# SAFE: It shows what it will do and asks for confirmation.
# ============================================================

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "============================================================"
echo "  Aphantasia/System — Clean Slate Reset"
echo "============================================================"
echo ""

# The 8 canonical files (plus docs)
CANONICAL_TS_FILES=(
  "src/system/types.ts"
  "src/system/tokens.ts"
  "src/system/registry.ts"
  "src/system/store.tsx"
  "src/system/Renderer.tsx"
  "src/system/codegen.ts"
  "src/system/Editor.tsx"
  "src/app/system/page.tsx"
)

# Approved subdirectories (may or may not exist yet)
APPROVED_SUBDIRS=(
  "src/system/ai"
  "src/system/persistence"
  "src/system/dnd"
  "src/system/export"
  "src/app/system/api"
)

# Doc files we keep
DOC_FILES=(
  "src/system/APHANTASIA_SYSTEM_CONTEXT.md"
  "src/system/APHANTASIA_SYSTEM_IMPLEMENTATION_PLAN.md"
)

# ── Find unauthorized files ──────────────────────────────────

TO_DELETE=()

while IFS= read -r f; do
  # Skip doc files
  if echo "$f" | grep -qE "\.(md|txt)$"; then continue; fi
  
  # Check if it's a canonical file
  is_canonical=false
  for cf in "${CANONICAL_TS_FILES[@]}"; do
    if [ "$f" = "$cf" ]; then is_canonical=true; break; fi
  done
  if $is_canonical; then continue; fi
  
  # Check if it's in an approved subdirectory
  is_approved=false
  for dir in "${APPROVED_SUBDIRS[@]}"; do
    if echo "$f" | grep -q "^$dir/"; then is_approved=true; break; fi
  done
  if $is_approved; then continue; fi
  
  # Check if it's a layout.tsx (acceptable)
  if [ "$f" = "src/app/system/layout.tsx" ]; then continue; fi
  
  # This file is unauthorized
  TO_DELETE+=("$f")
  
done < <(find src/system/ src/app/system/ \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.css" -o -name "*.module.css" \) 2>/dev/null | sort)

# ── Report ───────────────────────────────────────────────────

echo -e "${GREEN}Canonical files (keeping):${NC}"
for f in "${CANONICAL_TS_FILES[@]}"; do
  if [ -f "$f" ]; then
    echo "  ✓ $f"
  else
    echo -e "  ${RED}✗ $f (MISSING!)${NC}"
  fi
done

echo ""

if [ ${#TO_DELETE[@]} -eq 0 ]; then
  echo -e "${GREEN}No unauthorized files found. Architecture is clean.${NC}"
  exit 0
fi

echo -e "${RED}Unauthorized files to DELETE (${#TO_DELETE[@]}):${NC}"
for f in "${TO_DELETE[@]}"; do
  size=$(wc -l < "$f" 2>/dev/null || echo "?")
  echo -e "  ${RED}✗${NC} $f ($size lines)"
done

echo ""

# ── Also check for suspicious imports in canonical files ─────

echo -e "${YELLOW}Checking canonical files for imports from deleted files...${NC}"
IMPORT_WARNINGS=0

for f in "${CANONICAL_TS_FILES[@]}"; do
  if [ ! -f "$f" ]; then continue; fi
  
  while IFS= read -r line; do
    path=$(echo "$line" | grep -oP "from ['\"]([^'\"]+)['\"]" | sed "s/from ['\"]//;s/['\"]//")
    if [ -z "$path" ]; then continue; fi
    
    # Resolve relative imports
    if echo "$path" | grep -qE "^\."; then
      dir=$(dirname "$f")
      # Check if the resolved file is being deleted
      for del in "${TO_DELETE[@]}"; do
        base=$(basename "$del" | sed 's/\.[^.]*$//')
        if echo "$path" | grep -q "$base"; then
          echo -e "  ${YELLOW}⚠${NC}  $f imports from '$path' — target is being deleted!"
          echo "       You'll need to remove or replace this import."
          ((IMPORT_WARNINGS++))
        fi
      done
    fi
  done < <(grep "^import" "$f" 2>/dev/null || true)
done

if [ $IMPORT_WARNINGS -eq 0 ]; then
  echo -e "  ${GREEN}No broken import dependencies detected.${NC}"
fi

echo ""

# ── Confirm ──────────────────────────────────────────────────

echo -e "${YELLOW}This will permanently delete ${#TO_DELETE[@]} files.${NC}"
echo "Type 'yes' to proceed, anything else to abort:"
read -r confirm

if [ "$confirm" != "yes" ]; then
  echo "Aborted."
  exit 0
fi

# ── Delete ───────────────────────────────────────────────────

for f in "${TO_DELETE[@]}"; do
  rm -f "$f"
  echo -e "  ${RED}Deleted:${NC} $f"
done

# Clean up empty directories
find src/system/ src/app/system/ -type d -empty -delete 2>/dev/null || true

echo ""
echo -e "${GREEN}Clean slate complete.${NC}"
echo "Run ./scripts/system-audit.sh to verify."
echo "Then fix any broken imports in canonical files if flagged above."
