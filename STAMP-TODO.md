# xlsx-to-csv implementation status

- `src/utils/xlsxToCsvEngine.ts` reads XLSX, XLSM, and XLS files with SheetJS.
- Each worksheet is converted to a UTF-8 BOM-prefixed CSV.
- One-sheet workbooks download as CSV; multiple sheets download in a ZIP.
- SheetJS and zip.js are dynamically imported into separate chunks.
- `ConversionManager.tsx` reports progress, sheet count, filenames, and rows.
- Five page-content locales and the global drop-zone message are updated.
- Unit tests cover validation, filenames, CSV rows, direct CSV, and ZIP output.
- E2E fixtures are generated with SheetJS and cover single- and multi-sheet output.
