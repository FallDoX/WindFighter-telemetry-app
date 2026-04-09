export interface TripEntry {
  // Core fields (unified)
  Speed: number;
  Voltage: number;
  PWM: number;
  Current: number;
  Power: number;
  BatteryLevel: number;
  TotalDistance: number;
  Temperature: number;
  GPSSpeed: number | null;
  Latitude: number | null;
  Longitude: number | null;
  Altitude: number | null;
  timestamp: number;

  // Extended sensor fields (new format)
  PhaseCurrent?: number;
  Torque?: number;
  Temp2?: number;
  Distance?: number;
  Mode?: string;
  Alert?: string;
  GPSHeading?: number | null;
  GPSDistance?: number | null;

  // IMU/Orientation sensors
  Tilt?: number | null;
  Roll?: number | null;
  Pitch?: number | null;

  // Raw data for dynamic metrics (stores any additional CSV columns)
  rawData?: Record<string, string | number | null>;
}

// Metadata about available metrics in the current dataset
export interface DatasetMetadata {
  availableFields: string[];
  numericFields: string[];
  hasGPS: boolean;
  hasIMU: boolean;
  hasPhaseCurrent: boolean;
  hasTorque: boolean;
}

export interface TripSummary {
  maxSpeed: number;
  avgSpeed: number;
  avgMovingSpeed: number; // средняя только когда > 5 км/ч
  movingDuration: number; // ms — время в движении
  totalDistance: number;
  avgPower: number;
  maxPower: number;
  batteryDrop: number;  // Legacy: SOC % drop (start - end)
  batteryDischarge?: number;  // New: SOC % drop, renamed for clarity
  batteryVoltageDrop?: number;  // New: Voltage drop % (peak to min under load)
  maxBatteryDrop?: number; // Maximum battery SOC % drop during the trip
  duration: number; // ms
  maxTorque?: number; // New: max torque
  maxPhaseCurrent?: number; // New: max phase current
  avgTemp?: number;
  maxTemp?: number;
  maxCurrent?: number; // Max battery current
  consumptionPerKm?: number; // Wh/km
}

export type CSVFormat = 'old' | 'new';

export type ThresholdPair = {
  from: number;
  to: number;
};

export interface AccelerationAttempt {
  id: string;
  startTimestamp: number;
  endTimestamp: number;
  startSpeed: number;
  endSpeed: number;
  targetSpeed: number; // Keep for backward compatibility
  thresholdPair: ThresholdPair; // New field
  time: number;
  distance: number;
  averagePower: number;
  peakPower: number;
  averageCurrent: number;
  averageVoltage: number;
  batteryDrop: number;
  averageTemperature: number;
  isComplete: boolean;
  // Advanced power metrics (Plan 7.1)
  powerEfficiency: number; // power per speed unit (W/(km/h))
  powerConsistency: number; // standard deviation of power values (0-1 score)
  powerDistribution: { low: number; medium: number; high: number }; // percentage of time in power bands
  // Battery impact metrics (Plan 7.2)
  batteryDropRate: number; // battery drop per second (%/s)
  energyPerKm: number; // energy consumption per km (Wh/km)
  // Temperature impact metrics (Plan 7.3)
  temperaturePowerCorrelation: number; // correlation coefficient between temperature and power (-1 to 1)
  temperatureEfficiency: number; // normalized efficiency score based on temperature
}
