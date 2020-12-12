let wasm;

{
  const module = new WebAssembly.Module(WASM_BYTES);
  const instance = new WebAssembly.Instance(module, { __wbindgen_placeholder__: {} });

  wasm = instance.exports;
}

let u8array_ref = new Uint8Array(wasm.memory.buffer);
let i32array_ref = new Int32Array(wasm.memory.buffer);

function u8array() {
  return u8array_ref.buffer === wasm.memory.buffer ? u8array_ref : (u8array_ref = new Uint8Array(wasm.memory.buffer));
}

function i32array() {
  return i32array_ref.buffer === wasm.memory.buffer ? i32array_ref : (i32array_ref = new Int32Array(wasm.memory.buffer));
}

function ptr_to_u8array(ptr, len) {
  return u8array().subarray(ptr, ptr + len);
}

function u8array_to_ptr(buffer) {
  const ptr = wasm.__wbindgen_malloc(buffer.length);

  return (u8array().set(buffer, ptr), ptr);
}

export function compress(buffer) {
  const ptr = u8array_to_ptr(buffer);
  wasm.compress(8, ptr, buffer.length);

  const i32 = i32array();
  const slice = ptr_to_u8array(i32[2], i32[3]).slice();
  return (wasm.__wbindgen_free(i32[2], i32[3]), slice);
}

export function decompress(buffer) {
  const ptr = u8array_to_ptr(buffer);

  try {
    wasm.decompress(8, ptr, buffer.length);

    const i32 = i32array();
    const slice = ptr_to_u8array(i32[2], i32[3]).slice();
    return (wasm.__wbindgen_free(i32[2], i32[3]), slice);
  } catch { throw (wasm.__wbindgen_free(ptr, buffer.length), new Error('lz4: panic')) }
}

export function decompress_with(buffer, transform) {
  const ptr = u8array_to_ptr(buffer);

  try {
    wasm.decompress(8, ptr, buffer.length);

    const i32 = i32array();
    const slice = ptr_to_u8array(i32[2], i32[3]);

    try {
      const value = transform(slice);
      return (wasm.__wbindgen_free(i32[2], i32[3]), value);
    } catch (err) { throw (wasm.__wbindgen_free(i32[2], i32[3]), err) }
  } catch { throw (wasm.__wbindgen_free(ptr, buffer.length), new Error('lz4: panic')) }
}