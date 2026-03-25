import clsx from "clsx";
import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ModeToggle({ mode, onToggle, className }) {
  const isDark = mode === "dark";

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type="button"
      className={clsx("mode-toggle", className)}
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className={clsx("mode-toggle__thumb", isDark && "is-dark")}>
        {isDark ? <FiMoon /> : <FiSun />}
      </span>
      <span className="mode-toggle__label">
        {isDark ? "Dark mode" : "Light mode"}
      </span>
    </motion.button>
  );
}
