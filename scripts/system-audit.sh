#!/usr/bin/env bash
# ============================================================
# Aphantasia/System — Architecture Audit Script
# Run this BEFORE every coding session.
# Flags violations, dead files, and architectural drift.
# ============================================================

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

error() { echo -e "${RED}ERROR:${NC} $1"; ERRORS=$((ERRORS+1)); }
warn()  { echo -e "${YELLOW}WARN:${NC}  $1"; WARNINGS=$((WARNINGS+1)); }
ok()    { echo -e "${GREEN}OK:${NC}    $1"; }
info()  { echo -e "${BLUE}INFO:${NC}  $1"; }

echo ""
echo "============================================================"
echo "  Aphantasia/System — Architecture Audit"
echo "============================================================"
echo ""

# ── 1. Check core files exist ────────────────────────────────

info "Checking core files..."

CORE_FILES=(
  "src/app/system/page.tsx"
  "src/system/types.ts"
  "src/system/tokens.ts"
  "src/system/registry.ts"
  "src/system/store.tsx"
  "src/system/Renderer.tsx"
  "src/system/codegen.ts"
  "src/system/Editor.tsx"
)

for f in "${CORE_FILES[@]}"; do
  if [ -f "$f" ]; then
    ok "$f exists"
  else
    error "$f MISSING — this is a core file!"
  fi
done

# ── 2. Find unauthorized files in src/system/ ────────────────

info ""
info "Checking for unauthorized files in src/system/..."

APPROVED_DIRS="ai|persistence|dnd|export"

while IFS= read -r f; do
  # Get path relative to src/system/
  rel="${f#src/system/}"
  
  # Skip core files
  is_core=false
  for cf in "${CORE_FILES[@]}"; do
    if [ "$f" = "$cf" ]; then is_core=true; break; fi
  done
  if $is_core; then continue; fi
  
  # Skip approved subdirectories
  if echo "$rel" | grep -qE "^($APPROVED_DIRS)/"; then
    ok "$f (approved subdirectory)"
    continue
  fi
  
  # Skip doc files
  if echo "$f" | grep -qE "\.(md|txt)$"; then continue; fi
  
  # Anything else is unauthorized
  error "UNAUTHORIZED FILE: $f — not in the approved architecture!"
  
done < <(find src/system/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | sort)

# Also check src/app/system/ for unauthorized routes
while IFS= read -r f; do
  rel="${f#src/app/system/}"
  if [ "$f" = "src/app/system/page.tsx" ]; then continue; fi
  if echo "$rel" | grep -qE "^api/"; then
    ok "$f (approved API route)"
    continue
  fi
  # layout.tsx is acceptable
  if [ "$rel" = "layout.tsx" ]; then continue; fi
  
  warn "Unexpected file in app/system/: $f — verify this is intentional"
  
done < <(find src/app/system/ -name "*.ts" -o -name "*.tsx" 2>/dev/null | sort)

# ── 3. Check for imports from outside src/system/ ────────────

info ""
info "Checking for unauthorized imports..."

# Allowed external packages
ALLOWED_IMPORTS="react|next|lucide-react|@anthropic-ai/sdk"

while IFS= read -r f; do
  # Find all import lines
  while IFS= read -r line; do
    # Extract the import path
    path=$(echo "$line" | grep -oE "from ['\"][^'\"]+['\"]" 2>/dev/null | sed "s/from ['\"]//;s/['\"]$//" || true)
    if [ -z "$path" ]; then continue; fi
    
    # @/system/* and @/app/system/* aliases resolve inside the allowed tree
    if echo "$path" | grep -qE "^@/system/|^@/app/system/"; then
      continue
    fi

    # Relative imports within system are fine
    if echo "$path" | grep -qE "^\./|^\.\./" ; then
      # But check they don't escape src/system/
      if echo "$path" | grep -qE "^\.\./\.\./|^\.\./[^.]"; then
        # Might escape — check if it goes outside system
        dir=$(dirname "$f")
        # Portable path normalization (macOS realpath lacks -m)
        resolved=$(python3 -c "import os,sys; print(os.path.normpath(os.path.join(sys.argv[1], sys.argv[2])))" "$dir" "$path" 2>/dev/null || echo "UNRESOLVED")
        if ! echo "$resolved" | grep -q "src/system"; then
          error "IMPORT ESCAPE in $f: imports '$path' which resolves to '$resolved' (outside src/system/)"
        fi
      fi
      continue
    fi

    # Check against allowed external packages
    if echo "$path" | grep -qE "^($ALLOWED_IMPORTS)"; then
      continue
    fi

    # Server-side files can import Node builtins
    if echo "$f" | grep -qE "api/" && echo "$path" | grep -qE "^(fs|path|crypto|stream|url)$"; then
      continue
    fi

    error "UNAUTHORIZED IMPORT in $f: '$path' — only react, next, lucide-react, @anthropic-ai/sdk allowed"

  done < <(grep -nE "^[[:space:]]*import[[:space:]]" "$f" 2>/dev/null || true)
  
done < <(find src/system/ src/app/system/ -name "*.ts" -o -name "*.tsx" 2>/dev/null)

# ── 4. Check for Tailwind classes in editor chrome ───────────

info ""
info "Checking for Tailwind classes in editor chrome..."

for f in src/system/Editor.tsx src/system/Renderer.tsx; do
  if [ ! -f "$f" ]; then continue; fi
  
  # Look for className= that isn't inside a string template (code gen)
  # This is a heuristic — flag for review
  count=$(grep -c "className=" "$f" 2>/dev/null) || count=0
  if [ "$count" -gt 0 ]; then
    warn "$f has $count className= occurrences — verify these are only in generated code strings, not editor chrome"
  else
    ok "$f — no className usage"
  fi
done

# ── 5. Check EditorAction completeness ───────────────────────

info ""
info "Checking EditorAction ↔ reducer sync..."

if [ -f "src/system/types.ts" ] && [ -f "src/system/store.tsx" ]; then
  # Extract action type strings from types.ts
  types_actions=$(grep -oE 'type:[[:space:]]*"[A-Z_]+"' src/system/types.ts 2>/dev/null | grep -oE '"[A-Z_]+"' | tr -d '"' | sort -u || true)
  
  # Extract case strings from store.tsx reducer
  reducer_cases=$(grep -oE 'case[[:space:]]*"[A-Z_]+"' src/system/store.tsx 2>/dev/null | grep -oE '"[A-Z_]+"' | tr -d '"' | sort -u || true)
  
  # Find actions defined but not handled
  while IFS= read -r action; do
    if ! echo "$reducer_cases" | grep -q "^${action}$"; then
      warn "Action '$action' defined in types.ts but no case in reducer"
    fi
  done <<< "$types_actions"
  
  # Find cases handled but not defined
  while IFS= read -r action; do
    if ! echo "$types_actions" | grep -q "^${action}$"; then
      warn "Reducer handles '$action' but it's not in EditorAction type"
    fi
  done <<< "$reducer_cases"
  
  ok "EditorAction sync check complete"
fi

# ── 6. Check for common anti-patterns ────────────────────────

info ""
info "Checking for anti-patterns..."

# console.log left in code
for f in $(find src/system/ src/app/system/ -name "*.ts" -o -name "*.tsx" 2>/dev/null); do
  count=$(grep -c "console\.log" "$f" 2>/dev/null) || count=0
  if [ "$count" -gt 0 ]; then
    warn "$f has $count console.log statements — remove before commit"
  fi
done

# 'any' type usage
for f in $(find src/system/ src/app/system/ -name "*.ts" -o -name "*.tsx" 2>/dev/null); do
  count=$(grep -cE ":[[:space:]]*any[^A-Za-z]|as[[:space:]]+any[^A-Za-z]|<any>" "$f" 2>/dev/null) || count=0
  if [ "$count" -gt 0 ]; then
    warn "$f has $count 'any' type usages — use 'unknown' and narrow instead"
  fi
done

# useState for things that should be in reducer
for f in src/system/Editor.tsx; do
  if [ ! -f "$f" ]; then continue; fi
  state_count=$(grep -c "useState" "$f" 2>/dev/null) || state_count=0
  if [ "$state_count" -gt 15 ]; then
    warn "$f has $state_count useState calls — review if any should be EditorState/reducer actions instead"
  fi
done

# ── 7. Check for stale/orphan imports ────────────────────────

info ""
info "Checking for potentially stale imports..."

for f in $(find src/system/ -name "*.ts" -o -name "*.tsx" 2>/dev/null); do
  # Very rough check: imported names not used elsewhere in file
  while IFS= read -r line; do
    # Extract imported names (simple heuristic)
    names=$(echo "$line" | grep -oE "import[[:space:]]*\{[^}]+\}" 2>/dev/null | sed 's/import[[:space:]]*{//;s/}//' | tr ',' '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | grep -v "^type " | grep -v "^$" || true)
    for name in $names; do
      clean=$(echo "$name" | sed 's/ as .*//')
      # Count occurrences (excluding the import line itself)
      uses=$(grep -c "$clean" "$f" 2>/dev/null) || uses=0
      if [ "$uses" -le 1 ]; then
        warn "Potentially unused import '$clean' in $f"
      fi
    done
  done < <(grep "^import" "$f" 2>/dev/null || true)
done

# ── 8. TypeScript compilation ────────────────────────────────

info ""
info "Running TypeScript check..."

if command -v npx &> /dev/null && [ -f "tsconfig.json" ]; then
  if npx tsc --noEmit 2>/dev/null; then
    ok "TypeScript compiles cleanly"
  else
    error "TypeScript compilation FAILED — fix type errors before proceeding"
    npx tsc --noEmit 2>&1 | head -20
  fi
else
  warn "Cannot run TypeScript check (npx or tsconfig.json not found)"
fi

# ── Summary ──────────────────────────────────────────────────

echo ""
echo "============================================================"
if [ $ERRORS -gt 0 ]; then
  echo -e "  ${RED}FAILED${NC} — $ERRORS errors, $WARNINGS warnings"
  echo "  Fix all errors before starting your task."
  echo "============================================================"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo -e "  ${YELLOW}PASSED WITH WARNINGS${NC} — $WARNINGS warnings"
  echo "  Review warnings. Proceed with caution."
  echo "============================================================"
  exit 0
else
  echo -e "  ${GREEN}PASSED${NC} — Architecture is clean"
  echo "============================================================"
  exit 0
fi
