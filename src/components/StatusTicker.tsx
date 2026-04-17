import { useEffect, useState } from 'react';

const HEADLINES = [
  { tag: 'ALERT',   text: 'SSC Constellation sweep rerouting over Nuova Firenze. Operators: reduce signal profile.', tone: 'danger' },
  { tag: 'LEDGER',  text: 'Bounty raised on "One-Eye" // Iron Rat deserters // payout now 14k credits.', tone: 'rust' },
  { tag: 'WEATHER', text: 'Smog Opacity 0.94 at Port Aeturnus // lane-latency freight +48% // HA convoys grounded.', tone: 'phosphor' },
  { tag: 'RUMOR',   text: 'Machiavelli data-cache reported intact under Ironhusk Foundry. Registry neither confirms nor denies.', tone: 'rust' },
  { tag: 'INCIDENT',text: 'Glass Crater scavenger team lost contact 04:17 local. Distress beacon unresolved.', tone: 'danger' },
  { tag: 'NOTICE',  text: 'Crowbar relay rotating cipher keys 02:00–02:15. Expect momentary drops.', tone: 'phosphor' },
  { tag: 'FLASHPT', text: 'Caduceus Ring status upgraded to HOSTILE. All standing contracts in region suspended pending review.', tone: 'rust' },
  { tag: 'LEDGER',  text: 'Curator Primus has posted a new standing bounty. Check dossier for terms.', tone: 'phosphor' },
];

export default function StatusTicker() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(i);
  }, []);

  const loop = [...HEADLINES, ...HEADLINES];

  return (
    <div className="ticker" key={tick}>
      <div className="ticker-label">OMNI-NET WIRE</div>
      <div className="ticker-track-wrap">
        <div className="ticker-track">
          {loop.map((h, i) => (
            <span key={i} className="ticker-item">
              <span className={`ticker-tag ticker-${h.tone}`}>{h.tag}</span>
              <span className="ticker-text">{h.text}</span>
              <span className="ticker-sep">///</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
