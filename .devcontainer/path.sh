# Add local wasmtime to PATH
# Source this file in new shells: source .devcontainer/path.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
WASMTIME_PATH="$WORKSPACE_DIR/.bin/wasmtime-v39.0.0-x86_64-linux"

if [ -d "$WASMTIME_PATH" ]; then
    export PATH="$PATH:$WASMTIME_PATH"
    echo "✓ Added wasmtime to PATH: $WASMTIME_PATH"
else
    echo "⚠ Wasmtime not found at: $WASMTIME_PATH"
    echo "Run: bash .devcontainer/setup.sh"
fi
