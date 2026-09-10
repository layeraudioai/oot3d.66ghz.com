/**
 * GAR/ZAR unpacker utility based on TTEMMA's implementation.
 * 
 * Ported to TypeScript for use in the Ocarina of Time 3D Level Editor.
 */

export interface FileEntry {
  size: number;
  offset: number;
  name: string;
}

export interface ZarArchive {
  countFiles: number;
  files: FileEntry[];
}

export class GarZarUnpacker {
  private readonly GAR_HEADER = 0x02524147; // "GAR\x02" reversed to LE

  /**
   * Unpacks a GAR/ZAR archive.
   * 
   * @param buffer The ArrayBuffer containing the archive data.
   * @returns An object containing the list of files and their content (as Uint8Arrays).
   */
  unpack(buffer: ArrayBuffer): { [key: string]: Uint8Array } {
    if (buffer.byteLength < 24) {
      throw new Error(`File too small to be a GAR/ZAR archive: ${buffer.byteLength} bytes`);
    }

    const dataView = new DataView(buffer);

    // 1. Read Header
    const header = dataView.getUint32(0, true);
    if (header !== this.GAR_HEADER) {
      throw new Error(`Invalid GAR/ZAR header: 0x${header.toString(16)}`);
    }

    const fileSize = dataView.getUint32(4, true);
    const countFilesTypes = dataView.getUint16(8, true);
    const countFiles = dataView.getUint16(10, true);
    const fileTypesOffset = dataView.getUint32(12, true);
    const fileNamesOffset = dataView.getUint32(16, true);
    const fileIndexOffset = dataView.getUint32(20, true);

    if (fileNamesOffset >= buffer.byteLength || fileIndexOffset >= buffer.byteLength) {
      throw new Error('Invalid GAR/ZAR offsets in header.');
    }

    // 2. Read File Info
    const files: FileEntry[] = [];
    for (let i = 0; i < countFiles; i++) {
      const offset = fileNamesOffset + (i * 12);
      if (offset + 12 > buffer.byteLength) {
         throw new Error(`File entry ${i} offset out of bounds.`);
      }
      const sizeFile = dataView.getUint32(offset, true);
      const offsetName = dataView.getUint32(offset + 4, true);
      const offsetNameExt = dataView.getUint32(offset + 8, true);
      
      // Read Name
      let name = "";
      let j = offsetNameExt;
      if (j >= buffer.byteLength) {
        throw new Error(`Filename offset ${j} out of bounds.`);
      }
      
      while (j < buffer.byteLength && dataView.getUint8(j) !== 0) {
        name += String.fromCharCode(dataView.getUint8(j));
        j++;
      }
      name = name.replace(/\//g, '\\');
      
      files.push({ size: sizeFile, offset: 0, name: name });
    }

    // 3. Read File Offsets
    for (let i = 0; i < countFiles; i++) {
      const offset = fileIndexOffset + (i * 4);
      if (offset + 4 > buffer.byteLength) {
        throw new Error(`File index ${i} offset out of bounds.`);
      }
      files[i].offset = dataView.getUint32(offset, true);
    }

    // 4. Extract Files
    const extractedFiles: { [key: string]: Uint8Array } = {};
    for (const file of files) {
      if (file.offset + file.size > buffer.byteLength) {
        throw new Error(`File ${file.name} data out of bounds.`);
      }
      extractedFiles[file.name] = new Uint8Array(buffer, file.offset, file.size);
    }

    return extractedFiles;
  }
}
