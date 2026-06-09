import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ShotProvider } from './ShotProvider';
import { useShotContext } from './useShotContext';
import type { Shot } from '../types/shot';
import type { ReactNode } from 'react';

const mockShot = (id: string): Shot => ({
  ball_speed_mph: 100,
  club_speed_mph: 80,
  smash_factor: 1.25,
  estimated_carry_yards: 150,
  carry_range: [140, 160],
  club: '7-iron',
  timestamp: id,
  peak_magnitude: 50,
  launch_angle_vertical: 18,
  launch_angle_horizontal: 0,
  launch_angle_confidence: 1.0,
  angle_source: 'radar',
  club_angle_deg: null,
  club_path_deg: null,
  spin_axis_deg: null,
  spin_rpm: 5000,
  spin_confidence: 1.0,
  spin_quality: 'high',
  carry_spin_adjusted: 155,
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <ShotProvider>{children}</ShotProvider>
);

describe('ShotProvider state context', () => {
  it('initializes with null latestShot and empty shots list', () => {
    const { result } = renderHook(() => useShotContext(), { wrapper });

    expect(result.current.latestShot).toBeNull();
    expect(result.current.shots).toEqual([]);
    expect(result.current.isNewShot).toBe(false);
  });

  it('adds a shot to history, updates latestShot, and sets isNewShot', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useShotContext(), { wrapper });
    const shot = mockShot('shot-1');

    act(() => {
      result.current.addShot(shot);
    });

    expect(result.current.latestShot).toEqual(shot);
    expect(result.current.shots).toEqual([shot]);
    expect(result.current.isNewShot).toBe(true);

    // After 2.5 seconds, isNewShot transitions back to false
    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(result.current.isNewShot).toBe(false);
    vi.useRealTimers();
  });

  it('caps history at 200 shots to prevent memory issues', () => {
    const { result } = renderHook(() => useShotContext(), { wrapper });

    act(() => {
      for (let i = 0; i < 205; i++) {
        result.current.addShot(mockShot(`shot-${i}`));
      }
    });

    expect(result.current.shots).toHaveLength(200);
    // The oldest 5 shots should have been discarded (first elements in array are oldest)
    expect(result.current.shots[0].timestamp).toBe('shot-5');
    expect(result.current.latestShot?.timestamp).toBe('shot-204');
  });

  it('resets state when clearShots is called', () => {
    const { result } = renderHook(() => useShotContext(), { wrapper });

    act(() => {
      result.current.addShot(mockShot('shot-1'));
      result.current.clearShots();
    });

    expect(result.current.latestShot).toBeNull();
    expect(result.current.shots).toEqual([]);
  });
});
