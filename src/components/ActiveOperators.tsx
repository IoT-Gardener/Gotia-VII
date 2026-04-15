import { useEffect, useState } from 'react';

export default function ActiveOperators() {
  const [count, setCount] = useState(72);
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => {
      setFlicker(true);
      setTimeout(() => setFlicker(false), 140);
      setCount((c) => {
        const delta = Math.random() < 0.5 ? -1 : 1;
        const next = c + delta;
        if (next < 50) return 51;
        if (next > 100) return 99;
        return next;
      });
    }, 2200 + Math.random() * 1600);
    return () => clearInterval(tick);
  }, []);

  return (
    <span
      className="text-3xl text-phosphor glow tabular-nums"
      style={{ opacity: flicker ? 0.35 : 1, transition: 'opacity 80ms linear' }}
    >
      {count}
    </span>
  );
}
