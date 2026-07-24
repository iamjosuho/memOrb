#!/bin/bash
# Reset local test sandbox directory cleanly from fixtures
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "🧹 Clearing sandbox..."
rm -rf "$REPO_ROOT/sandbox"

if [ "$1" == "--empty" ] || [ "$1" == "-e" ]; then
  mkdir -p "$REPO_ROOT/sandbox"
  echo "✅ Empty Sandbox created cleanly! Ready to test /born skill initialization from scratch."
else
  mkdir -p "$REPO_ROOT/sandbox/memorbs"
  echo "📋 Copying fixtures to sandbox/memorbs..."
  cp -r "$REPO_ROOT/fixtures/memorbs/"* "$REPO_ROOT/sandbox/memorbs/"
  echo "✅ Sandbox reset cleanly! You can now run agent skills inside ./sandbox without polluting git status."
fi
