// Browser adapter for the currency converter (fx).
//
// This module exports a single asynchronous function `convertCurrency` that
// accepts a currency conversion request and returns the result.
// It works by instantiating the compiled WebAssembly module (fx.wasm) with
// a minimal WASI polyfill.

class WasmExit extends Error {
  constructor(code) {
    super(`WASM exited with code ${code}`);
    this.code = code;
  }
}

// Helper to create a minimal WASI import object for stdin/stdout I/O
function createWasiImports(memory, stdinBytes, stdoutBytes) {
  return {
    wasi_snapshot_preview1: {
      fd_write: (fd, iovsPtr, iovsLen, nwrittenPtr) => {
        if (fd !== 1 && fd !== 2) return 52; // EBADF
        
        const memU32 = new Uint32Array(memory.buffer);
        const memU8 = new Uint8Array(memory.buffer);
        let bytesWritten = 0;
        const start = iovsPtr >>> 2;
        
        for (let i = 0; i < iovsLen; i++) {
          const offset = memU32[start + i * 2];
          const length = memU32[start + i * 2 + 1];
          const slice = memU8.slice(offset, offset + length);
          stdoutBytes.push(...slice);
          bytesWritten += length;
        }
        
        memU32[nwrittenPtr >>> 2] = bytesWritten;
        return 0;
      },
      
      fd_read: (fd, iovsPtr, iovsLen, nreadPtr) => {
        if (fd !== 0) return 52; // EBADF
        
        const memU32 = new Uint32Array(memory.buffer);
        const memU8 = new Uint8Array(memory.buffer);
        let bytesRead = 0;
        const start = iovsPtr >>> 2;
        
        for (let i = 0; i < iovsLen; i++) {
          const offset = memU32[start + i * 2];
          const length = memU32[start + i * 2 + 1];
          const chunk = stdinBytes.slice(0, length);
          memU8.set(chunk, offset);
          stdinBytes.splice(0, chunk.length);
          bytesRead += chunk.length;
          if (stdinBytes.length === 0) break;
        }
        
        memU32[nreadPtr >>> 2] = bytesRead;
        return 0;
      },
      
      fd_close: () => 0,
      fd_fdstat_get: () => 0,
      fd_prestat_get: () => 8, // EBADF - no preopened directories
      fd_prestat_dir_name: () => 8,
      
      args_sizes_get: (argcPtr, argvBufSizePtr) => {
        const memU32 = new Uint32Array(memory.buffer);
        memU32[argcPtr >>> 2] = 0;
        memU32[argvBufSizePtr >>> 2] = 0;
        return 0;
      },
      
      args_get: () => 0,
      
      environ_sizes_get: (envCountPtr, envBufSizePtr) => {
        const memU32 = new Uint32Array(memory.buffer);
        memU32[envCountPtr >>> 2] = 0;
        memU32[envBufSizePtr >>> 2] = 0;
        return 0;
      },
      
      environ_get: () => 0,
      
      random_get: (bufPtr, bufLen) => {
        const memU8 = new Uint8Array(memory.buffer);
        const view = memU8.subarray(bufPtr, bufPtr + bufLen);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
          crypto.getRandomValues(view);
        } else {
          for (let i = 0; i < bufLen; i++) {
            view[i] = Math.floor(Math.random() * 256);
          }
        }
        return 0;
      },
      
      clock_time_get: (_id, _precision, timePtr) => {
        const nowNs = BigInt(Date.now()) * 1000000n;
        const memView = new DataView(memory.buffer);
        memView.setBigUint64(timePtr, nowNs, true);
        return 0;
      },
      
      proc_exit: (code) => {
        throw new WasmExit(code);
      },
    },
  };
}

/**
 * Convert currency using the WASI-compiled WebAssembly module.
 * 
 * @param {Object} input - Currency conversion request: {from: "USD", to: "EUR", amount: 100}
 * @returns {Promise<Object>} A Promise that resolves to the conversion result
 */
export async function convertCurrency(input) {
  // Serialize input to UTF-8 encoded bytes
  const inputStr = JSON.stringify(input);
  const stdinBytes = Array.from(new TextEncoder().encode(inputStr));
  const stdoutBytes = [];
  
  // Placeholder for WebAssembly.Memory instance
  let memory;
  
  // Create WASI imports
  const imports = {
    wasi_snapshot_preview1: createWasiImports(
      { get buffer() { return memory.buffer; } },
      stdinBytes,
      stdoutBytes
    ).wasi_snapshot_preview1,
  };
  
  // Fetch and instantiate the WebAssembly module
  const response = await fetch('fx.wasm');
  if (!response.ok) {
    throw new Error(`Failed to fetch fx.wasm: ${response.status}`);
  }
  
  const wasmBytes = await response.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(wasmBytes, imports);
  
  // Save memory reference after instantiation
  memory = instance.exports.memory;
  
  // Execute the WASM module
  try {
    instance.exports._start();
  } catch (err) {
    if (err instanceof WasmExit) {
      // Normal exit - check exit code
      if (err.code === 1) {
        throw new Error('Invalid input JSON');
      } else if (err.code === 2) {
        throw new Error('Unsupported currency pair');
      } else if (err.code === 3) {
        throw new Error('Output write error');
      } else if (err.code !== 0) {
        throw new Error(`Process exited with code ${err.code}`);
      }
    } else {
      throw err;
    }
  }
  
  // Decode stdout and parse JSON result
  const outputStr = new TextDecoder('utf-8').decode(new Uint8Array(stdoutBytes));
  return JSON.parse(outputStr);
}
