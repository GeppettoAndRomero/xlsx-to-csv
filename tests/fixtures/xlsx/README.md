# XLSX fixtures

`multi-sheet.xlsx` contains three sheets, including Japanese text, a quoted
line break, and an empty sheet. `single-sheet.xlsx` covers the direct-CSV
download path.

Both files are generated with SheetJS:

```sh
node tests/fixtures/xlsx/create-fixtures.mjs
```
