import clsx from "clsx";
import { motion } from "framer-motion";
import { FiCircle } from "react-icons/fi";
import { GiBoxingGlove } from "react-icons/gi";
import { LuDumbbell } from "react-icons/lu";

const iconsByPreset = {
  gym: LuDumbbell,
  boxing: GiBoxingGlove,
  minimal: FiCircle,
};

export default function ThemePresetSwitcher({
  presets,
  activePreset,
  onSelect,
  compact = false,
}) {
  return (
    <div className={clsx("preset-switcher", compact && "preset-switcher--compact")}>
      {presets.map((preset) => {
        const Icon = iconsByPreset[preset.id] ?? FiCircle;
        const isActive = preset.id === activePreset;

        return (
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            key={preset.id}
            className={clsx("preset-chip", isActive && "is-active")}
            onClick={() => onSelect(preset.id)}
          >
            <Icon />
            <span>{preset.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
