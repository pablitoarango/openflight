import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeAll } from 'vitest';
import { UnitPreferenceProvider } from './UnitPreferenceProvider';
import { useUnitPreference } from './useUnitPreference';
import type { ReactNode } from 'react';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <UnitPreferenceProvider>{children}</UnitPreferenceProvider>
);

describe('UnitPreferenceProvider state context', () => {
  it('initializes with default imperial unit preference', () => {
    const { result } = renderHook(() => useUnitPreference(), { wrapper });

    expect(result.current.unitSystem).toBe('imperial');
  });

  it('updates unit preference when setUnitSystem is called', () => {
    const { result } = renderHook(() => useUnitPreference(), { wrapper });

    act(() => {
      result.current.setUnitSystem('metric');
    });

    expect(result.current.unitSystem).toBe('metric');

    act(() => {
      result.current.setUnitSystem('imperial');
    });

    expect(result.current.unitSystem).toBe('imperial');
  });
});
