import { useContext } from 'react';
import { SocketContext } from '../state/socketContext';
import type { RadarConfig, CameraStatus } from '../state/socketContext';

export type { RadarConfig, CameraStatus };

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
