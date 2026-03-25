import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiEdit3, FiSave, FiTrash2 } from "react-icons/fi";
import { useWorkout } from "../../context/WorkoutContext";

export default function SavedPresetsPanel() {
  const {
    currentPreset,
    currentPresetId,
    deletePreset,
    loadPreset,
    presets,
    savePreset,
    selectedWorkout,
    updatePreset,
  } = useWorkout();
  const [presetName, setPresetName] = useState("");

  useEffect(() => {
    if (currentPreset) {
      setPresetName(currentPreset.name);
      return;
    }

    setPresetName("");
  }, [currentPreset]);

  function resolvePresetName() {
    return presetName.trim() || selectedWorkout.name;
  }

  function handleSave() {
    const createdPreset = savePreset(resolvePresetName());
    setPresetName(createdPreset.name);
  }

  function handleUpdate() {
    if (!currentPresetId) return;

    const updatedPreset = updatePreset(currentPresetId, resolvePresetName());

    if (updatedPreset) {
      setPresetName(updatedPreset.name);
    }
  }

  return (
    <motion.section
      className="card card--section panel-stack"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.14 }}
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">Saved presets</span>
          <h2>Save presets.</h2>
        </div>
        <p>Save, load, update, or delete.</p>
      </div>

      <label className="input-field">
        <span>Preset name</span>
        <input
          type="text"
          value={presetName}
          onChange={(event) => setPresetName(event.target.value)}
          placeholder={selectedWorkout.name}
        />
      </label>

      <div className="action-row">
        <button type="button" className="button button--secondary" onClick={handleSave}>
          <FiSave />
          Save
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={handleUpdate}
          disabled={!currentPresetId}
        >
          <FiEdit3 />
          Update
        </button>
      </div>

      <div className="preset-list">
        {presets.length === 0 ? (
          <div className="empty-state">
            <strong>No presets yet</strong>
            <p>Save a setup to reuse it.</p>
          </div>
        ) : (
          presets.map((preset) => (
            <article
              className={`preset-item${preset.id === currentPresetId ? " is-active" : ""}`}
              key={preset.id}
            >
              <div>
                <strong>{preset.name}</strong>
                <p>
                  {preset.workoutName} - {preset.config.sets} sets -{" "}
                  {preset.config.exerciseDuration}s / {preset.config.breakDuration}s
                </p>
              </div>
              <div className="preset-item__actions">
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => loadPreset(preset.id)}
                  aria-label={`Load ${preset.name}`}
                >
                  <FiDownload />
                </button>
                <button
                  type="button"
                  className="icon-button icon-button--danger"
                  onClick={() => deletePreset(preset.id)}
                  aria-label={`Delete ${preset.name}`}
                >
                  <FiTrash2 />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </motion.section>
  );
}
