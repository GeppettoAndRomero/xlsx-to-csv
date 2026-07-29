import { describe, expect, it } from 'vitest';
import { AppError, resolveErrorMessage } from '@/utils/appError';

const en = {
  errCannotReadWorkbook: 'Could not read {name}.',
  errConversionFailed: 'The workbook could not be converted.',
};

const ja = {
  errCannotReadWorkbook: '「{name}」を読み込めませんでした。',
  errConversionFailed: 'ブックを変換できませんでした。',
};

describe('resolveErrorMessage', () => {
  it('maps stable error codes and interpolates parameters', () => {
    expect(
      resolveErrorMessage(
        new AppError('errCannotReadWorkbook', { name: 'damaged.xlsx' }),
        en
      )
    ).toBe('Could not read damaged.xlsx.');
    expect(
      resolveErrorMessage(
        new AppError('errCannotReadWorkbook', { name: '破損.xlsx' }),
        ja
      )
    ).toBe('「破損.xlsx」を読み込めませんでした。');
  });

  it('accepts a forwarded string code', () => {
    expect(resolveErrorMessage('errCannotReadWorkbook', en)).toBe(
      'Could not read {name}.'
    );
  });

  it('falls back to the localized generic message for an unmapped error', () => {
    expect(resolveErrorMessage('internal parser detail', en)).toBe(
      en.errConversionFailed
    );
    expect(resolveErrorMessage(undefined, ja)).toBe(ja.errConversionFailed);
  });
});
