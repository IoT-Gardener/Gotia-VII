import { useEffect, useRef, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import BootTerminal from './BootTerminal';

const STORAGE_KEY = 'rrr.callsign';
const BOOTED_KEY = 'rrr.booted';
const BASE = import.meta.env.BASE_URL;

type LogEntry = { kind: 'cmd' | 'out' | 'err'; text: string };

export default function CallsignGate() {
  const [callsign, setCallsign] = useState('');
  const [verified, setVerified] = useState<string | null>(null);
  const [freshBoot, setFreshBoot] = useState(false);
  const [cmd, setCmd] = useState('');
  const [log, setLog] = useState<LogEntry[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const isFresh = sessionStorage.getItem(BOOTED_KEY) !== '1';
      setVerified(saved);
      setFreshBoot(isFresh);
      if (isFresh) {
        document.documentElement.classList.add('no-auth', 'booting');
      } else {
        document.documentElement.classList.remove('no-auth', 'booting');
      }
    }
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const handleBootDone = () => {
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
    document.querySelectorAll<HTMLElement>('.callsign').forEach((el) => {
      el.textContent = trimmed;
    });
  };

  const disconnect = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(BOOTED_KEY);
    document.documentElement.classList.add('no-auth');
    document.documentElement.classList.remove('booting');
    setVerified(null);
    setFreshBoot(false);
    setCallsign('');
    setLog([]);
    setCmd('');
    document.querySelectorAll<HTMLElement>('.callsign').forEach((el) => {
      el.textContent = 'Operator';
    });
  };

  const runCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = cmd.trim();
    if (!raw) return;
    const normalized = raw.toLowerCase().replace(/\s+/g, ' ');
    const entry: LogEntry = { kind: 'cmd', text: raw };
    setCmd('');

    if (/^query\s*:\s*roster$/.test(normalized)) {
      setLog((l) => [...l, entry, { kind: 'out', text: 'routing ledger-locked node…' }]);
      setTimeout(() => navigate(BASE + 'roster/'), 500);
      return;
    }
    if (normalized === 'clear' || normalized === ':clear') {
      setLog([]);
      return;
    }
    if (normalized === 'whoami' || normalized === ':whoami') {
      setLog((l) => [...l, entry, { kind: 'out', text: verified ?? 'unknown' }]);
      return;
    }
    if (normalized === 'disconnect' || normalized === ':disconnect') {
      disconnect();
      return;
    }
    if (normalized === 'help' || normalized === '?' || normalized === ':help') {
      setLog((l) => [...l, entry, { kind: 'err', text: 'the registry does not tutor.' }]);
      return;
    }
    setLog((l) => [...l, entry, { kind: 'err', text: `unknown command: ${raw}` }]);
  };

  if (verified) {
    const prompt = `${verified.toUpperCase()}@R.R.R.`;
    return (
      <div className="flex flex-col gap-4">
        <BootTerminal callsign={verified} instant={!freshBoot} onDone={handleBootDone} />
        <div className="panel">
          <p className="text-phosphor glow tracking-widest uppercase text-sm">
            &gt; Handshake complete. Welcome back, <span className="text-bone">{verified}</span>.
          </p>
          <p className="text-fg-dim text-xs mt-2">
            Terminal access granted. Dispatch will route traffic to this node.
            {' '}
            <button
              type="button"
              onClick={disconnect}
              className="underline decoration-dotted text-rust hover:text-phosphor ml-1"
            >
              disconnect
            </button>
          </p>

          {log.length > 0 && (
            <div
              ref={logRef}
              className="mt-4 max-h-32 overflow-y-auto bg-black/40 border border-rust-dim px-2 py-1 font-mono text-xs flex flex-col gap-0.5"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#5a2814 transparent' }}
            >
              {log.map((e, i) => (
                <p
                  key={i}
                  className={
                    e.kind === 'cmd'
                      ? 'text-bone'
                      : e.kind === 'err'
                      ? 'text-rust'
                      : 'text-phosphor'
                  }
                >
                  {e.kind === 'cmd' ? `${prompt} > ${e.text}` : `  ${e.text}`}
                </p>
              ))}
            </div>
          )}

          <form
            onSubmit={runCommand}
            className="mt-3 flex items-center gap-2 font-mono text-sm"
          >
            <span className="text-phosphor glow whitespace-nowrap">{prompt} &gt;</span>
            <input
              type="text"
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              className="bg-transparent outline-none flex-1 text-phosphor placeholder-fg-dim/60 border-b border-rust-dim focus:border-phosphor px-1 py-1"
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal command"
            />
          </form>
        </div>
      </div>
    );
  }

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
