/**
 * ZSI to CMB conversion utility based on Py-MM3D-LZSS-decompressor-to-CMB.
 * 
 * Ported to TypeScript for use in the Ocarina of Time 3D Level Editor.
 */
import { LzssDecompressor } from './lzss';

export class ZsiConverter {
  private lzssDecompressor: LzssDecompressor;

  constructor() {
    this.lzssDecompressor = new LzssDecompressor();
  }

  /**
   * Converts ZSI data to CMB data.
   * 
   * @param data The Uint8Array containing the ZSI/LZSS data.
   * @returns A Uint8Array containing the CMB data.
   */
  convertToCmb(data: Uint8Array): Uint8Array {
    let currentData = data;
    const headTag = new TextDecoder().decode(currentData.subarray(0, 4));

    // 1. Decompress if LZSS compressed
    if (headTag === 'LzS\x01') {
      currentData = this.lzssDecompressor.decompress(currentData);
    }

    // 2. Convert ZSI to CMB (remove ZSI header)
    const newHeadTag = new TextDecoder().decode(currentData.subarray(0, 4));
    
    if (newHeadTag === 'ZSI\x09' || newHeadTag === 'ZSI\x01') {
      // Find the start of the CMB data
      let cmbStartIndex = -1;
      const cmbSignature = new Uint8Array([0x63, 0x6d, 0x62, 0x20]); // 'cmb '
      
      for (let i = 0; i < currentData.length - 4; i++) {
        if (currentData[i] === cmbSignature[0] &&
            currentData[i+1] === cmbSignature[1] &&
            currentData[i+2] === cmbSignature[2] &&
            currentData[i+3] === cmbSignature[3]) {
          cmbStartIndex = i;
          break;
        }
      }

      if (cmbStartIndex !== -1) {
        return currentData.subarray(cmbStartIndex);
      } else {
        throw new Error('CMB signature not found in ZSI file.');
      }
    } else if (newHeadTag === 'cmb\x20') {
      return currentData; // Already CMB
    } else {
      throw new Error('Unsupported file format.');
    }
  }
}
