import { AnimatePresence } from "framer-motion";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { ThemeProvider } from "./context/ThemeContext";
import { WorkoutProvider } from "./context/WorkoutContext";
import DashboardPage from "./pages/DashboardPage";
import SessionPage from "./pages/SessionPage";
import "./styles/global.css";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/session" element={<SessionPage />} />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <WorkoutProvider>
        <HashRouter>
          <AnimatedRoutes />
        </HashRouter>
      </WorkoutProvider>
    </ThemeProvider>
  );
}

export default App;
