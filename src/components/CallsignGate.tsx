import { useState } from 'react';

export default function CallsignGate() {
  const [callsign, setCallsign] = useState('');
  const [verified, setVerified] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callsign.trim()) return;
    setVerified(callsign.trim());
  };

  if (verified) {
    return (
      <div className="panel">
        <p className="text-phosphor glow tracking-widest uppercase text-sm">
          &gt; Handshake complete. Welcome back, <span className="text-bone">{verified}</span>.
        </p>
        <p className="text-fg-dim text-xs mt-2">Terminal access granted. Dispatch will route traffic to this node.</p>
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
