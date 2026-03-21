# Browser Currency Converter (WASM)

This directory contains a browser adapter for running the currency converter as WebAssembly in the browser.

## Setup

### 1. Build the WASM Module

```bash
# From the currency-converter directory
cd /workspaces/UMA-code-examples/currency-converter

# Build for wasm32-wasip1 target
cargo build --target wasm32-wasip1 --release

# Copy the WASM file to the browser adapter directory
cp target/wasm32-wasip1/release/fx.wasm adapters/browser/
```

### 2. Serve the Files

You need a local web server (browsers block `fetch()` on `file://` URLs):

```bash
# From the browser adapter directory
cd currency-converter/adapters/browser

# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js (if http-server is installed)
npx http-server -p 8000

# Option 3: PHP
php -S localhost:8000
```

### 3. Open in Browser

Navigate to `http://localhost:8000` and try converting currencies!

## How It Works

1. **fx.js** - JavaScript module that:
   - Implements a minimal WASI polyfill for stdin/stdout/stderr
   - Loads the `fx.wasm` module
   - Passes JSON input via stdin
   - Captures JSON output from stdout
   - Handles WASI process exit codes

2. **index.html** - Simple UI with:
   - Currency selection dropdowns
   - Amount input field
   - Convert button that calls the WASM module
   - Result display

3. **fx.wasm** - Your compiled Rust binary running in the browser sandbox

## Browser Compatibility

Works in all modern browsers that support:
- WebAssembly
- ES6 modules
- TextEncoder/TextDecoder
- Fetch API

Tested on Chrome, Firefox, Safari, and Edge.

## Supported Currencies

The demo supports the same currency pairs as the native fx binary:
- USD ↔ EUR
- USD ↔ CAD
- EUR ↔ USD
- CAD ↔ USD

## File Size

The release WASM binary is typically ~200KB (unoptimized).
For production, consider:
- Using `wasm-opt` from the Binaryen toolkit
- Enabling LTO in Cargo.toml
- Compressing with gzip/brotli (reduces to ~50KB)
