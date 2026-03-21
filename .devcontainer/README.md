# Dev Container Configuration for UMA Rust Development

This directory contains the codespace/devcontainer configuration for rust code examples.

## What's Included

The devcontainer provides a complete Rust development environment with:

### Core Tools
- **Rust stable toolchain** with components:
  - `rustfmt` - Code formatting
  - `clippy` - Linting and best practices
- **wasm32-wasip1 target** - For WebAssembly compilation
- **wasmtime v39.0.0** - WebAssembly runtime
- **cargo-llvm-cov** - Code coverage reporting
- **jq** - JSON processing utility

### VS Code Extensions
- **rust-analyzer** - Intelligent Rust language support
- **vscode-lldb** - Debugging support
- **crates** - Manage Cargo dependencies
- **even-better-toml** - Enhanced TOML file support
- **dependi** - Dependency version management

## Usage

### Starting Fresh
When you create or rebuild the codespace, the `setup.sh` script automatically:
1. Installs the Rust stable toolchain with required components
2. Adds the wasm32-wasip1 compilation target
3. Downloads and installs wasmtime v39.0.0
4. Installs cargo-llvm-cov for coverage reporting

### Manual Setup
If you need to run the setup manually:
```bash
bash .devcontainer/setup.sh
```

## Environment Details

- **Base Image**: `mcr.microsoft.com/devcontainers/rust:1-1-bookworm`
- **Rust Toolchain**: stable (latest)
- **Shell**: zsh with Oh My Zsh

## Customization

To modify the environment:
- Edit `devcontainer.json` for VS Code settings and extensions
- Edit `setup.sh` for additional tools or dependencies
- Rebuild the container for changes to take effect