/**
 * Compatibility types used by the frozen ToastNotification component.
 * XLSX-to-CSV runs on the main thread and does not create worker jobs.
 */

export type JobStatus = 'pending' | 'processing' | 'succeeded' | 'failed';
export type ProcessingPhase = 'decode' | 'resize' | 'encode' | 'complete';

export interface ConversionJob {
  id: string;
  file: File;
  status: JobStatus;
  phase?: ProcessingPhase;
  progress: number;
}
