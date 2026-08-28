import { useId } from "react";

const SIZE = 108;
const STROKE = 9;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type GaugeProps = {
  /** How much of the ring to fill, 0-100. Clamped, so out-of-range inputs stay sane. */
  value: number;
  from: string;
  to: string;
  icon: string;
  label: string;
};

/**
 * Circular meter drawn as SVG rather than a CSS conic-gradient. The reason is
 * stroke-linecap: a conic-gradient can only produce hard-cut arc ends, while
 * rounded caps are what make the ring read as modern. The track is translucent
 * instead of opaque grey so the painting behind it shows through.
 */
export default function Gauge({ value, from, to, icon, label }: GaugeProps) {
  // useId() embeds ':' characters, which are awkward inside a url(#...) reference.
  const gradientId = `gauge-${useId().replace(/:/g, "")}`;

  const pct = Math.min(100, Math.max(0, value));
  const dash = (pct / 100) * CIRCUMFERENCE;

  return (
    <div className="gauge">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height="100%">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>

        <circle
          className="gauge-track"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE}
        />

        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={`url(#${gradientId})`}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
        />
      </svg>

      <div className="inner">
        {icon}
        <span>{label}</span>
      </div>
    </div>
  );
}
