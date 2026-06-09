'use client';

import { useGameStore } from '@/store/gameStore';
import { getPepeMessage } from '@/lib/pepe';

export function PepeMascot() {
  const userStats = useGameStore(s => s.userStats);
  const msg = getPepeMessage(userStats);

  return (
    <div className="bg-white border border-bio-100 rounded-2xl p-3 shadow-sm flex items-center gap-3">
      <div className="pepe-egg">
        <span className="mouth" />
        <span className="cheek-l" />
        <span className="cheek-r" />
      </div>
      <div
        className="speech-bubble flex-1"
        dangerouslySetInnerHTML={{ __html: msg }}
      />
    </div>
  );
}
