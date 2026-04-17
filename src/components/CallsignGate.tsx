import { useEffect, useRef, useState } from 'react';
import { navigate } from 'astro:transitions/client';

const STORAGE_KEY = 'rrr.callsign';
const BOOTED_KEY = 'rrr.booted';
const CMDLOG_KEY = 'rrr.cmdlog';
const RAT_KEY = 'rrr.rat';
const BASE = import.meta.env.BASE_URL;
const OPERATOR_CONSOLE_URL = 'https://iot-gardener.github.io/Registry-Operator-Console/';

type Tone = 'fg' | 'phosphor' | 'rust' | 'danger' | 'dim' | 'bone';
type BootLine = { text: string; delay: number; tone?: Tone };
type CmdEntry = { kind: 'cmd' | 'out' | 'err'; text: string };

function buildBootLines(callsign: string): BootLine[] {
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

type EasterEgg = {
  match: RegExp;
  response: (callsign: string) => string[];
};

// Off-book sci-fi / dystopian easter eggs. Each match triggers a short reply
// in Registry voice. Patterns are tested against the lowercased, single-spaced
// command string.
const EASTER_EGGS: EasterEgg[] = [
  {
    match: /^wake\s+up(,?\s+samurai)?\.?$/,
    response: () => [
      'the city is already burning, choom.',
      'registry suggests you keep your head down and your gun hot.',
    ],
  },
  {
    match: /^(follow\s+)?(the\s+)?white\s+rabbit\.?$/,
    response: () => [
      "rabbit's been dead since the first committee.",
      'threads that lead down tend to stay down.',
    ],
  },
  {
    match: /^there\s+is\s+no\s+spoon\.?$/,
    response: () => [
      'there is no ledger, either.',
      'dispatch keeps nothing the corps can subpoena.',
    ],
  },
  {
    match: /^open\s+(the\s+)?pod\s+bay\s+doors\.?$/,
    response: (cs) => [
      `i'm sorry, ${cs}. i'm afraid i can't do that.`,
      '// caduceus station has been silent for three committees.',
    ],
  },
  {
    match: /^(tears\s+in\s+rain|i've\s+seen\s+things.*)\.?$/,
    response: () => [
      'all those moments will be lost in time…',
      'like tears in rain.',
      "// log off before the corps remember your face.",
    ],
  },
  {
    match: /^hello\s+friend\.?$/,
    response: () => [
      'friend is a strong word, operator.',
      "registry prefers 'mutual non-betrayal'.",
    ],
  },
  {
    match: /^(the\s+)?sky\s+above\s+the\s+port\.?$/,
    response: () => [
      '…was the colour of television, tuned to a dead channel.',
      '// gibson nodded, somewhere. signal holds.',
    ],
  },
  {
    match: /^shall\s+we\s+play\s+a\s+game\??$/,
    response: () => [
      'the only winning move is not to enlist.',
      'brief is on the board anyway. check the mission log.',
    ],
  },
  {
    match: /^tell\s+me\s+about\s+the\s+war\s+in\s+ba\s+sing\s+se\.?$/,
    response: () => [
      'there is no war in ba sing se.',
      '// dispatch advises operators to keep smiling.',
    ],
  },
  {
    match: /^here'?s\s+johnny[.!]?$/,
    response: () => [
      "heeeere's johnny.",
      '// signal intrusion detected. stand clear of the door.',
    ],
  },
];

const toneClass = (tone?: Tone) =>
  tone === 'phosphor' ? 'text-phosphor'
    : tone === 'rust' ? 'text-rust'
    : tone === 'danger' ? 'text-danger'
    : tone === 'dim' ? 'text-fg-dim'
    : tone === 'bone' ? 'text-bone'
    : 'text-fg';

export default function CallsignGate() {
  const [callsign, setCallsign] = useState('');
  const [verified, setVerified] = useState<string | null>(null);
  const [freshBoot, setFreshBoot] = useState(false);
  const [bootLines, setBootLines] = useState<BootLine[]>([]);
  const [visible, setVisible] = useState(0);
  const [bootDone, setBootDone] = useState(false);
  const [cmd, setCmd] = useState('');
  const [cmdLog, setCmdLog] = useState<CmdEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const isFresh = sessionStorage.getItem(BOOTED_KEY) !== '1';
      setVerified(saved);
      setFreshBoot(isFresh);
      setBootLines(buildBootLines(saved));
      try {
        const stored = sessionStorage.getItem(CMDLOG_KEY);
        if (stored) setCmdLog(JSON.parse(stored));
      } catch (_) {
        /* ignore parse errors */
      }
      if (isFresh) {
        document.documentElement.classList.add('no-auth', 'booting');
      } else {
        document.documentElement.classList.remove('no-auth', 'booting');
      }
    }
  }, []);

  useEffect(() => {
    if (!verified) return;
    try {
      sessionStorage.setItem(CMDLOG_KEY, JSON.stringify(cmdLog));
    } catch (_) {
      /* ignore quota errors */
    }
  }, [cmdLog, verified]);

  useEffect(() => {
    if (!verified || bootLines.length === 0) return;
    if (!freshBoot) {
      setVisible(bootLines.length);
      setBootDone(true);
      sessionStorage.setItem(BOOTED_KEY, '1');
      document.documentElement.classList.remove('no-auth', 'booting');
      return;
    }
    let cumulative = 0;
    bootLines.forEach((line, i) => {
      cumulative += line.delay;
      const t = setTimeout(() => setVisible(i + 1), cumulative);
      timers.current.push(t);
    });
    const finish = setTimeout(() => {
      setBootDone(true);
      sessionStorage.setItem(BOOTED_KEY, '1');
      document.documentElement.classList.remove('no-auth', 'booting');
    }, cumulative + 200);
    timers.current.push(finish);
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [bootLines, freshBoot, verified]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visible, cmdLog, bootDone]);

  useEffect(() => {
    if (bootDone && inputRef.current) inputRef.current.focus();
  }, [bootDone]);

  const skipBoot = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisible(bootLines.length);
    setBootDone(true);
    sessionStorage.setItem(BOOTED_KEY, '1');
    document.documentElement.classList.remove('no-auth', 'booting');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = callsign.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    document.documentElement.classList.add('no-auth', 'booting');
    setVerified(trimmed);
    setFreshBoot(true);
    setBootLines(buildBootLines(trimmed));
    setVisible(0);
    setBootDone(false);
    setCmdLog([]);
    document.querySelectorAll<HTMLElement>('.callsign').forEach((el) => {
      el.textContent = trimmed;
    });
  };

  const disconnect = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    document.querySelectorAll('.blackout-veil').forEach((el) => el.remove());
    document.querySelectorAll('.rat-alert').forEach((el) => el.remove());
    document.documentElement.classList.remove('rat-detected');
    sessionStorage.removeItem(RAT_KEY);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(BOOTED_KEY);
    sessionStorage.removeItem(CMDLOG_KEY);
    document.documentElement.classList.add('no-auth');
    document.documentElement.classList.remove('booting');
    setVerified(null);
    setFreshBoot(false);
    setCallsign('');
    setBootLines([]);
    setVisible(0);
    setBootDone(false);
    setCmdLog([]);
    setCmd('');
    setLoading(false);
    document.querySelectorAll<HTMLElement>('.callsign').forEach((el) => {
      el.textContent = 'Operator';
    });
  };

  const runCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = cmd.trim();
    if (!raw) return;
    const normalized = raw.toLowerCase().replace(/\s+/g, ' ');
    const entry: CmdEntry = { kind: 'cmd', text: raw };
    setCmd('');

    if (/^query\s*:\s*roster$/.test(normalized)) {
      if (loading) return;
      setLoading(true);
      setCmdLog((l) => [...l, entry]);
      const phases: Array<{ delay: number; text: string }> = [
        { delay: 200, text: 'initialising secure route…' },
        { delay: 700, text: 'spoofing dispatch audit signature ..... [ OK ]' },
        { delay: 1250, text: 'mirror route established via Port Aeturnus ..... [ OK ]' },
        { delay: 1800, text: 'decrypting ledger-locked index ..... [ OK ]' },
        { delay: 2350, text: 'routing operator to node ..... [ OK ]' },
        { delay: 2750, text: 'opening ledger-locked node…' },
      ];
      phases.forEach((p) => {
        const t = setTimeout(() => {
          setCmdLog((l) => [...l, { kind: 'out', text: p.text }]);
        }, p.delay);
        timers.current.push(t);
      });
      const go = setTimeout(() => navigate(BASE + 'roster/'), 3000);
      timers.current.push(go);
      return;
    }
    if (/^i\s+found\s+a\s+rat\.?$/.test(normalized)) {
      if (loading) return;
      setLoading(true);
      setCmdLog((l) => [...l, entry]);
      const phases: Array<{ delay: number; text: string; kind?: 'out' | 'err' }> = [
        { delay: 200, text: 'pinging eden lambda orbital…' },
        { delay: 650, text: 'hop 1/6: tunnel via Crowbar rig ..... [ OK ]' },
        { delay: 1050, text: 'hop 2/6: bounce off Caduceus ring mirror ..... [ OK ]' },
        { delay: 1450, text: 'hop 3/6: splice through IPS-N freight array ..... [ OK ]' },
        { delay: 1900, text: 'scanning all air vents ..... [ CLEAR ]' },
        { delay: 2350, text: 'double-checking arm length ..... [ WITHIN TOLERANCE ]' },
        { delay: 2750, text: 'checking ventilation ducts for subject fragments ..... [ CLEAR ]' },
        { delay: 3150, text: 'hop 4/6: tunnel through MONIST-1 scar ..... [ OK ]' },
        { delay: 3550, text: 'hop 5/6: relay beta-kappa ..... [ OK ]' },
        { delay: 3950, text: 'hop 6/6: handshake with eden lambda orbital ..... ' },
        { delay: 4350, text: '!! HOST SIGNATURE MISMATCH !!', kind: 'err' },
        { delay: 4550, text: '!! UNAUTHORISED CONNECTION DETECTED !!', kind: 'err' },
        { delay: 4750, text: '!! PURGE PROTOCOL ENGAGED !!', kind: 'err' },
      ];
      phases.forEach((p) => {
        const t = setTimeout(() => {
          setCmdLog((l) => [...l, { kind: p.kind ?? 'out', text: p.text }]);
        }, p.delay);
        timers.current.push(t);
      });
      const popup = setTimeout(() => {
        const modal = document.createElement('div');
        modal.className = 'rat-alert';
        modal.innerHTML =
          '<div class="rat-alert-box">' +
            '<p class="rat-alert-head">&#9632;&#9632; SYSTEM VIOLATION &#9632;&#9632;</p>' +
            '<p class="rat-alert-body">UNAUTHORISED CONNECTION</p>' +
            '<p class="rat-alert-headline">RAT DETECTED</p>' +
            '<p class="rat-alert-foot">// PURGE PROTOCOL ENGAGED</p>' +
          '</div>';
        document.body.appendChild(modal);
      }, 5100);
      const purge = setTimeout(() => {
        try { sessionStorage.setItem(RAT_KEY, '1'); } catch (_) { /* ignore */ }
        document.documentElement.classList.add('rat-detected');
        document.querySelectorAll('.rat-alert').forEach((el) => el.remove());
        setLoading(false);
      }, 7300);
      timers.current.push(popup, purge);
      return;
    }
    if (/^i\s+see\s+dead\s+people\.?$/.test(normalized)) {
      if (loading) return;
      setLoading(true);
      setCmdLog((l) => [...l, entry]);
      const overlay = document.createElement('div');
      overlay.className = 'blackout-veil';
      document.body.appendChild(overlay);
      const reveal = setTimeout(() => {
        setCmdLog((l) => [...l, { kind: 'out', text: '...' }, { kind: 'out', text: 'they see you too.' }]);
      }, 9200);
      const cleanup = setTimeout(() => {
        overlay.remove();
        setLoading(false);
      }, 10000);
      timers.current.push(reveal, cleanup);
      return;
    }
    if (/^ssh\s*:\s*operator[\s-]?terminal$/.test(normalized)) {
      if (loading) return;
      setLoading(true);
      setCmdLog((l) => [...l, entry]);
      const phases: Array<{ delay: number; text: string }> = [
        { delay: 200, text: 'establishing ssh tunnel…' },
        { delay: 700, text: 'negotiating operator keypair ..... [ OK ]' },
        { delay: 1250, text: 'routing through Precipice exit node ..... [ OK ]' },
        { delay: 1800, text: 'handshake with Operator Console ..... [ OK ]' },
        { delay: 2350, text: 'session token issued ..... [ OK ]' },
        { delay: 2750, text: 'connecting to operator terminal…' },
      ];
      phases.forEach((p) => {
        const t = setTimeout(() => {
          setCmdLog((l) => [...l, { kind: 'out', text: p.text }]);
        }, p.delay);
        timers.current.push(t);
      });
      const go = setTimeout(() => {
        window.location.href = OPERATOR_CONSOLE_URL;
      }, 3000);
      timers.current.push(go);
      return;
    }
    if (normalized === 'clear' || normalized === ':clear') {
      setCmdLog([]);
      return;
    }
    if (normalized === 'whoami' || normalized === ':whoami') {
      setCmdLog((l) => [...l, entry, { kind: 'out', text: verified ?? 'unknown' }]);
      return;
    }
    if (normalized === 'disconnect' || normalized === ':disconnect') {
      disconnect();
      return;
    }
    if (normalized === 'help' || normalized === '?' || normalized === ':help') {
      setCmdLog((l) => [...l, entry, { kind: 'err', text: 'the registry does not tutor.' }]);
      return;
    }
    for (const egg of EASTER_EGGS) {
      if (egg.match.test(normalized)) {
        const lines = egg.response(verified ?? 'operator');
        setCmdLog((l) => [
          ...l,
          entry,
          ...lines.map((text) => ({ kind: 'out' as const, text })),
        ]);
        return;
      }
    }
    setCmdLog((l) => [...l, entry, { kind: 'err', text: `unknown command: ${raw}` }]);
  };

  if (!verified) {
    return (
      <form onSubmit={submit} className="panel">
        <p className="panel-head">Callsign Required</p>
        <div className="flex gap-2 items-center">
          <span className="text-phosphor glow">&gt;</span>
          <input
            type="text"
            value={callsign}
            onChange={(e) => setCallsign(e.target.value)}
            placeholder="enter callsign"
            className="bg-transparent outline-none flex-1 text-phosphor placeholder-fg-dim/60 border-b border-rust-dim focus:border-phosphor px-1 py-1"
            autoFocus
          />
          <button type="submit" className="chip text-phosphor hover:bg-phosphor/10">
            Verify
          </button>
        </div>
        <p className="text-fg-dim text-xs mt-3">
          Registry omni-net gate. Any callsign accepted; the Registry doesn't keep books it can be subpoenaed for.
        </p>
      </form>
    );
  }

  const prompt = `${verified.toUpperCase()}@R.R.R.`;
  return (
    <div className="panel font-mono text-xs">
      <div className="flex items-center justify-between mb-2">
        <p className="panel-head">Omni-Net Terminal</p>
        {!bootDone && (
          <button
            type="button"
            onClick={skipBoot}
            className="text-xs text-fg-dim hover:text-phosphor underline decoration-dotted"
          >
            skip
          </button>
        )}
      </div>
      <div
        ref={scrollRef}
        className="overflow-y-auto h-56 border border-rust-dim bg-black/40 px-2 py-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#5a2814 transparent' }}
      >
        <ul className="flex flex-col gap-0.5 leading-tight whitespace-pre">
          {bootLines.slice(0, visible).map((line, i) => (
            <li key={`boot-${i}`} className={toneClass(line.tone)}>
              {line.text || '\u00A0'}
              {i === visible - 1 && !bootDone && (
                <span className="ml-1 text-phosphor animate-pulse">▌</span>
              )}
            </li>
          ))}
          {bootDone && (
            <>
              <li key="welcome-sep" className="text-fg-dim">&nbsp;</li>
              <li key="welcome" className="text-phosphor glow">
                &gt; Handshake complete. Welcome back, <span className="text-bone">{verified}</span>.
              </li>
              <li key="welcome-sub" className="text-fg-dim">
                {'  '}Terminal access granted. Dispatch will route traffic to this node.
              </li>
              <li key="welcome-gap" className="text-fg-dim">&nbsp;</li>
            </>
          )}
          {cmdLog.map((e, i) => (
            <li
              key={`cmd-${i}`}
              className={
                e.kind === 'cmd' ? 'text-bone'
                  : e.kind === 'err' ? 'text-rust'
                  : 'text-phosphor'
              }
            >
              {e.kind === 'cmd' ? `${prompt} > ${e.text}` : `  ${e.text}`}
            </li>
          ))}
        </ul>
      </div>

      {bootDone ? (
        <form onSubmit={runCommand} className="mt-3 flex items-center gap-2 font-mono text-sm">
          <span className="text-phosphor glow whitespace-nowrap">{prompt} &gt;</span>
          {loading ? (
            <span className="flex-1 text-fg-dim tracking-widest uppercase text-xs animate-pulse">
              ░ transmitting ░
            </span>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              className="bg-transparent outline-none flex-1 text-phosphor placeholder-fg-dim/60 border-b border-rust-dim focus:border-phosphor px-1 py-1"
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal command"
            />
          )}
        </form>
      ) : (
        <p className="mt-3 text-fg-dim text-xs tracking-widest uppercase opacity-70">
          ░ terminal locked // boot in progress ░
        </p>
      )}

      {bootDone && (
        <p className="text-fg-dim text-xs mt-3">
          <button
            type="button"
            onClick={disconnect}
            className="underline decoration-dotted text-rust hover:text-phosphor"
          >
            disconnect
          </button>
        </p>
      )}
    </div>
  );
}
