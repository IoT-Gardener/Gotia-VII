import { useEffect, useState } from 'react';

interface Props {
  start: number;
  min?: number;
  max?: number;
  intervalMs: number;
  jitterMs?: number;
  minDelta: number;
  maxDelta: number;
  monotonic?: boolean;
  decimals?: number;
  format?: (n: number) => string;
  className?: string;
}

export default function FlickerNumber({
  start,
  min = -Infinity,
  max = Infinity,
  intervalMs,
  jitterMs = 0,
  minDelta,
  maxDelta,
  monotonic = false,
  decimals = 0,
  format,
  className = '',
}: Props) {
  const [value, setValue] = useState(start);
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setFlicker(true);
      setTimeout(() => setFlicker(false), 140);
      setValue((v) => {
        const mag = minDelta + Math.random() * (maxDelta - minDelta);
        const sign = monotonic ? 1 : Math.random() < 0.5 ? -1 : 1;
        let next = v + sign * mag;
        if (next < min) next = min + (min - next);
        if (next > max) next = max - (next - max);
        return parseFloat(next.toFixed(decimals));
      });
      timer = setTimeout(tick, intervalMs + (Math.random() - 0.5) * jitterMs);
    };
    timer = setTimeout(tick, intervalMs + Math.random() * jitterMs);
    return () => clearTimeout(timer);
  }, []);

  const display = format ? format(value) : value.toFixed(decimals);

  return (
    <span
      className={`tabular-nums ${className}`}
      style={{ opacity: flicker ? 0.35 : 1, transition: 'opacity 80ms linear' }}
    >
      {display}
    </span>
  );
}
