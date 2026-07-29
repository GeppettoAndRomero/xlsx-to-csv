import { test, expect } from '@playwright/test';
import { waitReady, convert } from './_helpers';

// Content routing is engine-independent; one browser is enough.
test.describe('i18n', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'content routing (one engine)');
  });

  for (const loc of [
    { path: '/xlsx-to-csv/', lang: 'en' },
    { path: '/xlsx-to-csv/ja/', lang: 'ja' },
  ]) {
    test(`converts on the ${loc.lang} route (#5)`, async ({ page }) => {
      await page.goto(loc.path);
      await waitReady(page);
      await convert(page);
    });
  }

  test('serves every locale with the correct <html lang>', async ({ page }) => {
    const expected: Array<[string, string]> = [
      ['/xlsx-to-csv/', 'en'],
      ['/xlsx-to-csv/ja/', 'ja'],
      ['/xlsx-to-csv/zh/', 'zh-Hans'],
      ['/xlsx-to-csv/de/', 'de'],
      ['/xlsx-to-csv/es/', 'es'],
    ];
    for (const [path, lang] of expected) {
      await page.goto(path);
      expect(await page.getAttribute('html', 'lang'), `lang on ${path}`).toBe(lang);
    }
  });
});
