import { describe, expect, it } from 'vitest';
import {
  sanitizeFileName,
  validateFile,
  validateFileExtension,
  validateFileMimeType,
  validateTotalSize,
} from '@/utils/fileValidation';

const file = (name: string, type = '', size = 1): File =>
  ({ name, type, size }) as unknown as File;

describe('validateFileExtension', () => {
  it('accepts XLSX, XLSM, and XLS regardless of case', () => {
    expect(validateFileExtension('book.XLSX').valid).toBe(true);
    expect(validateFileExtension('book.xlsm').valid).toBe(true);
    expect(validateFileExtension('book.xls').valid).toBe(true);
  });

  it('rejects other extensions and names without an extension', () => {
    expect(validateFileExtension('book.csv')).toEqual({
      valid: false,
      error: 'errUnsupported',
    });
    expect(validateFileExtension('book')).toEqual({
      valid: false,
      error: 'errUnsupported',
    });
  });
});

describe('validateFileMimeType', () => {
  it('accepts MIME types used for supported workbooks', () => {
    expect(
      validateFileMimeType(
        file(
          'book.xlsx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
      ).valid
    ).toBe(true);
    expect(validateFileMimeType(file('book.xls', 'application/vnd.ms-excel')).valid).toBe(
      true
    );
  });

  it('accepts an empty MIME type and rejects an unrelated one', () => {
    expect(validateFileMimeType(file('book.xlsx')).valid).toBe(true);
    expect(validateFileMimeType(file('book.xlsx', 'text/plain'))).toEqual({
      valid: false,
      error: 'errUnsupportedMime',
    });
  });
});

describe('validateFile', () => {
  it('requires both a supported extension and a compatible MIME type', () => {
    expect(
      validateFile(
        file(
          'book.xlsx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
      ).valid
    ).toBe(true);
    expect(validateFile(file('book.png', 'image/png')).valid).toBe(false);
    expect(validateFile(file('book.xlsm', 'text/plain')).valid).toBe(false);
  });
});

describe('validateTotalSize', () => {
  it('does not impose an undocumented byte limit', () => {
    expect(validateTotalSize([file('book.xlsx', '', Number.MAX_SAFE_INTEGER)]).valid).toBe(
      true
    );
  });
});

describe('sanitizeFileName', () => {
  it('replaces reserved filename characters with underscores', () => {
    expect(sanitizeFileName('a/b\\c:d*e?f"g<h>i|j.xlsx')).toBe(
      'a_b_c_d_e_f_g_h_i_j.xlsx'
    );
  });
});
