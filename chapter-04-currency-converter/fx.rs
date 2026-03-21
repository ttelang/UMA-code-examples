// Cargo.toml: [package] name="fx" version="0.1.0"
// [dependencies] serde = { version = "1", features = ["derive"] }
// serde_json = "1"

use serde::{Deserialize, Serialize};
use std::io::{Read, Write};

#[derive(Deserialize)]
struct CurrencyConversionRequest {
    from: String,
    to: String,
    amount: f64,
}

#[derive(Serialize)]
struct CurrencyConversionResponse {
    from: String,
    to: String,
    amount: f64,
    rate: f64,
    result: f64,
}

// Small fixed table for the demo
fn rate(from: &str, to: &str) -> Option<f64> {
    match (from, to) {
        ("USD", "EUR") => Some(0.92),
        ("EUR", "USD") => Some(1.09),
        ("USD", "CAD") => Some(1.35),
        ("CAD", "USD") => Some(0.74),
        (a, b) if a == b => Some(1.0),
        _ => None,
    }
}

fn main() {
    // Read one JSON document from stdin
    let mut buf = String::new();
    std::io::stdin()
        .read_to_string(&mut buf)
        .expect("Failed to read input from stdin");

    // Parse, compute, write JSON to stdout
    match serde_json::from_str::<CurrencyConversionRequest>(&buf) {
        Ok(inp) => {
            if let Some(exchange_rate) = rate(&inp.from, &inp.to) {
                let out = CurrencyConversionResponse {
                    from: inp.from,
                    to: inp.to,
                    amount: inp.amount,
                    rate: exchange_rate,
                    result: (inp.amount * exchange_rate * 100.0).round() / 100.0,
                };
                let json = serde_json::to_string(&out).unwrap();
                if let Err(_) = std::io::stdout().write_all(json.as_bytes()) {
                    std::process::exit(3);
                }
            } else {
                if let Err(_) = std::io::stdout().write_all(br#"{"error":"unsupported pair"}"#) {
                    std::process::exit(3);
                }
                std::process::exit(2);
            }
        }
        Err(_) => {
            if let Err(_) = std::io::stdout().write_all(br#"{"error":"bad input"}"#) {
                std::process::exit(3);
            }
            std::process::exit(1);
        }
    }
}
