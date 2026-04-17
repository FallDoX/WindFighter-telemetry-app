import { X, RotateCcw } from 'lucide-react';
import { resetSettings } from '../utils/settings';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  chartToggles: Record<string, boolean>;
  setChartToggles: (toggles: Record<string, boolean>) => void;
  chartView: 'line' | 'scatter';
  setChartView: (view: 'line' | 'scatter') => void;
  hideIdlePeriods: boolean;
  setHideIdlePeriods: (hide: boolean) => void;
}

const metricLabels: Record<string, string> = {
  speed: 'Скорость',
  gpsSpeed: 'GPS Скорость',
  power: 'Мощность',
  current: 'Ток',
  phaseCurrent: 'Фазный ток',
  voltage: 'Напряжение',
  batteryLevel: 'Батарея',
  temperature: 'Температура',
  temp2: 'Температура 2',
  torque: 'Крутящий момент',
  pwm: 'PWM',
};

export function SettingsPanel({
  isOpen,
  onClose,
  chartToggles,
  setChartToggles,
  chartView,
  setChartView,
  hideIdlePeriods,
  setHideIdlePeriods,
}: SettingsPanelProps) {
  const handleReset = () => {
    if (confirm('Сбросить все настройки к значениям по умолчанию?')) {
      resetSettings();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Настройки</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            aria-label="Закрыть настройки"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Chart Metrics */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Показывать на графике</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(metricLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setChartToggles({ ...chartToggles, [key]: !chartToggles[key] })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center gap-2 ${
                    chartToggles[key]
                      ? 'bg-[#3b82f6]/20 border-[#3b82f6]/30 text-[#60a5fa]'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                  aria-label={`${chartToggles[key] ? 'Скрыть' : 'Показать'} ${label}`}
                >
                  {chartToggles[key] ? '✓' : '○'} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart View */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Тип графика</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setChartView('line')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  chartView === 'line'
                    ? 'bg-[#3b82f6] border-[#60a5fa] text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
                aria-label="Линейный график"
              >
                Линейный
              </button>
              <button
                onClick={() => setChartView('scatter')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  chartView === 'scatter'
                    ? 'bg-[#3b82f6] border-[#60a5fa] text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
                aria-label="Точечный график"
              >
                Точечный
              </button>
            </div>
          </div>

          {/* Hide Idle Periods */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">Дополнительно</h3>
            <button
              onClick={() => setHideIdlePeriods(!hideIdlePeriods)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center justify-center gap-2 ${
                hideIdlePeriods
                  ? 'bg-[#3b82f6] border-[#60a5fa] text-white'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
              aria-label={`${hideIdlePeriods ? 'Показать' : 'Скрыть'} периоды без движения`}
            >
              {hideIdlePeriods ? '✓' : '○'} Скрывать периоды без движения
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center gap-2"
            aria-label="Сбросить настройки"
          >
            <RotateCcw className="w-4 h-4" />
            Сбросить настройки
          </button>
        </div>
      </div>
    </div>
  );
}
