# Phase 4: Acceleration State Refactoring - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning
**Source:** discuss-phase

## Phase Boundary

Извлечение управления состоянием ускорения из App.tsx в кастомный хук для улучшения организации кода и повторного использования. Фаза включает:
- Создание хука `useAccelerationState` в `src/hooks/useAccelerationState.ts`
- Перенос состояния ускорения из App.tsx в хук
- Обновление компонентов для использования хука
- Инкапсуляция мемоизации внутри хука
- Сохранение настроек (threshold, selectedColumns) в localStorage
- Добавление кнопки очистки localStorage

## Implementation Decisions

### Хук: Именование и структура
- **Один хук `useAccelerationState`** — вся логика ускорения в одном месте
- **Файл:** `src/hooks/useAccelerationState.ts`
- **Причина:** Для текущего размера логики это проще. Если в будущем станет слишком большим, можно разделить.

### Хук: Возвращаемое значение
- **Деструктуризация при вызове:** `const { attempts, threshold, setThreshold, ... } = useAccelerationState(data)`
- **Причина:** Удобнее использовать, соответствует текущему стилю в App.tsx

### Хук: Мемоизация
- **Инкапсулировать мемоизацию внутри хука** — детали оптимизации скрыты от пользователя хука
- **Сохранить паттерн:** мемоизация `detectAccelerations` внутри хука для производительности
- **Причина:** Хук должен инкапсулировать оптимизации, пользователь хука не должен думать о мемоизации.

### Сохранение состояния (localStorage)
- **Сохранять в localStorage:** `accelerationThreshold` и `selectedColumns`
- **Не сохранять:** `accelerationAttempts` и `showIncomplete` (это данные конкретной загрузки файла)
- **Ключи localStorage:**
  - `acceleration_threshold` — для порога ускорения
  - `acceleration_selected_columns` — для выбранных колонок таблицы (как JSON массив)
- **Загрузка при инициализации:** Читаем из localStorage при первом рендере, если есть сохранённые значения
- **Причина:** Соответствует плану по кешированию файлов — пользовательские настройки должны персистировать.

### Кнопка очистки localStorage
- **Разместить:** В настройках TripOverview или в AccelerationTab
- **Лейбл:** "Очистить настройки" или "Сбросить настройки"
- **Поведение:** При клике очищает все ключи localStorage, связанные с ускорением (`acceleration_threshold`, `acceleration_selected_columns`)
- **Визуальный фидбек:** Показать toast или подтверждение перед очисткой
- **Причина:** Пользователь должен иметь возможность сбросить настройки к значениям по умолчанию.

### Claude's Discretion
- **Детали реализации мемоизации:** Как именно организовать useMemo внутри хука
- **Обработка ошибок localStorage:** Что делать если localStorage недоступен (private режим)
- **UI для кнопки очистки:** Точное расположение и стиль кнопки
- **Формат сохранения selectedColumns:** Как сериализовать Set в JSON и обратно

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Context
- `.planning/phases/01-acceleration-detection-core/01-CONTEXT.md` — Алгоритм обнаружения ускорения и структура данных
- `.planning/phases/02-acceleration-configuration-ui/02-CONTEXT.md` — Конфигурация порога и поведение переобнаружения
- `.planning/phases/03-acceleration-visualization/03-CONTEXT.md` — Визуализация в AccelerationTab

### Codebase
- `src/App.tsx` — Текущее состояние ускорения (строки 173-176, 701-703, 718)
- `src/components/AccelerationTab.tsx` — Компонент, использующий состояние ускорения
- `src/hooks/useChartState.ts` — Пример существующего хука (для паттерна)
- `src/hooks/useChartOptions.ts` — Пример существующего хука (для паттерна)
- `src/utils/acceleration.ts` — Алгоритм detectAccelerations
- `src/types.ts` — Тип AccelerationAttempt

### Requirements
- `.planning/REQUIREMENTS.md` — Все требования (REQ-040 to REQ-054)

## Specific Ideas

- Хук принимает `data: TripEntry[]` как параметр
- Хук возвращает: `{ attempts, threshold, setThreshold, showIncomplete, setShowIncomplete, selectedColumns, setSelectedColumns, clearSettings }`
- Кнопка очистки вызывает `clearSettings()` из хука
- Если localStorage недоступен, использовать значения по умолчанию (threshold: 60, selectedColumns: ['time', 'distance', 'averagePower', 'peakPower', 'batteryDrop'])

## Deferred Ideas

- Сохранение `accelerationAttempts` в localStorage (слишком много данных, не нужно)
- Сохранение `showIncomplete` (это временное состояние для конкретной сессии)

---

*Phase: 04-acceleration-state-refactoring*
*Context gathered: 2026-04-10 via discuss-phase*
