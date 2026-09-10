/**
 * LZSS decompression utility based on Py-MM3D-LZSS implementation.
 * 
 * Ported to TypeScript for use in the Ocarina of Time 3D Level Editor.
 */

export class LzssDecompressor {
  private readonly BUFFER_SIZE = 4096;

  /**
   * Decompresses LZSS compressed data.
   * 
   * @param data The Uint8Array containing the full LZSS data (including the 16-byte header).
   * @returns A Uint8Array containing the decompressed data.
   * @throws Error if data is corrupted or size mismatch.
   */
  decompress(data: Uint8Array): Uint8Array {
    if (data.length < 16) {
      throw new Error('Data too small to be LZSS compressed.');
    }

    const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const decompressedSize = dataView.getUint32(8, true);
    const compressedSize = dataView.getUint32(12, true);

    if (data.length !== compressedSize + 16) {
      throw new Error(`Compressed size mismatch: expected ${compressedSize + 16} bytes, got ${data.length} bytes.`);
    }

    const compressedData = data.subarray(16);
    const outData: number[] = [];
    const buffer = new Uint8Array(this.BUFFER_SIZE);
    
    let writeIdx = 4078; // 0xFEE, starting index in the buffer
    let flags8 = 0;
    let compressedIdx = 0;

    while (compressedIdx < compressedData.length) {
      flags8 = compressedData[compressedIdx++];

      for (let i = 0; i < 8; i++) {
        if ((flags8 & 1) !== 0) {
          if (compressedIdx >= compressedData.length) break;
          
          const byte = compressedData[compressedIdx++];
          outData.push(byte);
          buffer[writeIdx] = byte;
          writeIdx = (writeIdx + 1) % this.BUFFER_SIZE;
        } else {
          if (compressedIdx + 1 >= compressedData.length) break;

          const b1 = compressedData[compressedIdx++];
          const b2 = compressedData[compressedIdx++];

          let readIdx = b1 | ((b2 & 0xF0) << 4);
          const count = (b2 & 0x0F) + 3;

          for (let j = 0; j < count; j++) {
            const byte = buffer[readIdx];
            outData.push(byte);
            buffer[writeIdx] = byte;
            readIdx = (readIdx + 1) % this.BUFFER_SIZE;
            writeIdx = (writeIdx + 1) % this.BUFFER_SIZE;
          }
        }

        flags8 >>= 1;
        if (compressedIdx >= compressedData.length) break;
      }
    }

    if (outData.length !== decompressedSize) {
      throw new Error(
        `Size mismatch: got ${outData.length} bytes after decompression, expected ${decompressedSize}.`
      );
    }

    return new Uint8Array(outData);
  }
}
