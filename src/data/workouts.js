const workoutCatalog = [
  {
    id: "full-body",
    name: "Full Body Reset",
    category: "Gym",
    focus: "Full-body strength",
    intensity: "High",
    description: "Full-body strength with a fast finish.",
    equipment: "Bodyweight + dumbbells",
    exercisesByPeriod: {
      AM: [
        "Squat drive",
        "Push-up release",
        "Bent-over row",
        "Reverse lunge",
        "Shoulder press",
        "Hip hinge pulse",
        "Mountain climber",
        "Plank reach",
        "Bike sprint finisher",
      ],
      PM: [
        "Squat drive",
        "Push-up release",
        "Bent-over row",
        "Reverse lunge",
        "Shoulder press",
        "Hip hinge pulse",
        "Mountain climber",
        "Plank reach",
      ],
    },
  },
  {
    id: "arms-legs",
    name: "Arms + Legs Circuit",
    category: "Gym",
    focus: "Upper and lower split",
    intensity: "Medium",
    description: "Alternating upper and lower body work.",
    equipment: "Bands or dumbbells",
    exercisesByPeriod: {
      AM: [
        "Split squat",
        "Hammer curl",
        "Romanian deadlift",
        "Triceps extension",
        "Lateral lunge",
        "Battle rope slams",
      ],
      PM: [
        "Split squat",
        "Hammer curl",
        "Romanian deadlift",
        "Triceps extension",
        "Lateral lunge",
        "Battle rope slams",
      ],
    },
  },
  {
    id: "arms-only",
    name: "Upper Burn",
    category: "Boxing",
    focus: "Upper-body endurance",
    intensity: "Medium",
    description: "Fast upper-body work for short sessions.",
    equipment: "Bands, gloves, or light dumbbells",
    exercisesByPeriod: {
      AM: ["Shadow jab-cross", "Arnold press", "Skull crusher"],
      PM: ["Shadow jab-cross", "Arnold press", "Skull crusher"],
    },
  },
  {
    id: "legs-only",
    name: "Leg Drive",
    category: "Gym",
    focus: "Lower-body power",
    intensity: "Medium",
    description: "Lower-body power and control.",
    equipment: "Bodyweight or kettlebell",
    exercisesByPeriod: {
      AM: ["Goblet squat", "Walking lunge", "Skater hop", "Glute bridge pulse"],
      PM: ["Goblet squat", "Walking lunge", "Skater hop", "Glute bridge pulse"],
    },
  },
  {
    id: "core-only",
    name: "Core Control",
    category: "Minimal",
    focus: "Core stability",
    intensity: "Low",
    description: "Core work with AM and PM variants.",
    equipment: "Mat optional",
    exercisesByPeriod: {
      AM: [
        "Dead bug hold",
        "Hollow body rock",
        "Side plank switch",
        "Russian twist",
        "Mobility reset",
      ],
      PM: [
        "Dead bug hold",
        "Hollow body rock",
        "Side plank switch",
        "Russian twist",
      ],
    },
  },
];

export function getPeriodOfDay(date = new Date()) {
  return date.getHours() < 12 ? "AM" : "PM";
}

export function getWorkoutPrograms(periodOfDay = "AM") {
  return workoutCatalog.map((workout) => {
    const exercises =
      workout.exercisesByPeriod[periodOfDay] ?? workout.exercisesByPeriod.AM;
    const morningCount = workout.exercisesByPeriod.AM.length;
    const eveningCount = workout.exercisesByPeriod.PM.length;
    const hasDynamicCount = morningCount !== eveningCount;

    return {
      ...workout,
      exercises,
      exerciseCount: exercises.length,
      cadence:
        hasDynamicCount && periodOfDay === "AM"
          ? "AM bonus round"
          : hasDynamicCount && periodOfDay === "PM"
          ? "PM short mode"
          : "Same all day",
    };
  });
}
