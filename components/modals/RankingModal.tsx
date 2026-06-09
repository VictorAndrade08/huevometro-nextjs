'use client';

import { useMemo, useState } from 'react';
import { Search, Trophy, Instagram } from 'lucide-react';
import { Modal, ModalHeader } from '@/components/ui/Modal';
import { useGameStore } from '@/store/gameStore';

interface RankingModalProps {
  open:    boolean;
  onClose: () => void;
}

// Mock provisional — reemplazar con fetch a backend cuando esté listo.
// Por ahora, top semilla para que el ranking no se vea vacío.
const SEED_PLAYERS: Array<{ ig: string; name: string; points: number }> = [
  { ig: 'cris_andrade',   name: 'Cristian Andrade',   points: 184 },
  { ig: 'la_mona24',      name: 'Mónica Rodríguez',   points: 167 },
  { ig: 'pelado_ec',      name: 'Pelado Tucumango',   points: 152 },
  { ig: 'pancho.gol',     name: 'Francisco Yépez',    points: 144 },
  { ig: 'kiara_2026',     name: 'Kiara Sánchez',      points: 138 },
  { ig: 'el_huevo_gomez', name: 'Diego Gómez',        points: 121 },
  { ig: 'mafer.ec',       name: 'María Fernanda Paz', points: 109 },
  { ig: 'jhozz',          name: 'Jhoa Castillo',      points: 98  },
  { ig: 'kevin_ec',       name: 'Kevin Tapia',        points: 92  },
  { ig: 'sofii.la_tri',   name: 'Sofía Vásconez',     points: 87  },
];

export function RankingModal({ open, onClose }: RankingModalProps) {
  const userProfile = useGameStore(s => s.userProfile);
  const userPoints  = useGameStore(s => s.userStats.points);
  const [query, setQuery] = useState('');

  const allPlayers = useMemo(() => {
    const list = [...SEED_PLAYERS];
    if (userProfile.ig || userProfile.name) {
      list.push({
        ig:     userProfile.ig?.replace(/^@/, '') || 'vos',
        name:   userProfile.name || 'Vos',
        points: userPoints,
      });
    }
    return list.sort((a, b) => b.points - a.points);
  }, [userProfile, userPoints]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPlayers;
    return allPlayers.filter(p =>
      p.ig.toLowerCase().includes(q) || p.name.toLowerCase().includes(q),
    );
  }, [allPlayers, query]);

  const myIg = userProfile.ig?.replace(/^@/, '').toLowerCase() || '';
  const myName = (userProfile.name || '').toLowerCase();
  const isMe = (p: typeof allPlayers[number]) =>
    (myIg && p.ig.toLowerCase() === myIg) ||
    (!myIg && myName && p.name.toLowerCase() === myName);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader
        title="Ranking"
        subtitle="Buscá tu @usuario de Instagram"
        onClose={onClose}
      />

      <div className="px-6 pb-2">
        {/* Buscador IG */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-bio-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por @usuario o nombre"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-bio-100 focus:border-bio-500 focus:ring-2 focus:ring-bio-100 outline-none text-sm"
          />
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 max-h-[60vh] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-ink/40 text-sm">
            Sin resultados para <strong>{query}</strong>
          </div>
        ) : (
          <ol className="space-y-1.5">
            {filtered.map((p, i) => {
              const me = isMe(p);
              const realPos = allPlayers.indexOf(p) + 1;
              return (
                <li
                  key={`${p.ig}-${i}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                    me
                      ? 'bg-gradient-to-r from-bio-100 to-bio-50 border-2 border-bio-400 shadow-sm'
                      : 'bg-bio-50/40 hover:bg-bio-50'
                  }`}
                >
                  <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-display font-extrabold text-sm ${
                    realPos === 1 ? 'bg-yellow-400 text-yellow-900' :
                    realPos === 2 ? 'bg-gray-300 text-gray-800' :
                    realPos === 3 ? 'bg-amber-600 text-white' :
                    'bg-bio-100 text-bio-700'
                  }`}>
                    {realPos <= 3 ? <Trophy className="size-4" strokeWidth={3} /> : realPos}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm truncate ${me ? 'text-bio-800' : 'text-ink'}`}>
                      {p.name}{me && <span className="ml-1.5 text-bio-600 text-[10px] font-extrabold uppercase">(vos)</span>}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-ink/55 font-semibold">
                      <Instagram className="size-3" />
                      <span className="truncate">@{p.ig}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-display text-lg text-bio-700 leading-none tabular-nums font-bold">
                      {p.points}
                    </div>
                    <div className="text-[9px] uppercase text-ink/40 font-bold tracking-wide">pts</div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        <p className="text-[11px] text-ink/40 text-center mt-4 leading-relaxed">
          El ranking se actualiza al cierre de cada jornada.
          <br />Compartí cartillas para sumar puntos.
        </p>
      </div>
    </Modal>
  );
}
