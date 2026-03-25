import { motion } from "framer-motion";
import { useEffect } from "react";
import HeroSection from "../components/dashboard/HeroSection";
import HistoryPanel from "../components/dashboard/HistoryPanel";
import SavedPresetsPanel from "../components/dashboard/SavedPresetsPanel";
import SettingsPanel from "../components/dashboard/SettingsPanel";
import WorkoutConfigurator from "../components/dashboard/WorkoutConfigurator";

export default function DashboardPage() {
  useEffect(() => {
    document.title = "Forge Timer | Premium workout planner";
  }, []);

  return (
    <motion.section
      className="page dashboard-page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <HeroSection />

      <div className="dashboard-grid">
        <div className="dashboard-grid__main">
          <WorkoutConfigurator />
          <HistoryPanel />
        </div>
        <div className="dashboard-grid__side">
          <SavedPresetsPanel />
          <SettingsPanel />
        </div>
      </div>
    </motion.section>
  );
}
