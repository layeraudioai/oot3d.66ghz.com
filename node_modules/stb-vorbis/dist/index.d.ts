/**
 * Decoded Ogg Vorbis audio.
 *
 * PCM samples are planar Float32 PCM.
 */
export interface DecodedAudio {
    /**
     * The audio sample rate in Hz.
     */
    readonly sampleRate: number;
    /**
     * One PCM array for each audio channel.
     *
     * All channel arrays contain the same number of samples.
     */
    readonly channels: Float32Array[];
}
/**
 * Synchronous Ogg Vorbis decoder backed by stb_vorbis.
 */
export declare class StbVorbis {
    /**
     * The exports of the WebAssembly decoder.
     * @private
     */
    private static exports;
    /**
     * Resolves when the underlying WebAssembly decoder is initialized.
     */
    static readonly ready: Promise<void>;
    /**
     * Decodes an entire Ogg Vorbis stream synchronously.
     *
     * The returned PCM arrays are normal JavaScript-owned typed arrays.
     * No WASM memory is retained after this method returns.
     *
     * @param data The complete Ogg Vorbis stream.
     * @returns The decoded planar PCM audio.
     */
    static decode(data: ArrayBufferLike | Uint8Array<ArrayBufferLike>): DecodedAudio;
}
