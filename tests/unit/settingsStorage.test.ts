// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { loadSettings, saveSettings } from '@/utils/settingsStorage';
import { DEFAULT_SETTINGS } from '@/utils/settings';

describe('settingsStorage', () => {
  beforeEach(() => localStorage.clear());

  it('returns the defaults when nothing is stored', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('round-trips saved settings', () => {
    const s = {};
    saveSettings(s);
    expect(loadSettings()).toEqual(s);
  });

  it('merges a stored partial over the defaults', () => {
    localStorage.setItem('xlsx-to-csv-settings', JSON.stringify({ compatibilityValue: true }));
    const loaded = loadSettings();
    expect(loaded).toEqual({ compatibilityValue: true });
  });

  it('falls back to the defaults on malformed JSON', () => {
    localStorage.setItem('xlsx-to-csv-settings', '{not valid json');
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });
});
