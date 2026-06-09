'use client';

import { useEffect, useState } from 'react';

interface Countdown {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

export function useCountdown(targetMs: number): Countdown {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(targetMs - now, 0);
  return {
    days:  Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins:  Math.floor((diff % 3_600_000) / 60_000),
    secs:  Math.floor((diff % 60_000) / 1000),
  };
}
