import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, validateSettings } from '@/utils/settings';

describe('settings', () => {
  it('has no user-configurable conversion settings', () => {
    expect(DEFAULT_SETTINGS).toEqual({});
  });

  it('accepts the empty compatibility model', () => {
    expect(validateSettings(DEFAULT_SETTINGS)).toEqual({
      valid: true,
      errors: {},
    });
  });
});
