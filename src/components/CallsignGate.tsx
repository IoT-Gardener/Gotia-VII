import { useEffect, useState } from 'react';
import BootTerminal from './BootTerminal';

const STORAGE_KEY = 'rrr.callsign';
const BOOTED_KEY = 'rrr.booted';

export default function CallsignGate() {
  const [callsign, setCallsign] = useState('');
  const [verified, setVerified] = useState<string | null>(null);
  const [freshBoot, setFreshBoot] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const isFresh = sessionStorage.getItem(BOOTED_KEY) !== '1';
      setVerified(saved);
      setFreshBoot(isFresh);
      sessionStorage.setItem(BOOTED_KEY, '1');
      if (isFresh) {
        document.documentElement.classList.add('no-auth', 'booting');
      } else {
        document.documentElement.classList.remove('no-auth', 'booting');
      }
    }
  }, []);

  const handleBootDone = () => {
    document.documentElement.classList.remove('no-auth', 'booting');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = callsign.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    sessionStorage.setItem(BOOTED_KEY, '1');
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
    document.querySelectorAll<HTMLElement>('.callsign').forEach((el) => {
      el.textContent = 'Operator';
    });
  };

  if (verified) {
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
