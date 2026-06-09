import type { Achievement } from '@/types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_egg',    icon: '🥚', title: 'Primer huevo',     desc: 'Pronosticaste tu primer partido',           check: s => s.predicted >= 1 },
  { id: 'half_dozen',   icon: '🍳', title: 'Media docena',     desc: 'Pronosticaste 6 partidos',                  check: s => s.predicted >= 6 },
  { id: 'full_dozen',   icon: '🫕', title: 'Docena completa',  desc: 'Pronosticaste 12 partidos',                 check: s => s.predicted >= 12 },
  { id: 'tri_lover',    icon: '🇪🇨', title: 'Tri-maníaco',      desc: 'Pronosticaste los 3 partidos de Ecuador',   check: s => s.triPredicted >= 3 },
  { id: 'streak_3',     icon: '🔥', title: 'En racha',         desc: 'Pronosticaste 3 días seguidos',             check: s => s.streak >= 3 },
  { id: 'streak_7',     icon: '⚡', title: 'Imparable',        desc: 'Pronosticaste 7 días seguidos',             check: s => s.streak >= 7 },
  { id: 'gold_egg',     icon: '🥇', title: 'Huevo de oro',     desc: 'Usaste tu primer multiplicador semanal',    check: s => s.goldEggsUsed >= 1 },
  { id: 'social_bird',  icon: '📲', title: 'Hincha viral',     desc: 'Compartiste tu tarjeta en historias',       check: s => s.shared >= 1 },
  { id: 'sharpshooter', icon: '🎯', title: 'Marcador clavado', desc: 'Acertaste 1 marcador exacto',               check: s => s.exact >= 1 },
  { id: 'oracle',       icon: '🔮', title: 'Oráculo',          desc: 'Acertaste 5 marcadores exactos',            check: s => s.exact >= 5 },
];
