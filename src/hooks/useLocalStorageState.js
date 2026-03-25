import { useEffect, useState } from "react";

function resolveInitialValue(initialValue) {
  return typeof initialValue === "function" ? initialValue() : initialValue;
}

export default function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    const fallbackValue = resolveInitialValue(initialValue);

    if (typeof window === "undefined") return fallbackValue;

    try {
      const savedValue = window.localStorage.getItem(key);
      return savedValue ? JSON.parse(savedValue) : fallbackValue;
    } catch {
      return fallbackValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore writes when storage is unavailable or full.
    }
  }, [key, state]);

  return [state, setState];
}
