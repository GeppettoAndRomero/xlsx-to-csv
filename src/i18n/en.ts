import type { ToolContent } from './types';

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'XLSX to CSV — One CSV per Sheet, No Upload | runlocally',
    description:
      'Convert an XLSX, XLSM, or XLS workbook to UTF-8 CSV files in your browser. Each sheet becomes a CSV; multi-sheet results are downloaded as a ZIP.',
    ogTitle: 'XLSX to CSV — One CSV per Sheet',
    ogDescription:
      'Convert Excel workbook sheets to UTF-8 CSV files in your browser. The workbook is not uploaded.',
  },

  hero: {
    h1: 'XLSX to CSV',
    tagline:
      'Turn each sheet in an Excel workbook into a UTF-8 CSV file. Processing stays in your browser.',
  },

  intro: {
    h2: 'Split an Excel workbook into CSV files',
    paras: [
      'An Excel workbook can contain several sheets, while a CSV file represents one table. This tool reads .xlsx, .xlsm, and older .xls workbooks and creates one CSV file for each sheet.',
      'A one-sheet workbook is downloaded as a CSV. When the workbook has two or more sheets, the CSV files are placed in a ZIP named after the source workbook. Characters that cannot be used in common filenames are replaced in sheet-based filenames.',
    ],
  },

  privacy: {
    h2: 'The workbook is processed on your device',
    lead: 'Workbook reading, CSV conversion, and ZIP creation run in the browser:',
    points: [
      'The selected workbook is not sent to a conversion server.',
      'The page is served as static files and has no server endpoint for workbook processing.',
      'The source code is available under the MIT license.',
      'Once the required app resources are cached, conversion can run without a network connection.',
    ],
    note: "You can inspect the browser's Network panel during conversion; no request contains the workbook.",
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to use it',
    steps: [
      {
        h3: 'Choose one workbook',
        p: 'Select an .xlsx, .xlsm, or .xls file, or drop it on the page.',
      },
      {
        h3: 'Wait for each sheet to be converted',
        p: 'The result lists the generated CSV filename and row count for every sheet.',
      },
      {
        h3: 'Save the output',
        p: 'A single sheet downloads as CSV. Multiple sheets download together in a ZIP whose name ends with “-sheets.zip”.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Is my Excel workbook uploaded?',
      a: 'No. The workbook is read and converted by code running in your browser. There is no file-processing server in this tool.',
    },
    {
      q: 'Which Excel formats are supported?',
      a: 'The tool accepts .xlsx, macro-enabled .xlsm, and the older binary .xls format. Password-protected or encrypted workbooks may not be readable.',
    },
    {
      q: 'What happens when a workbook has several sheets?',
      a: 'Each sheet becomes a separate CSV file. If there are two or more sheets, the browser downloads them in one ZIP. A workbook with one sheet downloads directly as CSV.',
    },
    {
      q: 'Which character encoding is used?',
      a: 'CSV files use UTF-8 with a byte order mark (BOM). The BOM helps Excel identify UTF-8 text, including Japanese and other non-Latin characters.',
    },
    {
      q: 'How are formulas handled?',
      a: 'The converter uses the formula result stored in the workbook. It does not recalculate formulas, so a missing or outdated cached result remains missing or outdated in the CSV.',
    },
    {
      q: 'Are formatting, charts, images, or macros included?',
      a: 'No. CSV stores cell text as rows and columns. Formatting, charts, embedded images, formulas themselves, macros, and workbook features are not part of the CSV output.',
    },
    {
      q: 'Does it work offline?',
      a: 'Yes, after the page and conversion resources have been cached by the browser. The tool can also be installed as a PWA.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      "Built and maintained by Geppetto. AI assistance is used for some code and copy; the maintainer reviews the resulting work.",
    securityText: 'Security',
  },
};
