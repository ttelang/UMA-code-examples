# Currency Converter - Universal Microservices Example

A demonstration of Universal Microservices Architecture (UMA) principles using a simple currency converter that runs identically across multiple execution environments.

## Overview

This example showcases UMA's core principle: **write once, deploy anywhere**. The same Rust code, compiled to WebAssembly (WASM), runs with identical behavior across:

- **Native** execution (development, CLI tools)
- **WASI runtimes** (wasmtime, wasmer)
- **Browsers** (client-side with WASI polyfill)
- **Edge computing** platforms (Cloudflare Workers, Fastly Compute, Vercel)
- **Cloud serverless** functions (AWS Lambda, Google Cloud Functions, Azure Functions)
- **Cloud containers** (Cloud Run, ECS/Fargate, ACI)

## Features

- Pure Rust implementation with no runtime dependencies
- JSON input/output via stdin/stdout (WASI-compatible)
- Fixed exchange rate table (USD, EUR, CAD)
- Proper error handling with exit codes
- ~200KB WASM binary (unoptimized)
- Sub-millisecond execution time

## Quick Start

### Build Native Binary

```bash
cargo build --release
echo '{"from":"USD","to":"EUR","amount":100}' | ./target/release/fx
```

### Build WASM Binary

```bash
# Add wasm32-wasip1 target (first time only)
rustup target add wasm32-wasip1

# Build for WASM
cargo build --target wasm32-wasip1 --release

# Run with wasmtime
echo '{"from":"USD","to":"EUR","amount":100}' | \
  wasmtime run target/wasm32-wasip1/release/fx.wasm
```

### Run in Browser

```bash
# Build WASM binary (see above)
cp target/wasm32-wasip1/release/fx.wasm adapters/browser/

# Start local web server
cd adapters/browser
python3 -m http.server 8000

# Open http://localhost:8000
```

## Project Structure

```
currency-converter/
├── Cargo.toml              # Rust project configuration
├── fx.rs                   # Core currency converter logic
├── README.md               # This file
├── adapters/
│   └── browser/            # Browser adapter with WASI polyfill
│       ├── index.html      # Web UI
│       ├── fx.js           # WASI polyfill implementation
│       └── README.md       # Browser adapter guide
└── docs/
    └── deployment-guide.adoc  # Comprehensive deployment documentation
```

## API Contract

### Input (JSON via stdin)

```json
{
  "from": "USD",
  "to": "EUR",
  "amount": 100.0
}
```

### Output (JSON via stdout)

```json
{
  "from": "USD",
  "to": "EUR",
  "amount": 100.0,
  "rate": 0.92,
  "result": 92.0
}
```

### Error Responses

```json
{"error": "bad input"}           // Exit code 1: Invalid JSON
{"error": "unsupported pair"}    // Exit code 2: Currency pair not supported
```

Exit code 3: Output write error  
Exit code 4: Input read error

## Supported Currency Pairs

- USD ↔ EUR
- USD ↔ CAD
- EUR ↔ USD
- CAD ↔ USD
- Any currency to itself (rate 1.0)

## Deployment Options

This example demonstrates UMA's universal portability. See the comprehensive [deployment guide](docs/deployment-guide.adoc) for detailed instructions on deploying to:

### Edge Computing
- Cloudflare Workers
- Fastly Compute@Edge
- Vercel Edge Functions
- AWS Lambda@Edge
- Deno Deploy

### Cloud Platforms
- AWS Lambda (with API Gateway)
- Google Cloud Functions
- Azure Functions
- Google Cloud Run
- AWS ECS/Fargate
- Azure Container Instances

### Local/Browser
- Native binary (Linux, macOS, Windows)
- Wasmtime/Wasmer runtime
- Browser (client-side with WASI polyfill)

## Performance Characteristics

| Environment | Cold Start | Execution Time | Binary Size |
|-------------|------------|----------------|-------------|
| Native | N/A | < 1ms | ~2MB |
| Wasmtime | < 10ms | < 5ms | ~200KB |
| Browser | < 5ms | < 10ms | ~200KB |
| Edge (Cloudflare) | < 1ms | < 5ms | ~200KB |
| Cloud Serverless | 50-1000ms | < 10ms | ~200KB |

## Development

### Running Tests

```bash
# Test native build
cargo test

# Test with different inputs
echo '{"from":"USD","to":"EUR","amount":100}' | cargo run
echo '{"from":"CAD","to":"USD","amount":50}' | cargo run
echo '{"from":"EUR","to":"EUR","amount":100}' | cargo run
```

### Error Handling Tests

```bash
# Test invalid JSON (exit code 1)
echo 'invalid json' | cargo run
echo $?  # Should output 1

# Test unsupported pair (exit code 2)
echo '{"from":"USD","to":"JPY","amount":100}' | cargo run
echo $?  # Should output 2
```

### Optimizing WASM Binary

```bash
# Build with size optimization
cargo build --target wasm32-wasip1 --release

# Further optimize with wasm-opt
wasm-opt -Oz -o fx-optimized.wasm target/wasm32-wasip1/release/fx.wasm

# Strip debug symbols
wasm-strip fx-optimized.wasm
```

Add to `Cargo.toml` for even smaller binaries:

```toml
[profile.release]
opt-level = 'z'     # Optimize for size
lto = true          # Link-time optimization
codegen-units = 1   # Better optimization
strip = true        # Remove debug symbols
panic = 'abort'     # Smaller panic handler
```

## UMA Principles Demonstrated

### 1. Universal Portability
The same WASM binary runs across 10+ different execution environments without modification.

### 2. Contract-Driven
JSON input/output contract remains constant regardless of deployment target.

### 3. Behavior Consistency
Identical exchange rate calculations and error handling across all runtimes.

### 4. No Vendor Lock-In
Switch between edge providers, cloud platforms, or local execution by changing only deployment configuration.

### 5. Environmental Abstraction
Core logic has no knowledge of whether it's running in a browser, on edge, or in cloud—the runtime provides necessary adapters.

## Documentation

- **[Browser Adapter Guide](adapters/browser/README.md)** - Running in the browser
- **[Comprehensive Deployment Guide](docs/deployment-guide.adoc)** - Complete guide to WASM runtimes, WASI versions, and deployment to edge/cloud platforms

## Related Examples

- **[Chapter 4: Feature Flag Evaluator](../chapter-04-feature-flag-evaluator/)** - Smallest portable UMA service
- **[Chapter 5: Post Fetcher Runtime](../chapter-05-post-fetcher-runtime/)** - Runtime wrapping a pure service
- **[Chapter 6: Portability Lab](../chapter-06-portability-lab/)** - Portability validation across native and WASI

## License

Part of the Universal Microservices Architecture (UMA) code examples repository.

## Summary

This currency converter demonstrates that with UMA and WebAssembly:

1. ✅ Write Rust code once
2. ✅ Compile to `wasm32-wasip1`
3. ✅ Deploy to 10+ environments
4. ✅ Achieve identical behavior everywhere
5. ✅ Maintain simple JSON contract
6. ✅ Get excellent performance (< 10ms execution)

**This is the power of Universal Microservices Architecture.**
