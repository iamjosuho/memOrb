#!/usr/bin/env bash
#
# Installs memOrb's tracked git hooks (scripts/git-hooks/*) into .git/hooks/,
# so `git commit` automatically runs scripts/lint-skills.js.
#
# .git/hooks/ is never version-controlled, so this script is the one-time
# (idempotent) bridge that wires the tracked hook source into the local repo.
# It runs automatically on `npm install` via the "prepare" lifecycle script
# in package.json, and can also be run manually any time:
#
#   bash scripts/install-hooks.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOKS_SRC_DIR="$REPO_ROOT/scripts/git-hooks"
HOOKS_DEST_DIR="$REPO_ROOT/.git/hooks"

if [ ! -d "$REPO_ROOT/.git" ]; then
  echo "ℹ️  Not a git repository (no .git/ found) — skipping hook installation."
  exit 0
fi

mkdir -p "$HOOKS_DEST_DIR"

installed=0
for hook_path in "$HOOKS_SRC_DIR"/*; do
  [ -f "$hook_path" ] || continue
  hook_name="$(basename "$hook_path")"
  dest_path="$HOOKS_DEST_DIR/$hook_name"

  cp "$hook_path" "$dest_path"
  chmod +x "$dest_path"
  installed=$((installed + 1))
  echo "✓ Installed git hook: $hook_name"
done

if [ "$installed" -eq 0 ]; then
  echo "ℹ️  No hooks found in $HOOKS_SRC_DIR"
else
  echo "✅ $installed git hook(s) installed. 'git commit' will now run scripts/lint-skills.js automatically."
fi
