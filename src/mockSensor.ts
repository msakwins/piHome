import { SensorData } from './types/sensor';

export function getMockSensorData(): SensorData {
  return {
    co2: Math.floor(400 + Math.random() * 2000), // ppm
    temperature: +(20 + Math.random() * 5).toFixed(1), // °C
    humidity: +(30 + Math.random() * 40).toFixed(1), // %
    timestamp: new Date().toISOString()
  };
}