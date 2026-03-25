import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getPeriodOfDay, getWorkoutPrograms } from "../data/workouts";
import useLocalStorageState from "../hooks/useLocalStorageState";
import { estimateTotalSeconds } from "../utils/workout";

const WorkoutContext = createContext(null);

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  showShortcuts: true,
  defaultSets: 4,
  defaultExerciseDuration: 45,
  defaultBreakDuration: 60,
};

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createConfig(defaults) {
  return {
    workoutId: "full-body",
    sets: defaults.defaultSets,
    exerciseDuration: defaults.defaultExerciseDuration,
    breakDuration: defaults.defaultBreakDuration,
  };
}

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function normalizeSettings(settings) {
  return {
    soundEnabled:
      typeof settings?.soundEnabled === "boolean"
        ? settings.soundEnabled
        : DEFAULT_SETTINGS.soundEnabled,
    showShortcuts:
      typeof settings?.showShortcuts === "boolean"
        ? settings.showShortcuts
        : DEFAULT_SETTINGS.showShortcuts,
    defaultSets: clampNumber(
      Number(settings?.defaultSets),
      1,
      8,
      DEFAULT_SETTINGS.defaultSets
    ),
    defaultExerciseDuration: clampNumber(
      Number(settings?.defaultExerciseDuration),
      20,
      180,
      DEFAULT_SETTINGS.defaultExerciseDuration
    ),
    defaultBreakDuration: clampNumber(
      Number(settings?.defaultBreakDuration),
      10,
      180,
      DEFAULT_SETTINGS.defaultBreakDuration
    ),
  };
}

function normalizeConfig(config, workoutId, settings) {
  const safeSettings = normalizeSettings(settings);

  return {
    workoutId: config?.workoutId ?? workoutId,
    sets: clampNumber(Number(config?.sets), 1, 8, safeSettings.defaultSets),
    exerciseDuration: clampNumber(
      Number(config?.exerciseDuration),
      20,
      180,
      safeSettings.defaultExerciseDuration
    ),
    breakDuration: clampNumber(
      Number(config?.breakDuration),
      10,
      180,
      safeSettings.defaultBreakDuration
    ),
  };
}

export function WorkoutProvider({ children }) {
  const [now, setNow] = useState(() => new Date());
  const [settingsState, setSettingsState] = useLocalStorageState(
    "fitforge-settings",
    DEFAULT_SETTINGS
  );
  const settings = useMemo(
    () => normalizeSettings(settingsState),
    [settingsState]
  );
  const [configState, setConfigState] = useLocalStorageState(
    "fitforge-config",
    () => createConfig(DEFAULT_SETTINGS)
  );
  const [presets, setPresets] = useLocalStorageState("fitforge-presets", []);
  const [history, setHistory] = useLocalStorageState("fitforge-history", []);
  const [currentPresetId, setCurrentPresetId] = useLocalStorageState(
    "fitforge-current-preset",
    null
  );

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => window.clearInterval(timerId);
  }, []);

  const periodOfDay = getPeriodOfDay(now);
  const workouts = useMemo(() => getWorkoutPrograms(periodOfDay), [periodOfDay]);
  const fallbackWorkoutId = workouts[0]?.id ?? "full-body";
  const config = useMemo(
    () => normalizeConfig(configState, fallbackWorkoutId, settings),
    [configState, fallbackWorkoutId, settings]
  );
  const selectedWorkout = useMemo(
    () => workouts.find((workout) => workout.id === config.workoutId) ?? workouts[0],
    [config.workoutId, workouts]
  );
  const currentPreset = useMemo(
    () => presets.find((preset) => preset.id === currentPresetId) ?? null,
    [currentPresetId, presets]
  );
  const estimatedDuration = useMemo(
    () => estimateTotalSeconds(config, selectedWorkout?.exerciseCount ?? 0),
    [config, selectedWorkout?.exerciseCount]
  );

  useEffect(() => {
    if (!workouts.some((workout) => workout.id === configState?.workoutId)) {
      setConfigState((currentConfig) =>
        normalizeConfig(currentConfig, fallbackWorkoutId, settings)
      );
    }
  }, [configState, fallbackWorkoutId, settings, setConfigState, workouts]);

  function updateConfig(patch) {
    setConfigState((currentConfig) =>
      normalizeConfig(
        {
          ...currentConfig,
          ...patch,
        },
        fallbackWorkoutId,
        settings
      )
    );
  }

  function resetConfigToDefaults() {
    setConfigState((currentConfig) =>
      normalizeConfig(
        {
          ...currentConfig,
          sets: settings.defaultSets,
          exerciseDuration: settings.defaultExerciseDuration,
          breakDuration: settings.defaultBreakDuration,
        },
        fallbackWorkoutId,
        settings
      )
    );
  }

  function updateSettings(patch) {
    setSettingsState((currentSettings) => normalizeSettings({ ...currentSettings, ...patch }));
  }

  function savePreset(name) {
    const presetName = name?.trim() || selectedWorkout?.name || "Custom workout";
    const nextPreset = {
      id: createId("preset"),
      name: presetName,
      config,
      workoutName: selectedWorkout?.name ?? "Workout",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPresets((currentPresets) => [nextPreset, ...currentPresets]);
    setCurrentPresetId(nextPreset.id);

    return nextPreset;
  }

  function updatePreset(presetId, name) {
    let updatedPreset = null;

    setPresets((currentPresets) =>
      currentPresets.map((preset) => {
        if (preset.id !== presetId) return preset;

        updatedPreset = {
          ...preset,
          name: name?.trim() || preset.name,
          config,
          workoutName: selectedWorkout?.name ?? preset.workoutName,
          updatedAt: new Date().toISOString(),
        };

        return updatedPreset;
      })
    );

    return updatedPreset;
  }

  function loadPreset(presetId) {
    const preset = presets.find((item) => item.id === presetId);

    if (!preset) return null;

    setConfigState(normalizeConfig(preset.config, fallbackWorkoutId, settings));
    setCurrentPresetId(preset.id);

    return preset;
  }

  function deletePreset(presetId) {
    setPresets((currentPresets) =>
      currentPresets.filter((preset) => preset.id !== presetId)
    );

    if (currentPresetId === presetId) {
      setCurrentPresetId(null);
    }
  }

  function addHistoryEntry(entry) {
    const historyEntry = {
      id: createId("history"),
      completedAt: new Date().toISOString(),
      ...entry,
    };

    setHistory((currentHistory) => [historyEntry, ...currentHistory].slice(0, 24));

    return historyEntry;
  }

  return (
    <WorkoutContext.Provider
      value={{
        now,
        periodOfDay,
        workouts,
        selectedWorkout,
        config,
        settings,
        presets,
        history,
        currentPreset,
        currentPresetId,
        estimatedDuration,
        updateConfig,
        resetConfigToDefaults,
        updateSettings,
        savePreset,
        updatePreset,
        loadPreset,
        deletePreset,
        addHistoryEntry,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);

  if (!context) {
    throw new Error("useWorkout must be used within WorkoutProvider");
  }

  return context;
}
