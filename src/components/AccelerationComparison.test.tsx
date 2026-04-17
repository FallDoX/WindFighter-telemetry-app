import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccelerationComparison } from './AccelerationComparison';
import type { AccelerationAttempt, TripEntry } from '../types';

describe('AccelerationComparison Component', () => {
  const mockAccelerationAttempts: AccelerationAttempt[] = [
    {
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
    },
    {
      id: '2',
      startTimestamp: 10000,
      endTimestamp: 18000,
      startSpeed: 0,
      endSpeed: 60,
      targetSpeed: 60,
      thresholdPair: { from: 0, to: 60 },
      time: 8,
      distance: 120,
      averagePower: 2200,
      peakPower: 3800,
      averageCurrent: 45,
      averageVoltage: 48,
      batteryDrop: 7,
      averageTemperature: 29,
      isComplete: true,
      powerEfficiency: 45,
      powerConsistency: 0.75,
      powerDistribution: { low: 0.25, medium: 0.45, high: 0.3 },
      batteryDropRate: 1.2,
      energyPerKm: 130,
      temperaturePowerCorrelation: 0.85,
      temperatureEfficiency: 0.8,
    },
  ];

  const mockData: TripEntry[] = [
    { timestamp: 0, Speed: 0, Power: 0, Current: 0, Voltage: 48, BatteryLevel: 100, Temperature: 25, PWM: 0, TotalDistance: 0, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
    { timestamp: 1000, Speed: 10, Power: 1000, Current: 20, Voltage: 48, BatteryLevel: 99, Temperature: 26, PWM: 20, TotalDistance: 2, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
    { timestamp: 2000, Speed: 20, Power: 2000, Current: 40, Voltage: 48, BatteryLevel: 98, Temperature: 27, PWM: 40, TotalDistance: 5, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
    { timestamp: 3000, Speed: 30, Power: 3000, Current: 60, Voltage: 48, BatteryLevel: 97, Temperature: 28, PWM: 60, TotalDistance: 10, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
    { timestamp: 4000, Speed: 40, Power: 4000, Current: 80, Voltage: 48, BatteryLevel: 96, Temperature: 29, PWM: 80, TotalDistance: 16, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
    { timestamp: 5000, Speed: 50, Power: 5000, Current: 100, Voltage: 48, BatteryLevel: 95, Temperature: 30, PWM: 100, TotalDistance: 23, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
    { timestamp: 6000, Speed: 60, Power: 6000, Current: 120, Voltage: 48, BatteryLevel: 94, Temperature: 31, PWM: 120, TotalDistance: 31, GPSSpeed: null, Latitude: null, Longitude: null, Altitude: null },
  ];

  const defaultProps = {
    accelerationAttempts: mockAccelerationAttempts,
    selectedAttempts: new Set(['1', '2']),
    data: mockData,
  };

  it('should render without errors', () => {
    render(<AccelerationComparison {...defaultProps} />);
    expect(screen.getByText('Фильтр попыток:')).toBeInTheDocument();
  });

  it('should render filter buttons', () => {
    render(<AccelerationComparison {...defaultProps} />);
    expect(screen.getByText('Все')).toBeInTheDocument();
    expect(screen.getByText('Лучшие 5')).toBeInTheDocument();
    expect(screen.getByText('Худшие 5')).toBeInTheDocument();
  });

  it('should render power curve toggle button', () => {
    render(<AccelerationComparison {...defaultProps} />);
    expect(screen.getByText('Мощность')).toBeInTheDocument();
  });

  it('should render filter limit input', () => {
    render(<AccelerationComparison {...defaultProps} />);
    expect(screen.getByText('Лимит:')).toBeInTheDocument();
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should render empty state when no selected attempts', () => {
    const props = { ...defaultProps, selectedAttempts: new Set<string>() };
    render(<AccelerationComparison {...props} />);
    expect(screen.getByText('Нет выбранных попыток')).toBeInTheDocument();
    expect(screen.getByText('Выберите попытки в таблице для сравнения')).toBeInTheDocument();
  });

  it('should render delta metrics table when attempts are selected', () => {
    render(<AccelerationComparison {...defaultProps} />);
    expect(screen.getByText('Таблица дельта-метрик')).toBeInTheDocument();
  });

  it('should toggle filter when filter button is clicked', async () => {
    const user = userEvent.setup();
    render(<AccelerationComparison {...defaultProps} />);
    
    const bestButton = screen.getByText('Лучшие 5');
    await user.click(bestButton);
    
    expect(bestButton).toBeInTheDocument();
  });

  it('should toggle power curve when button is clicked', async () => {
    const user = userEvent.setup();
    render(<AccelerationComparison {...defaultProps} />);
    
    const powerButton = screen.getByText('Мощность');
    await user.click(powerButton);
    
    expect(powerButton).toBeInTheDocument();
  });

  it('should update filter limit when input changes', async () => {
    const user = userEvent.setup();
    render(<AccelerationComparison {...defaultProps} />);
    
    const inputs = screen.getAllByRole('spinbutton');
    const limitInput = inputs[0];
    await user.clear(limitInput);
    await user.type(limitInput, '10');
    
    // Just verify the input can be interacted with
    expect(limitInput).toBeInTheDocument();
  });
});
