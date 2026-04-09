import { memo, useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { AccelerationTable } from './AccelerationTable';
import type { AccelerationAttempt, TripEntry } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

interface AccelerationTabProps {
  accelerationAttempts: AccelerationAttempt[];
  showIncomplete: boolean;
  selectedColumns: Set<string>;
  onShowIncompleteToggle: () => void;
  onColumnToggle: (column: string) => void;
  data: TripEntry[];
}

const ATTEMPT_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#f97316', '#06b6d4', '#a78bfa', '#fb923c'
];

export const AccelerationTab = memo(({
  accelerationAttempts,
  showIncomplete,
  selectedColumns,
  onShowIncompleteToggle,
  onColumnToggle,
  data,
}: AccelerationTabProps) => {
  const [selectedAttempts, setSelectedAttempts] = useState<Set<number>>(new Set());

  const toggleAttempt = (attemptIndex: number) => {
    setSelectedAttempts(prev => {
      const next = new Set(prev);
      if (next.has(attemptIndex)) {
        next.delete(attemptIndex);
      } else {
        if (next.size >= 10) {
          alert('Максимум 10 попыток для отображения');
          return prev;
        }
        next.add(attemptIndex);
      }
      return next;
    });
  };

  const accelerationChartData = useMemo(() => {
    const datasets = accelerationAttempts
      .filter((_, index) => selectedAttempts.has(index))
      .map((attempt, index) => {
        const attemptData = data.filter(
          e => e.timestamp >= attempt.startTimestamp && e.timestamp <= attempt.endTimestamp
        );

        return {
          label: `Попытка ${index + 1} (${attempt.startSpeed}-${attempt.endSpeed} км/ч)`,
          data: attemptData.map(e => ({ x: e.timestamp, y: e.Speed })),
          borderColor: ATTEMPT_COLORS[index % ATTEMPT_COLORS.length],
          backgroundColor: `${ATTEMPT_COLORS[index % ATTEMPT_COLORS.length]}20`,
          fill: false,
          tension: 0.1,
          pointRadius: 0,
        };
      });

    return { datasets };
  }, [accelerationAttempts, selectedAttempts, data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: { size: 11 },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'second' as const,
          displayFormats: {
            second: 'HH:mm:ss',
          },
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Скорость (км/ч)',
          color: '#94a3b8',
          font: { size: 11 },
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Attempt selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400 font-medium">Выберите попытки для графика:</span>
        <div className="flex flex-wrap gap-2">
          {accelerationAttempts.map((attempt, index) => (
            <button
              key={attempt.id}
              onClick={() => toggleAttempt(index)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedAttempts.has(index)
                  ? `${ATTEMPT_COLORS[index % ATTEMPT_COLORS.length]}20 border ${ATTEMPT_COLORS[index % ATTEMPT_COLORS.length]}50 text-white`
                  : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700'
              }`}
            >
              #{index + 1} ({attempt.startSpeed}-{attempt.endSpeed})
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {selectedAttempts.size > 0 && (
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 h-[400px]">
          <Line data={accelerationChartData} options={chartOptions} />
        </div>
      )}

      {/* Table */}
      <AccelerationTable
        accelerationAttempts={accelerationAttempts}
        showIncomplete={showIncomplete}
        selectedColumns={selectedColumns}
        onShowIncompleteToggle={onShowIncompleteToggle}
        onColumnToggle={onColumnToggle}
      />
    </div>
  );
});

AccelerationTab.displayName = 'AccelerationTab';
