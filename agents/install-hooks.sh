#!/usr/bin/env bash
# install-hooks.sh — Install git hooks from agents/ into .git/hooks/
#
# Usage: bash agents/install-hooks.sh
#
# Idempotent: safe to run multiple times.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOKS_DIR="$PROJECT_ROOT/.git/hooks"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓  $*${NC}"; }
info() { echo -e "${YELLOW}→  $*${NC}"; }

if [ ! -d "$HOOKS_DIR" ]; then
  echo "Error: .git/hooks directory not found. Are you in a git repository?"
  exit 1
fi

# ── Install pre-commit hook ──────────────────────────────────────────────────
SOURCE="$SCRIPT_DIR/pre-commit"
TARGET="$HOOKS_DIR/pre-commit"

if [ ! -f "$SOURCE" ]; then
  echo "Error: agents/pre-commit not found."
  exit 1
fi

if [ -f "$TARGET" ]; then
  # Back up existing hook
  BACKUP="$TARGET.backup.$(date +%s)"
  cp "$TARGET" "$BACKUP"
  info "Backed up existing pre-commit hook to $BACKUP"
fi

cp "$SOURCE" "$TARGET"
chmod +x "$TARGET"
ok "Installed pre-commit hook → .git/hooks/pre-commit"

echo ""
echo "The hook will warn you before commits if there are uncatalogued design images."
echo "It does NOT block commits — run '/update-design-projects' to catalogue them."
echo ""
echo "To uninstall: rm .git/hooks/pre-commit"
