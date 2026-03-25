import { createContext, useContext, useEffect } from "react";
import { themePresets } from "../data/themes";
import useLocalStorageState from "../hooks/useLocalStorageState";

const ThemeContext = createContext(null);

function getPreferredMode() {
  if (typeof window === "undefined") return "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useLocalStorageState("fitforge-mode", getPreferredMode);
  const [preset, setPreset] = useLocalStorageState("fitforge-preset", "gym");
  const theme = themePresets[preset] ?? themePresets.gym;

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.documentElement.dataset.preset = preset;
    document.documentElement.style.colorScheme = mode;
  }, [mode, preset]);

  function toggleMode() {
    setMode((currentMode) => (currentMode === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        preset,
        setPreset,
        toggleMode,
        theme,
        presets: Object.values(themePresets),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
