import * as fs from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import * as XLSX from 'xlsx';

XLSX.set_fs(fs);

function outputPath(fileName) {
  return fileURLToPath(new URL(`./${fileName}`, import.meta.url));
}

const multiSheetBook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
  multiSheetBook,
  XLSX.utils.aoa_to_sheet([
    ['項目', '値'],
    ['文字列', 'こんにちは'],
    ['改行', '1行目\n2行目'],
  ]),
  '日本語'
);

XLSX.utils.book_append_sheet(
  multiSheetBook,
  XLSX.utils.aoa_to_sheet([
    ['Format', 'Value'],
    ['Source', 'Generated test fixture'],
  ]),
  'Summary'
);

XLSX.utils.book_append_sheet(
  multiSheetBook,
  XLSX.utils.aoa_to_sheet([]),
  '空'
);

XLSX.writeFile(multiSheetBook, outputPath('multi-sheet.xlsx'), {
  bookType: 'xlsx',
  compression: true,
});

const singleSheetBook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(
  singleSheetBook,
  XLSX.utils.aoa_to_sheet([
    ['名前', '値'],
    ['サンプル', 1],
  ]),
  'データ'
);

XLSX.writeFile(singleSheetBook, outputPath('single-sheet.xlsx'), {
  bookType: 'xlsx',
  compression: true,
});
