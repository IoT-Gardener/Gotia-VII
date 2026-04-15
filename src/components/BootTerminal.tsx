import { useEffect, useRef, useState } from 'react';

type Tone = 'fg' | 'phosphor' | 'rust' | 'danger' | 'dim' | 'bone';

interface Line {
  text: string;
  delay?: number;
  tone?: Tone;
}

function buildLines(callsign: string): Line[] {
  const cs = callsign.toUpperCase();
  return [
    { text: '> initialising omni-net handshake .................', tone: 'dim', delay: 250 },
    { text: '  tunnel established via Crowbar rig ......... [ OK ]', tone: 'phosphor', delay: 350 },
    { text: '  rotating cipher keys ( 14 / 14 ) ........... [ OK ]', tone: 'phosphor', delay: 300 },
    { text: '  signal bounce through Port Aeturnus relay .. [ OK ]', tone: 'phosphor', delay: 300 },
    { text: '', delay: 200 },
    { text: '> scanning for surveillance ........................', tone: 'dim', delay: 400 },
    { text: '  SSC Constellation sweep .................... [ EVADED ]', tone: 'rust', delay: 450 },
    { text: '  Machiavelli private security ping .......... [ SPOOFED ]', tone: 'rust', delay: 450 },
    { text: '  Harrison Armory passive intercept .......... [ IGNORED ]', tone: 'rust', delay: 450 },
    { text: '  IPS-N manifest cross-reference ............. [ CLEAN ]', tone: 'phosphor', delay: 400 },
    { text: '', delay: 200 },
    { text: '> authenticating operator ..........................', tone: 'dim', delay: 400 },
    { text: `  callsign: ${cs}`, tone: 'bone', delay: 400 },
    { text: '  ledger match ............................... [ VERIFIED ]', tone: 'phosphor', delay: 400 },
    { text: '  clearance elevated to REGISTRY STANDING .... [ OK ]', tone: 'phosphor', delay: 400 },
    { text: '', delay: 200 },
    { text: '> loading dispatch queue ...........................', tone: 'dim', delay: 400 },
    { text: '  active contracts routed to this node ....... [ 5 ]', tone: 'phosphor', delay: 300 },
    { text: '  flashpoint board live ...................... [ OK ]', tone: 'phosphor', delay: 300 },
    { text: '  registry ledger sync ....................... [ OK ]', tone: 'phosphor', delay: 300 },
    { text: '', delay: 250 },
    { text: `>> WELCOME BACK, ${cs}.`, tone: 'phosphor', delay: 300 },
    { text: '>> DISCRETION PARAMOUNT. THE REGISTRY IS WATCHING.', tone: 'bone', delay: 250 },
  ];
}

interface Props {
  callsign: string;
  instant?: boolean;
  onDone?: () => void;
}

export default function BootTerminal({ callsign, instant = false, onDone }: Props) {
  const lines = useRef<Line[]>(buildLines(callsign));
  const [visible, setVisible] = useState<number>(instant ? lines.current.length : 0);
  const [done, setDone] = useState(instant);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visible]);

  useEffect(() => {
    if (instant) {
      onDone?.();
      return;
    }
    let cumulative = 0;
    lines.current.forEach((line, i) => {
      cumulative += line.delay ?? 300;
      const t = setTimeout(() => setVisible(i + 1), cumulative);
      timers.current.push(t);
    });
    const finish = setTimeout(() => {
      setDone(true);
      onDone?.();
    }, cumulative + 200);
    timers.current.push(finish);
    return () => timers.current.forEach(clearTimeout);
  }, [instant]);

  const skip = () => {
    timers.current.forEach(clearTimeout);
    setVisible(lines.current.length);
    setDone(true);
    onDone?.();
  };

  const toneClass = (tone?: Tone) =>
    tone === 'phosphor' ? 'text-phosphor'
    : tone === 'rust' ? 'text-rust'
    : tone === 'danger' ? 'text-danger'
    : tone === 'dim' ? 'text-fg-dim'
    : tone === 'bone' ? 'text-bone'
    : 'text-fg';

  return (
    <div className="panel font-mono text-xs">
      <div className="flex items-center justify-between mb-2">
        <p className="panel-head">Boot Log</p>
        {!done && (
          <button
            type="button"
            onClick={skip}
            className="text-xs text-fg-dim hover:text-phosphor underline decoration-dotted"
          >
            skip
          </button>
        )}
      </div>
      <div
        ref={scrollRef}
        className="overflow-y-auto h-40 border border-rust-dim bg-black/40 px-2 py-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#5a2814 transparent' }}
      >
      <ul className="flex flex-col gap-0.5 leading-tight whitespace-pre">
        {lines.current.slice(0, visible).map((line, i) => (
          <li key={i} className={toneClass(line.tone)}>
            {line.text || '\u00A0'}
            {i === visible - 1 && !done && (
              <span className="ml-1 text-phosphor animate-pulse">▌</span>
            )}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
