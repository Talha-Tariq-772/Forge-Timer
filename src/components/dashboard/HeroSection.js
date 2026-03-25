import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiActivity,
  FiArrowRight,
  FiLayers,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useWorkout } from "../../context/WorkoutContext";
import {
  formatCompactDuration,
  formatDashboardTime,
  pluralize,
} from "../../utils/formatters";

export default function HeroSection() {
  const { theme, mode } = useTheme();
  const {
    config,
    estimatedDuration,
    history,
    now,
    periodOfDay,
    presets,
    resetConfigToDefaults,
    selectedWorkout,
  } = useWorkout();

  const totalMoves = selectedWorkout.exerciseCount * config.sets;

  return (
    <section className="hero">
      <motion.div
        className="card card--hero hero__copy"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <span className="eyebrow">{theme.eyebrow}</span>
        <h1>Train with focus.</h1>
        <p className="hero__lede">
          Build a workout, save presets, and run a clean session timer.
        </p>

        <div className="hero__actions">
          <Link className="button button--primary" to="/session">
            Enter session mode
            <FiArrowRight />
          </Link>
          <button
            type="button"
            className="button button--secondary"
            onClick={resetConfigToDefaults}
          >
            Reset to defaults
          </button>
        </div>

        <div className="hero__detail-strip">
          <span>{formatDashboardTime(now)}</span>
          <span>{periodOfDay === "AM" ? "Morning mode" : "Evening mode"}</span>
          <span>{mode === "dark" ? "Dark mode" : "Light mode"}</span>
        </div>
      </motion.div>

      <motion.aside
        className="card card--spotlight hero__spotlight"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="hero__spotlight-topline">
          <span className="chip">{theme.badge}</span>
          <span className="chip chip--accent">{selectedWorkout.category}</span>
        </div>

        <h2>{selectedWorkout.name}</h2>
        <p>{selectedWorkout.description}</p>

        <div className="hero__highlight-grid">
          <div>
            <strong>{formatCompactDuration(estimatedDuration)}</strong>
            <span>Duration</span>
          </div>
          <div>
            <strong>{pluralize(totalMoves, "move")}</strong>
            <span>Total moves</span>
          </div>
          <div>
            <strong>{selectedWorkout.exerciseCount}</strong>
            <span>Exercises</span>
          </div>
          <div>
            <strong>{config.sets}</strong>
            <span>Sets</span>
          </div>
        </div>

        <ul className="hero__list">
          {theme.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </motion.aside>

      <div className="hero__stats">
        <article className="card stat-card">
          <span className="stat-card__icon">
            <FiTarget />
          </span>
          <strong>{selectedWorkout.focus}</strong>
          <span>{selectedWorkout.cadence}</span>
        </article>

        <article className="card stat-card">
          <span className="stat-card__icon">
            <FiLayers />
          </span>
          <strong>{presets.length}</strong>
          <span>Saved presets</span>
        </article>

        <article className="card stat-card">
          <span className="stat-card__icon">
            <FiActivity />
          </span>
          <strong>{history.length}</strong>
          <span>Sessions logged</span>
        </article>

        <article className="card stat-card">
          <span className="stat-card__icon">
            <FiTrendingUp />
          </span>
          <strong>{selectedWorkout.equipment}</strong>
          <span>Recommended setup</span>
        </article>
      </div>
    </section>
  );
}
