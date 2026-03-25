import { memo } from "react";
import clsx from "clsx";

function ExerciseQueue({ exercises, currentSegment, sets }) {
  const activeSet = currentSegment?.setNumber ?? 1;
  const activeExercise =
    currentSegment?.type === "exercise"
      ? currentSegment.exerciseNumber
      : exercises.length + 1;

  return (
    <section className="card card--inner queue-card">
      <div className="section-heading section-heading--compact">
        <div>
          <span className="eyebrow">Exercise list</span>
          <h3>
            Set {activeSet} of {sets}
          </h3>
        </div>
        <p>Live order for this set.</p>
      </div>

      <div className="exercise-queue">
        {exercises.map((exercise, index) => (
          (() => {
            const isComplete = index + 1 < activeExercise;
            const isActive =
              index + 1 === activeExercise &&
              currentSegment?.type === "exercise";

            return (
              <div
                className={clsx(
                  "exercise-pill",
                  isComplete && "is-complete",
                  isActive && "is-active"
                )}
                key={exercise}
              >
                <span className="exercise-pill__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="exercise-pill__body">
                  <strong>{exercise}</strong>
                  <small>
                    {isActive ? "Now" : isComplete ? "Done" : "Queued"}
                  </small>
                </div>
                {isActive ? <span className="exercise-pill__tag">Active</span> : null}
              </div>
            );
          })()
        ))}
      </div>
    </section>
  );
}

export default memo(ExerciseQueue);
