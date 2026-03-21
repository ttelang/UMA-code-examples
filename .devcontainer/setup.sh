#!/bin/bash
set -e

echo "🦀 Setting up Rust development environment..."

# Install stable Rust toolchain with required components
echo "Installing Rust stable toolchain..."
rustup toolchain install stable --profile minimal --no-self-update
rustup default stable
rustup component add rustfmt clippy

# Add wasm32-wasip1 target
echo "Adding wasm32-wasip1 target..."
rustup target add wasm32-wasip1

# Install wasmtime
echo "Installing wasmtime v39.0.0..."
mkdir -p .bin
curl -L https://github.com/bytecodealliance/wasmtime/releases/download/v39.0.0/wasmtime-v39.0.0-x86_64-linux.tar.xz -o /tmp/wasmtime.tar.xz
tar -xf /tmp/wasmtime.tar.xz -C .bin
rm /tmp/wasmtime.tar.xz

# Add wasmtime to PATH permanently
WASMTIME_PATH="$PWD/.bin/wasmtime-v39.0.0-x86_64-linux"
if ! grep -q "wasmtime" ~/.bashrc; then
    echo "export PATH=\"\$PATH:$WASMTIME_PATH\"" >> ~/.bashrc
fi
if ! grep -q "wasmtime" ~/.zshrc 2>/dev/null; then
    echo "export PATH=\"\$PATH:$WASMTIME_PATH\"" >> ~/.zshrc
fi
export PATH="$PATH:$WASMTIME_PATH"

# Install cargo-llvm-cov for code coverage
echo "Installing cargo-llvm-cov..."
cargo install cargo-llvm-cov --locked

# Install jq for JSON processing
echo "Installing jq..."
sudo apt-get update -qq
sudo apt-get install -y jq

echo "✅ Rust development environment setup complete!"
echo ""
echo "Rust version: $(rustc --version)"
echo "Cargo version: $(cargo --version)"
echo "Wasmtime version: $(wasmtime --version)"
echo "cargo-llvm-cov version: $(cargo llvm-cov --version)"
echo "jq version: $(jq --version)"