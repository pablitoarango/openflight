/**
 * Sends a shutdown request to the server API.
 */
export async function shutdownServer(): Promise<void> {
  try {
    await fetch('/api/shutdown', { method: 'POST' });
  } catch (error) {
    console.error('Failed to shut down server:', error);
  }
}
