import { useState, useMemo, useEffect } from 'react';
import { detectAccelerations } from '../utils/acceleration';
import type { TripEntry, ThresholdPair } from '../types';

/**
 * Custom hook for managing acceleration detection state and configuration.
 *
 * This hook handles:
 * - Threshold configuration with presets
 * - Column selection for display
 * - Incomplete attempt filtering
 * - Acceleration detection from telemetry data
 * - localStorage persistence of settings
 *
 * @param data - Array of telemetry entries for acceleration detection
 * @returns Object containing acceleration attempts and state management functions
 *
 * @example
 * ```typescript
 * const { accelerationAttempts, showIncomplete, setShowIncomplete } = useAccelerationState(tripData);
 * ```
 */
export function useAccelerationState(data: TripEntry[]) {
  // Initialize thresholdPairs from localStorage with lazy initialization
  const [thresholdPairs, setThresholdPairs] = useState<ThresholdPair[]>(() => {
    try {
      // Try new format first
      const saved = localStorage.getItem('acceleration_threshold_pairs');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
      // Migration: convert old single threshold to pair
      const oldThreshold = localStorage.getItem('acceleration_threshold');
      if (oldThreshold) {
        const value = JSON.parse(oldThreshold);
        return [{ from: 0, to: value }];
      }
      // Default
      return [{ from: 0, to: 60 }];
    } catch {
      return [{ from: 0, to: 60 }];
    }
  });

  // Initialize selectedColumns from localStorage with lazy initialization
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('acceleration_selected_columns');
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Set(parsed);
      }
      return new Set(['time', 'distance', 'averagePower', 'peakPower', 'batteryDrop']);
    } catch {
      return new Set(['time', 'distance', 'averagePower', 'peakPower', 'batteryDrop']);
    }
  });

  // showIncomplete is not persisted (session-only state)
  const [showIncomplete, setShowIncomplete] = useState<boolean>(false);

  // Initialize powerThreshold from localStorage with lazy initialization (Plan 7.8)
  const [powerThreshold, setPowerThreshold] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('power_threshold');
      if (saved) {
        return JSON.parse(saved);
      }
      return 2500; // Default 2500W
    } catch {
      return 2500;
    }
  });

  // Initialize temperatureThreshold from localStorage with lazy initialization (Plan 7.8)
  const [temperatureThreshold, setTemperatureThreshold] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('temperature_threshold');
      if (saved) {
        return JSON.parse(saved);
      }
      return 45; // Default 45°C
    } catch {
      return 45;
    }
  });

  // Memoize acceleration detection to prevent re-detection on unnecessary re-renders
  const accelerationAttempts = useMemo(() => {
    return detectAccelerations(data, thresholdPairs);
  }, [data, thresholdPairs]);

  // Persist thresholdPairs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('acceleration_threshold_pairs', JSON.stringify(thresholdPairs));
    } catch {
      // Silent fail - localStorage unavailable
    }
  }, [thresholdPairs]);

  // Persist selectedColumns to localStorage
  useEffect(() => {
    try {
      const arrayValue = Array.from(selectedColumns);
      localStorage.setItem('acceleration_selected_columns', JSON.stringify(arrayValue));
    } catch {
      // Silent fail - localStorage unavailable
    }
  }, [selectedColumns]);

  // Persist powerThreshold to localStorage (Plan 7.8)
  useEffect(() => {
    try {
      localStorage.setItem('power_threshold', JSON.stringify(powerThreshold));
    } catch {
      // Silent fail - localStorage unavailable
    }
  }, [powerThreshold]);

  // Persist temperatureThreshold to localStorage (Plan 7.8)
  useEffect(() => {
    try {
      localStorage.setItem('temperature_threshold', JSON.stringify(temperatureThreshold));
    } catch {
      // Silent fail - localStorage unavailable
    }
  }, [temperatureThreshold]);

  // Clear settings function
  const clearSettings = (): boolean => {
    try {
      localStorage.removeItem('acceleration_threshold_pairs');
      localStorage.removeItem('acceleration_threshold'); // Remove old key
      localStorage.removeItem('acceleration_selected_columns');
      localStorage.removeItem('power_threshold'); // Plan 7.8
      localStorage.removeItem('temperature_threshold'); // Plan 7.8
      return true;
    } catch {
      return false;
    }
  };

  return {
    accelerationAttempts,
    thresholdPairs,
    setThresholdPairs,
    showIncomplete,
    setShowIncomplete,
    selectedColumns,
    setSelectedColumns,
    clearSettings,
    powerThreshold, // Plan 7.8
    setPowerThreshold, // Plan 7.8
    temperatureThreshold, // Plan 7.8
    setTemperatureThreshold, // Plan 7.8
  };
}

export default useAccelerationState;
