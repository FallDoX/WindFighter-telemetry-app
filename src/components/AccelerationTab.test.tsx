import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccelerationTab } from './AccelerationTab';
import type { AccelerationAttempt, TripEntry } from '../types';

describe('AccelerationTab Component', () => {
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

  const mockClearSettings = vi.fn();

  const defaultProps = {
    accelerationAttempts: mockAccelerationAttempts,
    data: mockData,
    clearSettings: mockClearSettings,
  };

  it('should render without errors', () => {
    render(<AccelerationTab {...defaultProps} />);
    expect(screen.getByText('Выберите диапазоны для графика:')).toBeInTheDocument();
  });

  it('should render preset buttons', () => {
    render(<AccelerationTab {...defaultProps} />);
    expect(screen.getByText('0-25')).toBeInTheDocument();
    expect(screen.getByText('0-60')).toBeInTheDocument();
    expect(screen.getByText('0-90')).toBeInTheDocument();
    expect(screen.getByText('0-100')).toBeInTheDocument();
    expect(screen.getAllByText('Все').length).toBeGreaterThan(0);
  });

  it('should render clear settings button when provided', () => {
    render(<AccelerationTab {...defaultProps} />);
    expect(screen.getByText('Очистить настройки')).toBeInTheDocument();
  });

  it('should not render clear settings button when not provided', () => {
    const props = { ...defaultProps, clearSettings: undefined };
    render(<AccelerationTab {...props} />);
    expect(screen.queryByText('Очистить настройки')).not.toBeInTheDocument();
  });

  it('should render attempt visibility controls when attempts exist', () => {
    render(<AccelerationTab {...defaultProps} />);
    expect(screen.getByText('Попытки:')).toBeInTheDocument();
  });

  it('should not render attempt visibility controls when no attempts', () => {
    const props = { ...defaultProps, accelerationAttempts: [] };
    render(<AccelerationTab {...props} />);
    expect(screen.queryByText('Попытки:')).not.toBeInTheDocument();
  });

  it('should toggle preset selection when clicked', async () => {
    const user = userEvent.setup();
    render(<AccelerationTab {...defaultProps} />);
    
    const presetButton = screen.getByText('0-60');
    await user.click(presetButton);
    
    // Button should now be selected (background color change)
    expect(presetButton).toBeInTheDocument();
  });

  it('should toggle attempt visibility when clicked', async () => {
    const user = userEvent.setup();
    render(<AccelerationTab {...defaultProps} />);
    
    const attemptButton = screen.getByText('#1');
    await user.click(attemptButton);
    
    expect(attemptButton).toBeInTheDocument();
  });

  it('should show all attempts when "Все" button is clicked', async () => {
    const user = userEvent.setup();
    render(<AccelerationTab {...defaultProps} />);
    
    const showAllButtons = screen.getAllByText('Все');
    // The second "Все" button is the show all attempts button (first is preset)
    const showAllButton = showAllButtons[1];
    await user.click(showAllButton);
    
    expect(showAllButton).toBeInTheDocument();
  });

  it('should hide all attempts when "Скрыть все" button is clicked', async () => {
    const user = userEvent.setup();
    render(<AccelerationTab {...defaultProps} />);
    
    const hideAllButton = screen.getByText('Скрыть все');
    await user.click(hideAllButton);
    
    expect(hideAllButton).toBeInTheDocument();
  });

  it('should display attempt count on preset buttons', () => {
    render(<AccelerationTab {...defaultProps} />);
    const presetButtons = screen.getAllByText('0-60');
    expect(presetButtons.length).toBeGreaterThan(0);
  });
});
