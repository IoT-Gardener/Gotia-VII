import { useEffect, useState } from 'react';

interface Blip {
  id: number;
  angle: number;
  radius: number;
  label: string;
  tone: 'danger' | 'rust' | 'phosphor';
  intensity: number;
}

const CORPS: Array<{ label: string; tone: Blip['tone'] }> = [
  { label: 'SSC', tone: 'rust' },
  { label: 'HA', tone: 'danger' },
  { label: 'MCI', tone: 'danger' },
  { label: 'IPS-N', tone: 'phosphor' },
  { label: 'HORUS?', tone: 'rust' },
];

const SIZE = 220;
const CENTER = SIZE / 2;
const MAX_R = SIZE / 2 - 10;

function newBlip(id: number): Blip {
  const corp = CORPS[Math.floor(Math.random() * CORPS.length)];
  return {
    id,
    angle: Math.random() * 360,
    radius: 30 + Math.random() * (MAX_R - 30),
    label: corp.label,
    tone: corp.tone,
    intensity: 0,
  };
}

export default function CorpThreatRadar() {
  const [sweep, setSweep] = useState(0);
  const [blips, setBlips] = useState<Blip[]>(() =>
    Array.from({ length: 4 }, (_, i) => newBlip(i)),
  );
  const [nextId, setNextId] = useState(4);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      setSweep((s) => (s + dt * 0.12) % 360);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    setBlips((prev) =>
      prev.map((b) => {
        const delta = ((sweep - b.angle + 540) % 360) - 180;
        if (Math.abs(delta) < 6 && b.intensity < 1) {
          return { ...b, intensity: 1 };
        }
        return { ...b, intensity: Math.max(0, b.intensity - 0.015) };
      }),
    );
  }, [sweep]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlips((prev) => {
        const keep = prev.filter(() => Math.random() > 0.2);
        const id = nextId;
        setNextId((n) => n + 1);
        if (keep.length < 6) keep.push(newBlip(id));
        return keep;
      });
    }, 2600);
    return () => clearInterval(interval);
  }, [nextId]);

  const toneColor = (tone: Blip['tone']) =>
    tone === 'danger' ? '#c43a2d' : tone === 'rust' ? '#a5472a' : '#ffb347';

  const sweepRad = (sweep * Math.PI) / 180;
  const sweepX = CENTER + Math.cos(sweepRad) * MAX_R;
  const sweepY = CENTER + Math.sin(sweepRad) * MAX_R;

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-2">
        <p className="panel-head" style={{ marginBottom: 0, border: 'none', padding: 0 }}>
          Corp-Threat Radar // Passive Sweep
        </p>
        <span className="chip text-rust">{blips.length} TRK</span>
      </div>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full aspect-square max-h-64 mx-auto block">
        <defs>
          <radialGradient id="radar-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a120a" />
            <stop offset="100%" stopColor="#07060a" />
          </radialGradient>
          <linearGradient id="sweep-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffb347" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffb347" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <circle cx={CENTER} cy={CENTER} r={MAX_R} fill="url(#radar-bg)" stroke="#5a2814" />
        {[0.33, 0.66, 1].map((f) => (
          <circle
            key={f}
            cx={CENTER}
            cy={CENTER}
            r={MAX_R * f}
            fill="none"
            stroke="#5a2814"
            strokeDasharray="2 3"
          />
        ))}
        <line x1={CENTER} y1="10" x2={CENTER} y2={SIZE - 10} stroke="#5a2814" strokeDasharray="2 3" />
        <line x1="10" y1={CENTER} x2={SIZE - 10} y2={CENTER} stroke="#5a2814" strokeDasharray="2 3" />
        <g transform={`rotate(${sweep} ${CENTER} ${CENTER})`}>
          <path
            d={`M${CENTER},${CENTER} L${CENTER + MAX_R},${CENTER} A${MAX_R},${MAX_R} 0 0 0 ${
              CENTER + MAX_R * Math.cos(-Math.PI / 4)
            },${CENTER + MAX_R * Math.sin(-Math.PI / 4)} Z`}
            fill="url(#sweep-grad)"
          />
          <line
            x1={CENTER}
            y1={CENTER}
            x2={CENTER + MAX_R}
            y2={CENTER}
            stroke="#ffb347"
            strokeWidth="1"
            style={{ filter: 'drop-shadow(0 0 3px #ffb347)' }}
          />
        </g>
        {blips.map((b) => {
          const rad = (b.angle * Math.PI) / 180;
          const x = CENTER + Math.cos(rad) * b.radius;
          const y = CENTER + Math.sin(rad) * b.radius;
          const color = toneColor(b.tone);
          const op = 0.25 + b.intensity * 0.75;
          return (
            <g key={b.id} style={{ opacity: op }}>
              <circle cx={x} cy={y} r={2 + b.intensity * 3} fill={color} />
              <text
                x={x + 5}
                y={y - 5}
                fill={color}
                fontSize="8"
                fontFamily="VT323, monospace"
                style={{ letterSpacing: '0.1em' }}
              >
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-fg-dim mt-1 tracking-widest uppercase">
        &gt; passive only // active ping would trip manifests
      </p>
    </div>
  );
}
