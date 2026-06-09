'use client';

import { useEffect, useState } from 'react';
import type { Match } from '@/types';

interface UseFixturesResult {
  matches: Match[];
  loading: boolean;
  error:   string | null;
  refetch: () => void;
}

/**
 * Hook que consume `/api/fixtures` (cacheada en el server por 5 min).
 * Auto-refresh cada 30s para que los marcadores en vivo se actualicen solos.
 */
export function useFixtures(): UseFixturesResult {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [tick,    setTick]    = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/fixtures')
      .then(r => r.json())
      .then((data: Match[]) => {
        if (cancelled) return;
        setMatches(data);
        setError(null);
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setError(e.message);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [tick]);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  return { matches, loading, error, refetch: () => setTick(t => t + 1) };
}
