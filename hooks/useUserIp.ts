'use client';

import { useEffect, useState } from 'react';

/**
 * Obtiene el IP público del usuario para fingerprintear el bloqueo del huevo de oro.
 * Usa api.ipify.org (gratis, sin auth). Falla silenciosa si no responde.
 */
export function useUserIp(): string | null {
  const [ip, setIp] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data?.ip === 'string') setIp(data.ip);
      } catch {
        /* offline o bloqueado — seguimos sin IP */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return ip;
}
