import { SensorData } from './types/sensor';

// The SCD41 is read by a small service on the Pi itself (pihome-sensor.service),
// because only one process can own the I2C bus. The kiosk browser runs on that
// same Pi, so localhost is the right address even though the page is served
// from Vercel. Mixed-content blocking is handled by a Chromium flag on the
// kiosk; in any other browser this fetch simply fails and we keep the mock.
const SENSOR_URL = 'http://127.0.0.1:8765/sensor';

interface SensorResponse extends Partial<SensorData> {
  ok?: boolean;
}

/** Returns live readings, or null if the sensor service can't be reached. */
export const fetchSensorData = async (): Promise<SensorData | null> => {
  try {
    const response = await fetch(SENSOR_URL, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) return null;

    const data: SensorResponse = await response.json();

    // `ok: false` means the service is up but the sensor dropped out, so the
    // numbers it holds are stale rather than wrong-but-current.
    if (!data.ok) return null;
    if (
      typeof data.co2 !== 'number' ||
      typeof data.temperature !== 'number' ||
      typeof data.humidity !== 'number'
    ) {
      return null;
    }

    return {
      co2: data.co2,
      temperature: data.temperature,
      humidity: data.humidity,
      timestamp: data.timestamp ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
};
