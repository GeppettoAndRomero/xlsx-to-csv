import { AppError } from './appError';

const CSV_MIME = 'text/csv;charset=utf-8';
const ZIP_MIME = 'application/zip';
const UTF8_BOM = '\uFEFF';
const RESERVED_FILENAME_CHARACTERS = /[\\/:*?"<>|]/g;
const WORKBOOK_EXTENSION = /\.(xlsx|xlsm|xls)$/i;

export type ConversionPhase = 'reading' | 'converting' | 'packaging';

export interface ConversionProgress {
  phase: ConversionPhase;
  completed: number;
  total: number;
  sheetName?: string;
}

export interface ConvertedSheet {
  sheetName: string;
  fileName: string;
  rowCount: number;
}

export interface WorkbookCsvResult {
  blob: Blob;
  downloadName: string;
  outputKind: 'csv' | 'zip';
  sheetCount: number;
  sheets: ConvertedSheet[];
}

export type ConversionProgressCallback = (progress: ConversionProgress) => void;

interface GeneratedSheet extends ConvertedSheet {
  csv: string;
}

function hasZipSignature(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    ((bytes[2] === 0x03 && bytes[3] === 0x04) ||
      (bytes[2] === 0x05 && bytes[3] === 0x06) ||
      (bytes[2] === 0x07 && bytes[3] === 0x08))
  );
}

function hasCompoundFileSignature(bytes: Uint8Array): boolean {
  const signature = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
  return (
    bytes.length >= signature.length &&
    signature.every((value, index) => bytes[index] === value)
  );
}

function hasBiffSignature(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 2 &&
    bytes[0] === 0x09 &&
    [0x00, 0x02, 0x04, 0x08].includes(bytes[1])
  );
}

export function hasExpectedWorkbookSignature(
  bytes: Uint8Array,
  fileName: string
): boolean {
  if (/\.xls$/i.test(fileName)) {
    return hasCompoundFileSignature(bytes) || hasBiffSignature(bytes);
  }
  return hasZipSignature(bytes);
}

/**
 * Replaces characters that cannot be used in common desktop filenames.
 * An empty result uses the 1-based sheet position as a stable fallback.
 */
export function sanitizeSheetFileName(sheetName: string, sheetIndex: number): string {
  const sanitized = sheetName.replace(RESERVED_FILENAME_CHARACTERS, '_').trim();
  return sanitized || `sheet${sheetIndex + 1}`;
}

function uniqueCsvFileName(
  sheetName: string,
  sheetIndex: number,
  usedNames: Set<string>
): string {
  const base = sanitizeSheetFileName(sheetName, sheetIndex);
  let candidate = `${base}.csv`;
  let suffix = 2;

  while (usedNames.has(candidate.toLocaleLowerCase())) {
    candidate = `${base}-${suffix}.csv`;
    suffix += 1;
  }

  usedNames.add(candidate.toLocaleLowerCase());
  return candidate;
}

export function workbookBaseName(fileName: string): string {
  const withoutExtension = fileName.replace(WORKBOOK_EXTENSION, '');
  const sanitized = withoutExtension.replace(RESERVED_FILENAME_CHARACTERS, '_').trim();
  return sanitized || 'workbook';
}

/**
 * Counts CSV records while ignoring line breaks inside quoted cells.
 */
export function countCsvRows(csv: string): number {
  if (!csv) return 0;

  let rows = 0;
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (character === '"') {
      if (quoted && csv[index + 1] === '"') {
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === '\n' && !quoted) {
      rows += 1;
    }
  }

  return rows + (csv.endsWith('\n') ? 0 : 1);
}

async function createZip(sheets: GeneratedSheet[]): Promise<Blob> {
  const { BlobWriter, TextReader, ZipWriter } = await import('@zip.js/zip.js');
  const writer = new ZipWriter(new BlobWriter(ZIP_MIME), {
    useUnicodeFileNames: true,
  });

  try {
    for (const sheet of sheets) {
      await writer.add(sheet.fileName, new TextReader(sheet.csv));
    }
    return await writer.close();
  } catch {
    throw new AppError('errCreateDownload');
  }
}

/**
 * Converts every worksheet to a UTF-8 CSV file. SheetJS and zip.js are loaded
 * only after a workbook has been selected.
 */
export async function convertWorkbookToCsv(
  workbookFile: File,
  onProgress?: ConversionProgressCallback
): Promise<WorkbookCsvResult> {
  onProgress?.({ phase: 'reading', completed: 0, total: 0 });

  const XLSX = await import('xlsx');
  let workbook;

  try {
    const data = await workbookFile.arrayBuffer();
    if (!hasExpectedWorkbookSignature(new Uint8Array(data), workbookFile.name)) {
      throw new AppError('errCannotReadWorkbook');
    }
    workbook = XLSX.read(data, { type: 'array' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('errCannotReadWorkbook');
  }

  const sheetNames = workbook.SheetNames;
  if (sheetNames.length === 0) {
    throw new AppError('errNoSheets');
  }

  const usedFileNames = new Set<string>();
  const generatedSheets: GeneratedSheet[] = [];

  for (let index = 0; index < sheetNames.length; index += 1) {
    const sheetName = sheetNames[index];
    onProgress?.({
      phase: 'converting',
      completed: index,
      total: sheetNames.length,
      sheetName,
    });

    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      throw new AppError('errCannotReadWorkbook');
    }

    const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: ',', RS: '\n' });
    generatedSheets.push({
      sheetName,
      fileName: uniqueCsvFileName(sheetName, index, usedFileNames),
      rowCount: countCsvRows(csv),
      csv: `${UTF8_BOM}${csv}`,
    });
  }

  onProgress?.({
    phase: 'packaging',
    completed: sheetNames.length,
    total: sheetNames.length,
  });

  const sheets = generatedSheets.map(({ csv: _csv, ...sheet }) => sheet);

  if (generatedSheets.length === 1) {
    const [sheet] = generatedSheets;
    return {
      blob: new Blob([sheet.csv], { type: CSV_MIME }),
      downloadName: sheet.fileName,
      outputKind: 'csv',
      sheetCount: 1,
      sheets,
    };
  }

  return {
    blob: await createZip(generatedSheets),
    downloadName: `${workbookBaseName(workbookFile.name)}-sheets.zip`,
    outputKind: 'zip',
    sheetCount: generatedSheets.length,
    sheets,
  };
}
