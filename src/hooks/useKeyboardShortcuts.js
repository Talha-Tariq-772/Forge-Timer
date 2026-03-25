import { useEffect, useRef } from "react";

const FORM_TAGS = ["INPUT", "TEXTAREA", "SELECT"];

export default function useKeyboardShortcuts(shortcutMap, enabled = true) {
  const shortcutRef = useRef(shortcutMap);

  useEffect(() => {
    shortcutRef.current = shortcutMap;
  }, [shortcutMap]);

  useEffect(() => {
    if (!enabled) return undefined;

    function handleKeyDown(event) {
      const activeTag = document.activeElement?.tagName;

      if (FORM_TAGS.includes(activeTag)) return;

      const normalizedKey = event.key.toLowerCase();
      const action = shortcutRef.current[normalizedKey];

      if (!action) return;

      event.preventDefault();
      action(event);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
}
