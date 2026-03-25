import { memo } from "react";

const shortcuts = [
  { key: "Space", label: "Start, pause, resume" },
  { key: "Enter", label: "Trigger main action" },
  { key: "Arrow Right", label: "Jump to next segment" },
  { key: "Arrow Left", label: "Return to previous segment" },
  { key: "R", label: "Reset the session" },
  { key: "Esc", label: "Back to dashboard" },
];

function ShortcutList() {
  return (
    <section className="card card--inner shortcut-list">
      <div className="section-heading section-heading--compact">
        <div>
          <span className="eyebrow">Keyboard shortcuts</span>
          <h3>Fast control layer</h3>
        </div>
      </div>

      <div className="shortcut-panel">
        {shortcuts.map((shortcut) => (
          <div className="shortcut-row" key={shortcut.key}>
            <kbd>{shortcut.key}</kbd>
            <span>{shortcut.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(ShortcutList);
