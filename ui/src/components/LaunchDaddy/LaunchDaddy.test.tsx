import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LaunchDaddyProvider } from './LaunchDaddyContext';
import { useLaunchDaddy } from './useLaunchDaddy';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <LaunchDaddyProvider>{children}</LaunchDaddyProvider>
);

describe('useLaunchDaddy', () => {
  it('toggles isLaunchDaddyMode after 5 quick taps', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useLaunchDaddy(), { wrapper });

    expect(result.current.isLaunchDaddyMode).toBe(false);
    expect(result.current.secretTapCount).toBe(0);

    // Tap 4 times
    for (let i = 1; i <= 4; i++) {
      act(() => {
        result.current.handleSecretTap();
      });
      expect(result.current.secretTapCount).toBe(i);
      expect(result.current.isLaunchDaddyMode).toBe(false);
    }

    // 5th tap toggles mode
    act(() => {
      result.current.handleSecretTap();
    });
    expect(result.current.isLaunchDaddyMode).toBe(true);
    expect(result.current.secretTapCount).toBe(0);

    vi.useRealTimers();
  });

  it('resets tap count if taps are spaced more than 2 seconds apart', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useLaunchDaddy(), { wrapper });

    act(() => {
      result.current.handleSecretTap();
    });
    expect(result.current.secretTapCount).toBe(1);

    // Advance time by 2.1 seconds
    act(() => {
      vi.advanceTimersByTime(2100);
    });

    // Next tap should reset count to 1 instead of going to 2
    act(() => {
      result.current.handleSecretTap();
    });
    expect(result.current.secretTapCount).toBe(1);

    vi.useRealTimers();
  });
});
