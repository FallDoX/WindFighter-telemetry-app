# Settings Documentation

## Overview

The WindFighter Telemetry App now supports persistent user settings using localStorage. Settings are automatically saved when changed and loaded when the app starts.

## What Settings Are Saved

### Chart Metrics Visibility
- Speed (Скорость)
- GPS Speed (GPS Скорость)
- Power (Мощность)
- Current (Ток)
- Phase Current (Фазный ток)
- Voltage (Напряжение)
- Battery Level (Батарея)
- Temperature (Температура)
- Temperature 2 (Температура 2)
- Torque (Крутящий момент)
- PWM

### Chart View Preferences
- Chart View Mode: Line chart or Scatter plot
- Hide Idle Periods: Whether to hide periods with speed < 5 km/h for > 30 seconds

## How to Access Settings

1. Click the **Settings** button (gear icon) in the top-right corner of the header
2. The settings panel will open
3. Toggle the desired settings
4. Settings are automatically saved
5. Close the panel by clicking the X button or clicking outside the panel

## How to Reset Settings

1. Open the settings panel
2. Click the **"Сбросить настройки"** (Reset Settings) button at the bottom
3. Confirm the reset in the dialog
4. The page will reload with default settings

## Settings Persistence

- Settings are saved to browser localStorage
- Settings persist across browser sessions
- Settings persist across page reloads
- Settings are independent of loaded CSV files
- Each browser/profile has its own settings

## Limitations

- Settings are stored in browser localStorage
- localStorage has a limit of ~5-10MB (our settings use < 1KB)
- Settings are not synced across devices or browsers
- Clearing browser data will reset settings
- Private/incognito mode may not persist settings after closing

## Troubleshooting

### Settings Not Persisting

If settings are not persisting:

1. Check if localStorage is enabled in your browser
2. Check browser console for errors
3. Try clearing the site's data and reloading
4. Ensure you're not in private/incognito mode

### Settings Not Loading

If settings are not loading on app start:

1. Check browser console for errors
2. Verify localStorage contains data: `localStorage.getItem('windfighter-settings')`
3. Try resetting settings to defaults

### Reset Settings Not Working

If reset doesn't work:

1. Ensure you confirm the dialog
2. Check browser console for errors
3. Manually clear localStorage: `localStorage.removeItem('windfighter-settings')`
4. Reload the page

## Technical Details

### Storage Key
- `windfighter-settings`

### Storage Format
- JSON object with the following structure:
```json
{
  "chartToggles": {
    "speed": true,
    "gpsSpeed": true,
    "power": true,
    "current": true,
    "phaseCurrent": false,
    "voltage": true,
    "batteryLevel": true,
    "temperature": true,
    "temp2": false,
    "torque": false,
    "pwm": false
  },
  "chartView": "line",
  "hideIdlePeriods": false
}
```

### Default Settings
All metrics are visible by default
Chart view is "line" by default
Idle periods are shown by default

## Future Enhancements

Potential future improvements to settings:

- Export/import settings configuration
- Cloud sync across devices
- Settings profiles for different use cases
- More granular chart customization
