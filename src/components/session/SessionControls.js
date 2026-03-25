import { memo } from "react";
import {
  FiPause,
  FiPlay,
  FiRotateCcw,
  FiSkipBack,
  FiSkipForward,
} from "react-icons/fi";

function SessionControls({
  canGoBack,
  canGoForward,
  onPrimaryAction,
  onPrevious,
  onNext,
  onReset,
  primaryLabel,
  primaryIcon,
}) {
  const PrimaryIcon = primaryIcon === "pause" ? FiPause : FiPlay;

  return (
    <div className="session-controls">
      <div className="session-controls__cluster">
        <button
          type="button"
          className="icon-button icon-button--session"
          onClick={onPrevious}
          disabled={!canGoBack}
          aria-label="Previous segment"
        >
          <FiSkipBack />
        </button>
        <button
          type="button"
          className="button button--primary session-controls__primary"
          onClick={onPrimaryAction}
        >
          <PrimaryIcon />
          {primaryLabel}
        </button>
        <button
          type="button"
          className="icon-button icon-button--session"
          onClick={onNext}
          disabled={!canGoForward}
          aria-label="Next segment"
        >
          <FiSkipForward />
        </button>
      </div>
      <button
        type="button"
        className="button button--ghost session-controls__reset"
        onClick={onReset}
      >
        <FiRotateCcw />
        Reset
      </button>
    </div>
  );
}

export default memo(SessionControls);
