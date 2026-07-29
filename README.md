# xlsx-to-csv

Convert each sheet in an Excel workbook to a UTF-8 CSV file in the browser.
The workbook is not uploaded.

Part of [runlocally](https://runlocally.app) — small tools that run locally on
your device.

## How it works

SheetJS reads `.xlsx`, `.xlsm`, and `.xls` workbooks and converts each
worksheet with `sheet_to_csv`. Every CSV starts with a UTF-8 byte order mark.
A one-sheet workbook downloads as CSV; two or more sheets are packaged with
zip.js in a file named `<workbook>-sheets.zip`.

SheetJS and zip.js are loaded after a workbook is selected, so they are not
part of the initial page bundle.

## Output notes

- Each worksheet becomes a separate CSV file.
- Reserved filename characters in sheet names are replaced with underscores.
- The result shows the output filename and row count for each sheet.
- Formula results stored in the workbook are used; formulas are not
  recalculated.
- CSV does not include formatting, charts, embedded images, formulas, macros,
  or other workbook-only features.

## Develop

```bash
npm run dev
npm run type-check
npm run lint
npm run test:unit
npm run build
```

The E2E fixtures can be regenerated with:

```bash
node tests/fixtures/xlsx/create-fixtures.mjs
```

## License

[MIT](./LICENSE). Third-party dependency notices are listed in
[NOTICE.md](./NOTICE.md).
