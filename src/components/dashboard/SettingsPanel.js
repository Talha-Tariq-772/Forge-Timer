import { motion } from "framer-motion";
import { FiCommand, FiVolume2, FiVolumeX } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useWorkout } from "../../context/WorkoutContext";
import ModeToggle from "../shared/ModeToggle";
import RangeControl from "../shared/RangeControl";
import ThemePresetSwitcher from "../shared/ThemePresetSwitcher";

const shortcuts = [
  { key: "Space", label: "Start, pause, or resume" },
  { key: "Enter", label: "Primary action" },
  { key: "Arrow Right", label: "Next segment" },
  { key: "Arrow Left", label: "Previous segment" },
  { key: "R", label: "Reset workout" },
  { key: "Esc", label: "Return to dashboard" },
];

export default function SettingsPanel() {
  const { mode, preset, presets, setPreset, toggleMode } = useTheme();
  const { settings, updateSettings } = useWorkout();

  return (
    <motion.section
      className="card card--section panel-stack"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">Settings</span>
          <h2>App settings.</h2>
        </div>
        <p>Saved on this device.</p>
      </div>

      <div className="settings-group">
        <span className="settings-group__label">Theme preset</span>
        <ThemePresetSwitcher
          presets={presets}
          activePreset={preset}
          onSelect={setPreset}
        />
      </div>

      <div className="settings-group">
        <span className="settings-group__label">Appearance mode</span>
        <ModeToggle mode={mode} onToggle={toggleMode} className="mode-toggle--wide" />
      </div>

      <div className="settings-group settings-group--split">
        <button
          type="button"
          className={`toggle-card${settings.soundEnabled ? " is-active" : ""}`}
          onClick={() =>
            updateSettings({ soundEnabled: !settings.soundEnabled })
          }
        >
          {settings.soundEnabled ? <FiVolume2 /> : <FiVolumeX />}
          <span>{settings.soundEnabled ? "Sound on" : "Sound off"}</span>
        </button>

        <button
          type="button"
          className={`toggle-card${settings.showShortcuts ? " is-active" : ""}`}
          onClick={() =>
            updateSettings({ showShortcuts: !settings.showShortcuts })
          }
        >
          <FiCommand />
          <span>{settings.showShortcuts ? "Shortcuts on" : "Shortcuts off"}</span>
        </button>
      </div>

      <div className="settings-group">
        <span className="settings-group__label">Default timing</span>
        <RangeControl
          label="Default sets"
          value={settings.defaultSets}
          min={1}
          max={8}
          description="Used when you reset."
          onChange={(value) => updateSettings({ defaultSets: value })}
        />
        <RangeControl
          label="Default exercise duration"
          value={settings.defaultExerciseDuration}
          min={20}
          max={180}
          step={5}
          suffix="s"
          description="Default work time."
          onChange={(value) => updateSettings({ defaultExerciseDuration: value })}
        />
        <RangeControl
          label="Default break duration"
          value={settings.defaultBreakDuration}
          min={10}
          max={180}
          step={5}
          suffix="s"
          description="Default break time."
          onChange={(value) => updateSettings({ defaultBreakDuration: value })}
        />
      </div>

      {settings.showShortcuts ? (
        <div className="shortcut-panel">
          {shortcuts.map((shortcut) => (
            <div className="shortcut-row" key={shortcut.key}>
              <kbd>{shortcut.key}</kbd>
              <span>{shortcut.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </motion.section>
  );
}
