---
title: Графики ускорения (Acceleration Charts)
description: Техническая документация и руководство пользователя для графиков анализа ускорений
version: 2.0.0
last_updated: 2026-04-17
author: WindFighter Team
category: technical-spec
components:
  - AccelerationTab
  - AccelerationComparison
---

# Графики ускорения (Acceleration Charts)

> Компоненты для анализа и сравнения попыток ускорения с нормализованным временем.

---

## AccelerationTab

### Расположение
`src/components/AccelerationTab.tsx`

### Назначение
Отображение всех обнаруженных попыток ускорения с группировкой по пресетам.

### Пресеты (Presets)

| Пресет | Диапазон | Цвет | Описание |
|--------|----------|------|----------|
| 0-25   | 0-25 км/ч | Синий (#3b82f6) | Разгон с места |
| 0-60   | 0-60 км/ч | Зелёный (#10b981) | Стандартный разгон |
| 0-90   | 0-90 км/ч | Оранжевый (#f59e0b) | Быстрый разгон |
| 0-100  | 0-100 км/ч | Красный (#ef4444) | Максимальный разгон |
| Все    | Все попытки | Разные цвета | Все обнаруженные попытки |

### Особенность: Нормализованное время

В отличие от основного графика, время **нормализовано** — все попытки начинаются с 0 секунд:

```typescript
// Время в секундах от начала попытки
data: attemptData.map(e => ({ 
  x: (e.timestamp - attempt.startTimestamp) / 1000, 
  y: e.Speed 
}))
```

Это позволяет сравнивать **динамику разгона** независимо от времени суток.

---

## AccelerationComparison

### Расположение
`src/components/AccelerationComparison.tsx`

### Назначение
Сравнение выбранных попыток ускорения с выделением лучшей.

### Фильтры

| Фильтр | Описание |
|--------|----------|
| Все | Показать все выбранные попытки |
| Лучшие 5 | Топ-5 по времени (самые быстрые) |
| Худшие 5 | Топ-5 по времени (самые медленные) |

### Визуальное выделение

- **Лучшая попытка:** Утолщённая линия (3px vs 1.5px)
- **Остальные:** Стандартная линия

---

## Управление графиками ускорения

### Общие возможности (как в основном графике)

| Действие | Как выполнить |
|----------|---------------|
| **Pan** | Зажать ЛКМ + двигать |
| **Zoom In** | Shift + колесо вниз / Кнопка **+** |
| **Zoom Out** | Shift + колесо вверх / Кнопка **-** |
| **Сброс** | Двойной клик / Кнопка **Сброс** |

### Отличия от основного графика

| Параметр | Основной график | Графики ускорения |
|----------|-----------------|-------------------|
| **Ось X** | Время (timestamp) | Секунды от начала |
| **Диапазон** | Вся поездка | Длительность разгона |
| **Min zoom** | 1 секунда | 0.5 секунды |
| **Max zoom** | Вся поездка | Самая долгая попытка |

---

## Техническая реализация

### State управления

```typescript
// Zoom/pan state
const [chartZoom, setChartZoom] = useState<{ min: number; max: number } | null>(null);
const chartContainerRef = useRef<HTMLDivElement>(null);
const isPanning = useRef(false);
const panStart = useRef<{ x: number; zoomMin: number; zoomMax: number } | null>(null);
```

### Расчёт диапазона

```typescript
const timeRange = useMemo(() => {
  let maxDuration = 0;
  filteredAttempts.forEach(attempt => {
    maxDuration = Math.max(maxDuration, attempt.time);
  });
  return maxDuration > 0 ? { start: 0, end: maxDuration } : null;
}, [filteredAttempts]);
```

### Zoom limits

```typescript
// Min range 0.5 seconds
if (newMax - newMin < 0.5) {
  const c = (newMin + newMax) / 2;
  newMin = c - 0.25;
  newMax = c + 0.25;
}

// Max range limit
const totalRange = timeRange.end - timeRange.start;
if (newMax - newMin > totalRange) {
  newMin = timeRange.start;
  newMax = timeRange.end;
}
```

---

## Интерфейс управления

### Кнопки зума

```
┌─────────────────────────────────────┐
│  [+]  [Сброс]  [-]    XX.Xс         │
│                                     │
│  ZoomIn  Reset   ZoomOut  Индикатор │
└─────────────────────────────────────┘
```

### Цветовая схема кнопок

| Кнопка | Состояние | CSS классы |
|--------|-----------|------------|
| + | Default | `bg-blue-500/20 border-blue-500/30 text-blue-200` |
| + | Hover | `hover:bg-blue-500/30` |
| Сброс | Default | `bg-slate-700/50 border-slate-600 text-slate-400` |
| Сброс | Hover | `hover:bg-slate-600` |
| - | Default | `bg-slate-700/50 border-slate-600 text-slate-400` |
| - | Hover | `hover:bg-slate-600` |

---

## Интеграция с данными

### Цепочка обработки

```
detectedAccelerations
  ↓ filter by preset
selectedAttempts
  ↓ filter by time range
attemptData
  ↓ normalize time (x: seconds from start)
chartData.datasets
  ↓ render
Chart.js Line
```

---

## Советы по анализу

1. **Сравнение техники:** Используйте нормализованное время для сравнения нескольких попыток разгона
2. **Поиск лучшей:** В AccelerationComparison лучшая попытка выделена толщиной линии
3. **Анализ провалов:** Включите пресет "Все" чтобы увидеть все попытки сразу
4. **Zoom для деталей:** Приблизьте начало разгона (первые 2-3 секунды) для анализа старта

---

## Dependencies

### State
- `chartZoom: { min, max } | null` — текущий зум
- `timeRange: { start, end }` — диапазон в секундах

### Handlers
- `handleChartMouseDown` — начало pan
- `handleChartMouseMove` — pan с ограничениями
- `handleChartWheel` — zoom с центрированием
- `handleZoomIn/Out/Reset` — кнопки управления

### Refs
- `chartContainerRef: HTMLDivElement` — контейнер графика
- `isPanning: boolean` — флаг перетаскивания
- `panStart: { x, zoomMin, zoomMax }` — начальная позиция pan
