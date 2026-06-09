import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeAll } from 'vitest';
import { UnitPreferenceProvider } from '../state/UnitPreferenceProvider';
import type { CameraStatus } from '../hooks/useSocket';
import type { Shot } from '../types/shot';
import { DisplayMode } from './DisplayMode';

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

const cameraStatus: CameraStatus = {
  available: true,
  enabled: true,
  streaming: true,
  ball_detected: false,
  ball_confidence: 0,
};

const shot: Shot = {
  ball_speed_mph: 151.2,
  club_speed_mph: 101.1,
  smash_factor: 1.5,
  estimated_carry_yards: 254,
  carry_range: [244, 264],
  club: 'driver',
  timestamp: '2026-05-18T12:00:00Z',
  peak_magnitude: 42,
  launch_angle_vertical: 13.4,
  launch_angle_horizontal: -1.2,
  launch_angle_confidence: 0.82,
  angle_source: 'radar',
  club_angle_deg: 1.1,
  club_path_deg: 2.5,
  spin_axis_deg: -3.1,
  spin_rpm: 2450,
  spin_confidence: 0.8,
  spin_quality: 'high',
  carry_spin_adjusted: 261,
};

describe('DisplayMode', () => {
  it('renders latest shot metrics and recent shot strip', () => {
    render(
      <UnitPreferenceProvider>
        <DisplayMode connected cameraStatus={cameraStatus} latestShot={shot} shots={[shot]} />
      </UnitPreferenceProvider>,
    );

    expect(screen.getByText('OpenFlight Display')).toBeDefined();
    expect(screen.getByText('151.2')).toBeDefined();
    expect(screen.getByText('261')).toBeDefined();
    expect(screen.getByText('Socket connected')).toBeDefined();
    expect(screen.getByText('#1')).toBeDefined();
  });
});
