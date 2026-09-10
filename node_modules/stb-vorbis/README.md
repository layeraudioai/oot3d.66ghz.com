# stb-vorbis

A small synchronous Vorbis decoder for JavaScript using [`stb_vorbis`](https://github.com/nothings/stb) through WebAssembly.

This decoder is designed for restricted environments, such as an `AudioWorklet`.
It doesn't use `fetch` or any APIs not available in AudioWorklets and provides a fully synchronous decode method, shipping one JS file.
The WebAssembly binary is stored as base64-encoded data in the JS file.

Made for use in [`spessasynth_core`](https://github.com/spessasus/spessasynth_core), but can be used separately.

## Installation

```bash
npm install stb-vorbis
```

## Example

```ts
import { StbVorbis } from "stb-vorbis";

// Initialize the decoder
await StbVorbis.ready;

const ogg = await fetch("/audio/example.ogg").then((response) =>
    response.arrayBuffer()
);

// Decode the audio data
const audio = StbVorbis.decode(ogg); // f32 by default

console.log(audio.sampleRate); // For example: 44100
console.log(audio.channels.length); // Number of channels
console.log(audio.channels[0]); // Float32Array containing channel 1
```

A proper example can be found in the `examples/` directory. It plays the specified Ogg Vorbis file through ffplay.
Run it using `tsx`.

## API reference

### ready

```ts
await StbVorbis.ready;
```

Resolves when the decoder has been initialized. Call `await StbVorbis.ready` before calling `StbVorbis.decode()`.

### decode

```ts
StbVorbis.decode(data);
```

Synchronously decodes a complete Vorbis stream in an Ogg Container.

- `data` - `ArrayBufferLike` or `Uint8Array` - the binary Ogg Vorbis data.

Throws if the decoder has not been initialized, if the input cannot be decoded, or if WASM memory allocation fails.

The returned object is described below.

### DecodedAudio

```ts
interface DecodedAudio {
    readonly sampleRate: number;
    readonly channels: Float32Array[];
}
```

- `sampleRate` - sample rate in Hz.
- `channels` - an array of `Float32Array` channel PCM data. All arrays have the same length.

## Building from source

The build requires Emscripten. The build script looks for `emcc` in this order:

1. The `EMCC` environment variable.
2. `$EMSDK/upstream/emscripten/emcc`.
3. `/usr/lib/emscripten/emcc`.
4. `~/emsdk/upstream/emscripten/emcc`.
5. `emcc` on `PATH` directly.

For a custom installation, either activate Emscripten in the shell or set `EMCC` explicitly:

```bash
EMCC=/path/to/emsdk/upstream/emscripten/emcc npm run build
```

To build from source,
run:

```
git clone https://github.com/spessasus/stb-vorbis
cd stb-vorbis
npm install
npm run build
```

The final build publishes `dist/index.js`, which contains the code and type declarations.

## License

Apache License 2.0.

The included `stb_vorbis.c` source retains its original public-domain dedication. See the bottom of the file for details.

## Special Thanks

- [nothings/stb](https://github.com/nothings/stb) - for the original C library.
- [emscripten](https://github.com/emscripten-core/emscripten) - for the WebAssembly compiler.
