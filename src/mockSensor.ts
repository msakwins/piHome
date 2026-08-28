import { SensorData } from './types/sensor';

// Plausible indoor resting values. A real home sits far below the 2000 ppm
// "bad air" mark unless a room has been shut up with people in it, so the old
// uniform 400-2400 range read as a permanent CO2 alarm.
let co2 = 620;
let temperature = 21.5;
let humidity = 48;

// Random values that jump on every read look fake on a wall display. Drifting
// from the previous reading looks like an actual sensor instead.
const drift = (value: number, step: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value + (Math.random() - 0.5) * 2 * step));

export function getMockSensorData(): SensorData {
  co2 = drift(co2, 90, 450, 1300);
  temperature = drift(temperature, 0.3, 19, 24);
  humidity = drift(humidity, 3, 35, 62);

  return {
    co2: Math.round(co2),
    temperature: +temperature.toFixed(1),
    humidity: +humidity.toFixed(1),
    timestamp: new Date().toISOString()
  };
}
