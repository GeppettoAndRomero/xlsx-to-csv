import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { AppButton } from './AppButton';
import { AppCard } from './AppCard';
import { ErrorToast } from './ErrorToast';
import { AppError, resolveErrorMessage } from '@/utils/appError';
import { validateFile } from '@/utils/fileValidation';
import {
  convertWorkbookToCsv,
  type ConversionProgress,
  type WorkbookCsvResult,
} from '@/utils/xlsxToCsvEngine';

interface ConversionManagerProps {
  locale?: string;
}

interface ErrorToastItem {
  id: string;
  message: string;
}

interface InteractiveCopy {
  uploadHeading: string;
  uploadSubtitle: string;
  dropClick: string;
  dropOr: string;
  dropSupported: string;
  reading: string;
  converting: string;
  packaging: string;
  resultHeading: string;
  resultSingle: string;
  resultMultiple: string;
  outputFile: string;
  rowCount: string;
  downloadAgain: string;
  notificationsAria: string;
  errUnsupported: string;
  errUnsupportedMime: string;
  errOneFileOnly: string;
  errBusy: string;
  errCannotReadWorkbook: string;
  errNoSheets: string;
  errCreateDownload: string;
  errConversionFailed: string;
  errDownloadFailed: string;
}

const copy: Record<string, InteractiveCopy> = {
  en: {
    uploadHeading: 'Convert an Excel workbook to CSV',
    uploadSubtitle:
      'Choose one .xlsx, .xlsm, or .xls workbook. Each sheet becomes a UTF-8 CSV file.',
    dropClick: 'Choose an Excel workbook',
    dropOr: 'or drop one file anywhere on the page',
    dropSupported: 'Supported: .xlsx, .xlsm, and .xls',
    reading: 'Reading the workbook…',
    converting: 'Converting sheet {completed} of {total}: {name}',
    packaging: 'Preparing the download…',
    resultHeading: 'Conversion result',
    resultSingle: 'Converted 1 sheet. The CSV download has started.',
    resultMultiple: 'Converted {count} sheets. The ZIP download has started.',
    outputFile: 'Output: {name}',
    rowCount: '{count} rows',
    downloadAgain: 'Download again',
    notificationsAria: 'Notifications',
    errUnsupported: '{name} is not supported. Choose an .xlsx, .xlsm, or .xls workbook.',
    errUnsupportedMime: 'The browser reported an unsupported file type for {name}.',
    errOneFileOnly: 'Choose one Excel workbook at a time.',
    errBusy: 'Another workbook is being converted. Wait for it to finish before choosing another file.',
    errCannotReadWorkbook:
      'This workbook could not be read. It may be damaged, password-protected, or in an unsupported format.',
    errNoSheets: 'This workbook does not contain a sheet to convert.',
    errCreateDownload: 'The CSV files could not be packaged for download.',
    errConversionFailed: 'The workbook could not be converted.',
    errDownloadFailed: 'The converted file could not be downloaded.',
  },
  ja: {
    uploadHeading: 'Excel ブックを CSV に変換',
    uploadSubtitle:
      '.xlsx、.xlsm、.xls のいずれかを1ファイル選んでください。各シートを UTF-8 の CSV に変換します。',
    dropClick: 'Excel ブックを選択',
    dropOr: 'またはページ上に1ファイルをドロップ',
    dropSupported: '対応形式: .xlsx、.xlsm、.xls',
    reading: 'ブックを読み込んでいます…',
    converting: 'シートを変換中 {completed}/{total}: {name}',
    packaging: 'ダウンロードファイルを準備しています…',
    resultHeading: '変換結果',
    resultSingle: '1シートを変換しました。CSV のダウンロードを開始しました。',
    resultMultiple: '{count}シートを変換しました。ZIP のダウンロードを開始しました。',
    outputFile: '出力: {name}',
    rowCount: '{count} 行',
    downloadAgain: 'もう一度ダウンロード',
    notificationsAria: '通知',
    errUnsupported:
      '「{name}」は対応していません。.xlsx、.xlsm、.xls のいずれかを選んでください。',
    errUnsupportedMime: '「{name}」はブラウザから対応外のファイル形式として報告されました。',
    errOneFileOnly: 'Excel ブックは1ファイルずつ選んでください。',
    errBusy: '別のブックを変換中です。処理が終わってから次のファイルを選んでください。',
    errCannotReadWorkbook:
      'このブックを読み込めませんでした。ファイルの破損、パスワード保護、または非対応形式の可能性があります。',
    errNoSheets: 'このブックには変換するシートがありません。',
    errCreateDownload: 'CSV ファイルをダウンロード用にまとめられませんでした。',
    errConversionFailed: 'ブックを CSV に変換できませんでした。',
    errDownloadFailed: '変換後のファイルをダウンロードできませんでした。',
  },
  zh: {
    uploadHeading: '将 Excel 工作簿转换为 CSV',
    uploadSubtitle: '请选择一个 .xlsx、.xlsm 或 .xls 工作簿。每个工作表会生成一个 UTF-8 CSV 文件。',
    dropClick: '选择 Excel 工作簿',
    dropOr: '或将一个文件拖到页面任意位置',
    dropSupported: '支持格式：.xlsx、.xlsm、.xls',
    reading: '正在读取工作簿…',
    converting: '正在转换第 {completed}/{total} 个工作表：{name}',
    packaging: '正在准备下载文件…',
    resultHeading: '转换结果',
    resultSingle: '已转换 1 个工作表，CSV 文件已开始下载。',
    resultMultiple: '已转换 {count} 个工作表，ZIP 文件已开始下载。',
    outputFile: '输出文件：{name}',
    rowCount: '{count} 行',
    downloadAgain: '再次下载',
    notificationsAria: '通知',
    errUnsupported: '不支持“{name}”。请选择 .xlsx、.xlsm 或 .xls 工作簿。',
    errUnsupportedMime: '浏览器将“{name}”识别为不受支持的文件类型。',
    errOneFileOnly: '每次请选择一个 Excel 工作簿。',
    errBusy: '另一个工作簿仍在转换，请等待处理结束后再选择文件。',
    errCannotReadWorkbook: '无法读取此工作簿。文件可能已损坏、受密码保护或采用了不支持的格式。',
    errNoSheets: '此工作簿中没有可转换的工作表。',
    errCreateDownload: '无法将 CSV 文件打包为下载文件。',
    errConversionFailed: '无法将工作簿转换为 CSV。',
    errDownloadFailed: '无法下载转换后的文件。',
  },
  de: {
    uploadHeading: 'Excel-Arbeitsmappe in CSV umwandeln',
    uploadSubtitle:
      'Wähle eine .xlsx-, .xlsm- oder .xls-Datei aus. Jedes Tabellenblatt wird als UTF-8-CSV ausgegeben.',
    dropClick: 'Excel-Arbeitsmappe auswählen',
    dropOr: 'oder eine Datei auf der Seite ablegen',
    dropSupported: 'Unterstützt: .xlsx, .xlsm und .xls',
    reading: 'Arbeitsmappe wird gelesen…',
    converting: 'Blatt {completed} von {total} wird umgewandelt: {name}',
    packaging: 'Download wird vorbereitet…',
    resultHeading: 'Umwandlungsergebnis',
    resultSingle: '1 Tabellenblatt wurde umgewandelt. Der CSV-Download wurde gestartet.',
    resultMultiple: '{count} Tabellenblätter wurden umgewandelt. Der ZIP-Download wurde gestartet.',
    outputFile: 'Ausgabedatei: {name}',
    rowCount: '{count} Zeilen',
    downloadAgain: 'Erneut herunterladen',
    notificationsAria: 'Benachrichtigungen',
    errUnsupported:
      '„{name}“ wird nicht unterstützt. Wähle eine .xlsx-, .xlsm- oder .xls-Datei aus.',
    errUnsupportedMime: 'Der Browser hat für „{name}“ einen nicht unterstützten Dateityp gemeldet.',
    errOneFileOnly: 'Wähle jeweils nur eine Excel-Arbeitsmappe aus.',
    errBusy: 'Eine andere Arbeitsmappe wird noch umgewandelt. Warte, bevor du eine weitere auswählst.',
    errCannotReadWorkbook:
      'Diese Arbeitsmappe konnte nicht gelesen werden. Sie ist möglicherweise beschädigt, kennwortgeschützt oder in einem nicht unterstützten Format gespeichert.',
    errNoSheets: 'Diese Arbeitsmappe enthält kein Tabellenblatt zum Umwandeln.',
    errCreateDownload: 'Die CSV-Dateien konnten nicht für den Download verpackt werden.',
    errConversionFailed: 'Die Arbeitsmappe konnte nicht in CSV umgewandelt werden.',
    errDownloadFailed: 'Die umgewandelte Datei konnte nicht heruntergeladen werden.',
  },
  es: {
    uploadHeading: 'Convertir un libro de Excel a CSV',
    uploadSubtitle:
      'Elige un archivo .xlsx, .xlsm o .xls. Cada hoja se guardará como un CSV con codificación UTF-8.',
    dropClick: 'Elegir un libro de Excel',
    dropOr: 'o suelta un archivo en cualquier parte de la página',
    dropSupported: 'Formatos admitidos: .xlsx, .xlsm y .xls',
    reading: 'Leyendo el libro…',
    converting: 'Convirtiendo la hoja {completed} de {total}: {name}',
    packaging: 'Preparando la descarga…',
    resultHeading: 'Resultado de la conversión',
    resultSingle: 'Se ha convertido 1 hoja. La descarga del CSV ha comenzado.',
    resultMultiple: 'Se han convertido {count} hojas. La descarga del ZIP ha comenzado.',
    outputFile: 'Archivo de salida: {name}',
    rowCount: '{count} filas',
    downloadAgain: 'Descargar de nuevo',
    notificationsAria: 'Notificaciones',
    errUnsupported: '«{name}» no es compatible. Elige un archivo .xlsx, .xlsm o .xls.',
    errUnsupportedMime: 'El navegador ha identificado «{name}» como un tipo de archivo no compatible.',
    errOneFileOnly: 'Selecciona un solo libro de Excel cada vez.',
    errBusy: 'Se está convirtiendo otro libro. Espera a que termine antes de elegir otro archivo.',
    errCannotReadWorkbook:
      'No se pudo leer este libro. El archivo puede estar dañado, protegido con contraseña o guardado en un formato no compatible.',
    errNoSheets: 'Este libro no contiene hojas que se puedan convertir.',
    errCreateDownload: 'No se pudieron agrupar los archivos CSV para la descarga.',
    errConversionFailed: 'No se pudo convertir el libro a CSV.',
    errDownloadFailed: 'No se pudo descargar el archivo convertido.',
  },
};

function interpolate(template: string, params: Record<string, string | number>): string {
  return Object.entries(params).reduce(
    (text, [key, value]) => text.split(`{${key}}`).join(String(value)),
    template
  );
}

function startDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function progressText(progress: ConversionProgress | null, t: InteractiveCopy): string {
  if (!progress || progress.phase === 'reading') return t.reading;
  if (progress.phase === 'packaging') return t.packaging;

  return interpolate(t.converting, {
    completed: progress.completed + 1,
    total: progress.total,
    name: progress.sheetName ?? '',
  });
}

export function ConversionManager({ locale = 'en' }: ConversionManagerProps) {
  const t = copy[locale] ?? copy.en;
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [progress, setProgress] = useState<ConversionProgress | null>(null);
  const [result, setResult] = useState<WorkbookCsvResult | null>(null);
  const [sourceName, setSourceName] = useState('');
  const [errorToasts, setErrorToasts] = useState<ErrorToastItem[]>([]);

  const showErrorToast = useCallback((message: string) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    setErrorToasts((previous) => [...previous, { id, message }]);
  }, []);

  const removeErrorToast = useCallback((id: string) => {
    setErrorToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      if (busyRef.current) {
        showErrorToast(t.errBusy);
        return;
      }

      busyRef.current = true;
      setBusy(true);
      setProgress(null);
      setResult(null);
      setSourceName(file.name);

      try {
        const converted = await convertWorkbookToCsv(file, setProgress);
        setResult(converted);

        try {
          startDownload(converted.blob, converted.downloadName);
        } catch {
          showErrorToast(t.errDownloadFailed);
        }
      } catch (error) {
        showErrorToast(
          `${file.name}: ${resolveErrorMessage(error, t as unknown as Record<string, string>)}`
        );
      } finally {
        busyRef.current = false;
        setBusy(false);
        setProgress(null);
      }
    },
    [showErrorToast, t]
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      try {
        if (files.length !== 1) {
          if (files.length > 0) showErrorToast(t.errOneFileOnly);
          return;
        }

        const file = files[0];
        const validation = validateFile(file);
        if (!validation.valid) {
          showErrorToast(
            resolveErrorMessage(
              new AppError(validation.error ?? 'errConversionFailed', { name: file.name }),
              t as unknown as Record<string, string>
            )
          );
          return;
        }

        await processFile(file);
      } finally {
        window.dispatchEvent(new CustomEvent('filesProcessed'));
      }
    },
    [processFile, showErrorToast, t]
  );

  useEffect(() => {
    const handler = (event: Event) => {
      void handleFiles((event as CustomEvent<File[]>).detail);
    };
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [handleFiles]);

  const downloadAgain = useCallback(() => {
    if (!result) return;
    try {
      startDownload(result.blob, result.downloadName);
    } catch {
      showErrorToast(t.errDownloadFailed);
    }
  }, [result, showErrorToast, t]);

  const resultSummary = result
    ? result.sheetCount === 1
      ? t.resultSingle
      : interpolate(t.resultMultiple, { count: result.sheetCount })
    : '';

  return (
    <div>
      <AppCard>
        <div style="margin-bottom: var(--space-4);">
          <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">
            {t.uploadHeading}
          </h2>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">
            {t.uploadSubtitle}
          </p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => document.getElementById('file-input')?.click()}
          style={{
            width: '100%',
            padding: 'var(--space-6)',
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            textAlign: 'center',
            marginBottom: 'var(--space-4)',
            cursor: busy ? 'wait' : 'pointer',
          }}
        >
          <span style="display: block; font-size: 3rem; margin-bottom: var(--space-2);" aria-hidden="true">
            📄
          </span>
          <span style="display: block; font-size: var(--fs-3); font-weight: 600; margin-bottom: var(--space-2);">
            {t.dropClick}
          </span>
          <span style="display: block; font-size: var(--fs-1); color: var(--color-subtle);">
            {t.dropOr}
          </span>
          <span style="display: block; font-size: var(--fs-1); color: var(--color-subtle); margin-top: var(--space-1);">
            {t.dropSupported}
          </span>
        </button>

        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xlsm,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.ms-excel"
          onChange={(event) => {
            void handleFiles(Array.from(event.currentTarget.files || []));
            event.currentTarget.value = '';
          }}
          style="display: none;"
        />

        {busy && (
          <div role="status" aria-live="polite" style="color: var(--color-subtle);">
            {progressText(progress, t)}
          </div>
        )}

        {result && (
          <section
            data-testid="conversion-result"
            data-sheet-count={result.sheetCount}
            aria-live="polite"
            style="padding: var(--space-4); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-sm);"
          >
            <h3 style="margin: 0; font-size: var(--fs-3);">{t.resultHeading}</h3>
            <p style="margin: var(--space-2) 0 0 0;">
              <strong>{sourceName}</strong>
            </p>
            <p style="margin: var(--space-2) 0 0 0; font-size: var(--fs-2); color: var(--color-subtle);">
              {resultSummary}
            </p>
            <p style="margin: var(--space-1) 0 0 0; font-size: var(--fs-2); color: var(--color-subtle);">
              {interpolate(t.outputFile, { name: result.downloadName })}
            </p>

            <ul
              data-testid="sheet-results"
              style="margin: var(--space-4) 0; padding-left: var(--space-5);"
            >
              {result.sheets.map((sheet) => (
                <li key={sheet.fileName} data-sheet-name={sheet.sheetName}>
                  <span>{sheet.fileName}</span>
                  {' — '}
                  <span class="num">{interpolate(t.rowCount, { count: sheet.rowCount })}</span>
                </li>
              ))}
            </ul>

            <AppButton variant="secondary" onClick={downloadAgain}>
              {t.downloadAgain}
            </AppButton>
          </section>
        )}
      </AppCard>

      {errorToasts.length > 0 && (
        <div className="error-toast-container" aria-label={t.notificationsAria}>
          {errorToasts.map((toast) => (
            <ErrorToast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              onClose={removeErrorToast}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
