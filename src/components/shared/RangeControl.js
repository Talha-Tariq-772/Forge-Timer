export default function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  description,
  onChange,
}) {
  return (
    <label className="range-control">
      <div className="range-control__topline">
        <div>
          <span className="range-control__label">{label}</span>
          <span className="range-control__description">{description}</span>
        </div>
        <strong className="range-control__value">
          {value}
          {suffix}
        </strong>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
