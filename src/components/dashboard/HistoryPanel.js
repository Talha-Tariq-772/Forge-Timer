import { motion } from "framer-motion";
import { FiAward, FiClock, FiTrendingUp } from "react-icons/fi";
import { useWorkout } from "../../context/WorkoutContext";
import {
  formatCompactDuration,
  formatHistoryDate,
  pluralize,
} from "../../utils/formatters";

function getFavoriteWorkout(history) {
  if (history.length === 0) return "No data";

  const frequencyMap = history.reduce((totals, entry) => {
    totals[entry.workoutName] = (totals[entry.workoutName] ?? 0) + 1;
    return totals;
  }, {});

  return Object.entries(frequencyMap).sort((a, b) => b[1] - a[1])[0][0];
}

export default function HistoryPanel() {
  const { history } = useWorkout();

  const totalLoggedSeconds = history.reduce(
    (total, entry) => total + entry.totalDuration,
    0
  );

  return (
    <motion.section
      className="card card--section history-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.24 }}
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">History and stats</span>
          <h2>Workout history.</h2>
        </div>
        <p>Recent sessions on this device.</p>
      </div>

      <div className="history-summary">
        <article className="card stat-card stat-card--compact">
          <span className="stat-card__icon">
            <FiTrendingUp />
          </span>
          <strong>{history.length}</strong>
          <span>Sessions</span>
        </article>
        <article className="card stat-card stat-card--compact">
          <span className="stat-card__icon">
            <FiClock />
          </span>
          <strong>{formatCompactDuration(totalLoggedSeconds)}</strong>
          <span>Total time</span>
        </article>
        <article className="card stat-card stat-card--compact">
          <span className="stat-card__icon">
            <FiAward />
          </span>
          <strong>{getFavoriteWorkout(history)}</strong>
          <span>Top workout</span>
        </article>
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <div className="empty-state">
            <strong>No sessions yet</strong>
            <p>Finish a workout to log it here.</p>
          </div>
        ) : (
          history.map((entry) => (
            <article className="history-item" key={entry.id}>
              <div>
                <strong>{entry.workoutName}</strong>
                <p>
                  {entry.sets} sets - {entry.exerciseDuration}s work - {entry.breakDuration}s rest
                </p>
              </div>
              <div className="history-item__meta">
                <span>{formatCompactDuration(entry.totalDuration)}</span>
                <small>{formatHistoryDate(entry.completedAt)}</small>
              </div>
            </article>
          ))
        )}
      </div>
    </motion.section>
  );
}
