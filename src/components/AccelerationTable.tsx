import React, { memo } from 'react';
import { Settings, Eye, EyeOff, Grid3X3 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import type { AccelerationAttempt } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AccelerationTableProps {
  accelerationAttempts: AccelerationAttempt[];
  showIncomplete: boolean;
  selectedColumns: Set<string>;
  onShowIncompleteToggle: () => void;
  onColumnToggle: (column: string) => void;
}

const columnLabels: Record<string, string> = {
  time: 'Время (с)',
  distance: 'Дистанция (м)',
  averagePower: 'Средняя мощность (Вт)',
  peakPower: 'Пиковая мощность (Вт)',
  averageCurrent: 'Средний ток (А)',
  averageVoltage: 'Среднее напряжение (В)',
  batteryDrop: 'Падение батареи (%)',
  averageTemperature: 'Средняя температура (°C)',
  startSpeed: 'Начальная скорость (км/ч)',
  endSpeed: 'Конечная скорость (км/ч)',
  targetSpeed: 'Целевая скорость (км/ч)',
};

export const AccelerationTable = memo(({
  accelerationAttempts,
  showIncomplete,
  selectedColumns,
  onShowIncompleteToggle,
  onColumnToggle,
}: AccelerationTableProps) => {
  const filteredAttempts = showIncomplete
    ? accelerationAttempts
    : accelerationAttempts.filter(a => a.isComplete);

  const visibleColumns = Array.from(selectedColumns);

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">Ускорения</h2>
        <button
          onClick={onShowIncompleteToggle}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 border text-sm",
            showIncomplete
              ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
          )}
          title={showIncomplete ? "Скрыть неполные попытки" : "Показать неполные попытки"}
        >
          {showIncomplete ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
          <span className="hidden sm:inline">Неполные попытки</span>
        </button>
      </div>

      {/* Column Selector */}
      <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
          <Grid3X3 className="w-4 h-4" />
          Столбцы
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(columnLabels).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedColumns.has(key)}
                onChange={() => onColumnToggle(key)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className="text-xs text-slate-300">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Table */}
      {filteredAttempts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/50 text-sm mb-2">Ускорения не найдены</p>
          <p className="text-white/30 text-xs">Загрузите CSV файл с данными скорости для обнаружения ускорений.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-300 font-medium">№</TableHead>
                {visibleColumns.map((col) => (
                  <TableHead key={col} className="text-slate-300 font-medium">
                    {columnLabels[col] || col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttempts.map((attempt, index) => (
                <TableRow
                  key={attempt.id}
                  className={cn(
                    "border-white/5",
                    !attempt.isComplete && "text-slate-400"
                  )}
                >
                  <TableCell className="text-slate-300">{index + 1}</TableCell>
                  {visibleColumns.map((col) => (
                    <TableCell key={col} className={cn(
                      !attempt.isComplete && "text-slate-400"
                    )}>
                      {col === 'time' && `${attempt.time.toFixed(2)}`}
                      {col === 'distance' && `${attempt.distance.toFixed(1)}`}
                      {col === 'averagePower' && `${attempt.averagePower.toFixed(1)}`}
                      {col === 'peakPower' && `${attempt.peakPower.toFixed(1)}`}
                      {col === 'averageCurrent' && `${attempt.averageCurrent.toFixed(2)}`}
                      {col === 'averageVoltage' && `${attempt.averageVoltage.toFixed(1)}`}
                      {col === 'batteryDrop' && `${attempt.batteryDrop.toFixed(1)}`}
                      {col === 'averageTemperature' && `${attempt.averageTemperature.toFixed(1)}`}
                      {col === 'startSpeed' && `${attempt.startSpeed.toFixed(1)}`}
                      {col === 'endSpeed' && `${attempt.endSpeed.toFixed(1)}`}
                      {col === 'targetSpeed' && `${attempt.targetSpeed.toFixed(1)}`}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
});

AccelerationTable.displayName = 'AccelerationTable';
