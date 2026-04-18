---
title: Блок управления данными графика (Chart Controls Block)
description: Техническая документация компонента управления отображением и фильтрацией данных телеметрии
version: 2.0.0
last_updated: 2026-04-17
author: WindFighter Team
category: technical-spec
location: src/App.tsx (lines 1278-1416)
---

# Блок управления данными графика (Chart Controls Block)

> Компонент управления отображением и фильтрацией данных телеметрии, расположенный в заголовке основного графика.

## Описание
Компонент управления отображением и фильтрацией данных телеметрии, расположенный в заголовке основного графика.

## Расположение
`src/App.tsx` (строки 1278-1416)

## Структура компонента

```
Chart Controls Block
├── Data Processing Group
│   ├── Скрыть простои (Hide Idle Periods)
│   └── Фильтр данных (Data Filter)
│       ├── Включить/выключить фильтр
│       └── Настройки фильтра (dropdown)
│           ├── Разрыв времени
│           ├── GPS скорость лимит
│           └── Скорость колеса лимит
```

## Механизмы управления

### 1. Скрыть простои (Hide Idle Periods)

**Описание:** Убирает из отображения периоды стоянки (скорость < 5 км/ч > 30 сек)

**State:** `hideIdlePeriods: boolean`

**Toggle handler:**
```typescript
onClick={() => setHideIdlePeriods(prev => !prev)}
```

**Логика фильтрации (useMemo):**
```typescript
// Идентификация idle-периодов
const IDLE_THRESHOLD_KMH = 5;
const IDLE_TIME_THRESHOLD_MS = 30000; // 30 сек

// Фильтрация записей, попадающих в idle-периоды
filtered = filtered.filter(entry => {
  for (const period of idlePeriods) {
    if (entry.timestamp >= period.start && entry.timestamp <= period.end) {
      return false;
    }
  }
  return true;
});
```

**Визуальные состояния:**
- **Включено:** `bg-emerald-500/30 border-emerald-500/60 text-emerald-200`
- **Выключено:** `bg-slate-700/50 border-slate-600 text-slate-400`

---

### 2. Фильтр данных (Data Filter)

**Описание:** Удаляет аномалии GPS и разрывы во времени

**State:** `filterConfig: DataFilterConfig`
```typescript
interface DataFilterConfig {
  enabled: boolean;
  maxTimeGapSeconds: number;      // default: 5
  gpsTeleportSpeedKmh: number;    // default: 200
  wheelSpeedLimitKmh: number;     // default: 120
}
```

**Toggle handler:**
```typescript
onClick={() => setFilterConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
```

**Настройки (Dropdown):**

#### 2.1 Разрыв времени
- **Диапазон:** 1-60 секунд
- **Описание:** Максимальный разрыв между точками данных
- **Handler:** `setFilterConfig({ maxTimeGapSeconds: parseInt(e.target.value) })`

#### 2.2 GPS скорость лимит
- **Диапазон:** 0-500 км/ч
- **Описание:** Максимальная допустимая скорость GPS (телепортации)
- **Handler:** `setFilterConfig({ gpsTeleportSpeedKmh: parseInt(e.target.value) })`

#### 2.3 Скорость колеса лимит
- **Диапазон:** 0-300 км/ч
- **Описание:** Максимальная допустимая скорость колеса
- **Handler:** `setFilterConfig({ wheelSpeedLimitKmh: parseInt(e.target.value) })`

**Визуальные состояния:**
- **Включено:** `bg-emerald-500/30 border-emerald-500/60 text-emerald-200`
- **Выключено:** `bg-slate-700/50 border-slate-600 text-slate-400`

---

## Интеграция с данными

### Цепочка обработки данных

```
rawData
  ↓
[timeRange filter] → timeFiltered
  ↓
[filterData()] → qualityFiltered (DataFilterConfig)
  ↓
[hideIdlePeriods] → idleFiltered
  ↓
displayData (downsample)
```

### useMemo цепочка

```typescript
// 1. Time range filter + Data quality filter + Idle filter
const filteredData = useMemo(() => {
  let timeFiltered = data.filter(e => e.timestamp >= timeRange.start && ...);
  let result = filterData(timeFiltered, filterConfig);  // Quality filter
  let filtered = result.filtered;
  
  if (hideIdlePeriods) {
    filtered = filtered.filter(entry => !isInIdlePeriod(entry));
  }
  return filtered;
}, [data, timeRange, filterConfig, hideIdlePeriods]);

// 2. Downsample for performance
const displayData = useMemo(() => {
  return downsample(filteredData, 500, currentTimeRange);
}, [filteredData, chartZoom, timeRange]);
```

---

## Визуальная структура

### Layout
```
flex items-center justify-center gap-4 mb-2
├── Title Block
│   ├── Icon (BarChart)
│   └── Title "Телеметрия поездки"
└── Controls Group
    └── Data Processing Group
        ├── Hide Idle Button
        ├── Divider (w-px h-6)
        └── Filter Button + Settings Icon
```

### Стили контейнера
```
bg-slate-800/50 rounded-xl border border-white/5
px-3 py-1.5
flex items-center gap-2
```

### Стили кнопок
```
Base: px-4 py-2.5 rounded-lg text-xs font-semibold
      transition-all duration-200 border
      flex items-center gap-2 min-h-[44px]

Active: bg-emerald-500/30 border-emerald-500/60 text-emerald-200
Inactive: bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-700
```

---

## Dependencies

### State dependencies
- `hideIdlePeriods: boolean` — вкл/выкл скрытия простоев
- `filterConfig: DataFilterConfig` — настройки фильтра
- `showFilterDropdown: boolean` — видимость dropdown настроек

### Data dependencies
- `data: TripEntry[]` — исходные данные
- `timeRange: { start, end }` — диапазон времени

### Output
- `filteredData: TripEntry[]` — отфильтрованные данные
- `filteredSummary: TripSummary` — пересчитанная статистика

---

## Accessibility

### ARIA labels
```typescript
aria-label="Максимальный разрыв времени в секундах"
aria-label="Лимит GPS скорости в км/ч"
aria-label="Лимит скорости колеса в км/ч"
```

### Title hints
- "Скрыть простои: убирает стоянки (скорость <5 км/ч >30 сек)"
- "Фильтр данных: удаляет аномалии GPS и разрывы времени"
- "Настройки фильтра"

---

## Performance notes

1. **useMemo** — все фильтры мемоизированы
2. **downsample** — финальные данные сокращаются до 500 точек
3. **Lazy calculation** — фильтры пересчитываются только при изменении зависимостей
