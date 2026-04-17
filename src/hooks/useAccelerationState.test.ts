import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAccelerationState } from './useAccelerationState';
import type { TripEntry } from '../types';

describe('useAccelerationState Hook', () => {
  const mockData: TripEntry[] = [
    { timestamp: 0, Speed: 0, Power: 0, Current: 0, Voltage: 48, BatteryLevel: 100, Temperature: 25, PWM: 0, TotalDistance: 0, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
    { timestamp: 1000, Speed: 10, Power: 1000, Current: 20, Voltage: 48, BatteryLevel: 99, Temperature: 26, PWM: 20, TotalDistance: 2, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  ];

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clear localStorage after each test
    localStorage.clear();
  });

  it('should initialize with default threshold pairs', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    expect(result.current.thresholdPairs).toEqual([{ from: 0, to: 60 }]);
  });

  it('should initialize with default selected columns', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    expect(result.current.selectedColumns).toEqual(new Set(['time', 'distance', 'averagePower', 'peakPower', 'batteryDrop']));
  });

  it('should initialize showIncomplete as false', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    expect(result.current.showIncomplete).toBe(false);
  });

  it('should initialize with default power threshold', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    expect(result.current.powerThreshold).toBe(2500);
  });

  it('should initialize with default temperature threshold', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    expect(result.current.temperatureThreshold).toBe(45);
  });

  it('should return acceleration attempts', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    expect(result.current.accelerationAttempts).toBeDefined();
    expect(Array.isArray(result.current.accelerationAttempts)).toBe(true);
  });

  it('should update threshold pairs', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    act(() => {
      result.current.setThresholdPairs([{ from: 0, to: 90 }]);
    });
    
    expect(result.current.thresholdPairs).toEqual([{ from: 0, to: 90 }]);
  });

  it('should update selected columns', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    act(() => {
      result.current.setSelectedColumns(new Set(['time', 'distance']));
    });
    
    expect(result.current.selectedColumns).toEqual(new Set(['time', 'distance']));
  });

  it('should update showIncomplete', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    act(() => {
      result.current.setShowIncomplete(true);
    });
    
    expect(result.current.showIncomplete).toBe(true);
  });

  it('should update power threshold', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    act(() => {
      result.current.setPowerThreshold(3000);
    });
    
    expect(result.current.powerThreshold).toBe(3000);
  });

  it('should update temperature threshold', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    act(() => {
      result.current.setTemperatureThreshold(50);
    });
    
    expect(result.current.temperatureThreshold).toBe(50);
  });

  it('should persist threshold pairs to localStorage', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    act(() => {
      result.current.setThresholdPairs([{ from: 0, to: 90 }]);
    });
    
    expect(localStorage.getItem('acceleration_threshold_pairs')).toBe(JSON.stringify([{ from: 0, to: 90 }]));
  });

  it('should persist selected columns to localStorage', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    act(() => {
      result.current.setSelectedColumns(new Set(['time', 'distance']));
    });
    
    expect(localStorage.getItem('acceleration_selected_columns')).toBe(JSON.stringify(['time', 'distance']));
  });

  it('should persist power threshold to localStorage', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    act(() => {
      result.current.setPowerThreshold(3000);
    });
    
    expect(localStorage.getItem('power_threshold')).toBe(JSON.stringify(3000));
  });

  it('should persist temperature threshold to localStorage', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    act(() => {
      result.current.setTemperatureThreshold(50);
    });
    
    expect(localStorage.getItem('temperature_threshold')).toBe(JSON.stringify(50));
  });

  it('should clear settings and return true', () => {
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    // Set some values
    act(() => {
      result.current.setThresholdPairs([{ from: 0, to: 90 }]);
      result.current.setPowerThreshold(3000);
    });
    
    // Clear settings
    let clearResult: boolean | undefined;
    act(() => {
      clearResult = result.current.clearSettings();
    });
    
    expect(clearResult).toBe(true);
    expect(localStorage.getItem('acceleration_threshold_pairs')).toBe(null);
    expect(localStorage.getItem('power_threshold')).toBe(null);
  });

  it('should load threshold pairs from localStorage', () => {
    localStorage.setItem('acceleration_threshold_pairs', JSON.stringify([{ from: 0, to: 90 }]));
    
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    expect(result.current.thresholdPairs).toEqual([{ from: 0, to: 90 }]);
  });

  it('should load selected columns from localStorage', () => {
    localStorage.setItem('acceleration_selected_columns', JSON.stringify(['time', 'distance']));
    
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    expect(result.current.selectedColumns).toEqual(new Set(['time', 'distance']));
  });

  it('should load power threshold from localStorage', () => {
    localStorage.setItem('power_threshold', JSON.stringify(3000));
    
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    expect(result.current.powerThreshold).toBe(3000);
  });

  it('should load temperature threshold from localStorage', () => {
    localStorage.setItem('temperature_threshold', JSON.stringify(50));
    
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    expect(result.current.temperatureThreshold).toBe(50);
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage to throw error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error('Storage error');
    };
    
    const { result } = renderHook(() => useAccelerationState(mockData));
    
    act(() => {
      result.current.setThresholdPairs([{ from: 0, to: 90 }]);
    });
    
    // Should not throw, just handle error silently
    expect(result.current.thresholdPairs).toEqual([{ from: 0, to: 90 }]);
    
    // Restore original
    localStorage.setItem = originalSetItem;
  });
});
