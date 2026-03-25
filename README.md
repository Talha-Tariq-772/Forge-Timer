# Forge Timer

Forge Timer is a polished React single-page workout planner and interval timer built for fast workout setup and focused training sessions. It combines workout configuration, live timing, theme customization, saved presets, and local progress tracking in a clean client-side app.

## Overview

Forge Timer helps users plan a workout on a dashboard, launch a guided interval session, and keep their preferred setup available across visits. The app supports AM/PM-aware workout variations, adjustable timing, keyboard shortcuts, persistent presets, and local workout history without relying on any backend services.

## Key Features

- Dashboard for workout planning and setup
- Live session screen with progress ring, exercise queue, and timer controls
- Multiple built-in workout programs with AM/PM-aware exercise variations
- Configurable sets, exercise duration, and break duration
- Saved presets for quickly reusing favorite workout setups
- Workout history stored on the current device
- Theme presets with light and dark mode support
- Keyboard shortcuts for fast control during active sessions
- Smooth transitions and motion-enhanced UI
- Local-first persistence with `localStorage`
- No backend, API, or database required

## What The App Does

The app is organized around two primary flows:

1. Configure a workout on the dashboard
   - Choose a workout program
   - Adjust the number of sets
   - Set work and rest durations
   - Save the current setup as a reusable preset
   - Review recent workout history and app settings

2. Run the workout in session mode
   - Start, pause, resume, reset, or skip timer segments
   - Follow the live exercise queue for the current set
   - Track overall and per-segment progress
   - Finish the workout and automatically log it to local history

## Project Structure

```text
Forge-Timer/
|-- public/
|-- src/
|   |-- assets/
|   |-- components/
|   |   |-- dashboard/
|   |   |-- layout/
|   |   |-- session/
|   |   `-- shared/
|   |-- context/
|   |-- data/
|   |-- hooks/
|   |-- pages/
|   |-- styles/
|   |-- utils/
|   |-- App.js
|   `-- index.js
|-- package.json
`-- README.md
```

### Structure Notes

- `src/pages` contains the dashboard and session screens.
- `src/components/dashboard` contains workout setup, presets, history, and settings UI.
- `src/components/session` contains the live timer UI, progress ring, controls, and exercise queue.
- `src/context` manages shared workout and theme state.
- `src/hooks` contains reusable logic such as the workout session engine, keyboard shortcuts, and localStorage state.
- `src/data` holds workout definitions and theme presets.
- `src/utils` contains timer and formatting helpers.

## Tech Stack

- React 18
- React Router DOM
- Framer Motion
- React Icons
- `clsx`
- Create React App
- CSS for styling

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Talha-Tariq-772/Forge-Timer.git
   ```

2. Move into the project directory:

   ```bash
   cd Forge-Timer
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Local Development

Start the development server:

```bash
npm start
```

The app will run at `http://localhost:3000`.

## Production Build

Create an optimized production build:

```bash
npm run build
```

The output will be generated in the `build/` directory.

## Usage Guide

1. Open the dashboard.
2. Select one of the built-in workout programs.
3. Adjust sets, exercise time, and break time.
4. Optionally save the current setup as a preset.
5. Enter session mode.
6. Start the workout and follow the active exercise queue.
7. Use the on-screen controls or keyboard shortcuts to manage the session.
8. Complete the workout to save a history entry on the current device.

## Keyboard Shortcuts

The app includes built-in session shortcuts:

| Key | Action |
| --- | --- |
| `Space` | Start, pause, or resume |
| `Enter` | Trigger the main action |
| `Arrow Right` | Move to the next segment |
| `Arrow Left` | Return to the previous segment |
| `R` | Reset the workout |
| `Esc` | Return to the dashboard |

## Themes And Customization

Forge Timer includes multiple visual presets and appearance controls:

- Theme presets: `Gym`, `Boxing`, and `Minimal`
- Light and dark mode support
- Saved default timing settings for future sessions
- Toggleable sound cues
- Optional shortcut help visibility

## Persistence

This app stores the following locally in the browser using `localStorage`:

- Current workout configuration
- Saved presets
- Current selected preset
- Theme preset and light/dark mode
- User settings
- Workout history

Because persistence is local-only, data stays on the current browser/device unless it is manually cleared.

## Backend / Database

Forge Timer is a fully client-side application.

- No backend server
- No API integration
- No authentication
- No database

## Future Improvements

- Custom workout creation and editing
- Import/export for presets and history
- Notifications or countdown voice cues
- Better analytics for workout trends
- Mobile installability and deeper PWA support
- Automated test coverage for session behavior and state persistence

## Author

Talha Tariq  
GitHub: [@Talha-Tariq-772](https://github.com/Talha-Tariq-772)
