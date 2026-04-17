import type { TripEntry, ThresholdPair, AccelerationAttempt } from '../types';

/**
 * Mock acceleration data for testing
 */

export const mockTripData: TripEntry[] = [
  { timestamp: 0, Speed: 0, Power: 0, Current: 0, Voltage: 48, BatteryLevel: 100, Temperature: 25, PWM: 0, TotalDistance: 0, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 1000, Speed: 0, Power: 0, Current: 0, Voltage: 48, BatteryLevel: 100, Temperature: 25, PWM: 0, TotalDistance: 0, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 2000, Speed: 0, Power: 0, Current: 0, Voltage: 48, BatteryLevel: 100, Temperature: 25, PWM: 0, TotalDistance: 0, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 3000, Speed: 10, Power: 1000, Current: 20, Voltage: 48, BatteryLevel: 99.8, Temperature: 25.2, PWM: 20, TotalDistance: 2, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 4000, Speed: 20, Power: 2000, Current: 40, Voltage: 48, BatteryLevel: 99.6, Temperature: 25.4, PWM: 40, TotalDistance: 6, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 5000, Speed: 30, Power: 3000, Current: 60, Voltage: 48, BatteryLevel: 99.4, Temperature: 25.6, PWM: 60, TotalDistance: 12, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 6000, Speed: 40, Power: 4000, Current: 80, Voltage: 48, BatteryLevel: 99.2, Temperature: 25.8, PWM: 80, TotalDistance: 20, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 7000, Speed: 50, Power: 5000, Current: 100, Voltage: 48, BatteryLevel: 99.0, Temperature: 26.0, PWM: 100, TotalDistance: 30, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 8000, Speed: 60, Power: 6000, Current: 120, Voltage: 48, BatteryLevel: 98.8, Temperature: 26.2, PWM: 120, TotalDistance: 42, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 9000, Speed: 65, Power: 6500, Current: 130, Voltage: 48, BatteryLevel: 98.7, Temperature: 26.3, PWM: 130, TotalDistance: 49, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 10000, Speed: 70, Power: 7000, Current: 140, Voltage: 48, BatteryLevel: 98.6, Temperature: 26.4, PWM: 140, TotalDistance: 56, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 11000, Speed: 65, Power: 5000, Current: 100, Voltage: 48, BatteryLevel: 98.5, Temperature: 26.5, PWM: 100, TotalDistance: 63, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 12000, Speed: 60, Power: 4000, Current: 80, Voltage: 48, BatteryLevel: 98.4, Temperature: 26.6, PWM: 80, TotalDistance: 70, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
];

export const mockEmptyData: TripEntry[] = [];

export const mockThresholdPair: ThresholdPair = { from: 0, to: 60 };

export const mockMultipleThresholdPairs: ThresholdPair[] = [
  { from: 0, to: 60 },
  { from: 0, to: 90 },
  { from: 0, to: 100 },
];

export const mockIncompleteData: TripEntry[] = [
  { timestamp: 0, Speed: 0, Power: 0, Current: 0, Voltage: 48, BatteryLevel: 100, Temperature: 25, PWM: 0, TotalDistance: 0, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 1000, Speed: 10, Power: 1000, Current: 20, Voltage: 48, BatteryLevel: 99, Temperature: 26, PWM: 20, TotalDistance: 2, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 2000, Speed: 15, Power: 1500, Current: 30, Voltage: 48, BatteryLevel: 98, Temperature: 27, PWM: 30, TotalDistance: 4, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 3000, Speed: 20, Power: 2000, Current: 40, Voltage: 48, BatteryLevel: 97, Temperature: 28, PWM: 40, TotalDistance: 6, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
];

export const mockAccelerationAttempt: AccelerationAttempt = {
  id: '1',
  startTimestamp: 0,
  endTimestamp: 6000,
  startSpeed: 0,
  endSpeed: 60,
  targetSpeed: 60,
  thresholdPair: { from: 0, to: 60 },
  time: 6,
  distance: 100,
  averagePower: 2000,
  peakPower: 3500,
  averageCurrent: 40,
  averageVoltage: 48,
  batteryDrop: 6,
  averageTemperature: 28,
  isComplete: true,
  powerEfficiency: 50,
  powerConsistency: 0.8,
  powerDistribution: { low: 0.2, medium: 0.5, high: 0.3 },
  batteryDropRate: 1,
  energyPerKm: 120,
  temperaturePowerCorrelation: 0.9,
  temperatureEfficiency: 0.85,
};
