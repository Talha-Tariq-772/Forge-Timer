export function estimateTotalSeconds(config, exerciseCount) {
  const sets = Math.max(1, Number(config?.sets) || 1);
  const exerciseDuration = Math.max(0, Number(config?.exerciseDuration) || 0);
  const breakDuration = Math.max(0, Number(config?.breakDuration) || 0);

  return exerciseCount * sets * exerciseDuration + Math.max(sets - 1, 0) * breakDuration;
}

export function buildSessionSegments(program, config) {
  if (!program) return [];

  const sets = Math.max(1, Number(config?.sets) || 1);
  const exerciseDuration = Math.max(0, Number(config?.exerciseDuration) || 0);
  const breakDuration = Math.max(0, Number(config?.breakDuration) || 0);
  const totalExerciseCount = program.exerciseCount * sets;
  const segments = [];
  let absoluteExerciseIndex = 0;

  for (let setNumber = 1; setNumber <= sets; setNumber += 1) {
    for (
      let exerciseIndex = 0;
      exerciseIndex < program.exercises.length;
      exerciseIndex += 1
    ) {
      const exerciseName = program.exercises[exerciseIndex];
      absoluteExerciseIndex += 1;

      segments.push({
        id: `${program.id}-set-${setNumber}-exercise-${exerciseIndex + 1}`,
        type: "exercise",
        label: exerciseName,
        detail: `${program.category} sequence`,
        duration: exerciseDuration,
        setNumber,
        exerciseNumber: exerciseIndex + 1,
        absoluteExerciseIndex,
        totalExerciseCount,
      });
    }

    if (setNumber < sets) {
      segments.push({
        id: `${program.id}-break-${setNumber}`,
        type: "break",
        label: "Recovery window",
        detail: `Prepare for set ${setNumber + 1}`,
        duration: breakDuration,
        setNumber,
        absoluteExerciseIndex,
        totalExerciseCount,
        nextExerciseLabel: program.exercises[0],
      });
    }
  }

  return segments;
}
