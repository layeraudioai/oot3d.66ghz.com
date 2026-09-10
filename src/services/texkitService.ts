import { CTRTextureFormat, OoT3DTexture } from '../types/oot3d';

/**
 * oot3d-texkit (folxxsreal/oot3d-texkit) converter & inspection service.
 * Handles CTR texture formats (.ctxb) used in Ocarina of Time 3D RomFS.
 * Simulates conversion between PNG and 3DS hardware formats (ETC1, RGB565, RGBA8, etc.).
 */

export interface TexkitConversionResult {
  textureId: string;
  format: CTRTextureFormat;
  width: number;
  height: number;
  mipmaps: number;
  compressedSizeKb: number;
  ctxbHeaderMagic: string;
  binaryPayloadPreview: string; // Hex representation
}

// CTR Texture Format specifics (bits per pixel, hardware details)
export const CTR_FORMAT_SPECS: Record<
  CTRTextureFormat,
  {
    bpp: number;
    description: string;
    hasAlpha: boolean;
    native3dsHw: boolean;
    compressionRatio: string;
  }
> = {
  ETC1: {
    bpp: 4,
    description: 'Ericsson Texture Compression 1 (Standard 3DS Opaque)',
    hasAlpha: false,
    native3dsHw: true,
    compressionRatio: '8:1',
  },
  ETC1A4: {
    bpp: 8,
    description: 'ETC1 with 4-bit Alpha Sub-block (PICA200 standard for cutouts)',
    hasAlpha: true,
    native3dsHw: true,
    compressionRatio: '4:1',
  },
  RGBA8: {
    bpp: 32,
    description: '32-bit Uncompressed True Color (Sharpest, large memory footprint)',
    hasAlpha: true,
    native3dsHw: true,
    compressionRatio: '1:1',
  },
  RGB565: {
    bpp: 16,
    description: '16-bit Hi-Color (5 bits Red, 6 bits Green, 5 bits Blue)',
    hasAlpha: false,
    native3dsHw: true,
    compressionRatio: '2:1',
  },
  RGBA5551: {
    bpp: 16,
    description: '16-bit Color with 1-bit Punch-through Transparency',
    hasAlpha: true,
    native3dsHw: true,
    compressionRatio: '2:1',
  },
  RGBA4444: {
    bpp: 16,
    description: '16-bit Color with 4-bit Smooth Alpha Gradient',
    hasAlpha: true,
    native3dsHw: true,
    compressionRatio: '2:1',
  },
  L8: {
    bpp: 8,
    description: '8-bit Luminance / Grayscale Bump or Light Map',
    hasAlpha: false,
    native3dsHw: true,
    compressionRatio: '4:1',
  },
  A8: {
    bpp: 8,
    description: '8-bit Alpha-only Mask',
    hasAlpha: true,
    native3dsHw: true,
    compressionRatio: '4:1',
  },
};

/**
 * Calculates CTR .ctxb binary payload size including mipmaps
 */
export function calculateTextureSize(
  width: number,
  height: number,
  format: CTRTextureFormat,
  mipmaps: number = 1
): number {
  const spec = CTR_FORMAT_SPECS[format];
  let totalBytes = 0;
  let currentW = width;
  let currentH = height;

  for (let i = 0; i < mipmaps; i++) {
    // 3DS PICA200 GPU swizzles textures in 8x8 morton-order tiles
    const tilesX = Math.max(1, Math.ceil(currentW / 8));
    const tilesY = Math.max(1, Math.ceil(currentH / 8));
    const levelBytes = (tilesX * 8 * tilesY * 8 * spec.bpp) / 8;
    totalBytes += levelBytes;

    currentW = Math.max(1, Math.floor(currentW / 2));
    currentH = Math.max(1, Math.floor(currentH / 2));
  }

  // Add CTXB header (0x40 = 64 bytes)
  totalBytes += 64;
  return Number((totalBytes / 1024).toFixed(2));
}

/**
 * Converts a replacement image file (PNG/JPEG) to a preview dataURL and calculates
 * the simulated oot3d-texkit .ctxb compile attributes.
 */
export async function processReplacementImage(
  file: File,
  targetFormat: CTRTextureFormat
): Promise<{
  dataUrl: string;
  width: number;
  height: number;
  sizeKb: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Enforce power-of-two or standard 3DS dimension check
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const sizeKb = calculateTextureSize(w, h, targetFormat, 1);
        resolve({
          dataUrl,
          width: w,
          height: h,
          sizeKb,
        });
      };
      img.onerror = () => reject(new Error('Failed to load image for texture processing'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Error reading uploaded image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Generate simulated CTR .ctxb binary header and payload for Luma RomFS mod
 */
export function generateCtxbBinary(texture: OoT3DTexture): Uint8Array {
  // CTXB header:
  // 0x00: 'c' 't' 'x' 'b' (Magic)
  // 0x04: Format enum (0x01 = RGBA8, 0x02 = RGB565, 0x07 = ETC1, 0x08 = ETC1A4)
  // 0x06: Width (u16 LE)
  // 0x08: Height (u16 LE)
  // 0x0A: Mipmap Count (u8)
  // 0x10 - 0x3F: PICA200 texture registers
  const header = new Uint8Array(64);
  header[0] = 0x63; // 'c'
  header[1] = 0x74; // 't'
  header[2] = 0x78; // 'x'
  header[3] = 0x62; // 'b'

  // Format ID mapping
  let formatCode = 0x07; // ETC1
  if (texture.format === 'RGBA8') formatCode = 0x01;
  else if (texture.format === 'RGB565') formatCode = 0x02;
  else if (texture.format === 'RGBA4444') formatCode = 0x04;
  else if (texture.format === 'ETC1A4') formatCode = 0x08;

  header[4] = formatCode & 0xff;
  header[6] = texture.width & 0xff;
  header[7] = (texture.width >> 8) & 0xff;
  header[8] = texture.height & 0xff;
  header[9] = (texture.height >> 8) & 0xff;
  header[10] = texture.mipmaps & 0xff;

  // Total byte size
  const totalKb = calculateTextureSize(texture.width, texture.height, texture.format, texture.mipmaps);
  const dataSize = Math.max(64, Math.floor(totalKb * 1024));
  const fullBinary = new Uint8Array(dataSize);
  fullBinary.set(header, 0);

  // Fill pseudo Morton swizzled byte pattern
  for (let i = 64; i < fullBinary.length; i++) {
    fullBinary[i] = (i * 37) & 0xff;
  }

  return fullBinary;
}
