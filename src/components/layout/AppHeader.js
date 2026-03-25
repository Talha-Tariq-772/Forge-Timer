import { NavLink } from "react-router-dom";
import { FiActivity, FiClock } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useWorkout } from "../../context/WorkoutContext";
import { formatCompactDuration } from "../../utils/formatters";
import ModeToggle from "../shared/ModeToggle";
import ThemePresetSwitcher from "../shared/ThemePresetSwitcher";

export default function AppHeader() {
  const { mode, toggleMode, preset, setPreset, presets } = useTheme();
  const { selectedWorkout, estimatedDuration } = useWorkout();

  return (
    <header className="app-header card card--glass">
      <NavLink to="/" className="brand">
        <span className="brand__mark">FT</span>
        <span className="brand__copy">
          <strong>Forge Timer</strong>
          <small>Workout timer</small>
        </span>
      </NavLink>

      <nav className="app-nav" aria-label="Primary navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `app-nav__link${isActive ? " is-active" : ""}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/session"
          className={({ isActive }) =>
            `app-nav__link${isActive ? " is-active" : ""}`
          }
        >
          Session
        </NavLink>
      </nav>

      <div className="app-header__signal">
        <span className="signal-pill">
          <FiActivity />
          {selectedWorkout?.name}
        </span>
        <span className="signal-pill">
          <FiClock />
          {formatCompactDuration(estimatedDuration)}
        </span>
      </div>

      <ThemePresetSwitcher
        presets={presets}
        activePreset={preset}
        onSelect={setPreset}
        compact
      />

      <ModeToggle mode={mode} onToggle={toggleMode} />
    </header>
  );
}
