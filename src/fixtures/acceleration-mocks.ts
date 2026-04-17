import type { TripEntry, ThresholdPair, AccelerationAttempt } from '../types';

/**
 * Mock acceleration data for testing
 */

export const mockTripData: TripEntry[] = [
  { timestamp: 0, Speed: 0, Power: 0, Current: 0, Voltage: 48, BatteryLevel: 100, Temperature: 25, PWM: 0, TotalDistance: 0, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 1000, Speed: 10, Power: 1000, Current: 20, Voltage: 48, BatteryLevel: 99, Temperature: 26, PWM: 20, TotalDistance: 2, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 2000, Speed: 20, Power: 1500, Current: 30, Voltage: 48, BatteryLevel: 98, Temperature: 27, PWM: 30, TotalDistance: 5, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 3000, Speed: 30, Power: 2000, Current: 40, Voltage: 48, BatteryLevel: 97, Temperature: 28, PWM: 40, TotalDistance: 10, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 4000, Speed: 40, Power: 2500, Current: 50, Voltage: 48, BatteryLevel: 96, Temperature: 29, PWM: 50, TotalDistance: 16, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 5000, Speed: 50, Power: 3000, Current: 60, Voltage: 48, BatteryLevel: 95, Temperature: 30, PWM: 60, TotalDistance: 23, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  { timestamp: 6000, Speed: 60, Power: 3500, Current: 70, Voltage: 48, BatteryLevel: 94, Temperature: 31, PWM: 70, TotalDistance: 31, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
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
