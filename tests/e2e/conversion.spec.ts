import { readFileSync } from 'node:fs';
import {
  Uint8ArrayReader,
  Uint8ArrayWriter,
  ZipReader,
  configure,
} from '@zip.js/zip.js';
import { expect, test, type Page } from '@playwright/test';
import { convert, waitReady } from './_helpers';

configure({ useWebWorkers: false });

const UTF8_BOM = [0xef, 0xbb, 0xbf];

function trackExternalRequests(page: Page): string[] {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (
      !url.startsWith('http://localhost:4321') &&
      !url.startsWith('data:') &&
      !url.startsWith('blob:')
    ) {
      externalRequests.push(url);
    }
  });
  return externalRequests;
}

async function unzipCsvFiles(bytes: Uint8Array): Promise<Map<string, Uint8Array>> {
  const reader = new ZipReader(new Uint8ArrayReader(bytes));
  const output = new Map<string, Uint8Array>();

  try {
    const entries = await reader.getEntries();
    for (const entry of entries) {
      if (!entry.directory) {
        output.set(entry.filename, await entry.getData(new Uint8ArrayWriter()));
      }
    }
  } finally {
    await reader.close();
  }

  return output;
}

function expectUtf8Bom(bytes: Uint8Array): void {
  expect(Array.from(bytes.slice(0, 3))).toEqual(UTF8_BOM);
}

test.describe('XLSX to CSV conversion', () => {
  test('converts every sheet to a BOM-prefixed CSV in a ZIP with no upload', async ({
    page,
  }) => {
    const externalRequests = trackExternalRequests(page);

    await page.goto('/xlsx-to-csv/');
    await waitReady(page);
    const download = await convert(page);

    expect(download.suggestedFilename()).toBe('multi-sheet-sheets.zip');
    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();

    const csvFiles = await unzipCsvFiles(
      new Uint8Array(readFileSync(downloadPath as string))
    );
    expect([...csvFiles.keys()]).toEqual([
      '日本語.csv',
      'Summary.csv',
      '空.csv',
    ]);

    const japaneseCsv = csvFiles.get('日本語.csv');
    const summaryCsv = csvFiles.get('Summary.csv');
    const emptyCsv = csvFiles.get('空.csv');
    expect(japaneseCsv).toBeDefined();
    expect(summaryCsv).toBeDefined();
    expect(emptyCsv).toBeDefined();

    expectUtf8Bom(japaneseCsv as Uint8Array);
    expectUtf8Bom(summaryCsv as Uint8Array);
    expectUtf8Bom(emptyCsv as Uint8Array);
    expect(new TextDecoder().decode(japaneseCsv as Uint8Array)).toContain(
      '文字列,こんにちは'
    );
    expect(new TextDecoder().decode(japaneseCsv as Uint8Array)).toContain(
      '"1行目\n2行目"'
    );
    expect(new TextDecoder().decode(summaryCsv as Uint8Array)).toContain(
      'Source,Generated test fixture'
    );
    expect((emptyCsv as Uint8Array).byteLength).toBe(3);

    const result = page.getByTestId('conversion-result');
    await expect(result).toHaveAttribute('data-sheet-count', '3');
    await expect(page.getByTestId('sheet-results')).toContainText('日本語.csv — 3 rows');
    await expect(page.getByTestId('sheet-results')).toContainText('Summary.csv — 2 rows');
    await expect(page.getByTestId('sheet-results')).toContainText('空.csv — 0 rows');
    expect(
      externalRequests,
      `unexpected cross-origin requests: ${externalRequests.join(', ')}`
    ).toHaveLength(0);
  });

  test('downloads a one-sheet workbook directly as CSV', async ({ page }) => {
    await page.goto('/xlsx-to-csv/');
    await waitReady(page);
    const download = await convert(page, 'single');

    // WebKit on macOS can round-trip a downloaded file through APFS, which
    // normalizes non-ASCII filenames to NFD; normalize before comparing so the
    // assertion checks the visible characters, not the underlying byte form.
    expect(download.suggestedFilename().normalize('NFC')).toBe('データ.csv');
    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();

    const csv = new Uint8Array(readFileSync(downloadPath as string));
    expectUtf8Bom(csv);
    expect(new TextDecoder().decode(csv)).toContain('サンプル,1');

    const result = page.getByTestId('conversion-result');
    await expect(result).toHaveAttribute('data-sheet-count', '1');
    await expect(page.getByTestId('sheet-results')).toContainText('データ.csv — 2 rows');
  });

  test('shows a readable error for a damaged workbook', async ({ page }) => {
    await page.goto('/xlsx-to-csv/');
    await waitReady(page);

    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('filesDropped', {
          detail: [
            new File(['not an Excel workbook'], 'damaged.xlsx', {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
          ],
        })
      );
    });

    await expect(page.getByRole('alert')).toContainText(
      'This workbook could not be read'
    );
  });
});
