import { describe, expect, it } from 'vitest';
import type { Shot } from './shot';
import { computeStats, getUniqueClubs } from './shot';

const mockShot = (overrides: Partial<Shot> = {}): Shot => ({
  ball_speed_mph: 100,
  club_speed_mph: 80,
  smash_factor: 1.25,
  estimated_carry_yards: 150,
  carry_range: [140, 160],
  club: '7-iron',
  timestamp: new Date().toISOString(),
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
  ...overrides,
});

describe('shot stats calculations', () => {
  it('handles empty shot lists safely', () => {
    const stats = computeStats([]);
    expect(stats.shot_count).toBe(0);
    expect(stats.avg_ball_speed).toBe(0);
    expect(stats.max_ball_speed).toBe(0);
    expect(stats.min_ball_speed).toBe(0);
    expect(stats.avg_club_speed).toBeNull();
    expect(stats.avg_smash_factor).toBeNull();
    expect(stats.avg_carry_est).toBe(0);
  });

  it('handles single shot lists safely without failing on std_dev', () => {
    const stats = computeStats([mockShot({ ball_speed_mph: 100 })]);
    expect(stats.shot_count).toBe(1);
    expect(stats.avg_ball_speed).toBe(100);
    expect(stats.std_dev).toBe(0);
  });

  it('computes correct average, min, max, and std dev speed metrics', () => {
    const shots = [
      mockShot({ ball_speed_mph: 100, club_speed_mph: 80, smash_factor: 1.25, estimated_carry_yards: 150 }),
      mockShot({ ball_speed_mph: 120, club_speed_mph: 90, smash_factor: 1.33, estimated_carry_yards: 190 }),
      mockShot({ ball_speed_mph: 140, club_speed_mph: 100, smash_factor: 1.4, estimated_carry_yards: 230 }),
    ];

    const stats = computeStats(shots);

    expect(stats.shot_count).toBe(3);
    expect(stats.avg_ball_speed).toBe(120);
    expect(stats.max_ball_speed).toBe(140);
    expect(stats.min_ball_speed).toBe(100);
    expect(stats.std_dev).toBe(20);
    expect(stats.avg_club_speed).toBe(90);
    expect(stats.avg_smash_factor).toBeCloseTo(1.327, 3);
    expect(stats.avg_carry_est).toBe(190);
  });

  it('ignores null values for club speed and smash factor calculations', () => {
    const shots = [
      mockShot({ ball_speed_mph: 100, club_speed_mph: 80, smash_factor: 1.25 }),
      mockShot({ ball_speed_mph: 120, club_speed_mph: null, smash_factor: null }),
    ];

    const stats = computeStats(shots);

    expect(stats.avg_club_speed).toBe(80);
    expect(stats.avg_smash_factor).toBe(1.25);
  });

  it('extracts unique clubs lists correctly', () => {
    const shots = [
      mockShot({ club: 'driver' }),
      mockShot({ club: '7-iron' }),
      mockShot({ club: 'driver' }),
    ];

    const uniqueClubs = getUniqueClubs(shots);
    expect(uniqueClubs).toContain('driver');
    expect(uniqueClubs).toContain('7-iron');
    expect(uniqueClubs).toHaveLength(2);
  });
});
