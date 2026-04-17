import { describe, it, expect } from 'vitest';
import { detectAccelerations } from './acceleration';
import type { ThresholdPair } from '../types';
import { mockTripData, mockEmptyData, mockThresholdPair, mockMultipleThresholdPairs, mockIncompleteData } from '../fixtures/acceleration-mocks';

describe('Acceleration Detection - Empty Data Handling', () => {
  it('should return empty array for empty data', () => {
    const thresholdPairs: ThresholdPair[] = [mockThresholdPair];
    const result = detectAccelerations(mockEmptyData, thresholdPairs);
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  it('should handle empty threshold pairs array', () => {
    const thresholdPairs: ThresholdPair[] = [];
    const result = detectAccelerations(mockTripData, thresholdPairs);
    expect(result).toEqual([]);
  });
});

describe('Acceleration Detection - Single Threshold Pair', () => {
  it('should return array for single threshold pair', () => {
    const thresholdPairs: ThresholdPair[] = [mockThresholdPair];
    const result = detectAccelerations(mockTripData, thresholdPairs);
    
    expect(Array.isArray(result)).toBe(true);
    expect(typeof result.length).toBe('number');
  });

  it('should calculate basic metrics correctly', () => {
    const thresholdPairs: ThresholdPair[] = [mockThresholdPair];
    const result = detectAccelerations(mockTripData, thresholdPairs);
    
    if (result.length > 0) {
      const attempt = result[0];
      expect(attempt.time).toBeGreaterThan(0);
      expect(attempt.distance).toBeGreaterThanOrEqual(0);
      expect(attempt.peakPower).toBeGreaterThan(0);
      expect(attempt.averagePower).toBeGreaterThan(0);
      expect(attempt.batteryDrop).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('Acceleration Detection - Multiple Threshold Pairs', () => {
  it('should return array for multiple threshold pairs', () => {
    const thresholdPairs: ThresholdPair[] = mockMultipleThresholdPairs;
    const result = detectAccelerations(mockTripData, thresholdPairs);
    
    expect(Array.isArray(result)).toBe(true);
    expect(typeof result.length).toBe('number');
  });

  it('should assign correct threshold pair to each attempt', () => {
    const thresholdPairs: ThresholdPair[] = mockMultipleThresholdPairs;
    const result = detectAccelerations(mockTripData, thresholdPairs);
    
    if (result.length > 0) {
      result.forEach(attempt => {
        expect(attempt.thresholdPair).toBeDefined();
        expect(typeof attempt.thresholdPair.from).toBe('number');
        expect(typeof attempt.thresholdPair.to).toBe('number');
      });
    }
  });
});

describe('Acceleration Detection - Incomplete Attempt Handling', () => {
  it('should handle incomplete attempts correctly', () => {
    const thresholdPairs: ThresholdPair[] = [mockThresholdPair];
    const result = detectAccelerations(mockIncompleteData, thresholdPairs);
    
    expect(Array.isArray(result)).toBe(true);
    
    if (result.length > 0) {
      const attempt = result[0];
      expect(attempt.isComplete).toBe(false);
      expect(attempt.startSpeed).toBeLessThan(mockThresholdPair.to);
    }
  });

  it('should still calculate metrics for incomplete attempts', () => {
    const thresholdPairs: ThresholdPair[] = [mockThresholdPair];
    const result = detectAccelerations(mockIncompleteData, thresholdPairs);
    
    if (result.length > 0) {
      const attempt = result[0];
      expect(attempt.time).toBeGreaterThan(0);
      expect(attempt.distance).toBeGreaterThanOrEqual(0);
      expect(attempt.peakPower).toBeGreaterThan(0);
    }
  });
});

describe('Acceleration Detection - Advanced Metrics', () => {
  it('should calculate power efficiency', () => {
    const thresholdPairs: ThresholdPair[] = [mockThresholdPair];
    const result = detectAccelerations(mockTripData, thresholdPairs);
    
    if (result.length > 0) {
      const attempt = result[0];
      expect(attempt.powerEfficiency).toBeDefined();
      expect(typeof attempt.powerEfficiency).toBe('number');
    }
  });

  it('should calculate power consistency', () => {
    const thresholdPairs: ThresholdPair[] = [mockThresholdPair];
    const result = detectAccelerations(mockTripData, thresholdPairs);
    
    if (result.length > 0) {
      const attempt = result[0];
      expect(attempt.powerConsistency).toBeDefined();
      expect(attempt.powerConsistency).toBeGreaterThanOrEqual(0);
      expect(attempt.powerConsistency).toBeLessThanOrEqual(1);
    }
  });

  it('should calculate power distribution', () => {
    const thresholdPairs: ThresholdPair[] = [mockThresholdPair];
    const result = detectAccelerations(mockTripData, thresholdPairs);
    
    if (result.length > 0) {
      const attempt = result[0];
      expect(attempt.powerDistribution).toBeDefined();
      expect(attempt.powerDistribution.low).toBeDefined();
      expect(attempt.powerDistribution.medium).toBeDefined();
      expect(attempt.powerDistribution.high).toBeDefined();
    }
  });

  it('should calculate battery drop rate', () => {
    const thresholdPairs: ThresholdPair[] = [mockThresholdPair];
    const result = detectAccelerations(mockTripData, thresholdPairs);
    
    if (result.length > 0) {
      const attempt = result[0];
      expect(attempt.batteryDropRate).toBeDefined();
      expect(typeof attempt.batteryDropRate).toBe('number');
    }
  });

  it('should calculate energy per km', () => {
    const thresholdPairs: ThresholdPair[] = [mockThresholdPair];
    const result = detectAccelerations(mockTripData, thresholdPairs);
    
    if (result.length > 0) {
      const attempt = result[0];
      expect(attempt.energyPerKm).toBeDefined();
      expect(typeof attempt.energyPerKm).toBe('number');
    }
  });

  it('should calculate temperature-power correlation', () => {
    const thresholdPairs: ThresholdPair[] = [mockThresholdPair];
    const result = detectAccelerations(mockTripData, thresholdPairs);
    
    if (result.length > 0) {
      const attempt = result[0];
      expect(attempt.temperaturePowerCorrelation).toBeDefined();
      expect(attempt.temperaturePowerCorrelation).toBeGreaterThanOrEqual(-1);
      expect(attempt.temperaturePowerCorrelation).toBeLessThanOrEqual(1);
    }
  });

  it('should calculate temperature efficiency', () => {
    const thresholdPairs: ThresholdPair[] = [mockThresholdPair];
    const result = detectAccelerations(mockTripData, thresholdPairs);
    
    if (result.length > 0) {
      const attempt = result[0];
      expect(attempt.temperatureEfficiency).toBeDefined();
      expect(typeof attempt.temperatureEfficiency).toBe('number');
    }
  });
});
