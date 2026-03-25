import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import ExerciseQueue from "../components/session/ExerciseQueue";
import ProgressRing from "../components/session/ProgressRing";
import SessionControls from "../components/session/SessionControls";
import ShortcutList from "../components/session/ShortcutList";
import { useWorkout } from "../context/WorkoutContext";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import useWorkoutSession from "../hooks/useWorkoutSession";
import { formatCompactDuration, formatTimer } from "../utils/formatters";

export default function SessionPage() {
  const navigate = useNavigate();
  const { addHistoryEntry, config, periodOfDay, selectedWorkout, settings } =
    useWorkout();

  function handleComplete({ totalDuration }) {
    addHistoryEntry({
      workoutId: selectedWorkout.id,
      workoutName: selectedWorkout.name,
      sets: config.sets,
      exerciseDuration: config.exerciseDuration,
      breakDuration: config.breakDuration,
      totalDuration,
      exerciseCount: selectedWorkout.exerciseCount,
      periodOfDay,
    });
  }

  const session = useWorkoutSession({
    program: selectedWorkout,
    config,
    soundEnabled: settings.soundEnabled,
    onComplete: handleComplete,
  });

  const nextSegment = session.segments[session.segmentIndex + 1] ?? null;
  const currentSegment = session.currentSegment;
  const totalMoves = selectedWorkout.exerciseCount * config.sets;
  const overallExerciseProgress = currentSegment?.absoluteExerciseIndex ?? 0;
  const phaseLabel = currentSegment?.type === "break" ? "Recovery" : "Exercise";
  const currentSetLabel = `Set ${currentSegment?.setNumber ?? 1} / ${config.sets}`;
  const nextLabel = nextSegment?.label ?? "Complete";

  useEffect(() => {
    document.title = `${selectedWorkout.name} | Session mode`;
  }, [selectedWorkout.name]);

  useKeyboardShortcuts(
    {
      " ": () => {
        if (session.status === "idle") {
          session.start();
          return;
        }

        if (session.isRunning) {
          session.pause();
          return;
        }

        if (session.status === "completed") {
          session.start();
          return;
        }

        session.resume();
      },
      enter: () => {
        if (session.status === "idle" || session.status === "completed") {
          session.start();
          return;
        }

        if (!session.isRunning) {
          session.resume();
        }
      },
      arrowright: () => session.next(),
      arrowleft: () => session.previous(),
      r: () => session.reset(),
      escape: () => navigate("/"),
    },
    true
  );

  const primaryActionLabel =
    session.status === "idle"
      ? "Start"
      : session.isRunning
      ? "Pause"
      : session.status === "completed"
      ? "Restart"
      : "Resume";

  const primaryActionIcon = session.isRunning ? "pause" : "play";

  function handlePrimaryAction() {
    if (session.status === "idle") {
      session.start();
      return;
    }

    if (session.isRunning) {
      session.pause();
      return;
    }

    if (session.status === "completed") {
      session.start();
      return;
    }

    session.resume();
  }

  return (
    <motion.section
      className="page session-page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="session-topbar">
        <button
          type="button"
          className="button button--ghost"
          onClick={() => navigate("/")}
        >
          <FiArrowLeft />
          Back
        </button>

        <div className="session-topbar__signals">
          <span className="signal-pill">
            <FiTarget />
            {selectedWorkout.category}
          </span>
          <span className="signal-pill">
            <FiClock />
            {formatCompactDuration(session.totalDuration)}
          </span>
        </div>
      </div>

      <div className="session-grid">
        <motion.section
          className="card card--session-focus"
          initial={{ opacity: 0, x: -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="session-focus__header">
            <div>
              <span className="eyebrow">Session</span>
              <h1>{selectedWorkout.name}</h1>
              <p className="session-focus__subcopy">{selectedWorkout.focus}</p>
            </div>
            <span className="chip chip--accent">
              {session.status === "completed"
                ? "Complete"
                : session.isRunning
                ? "Live"
                : session.status === "paused"
                ? "Paused"
                : "Ready"}
            </span>
          </div>

          <div className="session-focus__ring">
            <ProgressRing
              progress={session.segmentProgress}
              value={formatTimer(session.remainingSeconds)}
              caption={phaseLabel}
              detail={currentSetLabel}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSegment?.id ?? session.status}
              className="session-focus__copy"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.24 }}
            >
              <span className="session-focus__kicker">
                {phaseLabel}
              </span>
              <h2>{currentSegment?.label ?? "Ready to start"}</h2>
              <p>
                {currentSegment?.detail ?? "Press start when ready."}
              </p>
              <div className="session-focus__next">
                <span>Next up</span>
                <strong>{nextLabel}</strong>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="session-inline-stats">
            <article className="session-inline-stat">
              <span>Overall</span>
              <strong>{Math.round(session.overallProgress * 100)}%</strong>
            </article>
            <article className="session-inline-stat">
              <span>Set</span>
              <strong>{currentSetLabel}</strong>
            </article>
            <article className="session-inline-stat session-inline-stat--wide">
              <span>Next</span>
              <strong>{nextLabel}</strong>
            </article>
          </div>

          <div className="progress-panel">
            <div className="progress-panel__row">
              <span>Workout progress</span>
              <strong>
                {overallExerciseProgress} / {totalMoves}
              </strong>
            </div>
            <div className="progress-bar">
              <span
                className="progress-bar__value"
                style={{ width: `${session.overallProgress * 100}%` }}
              />
            </div>
            <div className="progress-panel__row">
              <span>Exercise {overallExerciseProgress} of {totalMoves}</span>
              <strong>{phaseLabel}</strong>
            </div>
          </div>

          <SessionControls
            canGoBack={session.segmentIndex > 0}
            canGoForward={session.segmentIndex < session.segments.length - 1}
            onPrimaryAction={handlePrimaryAction}
            onPrevious={session.previous}
            onNext={session.next}
            onReset={session.reset}
            primaryLabel={primaryActionLabel}
            primaryIcon={primaryActionIcon}
          />
        </motion.section>

        <div className="session-grid__side">
          <motion.section
            className="card card--inner session-metrics"
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
          >
            <div className="section-heading section-heading--compact">
              <div>
                <span className="eyebrow">Session data</span>
                <h3>Overview</h3>
              </div>
            </div>

            <div className="session-data-grid">
              <div className="session-data-card">
                <strong>{config.exerciseDuration}s</strong>
                <span>Work</span>
              </div>
              <div className="session-data-card">
                <strong>{config.breakDuration}s</strong>
                <span>Break</span>
              </div>
              <div className="session-data-card">
                <strong>{config.sets}</strong>
                <span>Sets</span>
              </div>
              <div className="session-data-card">
                <strong>{selectedWorkout.exerciseCount}</strong>
                <span>Per set</span>
              </div>
            </div>

            <div className="session-metrics__stack">
              <div className="metric-line">
                <FiLayers />
                <span>{selectedWorkout.focus}</span>
              </div>
              <div className="metric-line">
                <FiTrendingUp />
                <span>{selectedWorkout.equipment}</span>
              </div>
              <div className="metric-line">
                <FiCheckCircle />
                <span>{selectedWorkout.cadence}</span>
              </div>
            </div>
          </motion.section>

          <ExerciseQueue
            exercises={selectedWorkout.exercises}
            currentSegment={currentSegment}
            sets={config.sets}
          />

          {settings.showShortcuts ? <ShortcutList /> : null}
        </div>
      </div>

      {session.isCompleted ? (
        <motion.section
          className="card card--complete"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <span className="eyebrow">Session complete</span>
            <h2>Workout complete.</h2>
            <p>
              {selectedWorkout.name} in {formatCompactDuration(session.totalDuration)}.
            </p>
          </div>
          <div className="action-row">
            <button
              type="button"
              className="button button--secondary"
              onClick={session.start}
            >
              Repeat
            </button>
            <button
              type="button"
              className="button button--primary"
              onClick={() => navigate("/")}
            >
              Dashboard
            </button>
          </div>
        </motion.section>
      ) : null}
    </motion.section>
  );
}
