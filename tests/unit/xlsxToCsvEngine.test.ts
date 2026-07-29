import {
  Uint8ArrayReader,
  Uint8ArrayWriter,
  ZipReader,
  configure,
} from '@zip.js/zip.js';
import { describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';
import {
  convertWorkbookToCsv,
  countCsvRows,
  hasExpectedWorkbookSignature,
  sanitizeSheetFileName,
  workbookBaseName,
} from '@/utils/xlsxToCsvEngine';

configure({ useWebWorkers: false });

function workbookFile(sheets: Array<{ name: string; rows: unknown[][] }>): File {
  const workbook = XLSX.utils.book_new();
  for (const sheet of sheets) {
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet(sheet.rows),
      sheet.name
    );
  }
  const bytes = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  return new File([bytes], 'source.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

describe('filename helpers', () => {
  it('sanitizes sheet names and uses a positional fallback', () => {
    expect(sanitizeSheetFileName('a/b:c*?', 0)).toBe('a_b_c__');
    expect(sanitizeSheetFileName('   ', 2)).toBe('sheet3');
  });

  it('creates a safe source workbook base name', () => {
    expect(workbookBaseName('report:2026.xlsx')).toBe('report_2026');
    expect(workbookBaseName('.xlsx')).toBe('workbook');
  });
});

describe('countCsvRows', () => {
  it('ignores line breaks inside quoted fields', () => {
    expect(countCsvRows('heading,value\nrow,"line 1\nline 2"')).toBe(2);
    expect(countCsvRows('')).toBe(0);
  });
});

describe('workbook signatures', () => {
  it('accepts ZIP-based XLSX and compound-file XLS signatures', () => {
    expect(
      hasExpectedWorkbookSignature(
        new Uint8Array([0x50, 0x4b, 0x03, 0x04]),
        'book.xlsx'
      )
    ).toBe(true);
    expect(
      hasExpectedWorkbookSignature(
        new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
        'book.xls'
      )
    ).toBe(true);
    expect(
      hasExpectedWorkbookSignature(new TextEncoder().encode('not a workbook'), 'book.xlsx')
    ).toBe(false);
  });
});

describe('convertWorkbookToCsv', () => {
  it('returns a BOM-prefixed CSV directly for one sheet', async () => {
    const result = await convertWorkbookToCsv(
      workbookFile([{ name: '日本語', rows: [['項目'], ['こんにちは']] }])
    );

    expect(result.outputKind).toBe('csv');
    expect(result.downloadName).toBe('日本語.csv');
    expect(result.sheets).toEqual([
      { sheetName: '日本語', fileName: '日本語.csv', rowCount: 2 },
    ]);
    const bytes = new Uint8Array(await result.blob.arrayBuffer());
    expect(Array.from(bytes.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
    expect(new TextDecoder().decode(bytes)).toContain('こんにちは');
  });

  it('packages multiple sheets in a ZIP', async () => {
    const result = await convertWorkbookToCsv(
      workbookFile([
        { name: 'First', rows: [['A'], [1]] },
        { name: 'Second', rows: [['B'], [2]] },
      ])
    );

    expect(result.outputKind).toBe('zip');
    expect(result.downloadName).toBe('source-sheets.zip');

    const reader = new ZipReader(
      new Uint8ArrayReader(new Uint8Array(await result.blob.arrayBuffer()))
    );
    try {
      const entries = await reader.getEntries();
      expect(entries.map((entry) => entry.filename)).toEqual([
        'First.csv',
        'Second.csv',
      ]);
      const first = await entries[0].getData(new Uint8ArrayWriter());
      expect(Array.from(first.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
    } finally {
      await reader.close();
    }
  });
});
