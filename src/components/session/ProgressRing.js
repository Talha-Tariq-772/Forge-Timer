import { memo, useId } from "react";

const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({ progress, value, caption, detail }) {
  const gradientId = useId();
  const safeProgress = Math.max(0, Math.min(progress, 1));
  const dashOffset = CIRCUMFERENCE - safeProgress * CIRCUMFERENCE;

  return (
    <div className="progress-ring">
      <div className="progress-ring__halo" />
      <svg viewBox="0 0 260 260" role="img" aria-label="Workout progress ring">
        <defs>
          <linearGradient id={gradientId} x1="24" y1="24" x2="236" y2="236">
            <stop offset="0%" stopColor="var(--accent-3)" />
            <stop offset="48%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <circle className="progress-ring__track" cx="130" cy="130" r={RADIUS} />
        <circle className="progress-ring__track progress-ring__track--inner" cx="130" cy="130" r="96" />
        <circle
          className="progress-ring__value-glow"
          cx="130"
          cy="130"
          r={RADIUS}
          stroke={`url(#${gradientId})`}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
        <circle
          className="progress-ring__value"
          cx="130"
          cy="130"
          r={RADIUS}
          stroke={`url(#${gradientId})`}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="progress-ring__content">
        <span className="progress-ring__label">{caption}</span>
        <strong>{value}</strong>
        <span className="progress-ring__detail">{detail}</span>
      </div>
    </div>
  );
}

export default memo(ProgressRing);
