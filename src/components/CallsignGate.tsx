import { useEffect, useRef, useState } from 'react';
import { navigate } from 'astro:transitions/client';

const STORAGE_KEY = 'rrr.callsign';
const BOOTED_KEY = 'rrr.booted';
const CMDLOG_KEY = 'rrr.cmdlog';
const BOOT_TIME_KEY = 'rrr.boot_time';
const RAT_KEY = 'rrr.rat';
const BASE = import.meta.env.BASE_URL;
const OPERATOR_CONSOLE_URL = 'https://iot-gardener.github.io/Registry-Operator-Console/';

type Tone = 'fg' | 'phosphor' | 'rust' | 'danger' | 'dim' | 'bone';
type BootLine = { text: string; delay: number; tone?: Tone };
type CmdEntry = { kind: 'cmd' | 'out' | 'err'; text: string; href?: string };

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

const FAKE_OPERATORS = [
  'NIGHTOWL', 'PROWLER', 'TRAPDOOR', 'BRITTLE', 'ASH',
  'SPROCKET', 'CINDER', 'HOLLOW', 'DRIFT', 'GLASSJAW',
  'TALLOW', 'CRANE', 'SALTBACK', 'FUSEBOX', 'TIN-ROOF',
];

const CHATTER_POOL = [
  'iron rat chatter on band 7. someone is talking big.',
  'ssc patrol leaving port aeturnus bearing south-west.',
  "crowbar's rig back up. cipher rotation holding steady.",
  'machiavelli bean-counter spotted in nuova firenze east block.',
  'ha convoy stranded. smog opacity 0.96 and climbing.',
  'ips-n lane freight 71% late. lost-cargo manifest growing.',
  "foreman gault's contract still open if anyone's hungry.",
  "someone is rigging the tremor index. do not trust the spike.",
  'caduceus station three hours silent and counting.',
  'port aeturnus buyer paying for stolen compcon share codes.',
  'one-eye sighting east of glass crater. three days stale.',
  'dispatch rotating rendezvous points again. check the bulletin.',
  'sybil vane rumoured alive. registry does not confirm.',
  'ssc constellation banking over ironhusk. holding a line.',
];

const HAIL_MAP: Record<string, string[]> = {
  crowbar: ['rig silent. try again after dark.'],
  'crowbar-jones': ['rig silent. try again after dark.'],
  dispatch: ['~stand by, operator.~', 'channel is monitored. say nothing you cannot defend.'],
  'one-eye': ['... static. signal refusing handshake.'],
  'iron-rat': ['[COMMS BLOCKED] // flag: deserter'],
  'gravel-gault': ['foreman unavailable. leave a chit at cairnfrost.'],
  machiavelli: ['ERR: connection refused. do not attempt this callsign again.'],
  ssc: ['// INTERCEPT NOTICE // trace initiated on this node. disconnect recommended.'],
  'harrison-armory': ['line busy. tactical officer otherwise engaged.'],
  'ips-n': ['auto-reply: your freight is delayed. no refunds.'],
  'sybil-vane': ['no record. do not log this attempt.'],
  'silas-vane': ['last known signal lost under salt flats. no reply.'],
};

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
      if (!sessionStorage.getItem(BOOT_TIME_KEY)) sessionStorage.setItem(BOOT_TIME_KEY, String(Date.now()));
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
      if (!sessionStorage.getItem(BOOT_TIME_KEY)) sessionStorage.setItem(BOOT_TIME_KEY, String(Date.now()));
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
    if (!sessionStorage.getItem(BOOT_TIME_KEY)) sessionStorage.setItem(BOOT_TIME_KEY, String(Date.now()));
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
    sessionStorage.removeItem(BOOT_TIME_KEY);
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

  const runPagefindSearch = async (query: string) => {
    try {
      // Absolute URL (origin prefix) keeps Vite from treating this as a
      // source-level import of a public/ asset and emitting a dev-time warning.
      const pfUrl = `${window.location.origin}${BASE}pagefind/pagefind.js`;
      // @ts-expect-error - module is generated post-build by pagefind CLI
      const pf = await import(/* @vite-ignore */ pfUrl);
      const search = await pf.search(query);
      const topRaw = search.results.slice(0, 6);
      const data = await Promise.all(topRaw.map((r: { data: () => Promise<unknown> }) => r.data()));

      const additions: CmdEntry[] = [];
      if (data.length === 0) {
        additions.push({ kind: 'err', text: `no records matched "${query}".` });
      } else {
        additions.push({
          kind: 'out',
          text: `matched ${search.results.length} record${search.results.length === 1 ? '' : 's'}. showing top ${data.length}:`,
        });
        data.forEach((raw, idx) => {
          const d = raw as { url: string; meta?: { title?: string }; excerpt?: string };
          const title = d.meta?.title || d.url;
          const excerpt = (d.excerpt || '')
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          additions.push({ kind: 'out', text: `[${idx + 1}] ${title}`, href: d.url });
          if (excerpt) {
            const trimmed = excerpt.length > 160 ? excerpt.slice(0, 160) + '…' : excerpt;
            additions.push({ kind: 'out', text: `    ${trimmed}` });
          }
        });
      }
      setCmdLog((l) => [...l, ...additions]);
    } catch (err) {
      setCmdLog((l) => [
        ...l,
        { kind: 'err', text: 'search index unavailable. run `npm run search:index` (dev) or `npm run build` (prod).' },
      ]);
    }
    setLoading(false);
  };

  const runCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = cmd.trim();
    if (!raw) return;
    const normalized = raw.toLowerCase().replace(/\s+/g, ' ');
    const entry: CmdEntry = { kind: 'cmd', text: raw };
    setCmd('');

    if (/^query\s+--\s*roster$/.test(normalized)) {
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
    if (/^ssh\s+--\s*operator[\s-]?terminal$/.test(normalized)) {
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
    if (normalized === 'help --all' || normalized === 'help -a' || normalized === 'help --full') {
      const lines: CmdEntry[] = [
        { kind: 'out', text: 'REGISTRY OMNI-NET TERMINAL // full command reference' },
        { kind: 'out', text: ' ' },
        { kind: 'out', text: '  search --<query>         scan indexed records (alias: find / grep)' },
        { kind: 'out', text: '  ssh --operator-terminal  open registry operator console' },
        { kind: 'out', text: '  query --roster           access ledger-locked contractor roster' },
        { kind: 'out', text: ' ' },
        { kind: 'out', text: '  ledger                   show credit ledger and outstanding fees' },
        { kind: 'out', text: '  uptime                   session duration' },
        { kind: 'out', text: '  whoami                   display current callsign' },
        { kind: 'out', text: '  who                      active operators on this node' },
        { kind: 'out', text: '  chatter                  tap omni-net chatter feed' },
        { kind: 'out', text: ' ' },
        { kind: 'out', text: '  hail --<callsign>        open channel to a known contact' },
        { kind: 'out', text: '  msg --<callsign> <text>  send encrypted message' },
        { kind: 'out', text: '  ping --<target>          route latency check' },
        { kind: 'out', text: '  trace --<callsign>       attempt operator trace' },
        { kind: 'out', text: '  whois --<callsign>       look up a callsign' },
        { kind: 'out', text: '  nmap --<target>          open-port reconnaissance' },
        { kind: 'out', text: '  decrypt --<string>       attempt cipher decryption' },
        { kind: 'out', text: ' ' },
        { kind: 'out', text: '  clear                    wipe terminal log' },
        { kind: 'out', text: '  disconnect               end session, clear callsign' },
        { kind: 'out', text: '  help                     primary command reference' },
        { kind: 'out', text: '  help --all               this listing' },
        { kind: 'out', text: ' ' },
        { kind: 'out', text: '// registry does not document discovery protocols.' },
      ];
      setCmdLog((l) => [...l, entry, ...lines]);
      return;
    }
    if (normalized === 'help' || normalized === '?' || normalized === ':help') {
      const lines: CmdEntry[] = [
        { kind: 'out', text: 'REGISTRY OMNI-NET TERMINAL // command reference' },
        { kind: 'out', text: ' ' },
        { kind: 'out', text: '  search --<query>         scan indexed records (alias: find / grep)' },
        { kind: 'out', text: '  ssh --operator-terminal  open registry operator console' },
        { kind: 'out', text: '  query --roster           access ledger-locked contractor roster' },
        { kind: 'out', text: ' ' },
        { kind: 'out', text: '  clear                    wipe terminal log' },
        { kind: 'out', text: '  disconnect               end session, clear callsign' },
        { kind: 'out', text: '  help                     show this reference' },
        { kind: 'out', text: '  help --all               full reference, including diegetic tools' },
        { kind: 'out', text: ' ' },
        { kind: 'out', text: '// registry does not document discovery protocols.' },
      ];
      setCmdLog((l) => [...l, entry, ...lines]);
      return;
    }
    if (normalized === 'uptime' || normalized === ':uptime') {
      const start = Number(sessionStorage.getItem(BOOT_TIME_KEY) || 0);
      const ms = start ? Date.now() - start : 0;
      const secs = Math.floor(ms / 1000);
      const hh = Math.floor(secs / 3600);
      const mm = Math.floor((secs % 3600) / 60);
      const ss = secs % 60;
      const pad = (n: number) => String(n).padStart(2, '0');
      let bootedAt = 'unknown';
      if (start) {
        const bd = new Date(start);
        const yearStart = new Date(bd.getFullYear(), 0, 0).getTime();
        const dayOfYear = Math.floor((bd.getTime() - yearStart) / 86400000);
        bootedAt = `5016u / Day ${String(dayOfYear).padStart(3, '0')} / ${pad(bd.getHours())}:${pad(bd.getMinutes())}:${pad(bd.getSeconds())} local`;
      }
      setCmdLog((l) => [
        ...l,
        entry,
        { kind: 'out', text: `session uptime: ${pad(hh)}h ${pad(mm)}m ${pad(ss)}s` },
        { kind: 'out', text: `booted: ${bootedAt}` },
      ]);
      return;
    }

    if (normalized === 'who' || normalized === ':who') {
      const pool = [...FAKE_OPERATORS].sort(() => Math.random() - 0.5).slice(0, 6);
      const lines: CmdEntry[] = [
        { kind: 'out', text: 'active operators on this node:' },
        { kind: 'out', text: `  ${verified.toUpperCase().padEnd(14)} (connected 00:00 ago) ← you` },
      ];
      pool.forEach((op) => {
        const mins = Math.floor(Math.random() * 720) + 5;
        const h = String(Math.floor(mins / 60)).padStart(2, '0');
        const m = String(mins % 60).padStart(2, '0');
        lines.push({ kind: 'out', text: `  ${op.padEnd(14)} (connected ${h}:${m} ago)` });
      });
      lines.push({ kind: 'out', text: '  [+ 42 more redacted]' });
      setCmdLog((l) => [...l, entry, ...lines]);
      return;
    }

    if (normalized === 'chatter' || normalized === ':chatter') {
      const picks = [...CHATTER_POOL].sort(() => Math.random() - 0.5).slice(0, 7);
      const lines: CmdEntry[] = [{ kind: 'out', text: '// tapping omni-net chatter ..... [ LIVE ]' }];
      picks.forEach((text) => {
        lines.push({ kind: 'out', text: `  ... ${text}` });
      });
      lines.push({ kind: 'out', text: '// chatter roll ended. [ DROP ]' });
      setCmdLog((l) => [...l, entry, ...lines]);
      return;
    }

    if (normalized === 'ledger' || normalized === ':ledger') {
      // Simple deterministic hash of the callsign for stable balance numbers
      let hash = 0;
      for (let i = 0; i < verified.length; i += 1) hash = (hash * 31 + verified.charCodeAt(i)) | 0;
      const balance = 8000 + Math.abs(hash % 8500);
      const outstanding = 150 + Math.abs((hash >> 3) % 900);
      const lines: CmdEntry[] = [
        { kind: 'out', text: `LEDGER // operator ${verified.toUpperCase()}` },
        { kind: 'out', text: '  +3,000   Lost Cargo (Solitude freighter) .... 5016u / Day 012' },
        { kind: 'out', text: '  -  300   dispatch retainer ...................          std' },
        { kind: 'out', text: '  +1,500   Quell Unrest (ironhusk mining) ..... 5016u / Day 035' },
        { kind: 'out', text: "  -  150   rig rental (crowbar's cut) ..........          std" },
        { kind: 'out', text: "  +8,400   Vane's Sunken Vault (bonus) ........ 5016u / Day 059" },
        { kind: 'out', text: '  - 2,100   legal offset (ask no questions) ....          std' },
        { kind: 'out', text: '  --- --- --- --- --- --- --- --- --- ---' },
        { kind: 'out', text: `  current balance: ${balance.toLocaleString()} credits` },
        { kind: 'out', text: `  outstanding fees: ${outstanding.toLocaleString()} credits (retainer)` },
        { kind: 'out', text: '  next audit: when crowbar says so.' },
      ];
      setCmdLog((l) => [...l, entry, ...lines]);
      return;
    }

    const hailMatch = normalized.match(/^hail\s+--\s*(.+)$/);
    if (hailMatch) {
      const target = hailMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
      const reply = HAIL_MAP[target];
      const lines: CmdEntry[] = [
        { kind: 'out', text: `opening channel to ${target} .....` },
      ];
      if (reply) {
        reply.forEach((line) => lines.push({ kind: 'out', text: `  > ${line}` }));
      } else {
        lines.push({ kind: 'err', text: `  no such callsign on registry books.` });
      }
      setCmdLog((l) => [...l, entry, ...lines]);
      return;
    }

    const msgMatch = normalized.match(/^msg\s+--\s*(\S+)\s+(.+)$/);
    if (msgMatch) {
      const target = msgMatch[1].toUpperCase();
      const body = msgMatch[2];
      const lines: CmdEntry[] = [
        { kind: 'out', text: `→ ${target}: ${body}` },
        { kind: 'out', text: '  [SENT] // encrypted via Crowbar rig // delivery unconfirmed.' },
        { kind: 'out', text: "  registry does not relay replies on open channel." },
      ];
      setCmdLog((l) => [...l, entry, ...lines]);
      return;
    }

    const whoisMatch = normalized.match(/^whois\s+--\s*(.+)$/);
    if (whoisMatch) {
      const target = whoisMatch[1].trim().toUpperCase();
      setCmdLog((l) => [
        ...l,
        entry,
        { kind: 'out', text: `WHOIS: ${target}` },
        { kind: 'out', text: '  clearance level: INSUFFICIENT' },
        { kind: 'out', text: '  record: NOT FOUND' },
        { kind: 'err', text: '  registry does not confirm operator presence on open channel.' },
      ]);
      return;
    }

    const decryptMatch = normalized.match(/^decrypt\s+--\s*(.+)$/);
    if (decryptMatch) {
      const target = decryptMatch[1].trim();
      const clipped = target.length > 40 ? target.slice(0, 40) + '…' : target;
      setCmdLog((l) => [
        ...l,
        entry,
        { kind: 'out', text: `decrypt target: "${clipped}"` },
        { kind: 'out', text: '  attempting brute force ..........' },
        { kind: 'out', text: '  attempting rainbow lookup .........' },
        { kind: 'out', text: '  attempting ledger cross-reference ..........' },
        { kind: 'err', text: '[ERR] insufficient key material. acquire a cipher wheel from crowbar.' },
      ]);
      return;
    }

    const pingMatch = normalized.match(/^ping\s+--\s*(\S+)$/);
    if (pingMatch) {
      if (loading) return;
      const target = pingMatch[1];
      const octets = () => Math.floor(Math.random() * 254) + 1;
      const ip = `10.${octets()}.${octets()}.${octets()}`;
      setLoading(true);
      setCmdLog((l) => [
        ...l,
        entry,
        { kind: 'out', text: `PING ${target} (${ip}): 56 data bytes` },
      ]);
      const lats = [38 + Math.random() * 8, 41 + Math.random() * 12, 55 + Math.random() * 30];
      lats.forEach((lat, i) => {
        const t = setTimeout(() => {
          const tag = lat > 70 ? ' (lane-latency elevated)' : '';
          setCmdLog((l) => [
            ...l,
            { kind: 'out', text: `64 bytes from ${ip}: time=${lat.toFixed(1)}ms${tag}` },
          ]);
        }, 350 + i * 340);
        timers.current.push(t);
      });
      const fin = setTimeout(() => {
        const avg = (lats.reduce((a, b) => a + b) / lats.length).toFixed(1);
        const max = Math.max(...lats).toFixed(1);
        setCmdLog((l) => [
          ...l,
          { kind: 'out', text: `--- ${target} ping statistics ---` },
          { kind: 'out', text: `3 transmitted, 3 received, 0% loss, avg/max = ${avg}ms / ${max}ms` },
        ]);
        setLoading(false);
      }, 1500);
      timers.current.push(fin);
      return;
    }

    const traceMatch = normalized.match(/^trace\s+--\s*(.+)$/);
    if (traceMatch) {
      if (loading) return;
      const target = traceMatch[1].trim().toUpperCase();
      setLoading(true);
      setCmdLog((l) => [...l, entry, { kind: 'out', text: `tracing ${target} ..........` }]);
      const hops = [
        { delay: 250, text: '  hop 1: omni-net ingress ..... [ OK ]' },
        { delay: 600, text: '  hop 2: Port Aeturnus relay ..... [ OK ]' },
        { delay: 1000, text: '  hop 3: SSC signal jammer ..... [ BOUNCE ]' },
        { delay: 1400, text: "  hop 4: Crowbar rig ..... [ DECLINED ]" },
        { delay: 1750, text: '  hop 5: ???' },
      ];
      hops.forEach((h) => {
        timers.current.push(setTimeout(() => {
          setCmdLog((l) => [...l, { kind: 'out', text: h.text }]);
        }, h.delay));
      });
      timers.current.push(setTimeout(() => {
        setCmdLog((l) => [
          ...l,
          { kind: 'err', text: '[ERR] trace dead-ends. registry does not resolve operator paths.' },
        ]);
        setLoading(false);
      }, 2100));
      return;
    }

    const nmapMatch = normalized.match(/^nmap\s+--\s*(\S+)$/);
    if (nmapMatch) {
      if (loading) return;
      const target = nmapMatch[1];
      setLoading(true);
      setCmdLog((l) => [
        ...l,
        entry,
        { kind: 'out', text: `starting scan // target: ${target}` },
        { kind: 'out', text: ' ' },
        { kind: 'out', text: 'PORT      STATE     SERVICE' },
      ]);
      const rows = [
        { delay: 250, text: '22/ssh    open      omni-net handshake' },
        { delay: 500, text: '80/http   open      registry bulletin' },
        { delay: 750, text: "1337/?    open      elite" },
        { delay: 1000, text: '5016/?    filtered  ledger sync' },
        { delay: 1250, text: "9999/?    open      crowbar's pipe" },
        { delay: 1500, text: '15000/?   closed    dispatch audit' },
      ];
      rows.forEach((r) => {
        timers.current.push(setTimeout(() => {
          setCmdLog((l) => [...l, { kind: 'out', text: r.text }]);
        }, r.delay));
      });
      timers.current.push(setTimeout(() => {
        setCmdLog((l) => [
          ...l,
          { kind: 'out', text: ' ' },
          { kind: 'out', text: 'scan complete. 6 ports reported. recommendation: burn the cable.' },
        ]);
        setLoading(false);
      }, 1800));
      return;
    }

    const searchMatch = normalized.match(/^(?:search|find|grep)\s+--\s*(.+)$/);
    if (searchMatch) {
      if (loading) return;
      const query = searchMatch[1].trim();
      if (!query) {
        setCmdLog((l) => [...l, entry, { kind: 'err', text: 'search requires a query. usage: search --<query>' }]);
        return;
      }
      setLoading(true);
      setCmdLog((l) => [...l, entry, { kind: 'out', text: 'scanning omni-net archive…' }]);
      void runPagefindSearch(query);
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
              {e.kind === 'cmd' ? (
                `${prompt} > ${e.text}`
              ) : e.href ? (
                <>
                  {'  '}
                  <a
                    href={e.href}
                    className="underline decoration-dotted hover:text-bone"
                  >
                    {e.text.replace(/^\s+/, '')}
                  </a>
                </>
              ) : (
                `  ${e.text}`
              )}
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
        <p className="text-fg-dim text-xs mt-3 flex items-center justify-between gap-4">
          <span>
            type{' '}
            <code className="text-phosphor">help</code>{' '}
            for command reference.
          </span>
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
