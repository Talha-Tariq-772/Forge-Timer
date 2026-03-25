import clsx from "clsx";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiZap } from "react-icons/fi";
import { useWorkout } from "../../context/WorkoutContext";
import { formatCompactDuration, pluralize } from "../../utils/formatters";
import RangeControl from "../shared/RangeControl";

export default function WorkoutConfigurator() {
  const {
    config,
    estimatedDuration,
    selectedWorkout,
    updateConfig,
    workouts,
  } = useWorkout();

  const totalMoves = selectedWorkout.exerciseCount * config.sets;

  return (
    <motion.section
      className="card card--section configurator"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 }}
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">Workout configuration</span>
          <h2>Build your workout.</h2>
        </div>
        <p>Pick a program and set the timing.</p>
      </div>

      <div className="program-selector">
        {workouts.map((workout) => (
          <button
            type="button"
            key={workout.id}
            className={clsx(
              "program-card",
              workout.id === selectedWorkout.id && "is-selected"
            )}
            onClick={() => updateConfig({ workoutId: workout.id })}
          >
            <span className="program-card__meta">
              <span>{workout.category}</span>
              <span>{workout.intensity} intensity</span>
            </span>
            <strong>{workout.name}</strong>
            <p>{workout.focus}</p>
            <div className="program-card__footer">
              <span>{workout.exerciseCount} exercises</span>
              <span>{workout.cadence}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="configurator__grid">
        <div className="configurator__controls">
          <RangeControl
            label="Sets"
            value={config.sets}
            min={1}
            max={8}
            description="More sets, longer workout."
            onChange={(value) => updateConfig({ sets: value })}
          />
          <RangeControl
            label="Exercise duration"
            value={config.exerciseDuration}
            min={20}
            max={180}
            step={5}
            suffix="s"
            description="Time for each exercise."
            onChange={(value) => updateConfig({ exerciseDuration: value })}
          />
          <RangeControl
            label="Break between sets"
            value={config.breakDuration}
            min={10}
            max={180}
            step={5}
            suffix="s"
            description="Rest between sets."
            onChange={(value) => updateConfig({ breakDuration: value })}
          />
        </div>

        <aside className="configurator__summary card card--inner">
          <span className="chip">
            <FiZap />
            Session
          </span>
          <h3>{selectedWorkout.name}</h3>
          <p>{selectedWorkout.description}</p>

          <div className="summary-grid">
            <div>
              <strong>{formatCompactDuration(estimatedDuration)}</strong>
              <span>Duration</span>
            </div>
            <div>
              <strong>{pluralize(totalMoves, "move")}</strong>
              <span>Total moves</span>
            </div>
            <div>
              <strong>{config.breakDuration}s</strong>
              <span>Break</span>
            </div>
            <div>
              <strong>{selectedWorkout.equipment}</strong>
              <span>Equipment</span>
            </div>
          </div>

          <div className="summary-tags">
            <span>{selectedWorkout.focus}</span>
            <span>{selectedWorkout.cadence}</span>
            <span>{selectedWorkout.category} aesthetic</span>
          </div>

          <Link className="button button--primary button--full" to="/session">
            Start session
            <FiArrowRight />
          </Link>
        </aside>
      </div>
    </motion.section>
  );
}
