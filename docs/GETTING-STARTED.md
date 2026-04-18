# Getting Started

<!-- GSD-MARKER:DOC-GENERATED -->

## Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git (for cloning the repository)

## Installation

### Clone the Repository

```bash
git clone https://github.com/FallDoX/WindFighter-telemetry-app.git
cd WindFighter-telemetry-app
```

### Install Dependencies

```bash
npm install
```

## Quick Start

### Development Mode

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Or serve the built files:

```bash
npm run serve
```

## Using the Application

### Upload CSV File

1. Open the application in your browser
2. Drag and drop your CSV file into the upload area
3. Or click "Upload Trip CSV" to select a file

### Supported CSV Formats

The application supports two CSV formats:

**Old Format:**
```
timestamp,Speed,Voltage,PWM,Current,Power,BatteryLevel,TotalDistance,Temperature
```

**New Format:**
```
timestamp,Speed,Voltage,PWM,Current,Power,BatteryLevel,TotalDistance,Temperature,PhaseCurrent,Torque,Temp2,Distance,Mode,Alert,GPSSpeed,Latitude,Longitude,Altitude,Tilt,Roll,Pitch,GPSHeading,GPSDistance
```

The application automatically detects the format.

### Analyze Data

Once uploaded, you can:

**View Statistics:**
- Maximum speed
- Average speed
- Distance traveled
- Peak power
- Battery drop
- Temperature metrics

**View Charts:**
- Speed profile (Speed vs GPS Speed)
- Power and current
- Voltage and battery level
- System temperature

**Filter by Time:**
- Use the time range slider to select a specific period
- Statistics update automatically based on selected range

**Configure Display:**
- Click the ⚙️ button to open settings
- Toggle chart visibility
- Adjust performance settings
- Change language

### Acceleration Analysis

**View Acceleration Attempts:**
1. Navigate to the Acceleration tab
2. View detected acceleration attempts
3. Filter by preset ranges (0-25, 0-60, 0-90, 0-100)
4. Create custom presets

**Analyze Attempts:**
- View time, distance, power metrics
- Sort by any metric
- Select attempts for comparison

**Compare Attempts:**
1. Select multiple attempts
2. View comparison table
3. See delta metrics vs best attempt
4. View overlaid speed charts

### Export Data

**Screenshot:**
- Click the screenshot button in the data panel
- Saves current view as PNG

**Settings:**
- Settings are automatically saved to localStorage
- Persist across browser sessions

## Demo Data

The application includes demo data files for testing:

```bash
# Generate acceleration demo data
npm run generate:acceleration
```

This creates `demo_acceleration.csv` in the project root.

## Troubleshooting

### CSV Not Loading

**Issue:** CSV file not recognized

**Solutions:**
- Ensure CSV has proper headers
- Check file encoding (UTF-8 recommended)
- Verify file is not corrupted
- Try opening in text editor to inspect format

### Charts Not Displaying

**Issue:** Charts appear blank

**Solutions:**
- Check browser console for errors
- Ensure Chart.js loaded correctly
- Verify data parsing succeeded
- Try disabling downsampling in settings

### Performance Issues

**Issue:** Application slow with large files

**Solutions:**
- Enable downsampling in settings
- Reduce time range selection
- Close other browser tabs
- Use modern browser (Chrome/Edge recommended)

### Mobile Issues

**Issue:** UI not responsive on mobile

**Solutions:**
- Use landscape orientation
- Close other apps
- Ensure sufficient memory
- Try different browser

## Browser Compatibility

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 90+ | Recommended |
| Edge | 90+ | Recommended |
| Firefox | 88+ | Supported |
| Safari | 14+ | Supported |

## Next Steps

- Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system design
- Read [DEVELOPMENT.md](DEVELOPMENT.md) to learn about development
- Read [TESTING.md](TESTING.md) to learn about testing
- Read [CONTRIBUTING.md](../CONTRIBUTING.md) to contribute

## Support

- **Issues:** Report bugs on [GitHub Issues](https://github.com/FallDoX/WindFighter-telemetry-app/issues)
- **Documentation:** See [docs/](../docs/) directory
- **Source Code:** [GitHub Repository](https://github.com/FallDoX/WindFighter-telemetry-app)
