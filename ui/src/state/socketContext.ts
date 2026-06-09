import { createContext } from 'react';
import type { TriggerDiagnostic, TriggerStatus } from '../types/shot';

export interface RadarConfig {
  min_speed: number;
  max_speed: number;
  min_magnitude: number;
  transmit_power: number;
}

export interface CameraStatus {
  available: boolean;
  enabled: boolean;
  streaming: boolean;
  ball_detected: boolean;
  ball_confidence: number;
}

export interface SocketContextValue {
  connected: boolean;
  mockMode: boolean;
  debugMode: boolean;
  radarConfig: RadarConfig;
  cameraStatus: CameraStatus;
  triggerDiagnostics: TriggerDiagnostic[];
  triggerStatus: TriggerStatus;
  clearSession: () => void;
  setClub: (club: string) => void;
  simulateShot: () => void;
  toggleDebug: () => void;
  updateRadarConfig: (config: Partial<RadarConfig>) => void;
  toggleCamera: () => void;
  toggleCameraStream: () => void;
}

export const SocketContext = createContext<SocketContextValue | null>(null);
