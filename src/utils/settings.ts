/**
 * XLSX-to-CSV has no user-configurable conversion settings. UTF-8 BOM output
 * and the single-CSV/multi-sheet-ZIP behavior are part of the file contract.
 *
 * These broad aliases keep the frozen, unused SettingsPanel type-checkable
 * without retaining image-conversion settings or defaults.
 */
export type OutputFormat = string;
export type ResizeMode = string;
export type ConversionSettings = Record<string, any>;

export const DEFAULT_SETTINGS: ConversionSettings = {};

export function validateSettings(_settings: ConversionSettings): {
  valid: boolean;
  errors: Record<string, string>;
} {
  return { valid: true, errors: {} };
}
