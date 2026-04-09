import { useState, useMemo, useEffect } from 'react';
import { detectAccelerations } from '../utils/acceleration';
import type { TripEntry } from '../types';

export function useAccelerationState(data: TripEntry[]) {
  // Initialize accelerationThreshold from localStorage with lazy initialization
  const [accelerationThreshold, setAccelerationThreshold] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('acceleration_threshold');
      return saved ? JSON.parse(saved) : 60;
    } catch {
      return 60;
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

  // Memoize acceleration detection to prevent re-detection on unnecessary re-renders
  const accelerationAttempts = useMemo(() => {
    return detectAccelerations(data, accelerationThreshold);
  }, [data, accelerationThreshold]);

  // Persist accelerationThreshold to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('acceleration_threshold', JSON.stringify(accelerationThreshold));
    } catch {
      // Silent fail - localStorage unavailable
    }
  }, [accelerationThreshold]);

  // Persist selectedColumns to localStorage
  useEffect(() => {
    try {
      const arrayValue = Array.from(selectedColumns);
      localStorage.setItem('acceleration_selected_columns', JSON.stringify(arrayValue));
    } catch {
      // Silent fail - localStorage unavailable
    }
  }, [selectedColumns]);

  // Clear settings function
  const clearSettings = (): boolean => {
    try {
      localStorage.removeItem('acceleration_threshold');
      localStorage.removeItem('acceleration_selected_columns');
      return true;
    } catch {
      return false;
    }
  };

  return {
    accelerationAttempts,
    accelerationThreshold,
    setAccelerationThreshold,
    showIncomplete,
    setShowIncomplete,
    selectedColumns,
    setSelectedColumns,
    clearSettings,
  };
}

export default useAccelerationState;
