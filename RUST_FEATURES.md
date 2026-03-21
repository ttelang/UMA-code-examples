# Rust Language Features in UMA Code Examples

This document catalogs the Rust language features demonstrated in the Feature Flag Evaluator and Currency Converter implementations.

## Core Language Features

- **Structs**: Custom data types (`Flag`, `Rule`, `EvalResult`, `Value` in evaluator; `CurrencyConversionRequest`, `CurrencyConversionResponse` in converter)
- **Enums**: Algebraic data types (`Value` enum with Str, Num, Bool, Null variants) - evaluator only
- **Pattern Matching**: `match` expressions on enums, tuples, and Result types in both implementations
- **Type Aliases**: Named shortcuts like `type Context = HashMap<...>` - evaluator only
- **Options**: `Option<usize>`, `Option<f64>` for nullable values in both
- **Result**: `Result<bool, ()>` for error handling in both

## Ownership & Borrowing

- **References**: Borrowed references `&Flag`, `&Context`, `&str` used extensively in both
- **String vs &str**: Mix of owned `String` and borrowed `&str` in both implementations
- **Clone**: `#[derive(Clone)]` for explicit cloning - evaluator only
- **Moves**: Implicit ownership transfer with `String` and structs in both

## Collections

- **Vec**: Dynamic arrays `Vec<Rule>` - evaluator only
- **HashMap**: Key-value maps `HashMap<String, Value>` - evaluator only
- **Iteration**: Iterator methods `.iter()`, `.enumerate()` - evaluator only

## Functional Programming

- **Closures**: Anonymous functions like `.map_err(|_| ())` - evaluator only
- **if let**: Pattern matching shorthand `if let Some(...)` in both
- **Method Chaining**: Fluent API style on Options and I/O operations in both

## String Manipulation

- **format!**: String formatting macro - evaluator only
- **String methods**: `.trim()`, `.starts_with()`, `.strip_prefix()`, `.ends_with()` - evaluator only
- **Slice indexing**: String slicing `&s[..idx]`, `&s[1..len-1]` - evaluator only
- **as_bytes()**: Byte-level iteration in evaluator, byte writing in converter

## I/O Operations

- **std::io**: Standard I/O with `Read` and `Write` traits - converter only
- **stdin/stdout**: Console I/O `std::io::stdin()`, `stdout()` - converter only
- **read_to_string**: Reading all input into buffer - converter only
- **write_all**: Writing byte arrays - converter only

## Error Handling

- **Result**: `Result<bool, ()>` with pattern matching in evaluator, `.expect()` in converter
- **? operator**: Shorthand error propagation - evaluator only
- **process::exit**: Process termination with exit codes (1, 2, 3) - converter only
- **Unit error ()**: Minimal error type as simple signal - evaluator only

## Numeric Operations

- **f64 arithmetic**: Comparison and division in evaluator, multiplication and rounding in converter
- **u32 arithmetic**: Hash calculation with unsigned integers - evaluator only
- **wrapping_mul**: Overflow-safe multiplication for hashing - evaluator only
- **Type casting**: Type conversions `as u32`, `as f64` - evaluator only

## Testing

- **#[cfg(test)]**: Conditional compilation for test modules - evaluator only
- **#[test]**: Test function attribute - evaluator only
- **assert!**: Boolean assertions - evaluator only
- **assert_eq!**: Equality assertions - evaluator only

## Attributes & Macros

- **#[derive]**: Automatic trait implementations (`Debug`, `Clone` in evaluator; `Deserialize`, `Serialize` in converter)
- **Documentation comments**: Doc generation with `///` and `//!` - evaluator only
- **br#"..."#**: Raw byte string literals - converter only

## Serde (Serialization)

- **Deserialize**: JSON input parsing from strings - converter only
- **Serialize**: JSON output generation - converter only
- **serde_json**: JSON operations `from_str`, `to_string` - converter only

## Advanced Features

- **Recursion**: Recursive function `eval_expr` - evaluator only
- **Short-circuit evaluation**: Lazy boolean evaluation in `&&` and `||` operators - evaluator only
- **Guard clauses**: Conditional patterns in match arms - both implementations
- **Constants**: Compile-time values for hash calculations - evaluator only

## Summary

- **Feature Flag Evaluator** ([chapter-04-feature-flag-evaluator](chapter-04-feature-flag-evaluator/)): ~22 distinct Rust features
  - Demonstrates advanced patterns: enums, recursion, iterators, functional programming
  - Pure logic, no I/O, minimal dependencies
  - Emphasis on type safety and pattern matching

- **Currency Converter** ([chapter-04-currency-converter](chapter-04-currency-converter/)): ~15 distinct Rust features
  - Focuses on practical I/O handling
  - External dependencies (serde for JSON)
  - Error handling with process exit codes

- **Shared Core Features**: ~10 fundamental features used by both
  - Structs, Options, Result, References, Pattern Matching
  - String handling, Attributes, Method chaining

## Learning Path

1. **Start with Currency Converter** for basics:
   - Simple struct definitions
   - I/O operations
   - JSON serialization/deserialization
   - Error handling with exit codes

2. **Progress to Feature Flag Evaluator** for advanced concepts:
   - Enums and pattern matching
   - Collections (Vec, HashMap)
   - Recursion and functional programming
   - Testing with unit tests
   - Pure, dependency-free code

Both implementations compile to WebAssembly (wasm32-wasip1), demonstrating Rust's portability and Universal Microservices Architecture (UMA) principles.
