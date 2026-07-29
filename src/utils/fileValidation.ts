export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const ALLOWED_EXTENSIONS = ['.xlsx', '.xlsm', '.xls'] as const;
export const ALLOWED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel.sheet.macroenabled.12',
  'application/vnd.ms-excel',
  'application/zip',
  'application/octet-stream',
] as const;

export function validateFileExtension(fileName: string): ValidationResult {
  const dot = fileName.lastIndexOf('.');
  const extension = dot >= 0 ? fileName.slice(dot).toLowerCase() : '';

  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(extension)) {
    return { valid: false, error: 'errUnsupported' };
  }

  return { valid: true };
}

export function validateFileMimeType(file: File): ValidationResult {
  const mimeType = file.type.toLowerCase();
  if (mimeType && !(ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType)) {
    return { valid: false, error: 'errUnsupportedMime' };
  }

  return { valid: true };
}

export function validateFile(file: File): ValidationResult {
  const extensionResult = validateFileExtension(file.name);
  if (!extensionResult.valid) {
    return extensionResult;
  }

  const mimeResult = validateFileMimeType(file);
  if (!mimeResult.valid) {
    return mimeResult;
  }

  return { valid: true };
}

/**
 * Kept for the frozen FileUpload component. This tool does not impose a
 * separate byte-size limit; ConversionManager enforces one workbook at a time.
 */
export function validateTotalSize(_files: File[]): ValidationResult {
  return { valid: true };
}

export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[\\/:*?"<>|]/g, '_');
}
