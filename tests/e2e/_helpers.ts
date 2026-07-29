import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { type Download, type Page } from '@playwright/test';

const MULTI_SHEET_B64 = readFileSync(
  fileURLToPath(new URL('../fixtures/xlsx/multi-sheet.xlsx', import.meta.url))
).toString('base64');

const SINGLE_SHEET_B64 = readFileSync(
  fileURLToPath(new URL('../fixtures/xlsx/single-sheet.xlsx', import.meta.url))
).toString('base64');

export async function waitReady(page: Page) {
  await page.waitForFunction(
    () => (window as Record<string, unknown>).__toolReady === true
  );
}

export async function convert(
  page: Page,
  fixture: 'multi' | 'single' = 'multi'
): Promise<Download> {
  const selected =
    fixture === 'multi'
      ? { base64: MULTI_SHEET_B64, name: 'multi-sheet.xlsx' }
      : { base64: SINGLE_SHEET_B64, name: 'single-sheet.xlsx' };

  const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
  await page.evaluate(({ base64, name }) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    window.dispatchEvent(
      new CustomEvent('filesDropped', {
        detail: [
          new File([bytes], name, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        ],
      })
    );
  }, selected);

  return downloadPromise;
}
