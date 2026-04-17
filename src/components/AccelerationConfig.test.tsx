import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccelerationConfig from './AccelerationConfig';
import type { ThresholdPair } from '../types';

describe('AccelerationConfig Component', () => {
  const mockThresholdPairs: ThresholdPair[] = [
    { from: 0, to: 60 },
    { from: 0, to: 90 },
  ];

  const mockOnThresholdPairsChange = vi.fn();
  const mockOnPowerThresholdChange = vi.fn();
  const mockOnTemperatureThresholdChange = vi.fn();

  const defaultProps = {
    thresholdPairs: mockThresholdPairs,
    onThresholdPairsChange: mockOnThresholdPairsChange,
    powerThreshold: 2500,
    onPowerThresholdChange: mockOnPowerThresholdChange,
    temperatureThreshold: 45,
    onTemperatureThresholdChange: mockOnTemperatureThresholdChange,
  };

  it('should render without errors', () => {
    render(<AccelerationConfig {...defaultProps} />);
    expect(screen.getByText('Пороги: 2 пар')).toBeInTheDocument();
  });

  it('should display correct number of threshold pairs', () => {
    render(<AccelerationConfig {...defaultProps} />);
    expect(screen.getByText('Пороги: 2 пар')).toBeInTheDocument();
  });

  it('should expand when header button is clicked', async () => {
    const user = userEvent.setup();
    render(<AccelerationConfig {...defaultProps} />);
    
    const headerButton = screen.getByText('Пороги: 2 пар').closest('button');
    await user.click(headerButton!);
    
    expect(screen.getAllByText('От').length).toBeGreaterThan(0);
    expect(screen.getAllByText('До').length).toBeGreaterThan(0);
  });

  it('should collapse when expanded and header button is clicked', async () => {
    const user = userEvent.setup();
    render(<AccelerationConfig {...defaultProps} />);
    
    const headerButton = screen.getByText('Пороги: 2 пар').closest('button');
    await user.click(headerButton!);
    
    expect(screen.getAllByText('От').length).toBeGreaterThan(0);
    
    await user.click(headerButton!);
    
    expect(screen.queryAllByText('От').length).toBe(0);
  });

  it('should call onThresholdPairsChange when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<AccelerationConfig {...defaultProps} />);
    
    const headerButton = screen.getByText('Пороги: 2 пар').closest('button');
    await user.click(headerButton!);
    
    const addButton = screen.getByText('Добавить порог');
    await user.click(addButton);
    
    expect(mockOnThresholdPairsChange).toHaveBeenCalledWith([
      ...mockThresholdPairs,
      { from: 0, to: 60 },
    ]);
  });

  it('should call onThresholdPairsChange when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<AccelerationConfig {...defaultProps} />);
    
    const headerButton = screen.getByText('Пороги: 2 пар').closest('button');
    await user.click(headerButton!);
    
    const removeButtons = screen.getAllByTitle('Удалить');
    await user.click(removeButtons[0]);
    
    expect(mockOnThresholdPairsChange).toHaveBeenCalledWith([mockThresholdPairs[1]]);
  });

  it('should display threshold inputs when expanded', async () => {
    const user = userEvent.setup();
    render(<AccelerationConfig {...defaultProps} />);
    
    const headerButton = screen.getByText('Пороги: 2 пар').closest('button');
    await user.click(headerButton!);
    
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should display presets when expanded', async () => {
    const user = userEvent.setup();
    render(<AccelerationConfig {...defaultProps} />);
    
    const headerButton = screen.getByText('Пороги: 2 пар').closest('button');
    await user.click(headerButton!);
    
    expect(screen.getByText('Пресеты')).toBeInTheDocument();
    expect(screen.getByText('0-25')).toBeInTheDocument();
    expect(screen.getByText('0-60')).toBeInTheDocument();
    expect(screen.getByText('0-90')).toBeInTheDocument();
    expect(screen.getByText('0-100')).toBeInTheDocument();
  });

  it('should call onThresholdPairsChange when preset is clicked', async () => {
    const user = userEvent.setup();
    render(<AccelerationConfig {...defaultProps} />);
    
    const headerButton = screen.getByText('Пороги: 2 пар').closest('button');
    await user.click(headerButton!);
    
    const presetButton = screen.getByText('0-25');
    await user.click(presetButton);
    
    expect(mockOnThresholdPairsChange).toHaveBeenCalledWith([
      ...mockThresholdPairs,
      { from: 0, to: 25 },
    ]);
  });

  it('should display power and temperature thresholds when expanded', async () => {
    const user = userEvent.setup();
    render(<AccelerationConfig {...defaultProps} />);
    
    const headerButton = screen.getByText('Пороги: 2 пар').closest('button');
    await user.click(headerButton!);
    
    expect(screen.getByText('Пороги метрик')).toBeInTheDocument();
    expect(screen.getByText('Макс. мощность (Вт)')).toBeInTheDocument();
    expect(screen.getByText('Макс. температура (°C)')).toBeInTheDocument();
  });

  it('should call onPowerThresholdChange when power input changes', async () => {
    const user = userEvent.setup();
    render(<AccelerationConfig {...defaultProps} />);
    
    const headerButton = screen.getByText('Пороги: 2 пар').closest('button');
    await user.click(headerButton!);
    
    const powerInput = screen.getByPlaceholderText('2500');
    fireEvent.change(powerInput, { target: { value: '3000' } });
    
    expect(mockOnPowerThresholdChange).toHaveBeenCalledWith(3000);
  });

  it('should call onTemperatureThresholdChange when temperature input changes', async () => {
    const user = userEvent.setup();
    render(<AccelerationConfig {...defaultProps} />);
    
    const headerButton = screen.getByText('Пороги: 2 пар').closest('button');
    await user.click(headerButton!);
    
    const tempInput = screen.getByPlaceholderText('45');
    fireEvent.change(tempInput, { target: { value: '50' } });
    
    expect(mockOnTemperatureThresholdChange).toHaveBeenCalledWith(50);
  });
});
