import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeBackdrop() {
  const { mode, preset, theme } = useTheme();
  const backgroundImage = theme.backgroundImages[mode];

  return (
    <div className="theme-backdrop-wrap" aria-hidden="true">
      <motion.div
        key={`${preset}-${mode}`}
        className="theme-backdrop"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <div className="theme-backdrop__mesh" />
      <div className="theme-backdrop__glow theme-backdrop__glow--one" />
      <div className="theme-backdrop__glow theme-backdrop__glow--two" />
      <div className="theme-backdrop__grain" />
    </div>
  );
}
