import { useEffect, useRef, useState } from 'react';

const WIDTH = 320;
const HEIGHT = 80;
const POINTS = 60;
const ALERT_THRESHOLD = 2.5;
const MAX_EVENTS = 12;

const SITES = [
  'cradlelands',
  'deep-trenches',
  'equatorial-forge-belt',
  'glassed-salt-flats',
  'great-pit',
  'polar-scrapfields',
  'foundry-prime',
  'ironhusk',
  'nuova-firenze',
  'port-aeturnus',
  'cairnfrost',
  'the-precipice',
];

interface TremorEvent {
  id: number;
  time: string;
  site: string;
  magnitude: number;
}

function seed() {
  const arr: number[] = [];
  for (let i = 0; i < POINTS; i++) {
    arr.push(0.22 + Math.random() * 0.06);
  }
  return arr;
}

function stamp() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

export default function TremorSparkline() {
  const [data, setData] = useState<number[]>(seed);
  const [magnitude, setMagnitude] = useState(1.0);
  const [events, setEvents] = useState<TremorEvent[]>([]);
  const quakeTimer = useRef(0);
  const inQuake = useRef(false);
  const eventId = useRef(0);
  const peakRef = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const next = prev.slice(1);
        quakeTimer.current -= 1;

        let v: number;
        if (quakeTimer.current <= 0 && !inQuake.current && Math.random() < 0.018) {
          quakeTimer.current = 3 + Math.floor(Math.random() * 4);
          inQuake.current = true;
          peakRef.current = 0;
        }
        if (quakeTimer.current > 0) {
          v = 0.5 + Math.random() * 0.4;
        } else {
          v = 0.22 + Math.random() * 0.08;
        }
        next.push(v);

        const peak = Math.max(...next);
        const mag = parseFloat((peak * 4.2).toFixed(2));
        setMagnitude(mag);

        if (inQuake.current) {
          peakRef.current = Math.max(peakRef.current, mag);
          if (quakeTimer.current <= 0) {
            inQuake.current = false;
            const peakMag = peakRef.current;
            const site = SITES[Math.floor(Math.random() * SITES.length)];
            eventId.current += 1;
            setEvents((list) => {
              const entry: TremorEvent = {
                id: eventId.current,
                time: stamp(),
                site,
                magnitude: peakMag,
              };
              return [entry, ...list].slice(0, MAX_EVENTS);
            });
          }
        }

        return next;
      });
    }, 180);
    return () => clearInterval(interval);
  }, []);

  const path = data
    .map((v, i) => {
      const x = (i / (POINTS - 1)) * WIDTH;
      const y = HEIGHT - v * HEIGHT;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const alert = magnitude > ALERT_THRESHOLD;

  return (
    <div className="panel flex flex-col" style={{ maxHeight: '320px' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="panel-head" style={{ marginBottom: 0, border: 'none', padding: 0 }}>
          Crustal Tremor // Crater-Rim Sensor
        </p>
        <span className={`chip ${alert ? 'text-danger glow-danger' : 'text-phosphor'}`}>
          M {magnitude.toFixed(2)}
        </span>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-20 flex-shrink-0" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trem" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={alert ? '#c43a2d' : '#ffb347'} stopOpacity="0.4" />
            <stop offset="100%" stopColor={alert ? '#c43a2d' : '#ffb347'} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((y) => (
          <line key={y} x1="0" x2={WIDTH} y1={HEIGHT * y} y2={HEIGHT * y} stroke="#5a2814" strokeWidth="0.5" strokeDasharray="2 3" />
        ))}
        <path d={`${path} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`} fill="url(#trem)" />
        <path
          d={path}
          fill="none"
          stroke={alert ? '#c43a2d' : '#ffb347'}
          strokeWidth="1.5"
          style={{ filter: `drop-shadow(0 0 3px ${alert ? '#c43a2d' : '#ffb347'})` }}
        />
      </svg>
      <div className="flex items-center justify-between mt-2 mb-1 flex-shrink-0">
        <p className="text-[10px] text-fg-dim tracking-[0.25em] uppercase">Event Log</p>
        <span className="text-[10px] text-fg-dim">{events.length} / {MAX_EVENTS}</span>
      </div>
      <div
        ref={logRef}
        className="overflow-y-auto border border-rust-dim bg-black/40 px-2 py-1 font-mono text-[11px] flex-1 min-h-0"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#5a2814 transparent' }}
      >
        {events.length === 0 ? (
          <p className="text-fg-dim text-[11px]">&gt; nominal crustal creep // no events logged</p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {events.map((e) => (
              <li key={e.id} className="text-fg">
                <span className="text-fg-dim">[{e.time}]</span>{' '}
                <span className="text-rust">M{e.magnitude.toFixed(2)}</span>{' '}
                <span className="text-fg-dim">//</span>{' '}
                <span className="text-bone">{e.site}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
