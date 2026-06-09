'use client';

import { useEffect, useState } from 'react';

/**
 * Re-renderiza cada `intervalMs` ms con Date.now() actualizado.
 * Útil para refrescar countdowns / status de partidos sin tener
 * que setear un timer por cada componente individualmente.
 */
export function useNow(intervalMs = 15_000): number {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
