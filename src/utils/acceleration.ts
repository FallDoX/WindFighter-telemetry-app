import type { TripEntry, AccelerationAttempt, ThresholdPair } from '../types.js';

/**
 * Detects acceleration attempts from telemetry data based on threshold pairs.
 *
 * This function analyzes speed data to identify acceleration attempts that cross
 * specified speed thresholds. It handles multiple threshold pairs simultaneously,
 * filters data gaps, and calculates comprehensive metrics for each attempt.
 *
 * @param data - Array of telemetry entries with timestamp, speed, power, current, voltage, battery, and temperature
 * @param thresholdPairs - Array of threshold pairs (e.g., [{from: 0, to: 60}]) defining acceleration ranges to detect
 * @returns Array of acceleration attempts with calculated metrics
 *
 * @example
 * ```typescript
 * const attempts = detectAccelerations(tripData, [{from: 0, to: 60}]);
 * console.log(attempts[0].time); // Acceleration time in seconds
 * console.log(attempts[0].distance); // Distance in meters
 * ```
 */
export function detectAccelerations(data: TripEntry[], thresholdPairs: ThresholdPair[]): AccelerationAttempt[] {
  const attempts: AccelerationAttempt[] = [];
  
  if (data.length === 0 || thresholdPairs.length === 0) {
    return attempts;
  }

  // Define zero speed threshold (km/h)
  const ZERO_SPEED_THRESHOLD = 5;

  // Maintain separate attempt tracking for each threshold pair
  const attemptTracking = new Map<ThresholdPair, { 
    attemptStart: TripEntry | null; 
    startIndex: number;
    wasAtZero: boolean; // Track if we were at zero before starting attempt
  }>();
  
  for (const pair of thresholdPairs) {
    attemptTracking.set(pair, { attemptStart: null, startIndex: 0, wasAtZero: false });
  }

  for (let i = 0; i < data.length; i++) {
    const current = data[i];
    
    // Check each threshold pair
    for (const pair of thresholdPairs) {
      const tracking = attemptTracking.get(pair);
      if (!tracking) continue;

      // Check for data gaps (> 500ms)
      if (tracking.attemptStart && i > tracking.startIndex) {
        const gap = current.timestamp - data[i - 1].timestamp;
        if (gap > 500) {
          // Gap detected, reset attempt for this pair
          tracking.attemptStart = null;
          tracking.startIndex = i;
          tracking.wasAtZero = false;
          continue;
        }
      }

      const isAtZero = current.Speed < ZERO_SPEED_THRESHOLD;

      // Track if we were at zero (needed to start a new attempt)
      if (!tracking.attemptStart) {
        if (isAtZero) {
          tracking.wasAtZero = true;
        } else if (tracking.wasAtZero && current.Speed >= pair.from && current.Speed < pair.to) {
          // Speed was at zero and now is increasing within threshold range - start attempt
          tracking.attemptStart = current;
          tracking.startIndex = i;
        }
      }

      // If we have an active attempt, check if we reached target speed
      if (tracking.attemptStart && current.Speed >= pair.to) {
        // Speed reached target, end of acceleration attempt for this pair
        const attemptStart = tracking.attemptStart;
        const startIndex = tracking.startIndex;
        const attemptEnd = current;
        
        // Calculate metrics
        const time = (attemptEnd.timestamp - attemptStart.timestamp) / 1000; // convert to seconds
        
        // Calculate distance using trapezoidal integration (convert km/h to m/s)
        let distance = 0;
        for (let j = startIndex; j < i; j++) {
          const point1 = data[j];
          const point2 = data[j + 1];
          const dt = (point2.timestamp - point1.timestamp) / 1000; // seconds
          const speed1 = point1.Speed / 3.6; // convert km/h to m/s
          const speed2 = point2.Speed / 3.6; // convert km/h to m/s
          distance += ((speed1 + speed2) / 2) * dt; // trapezoidal method
        }

        // Calculate power metrics
        const powerValues: number[] = [];
        const currentValues: number[] = [];
        const voltageValues: number[] = [];
        const temperatureValues: number[] = [];
        
        for (let j = startIndex; j <= i; j++) {
          powerValues.push(data[j].Power);
          currentValues.push(data[j].Current);
          voltageValues.push(data[j].Voltage);
          temperatureValues.push(data[j].Temperature);
        }

        const averagePower = powerValues.reduce((sum, val) => sum + val, 0) / powerValues.length;
        const peakPower = Math.max(...powerValues);
        const averageCurrent = currentValues.reduce((sum, val) => sum + val, 0) / currentValues.length;
        const averageVoltage = voltageValues.reduce((sum, val) => sum + val, 0) / voltageValues.length;
        const batteryDrop = attemptEnd.BatteryLevel - attemptStart.BatteryLevel;
        const averageTemperature = temperatureValues.reduce((sum, val) => sum + val, 0) / temperatureValues.length;

        // Calculate advanced power metrics (Plan 7.1)
        const speedDelta = attemptEnd.Speed - attemptStart.Speed;
        const powerEfficiency = speedDelta > 0 ? peakPower / speedDelta : 0;
        
        // Calculate power consistency (standard deviation normalized to 0-1)
        const powerMean = averagePower;
        const powerVariance = powerValues.reduce((sum, val) => sum + Math.pow(val - powerMean, 2), 0) / powerValues.length;
        const powerStdDev = Math.sqrt(powerVariance);
        const powerConsistency = powerStdDev > 0 ? 1 - (powerStdDev / peakPower) : 1;
        
        // Calculate power distribution
        const powerDistribution = {
          low: powerValues.filter(v => v < 1000).length / powerValues.length,
          medium: powerValues.filter(v => v >= 1000 && v < 2000).length / powerValues.length,
          high: powerValues.filter(v => v >= 2000).length / powerValues.length
        };

        // Calculate battery impact metrics (Plan 7.2)
        const batteryDropRate = time > 0 ? batteryDrop / time : 0;
        const energyPerKm = distance > 0 ? (averagePower * time / 3600) / (distance / 1000) : 0;

        // Calculate temperature impact metrics (Plan 7.3)
        // Temperature-power correlation (Pearson correlation coefficient)
        let temperaturePowerCorrelation = 0;
        if (temperatureValues.length > 1 && powerValues.length > 1) {
          const tempMean = averageTemperature;
          const powerMeanCalc = averagePower;
          let numerator = 0;
          let tempStdDevSum = 0;
          let powerStdDevSum = 0;
          for (let j = 0; j < temperatureValues.length; j++) {
            const tempDiff = temperatureValues[j] - tempMean;
            const powerDiff = powerValues[j] - powerMeanCalc;
            numerator += tempDiff * powerDiff;
            tempStdDevSum += tempDiff * tempDiff;
            powerStdDevSum += powerDiff * powerDiff;
          }
          const tempStdDev = Math.sqrt(tempStdDevSum);
          const powerStdDevCalc = Math.sqrt(powerStdDevSum);
          temperaturePowerCorrelation = (tempStdDev > 0 && powerStdDevCalc > 0) 
            ? numerator / (tempStdDev * powerStdDevCalc) 
            : 0;
        }

        // Temperature efficiency (optimal range 20-35°C)
        const tempEff = averageTemperature;
        let temperatureEfficiency = 1;
        if (tempEff < 20) {
          temperatureEfficiency = Math.max(0, tempEff / 20);
        } else if (tempEff > 35) {
          temperatureEfficiency = Math.max(0, 1 - (tempEff - 35) / 20);
        }

        attempts.push({
          id: `accel-${startIndex}-${i}-${pair.from}-${pair.to}`,
          startTimestamp: attemptStart.timestamp,
          endTimestamp: attemptEnd.timestamp,
          startSpeed: attemptStart.Speed,
          endSpeed: attemptEnd.Speed,
          targetSpeed: pair.to, // Keep for backward compatibility
          thresholdPair: pair,
          time: time,
          distance: distance,
          averagePower: averagePower,
          peakPower: peakPower,
          averageCurrent: averageCurrent,
          averageVoltage: averageVoltage,
          batteryDrop: batteryDrop,
          averageTemperature: averageTemperature,
          isComplete: true,
          // Advanced metrics
          powerEfficiency,
          powerConsistency,
          powerDistribution,
          batteryDropRate,
          energyPerKm,
          temperaturePowerCorrelation,
          temperatureEfficiency
        });

        // Reset for next attempt for this pair
        tracking.attemptStart = null;
        tracking.startIndex = i;
        tracking.wasAtZero = false;
      }

      // If we're not in an attempt but speed dropped to zero, reset tracking state
      if (!tracking.attemptStart && isAtZero) {
        tracking.wasAtZero = true;
      }
    }
  }

  // Handle incomplete attempts (attempts that never reached target speed)
  for (const pair of thresholdPairs) {
    const tracking = attemptTracking.get(pair);
    if (!tracking || !tracking.attemptStart) continue;

    const attemptEnd = data[data.length - 1];
    const startIndex = tracking.startIndex;
    
    // Calculate metrics for incomplete attempt
    const time = (attemptEnd.timestamp - tracking.attemptStart.timestamp) / 1000;
    
    let distance = 0;
    for (let j = startIndex; j < data.length - 1; j++) {
      const point1 = data[j];
      const point2 = data[j + 1];
      const dt = (point2.timestamp - point1.timestamp) / 1000;
      const speed1 = point1.Speed / 3.6;
      const speed2 = point2.Speed / 3.6;
      distance += ((speed1 + speed2) / 2) * dt;
    }

    const powerValues: number[] = [];
    const currentValues: number[] = [];
    const voltageValues: number[] = [];
    const temperatureValues: number[] = [];
    
    for (let j = startIndex; j < data.length; j++) {
      powerValues.push(data[j].Power);
      currentValues.push(data[j].Current);
      voltageValues.push(data[j].Voltage);
      temperatureValues.push(data[j].Temperature);
    }

    const averagePower = powerValues.reduce((sum, val) => sum + val, 0) / powerValues.length;
    const peakPower = Math.max(...powerValues);
    const averageCurrent = currentValues.reduce((sum, val) => sum + val, 0) / currentValues.length;
    const averageVoltage = voltageValues.reduce((sum, val) => sum + val, 0) / voltageValues.length;
    const batteryDrop = attemptEnd.BatteryLevel - tracking.attemptStart.BatteryLevel;
    const averageTemperature = temperatureValues.reduce((sum, val) => sum + val, 0) / temperatureValues.length;

    // Calculate advanced power metrics (Plan 7.1)
    const speedDelta = attemptEnd.Speed - tracking.attemptStart.Speed;
    const powerEfficiency = speedDelta > 0 ? peakPower / speedDelta : 0;
    
    const powerMean = averagePower;
    const powerVariance = powerValues.reduce((sum, val) => sum + Math.pow(val - powerMean, 2), 0) / powerValues.length;
    const powerStdDev = Math.sqrt(powerVariance);
    const powerConsistency = powerStdDev > 0 ? 1 - (powerStdDev / peakPower) : 1;
    
    const powerDistribution = {
      low: powerValues.filter(v => v < 1000).length / powerValues.length,
      medium: powerValues.filter(v => v >= 1000 && v < 2000).length / powerValues.length,
      high: powerValues.filter(v => v >= 2000).length / powerValues.length
    };

    // Calculate battery impact metrics (Plan 7.2)
    const batteryDropRate = time > 0 ? batteryDrop / time : 0;
    const energyPerKm = distance > 0 ? (averagePower * time / 3600) / (distance / 1000) : 0;

    // Calculate temperature impact metrics (Plan 7.3)
    let temperaturePowerCorrelation = 0;
    if (temperatureValues.length > 1 && powerValues.length > 1) {
      const tempMean = averageTemperature;
      const powerMeanCalc = averagePower;
      let numerator = 0;
      let tempStdDevSum = 0;
      let powerStdDevSum = 0;
      for (let j = 0; j < temperatureValues.length; j++) {
        const tempDiff = temperatureValues[j] - tempMean;
        const powerDiff = powerValues[j] - powerMeanCalc;
        numerator += tempDiff * powerDiff;
        tempStdDevSum += tempDiff * tempDiff;
        powerStdDevSum += powerDiff * powerDiff;
      }
      const tempStdDev = Math.sqrt(tempStdDevSum);
      const powerStdDevCalc = Math.sqrt(powerStdDevSum);
      temperaturePowerCorrelation = (tempStdDev > 0 && powerStdDevCalc > 0) 
        ? numerator / (tempStdDev * powerStdDevCalc) 
        : 0;
    }

    const tempEff = averageTemperature;
    let temperatureEfficiency = 1;
    if (tempEff < 20) {
      temperatureEfficiency = Math.max(0, tempEff / 20);
    } else if (tempEff > 35) {
      temperatureEfficiency = Math.max(0, 1 - (tempEff - 35) / 20);
    }

    attempts.push({
      id: `accel-${startIndex}-${data.length - 1}-${pair.from}-${pair.to}`,
      startTimestamp: tracking.attemptStart.timestamp,
      endTimestamp: attemptEnd.timestamp,
      startSpeed: tracking.attemptStart.Speed,
      endSpeed: attemptEnd.Speed,
      targetSpeed: pair.to, // Keep for backward compatibility
      thresholdPair: pair,
      time: time,
      distance: distance,
      averagePower: averagePower,
      peakPower: peakPower,
      averageCurrent: averageCurrent,
      averageVoltage: averageVoltage,
      batteryDrop: batteryDrop,
      averageTemperature: averageTemperature,
      isComplete: false,
      // Advanced metrics
      powerEfficiency,
      powerConsistency,
      powerDistribution,
      batteryDropRate,
      energyPerKm,
      temperaturePowerCorrelation,
      temperatureEfficiency
    });
  }

  return attempts;
}
