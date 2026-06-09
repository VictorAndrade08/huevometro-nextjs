import type { Match, WeekBucket } from '@/types';

export const WEEK_BUCKETS: WeekBucket[] = [
  { id: 1,  title: 'Jornada 1',  subtitle: 'Inicio del Mundial',            emoji: '🏁', from: '2026-06-11', to: '2026-06-13' },
  { id: 2,  title: 'Jornada 2',  subtitle: '🇪🇨 Debut Ecuador vs C. Marfil', emoji: '🇪🇨', from: '2026-06-14', to: '2026-06-16', isTri: true },
  { id: 3,  title: 'Jornada 3',  subtitle: 'Cierra la 1ª fecha',            emoji: '⚽', from: '2026-06-17', to: '2026-06-19' },
  { id: 4,  title: 'Jornada 4',  subtitle: '🇪🇨 Ecuador vs Curazao',        emoji: '🇪🇨', from: '2026-06-20', to: '2026-06-22', isTri: true },
  { id: 5,  title: 'Jornada 5',  subtitle: '🇪🇨 Ecuador vs Alemania',       emoji: '🇩🇪', from: '2026-06-23', to: '2026-06-25', isTri: true },
  { id: 6,  title: 'Jornada 6',  subtitle: 'Cierre fase de grupos',          emoji: '🏆', from: '2026-06-26', to: '2026-06-27' },
  { id: 7,  title: 'Jornada 7',  subtitle: '16avos de final',                emoji: '⚔️', from: '2026-06-28', to: '2026-07-01' },
  { id: 8,  title: 'Jornada 8',  subtitle: 'Octavos de final',               emoji: '🗡️', from: '2026-07-02', to: '2026-07-04' },
  { id: 9,  title: 'Jornada 9',  subtitle: 'Cuartos de final',               emoji: '💪', from: '2026-07-05', to: '2026-07-11' },
  { id: 10, title: 'Jornada 10', subtitle: 'Semifinales',                    emoji: '👑', from: '2026-07-12', to: '2026-07-15' },
  { id: 11, title: 'Jornada 11', subtitle: 'Por el 3er lugar',               emoji: '🥉', from: '2026-07-16', to: '2026-07-18' },
  { id: 12, title: 'Jornada 12', subtitle: '🏆 ¡LA GRAN FINAL!',             emoji: '🥇', from: '2026-07-19', to: '2026-07-19' },
];

export function getWeekFor(match: Match): WeekBucket {
  const d = (match.kickoff ?? '').slice(0, 10);
  return WEEK_BUCKETS.find(w => d >= w.from && d <= w.to) ?? WEEK_BUCKETS[WEEK_BUCKETS.length - 1]!;
}

export function getCurrentWeekId(today = new Date().toISOString().slice(0, 10)): number {
  const current = WEEK_BUCKETS.find(w => today >= w.from && today <= w.to);
  if (current) return current.id;
  const firstFuture = WEEK_BUCKETS.find(w => w.from >= today);
  return firstFuture?.id ?? 1;
}

export function formatWeekRange(w: WeekBucket): string {
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const fmt = (iso: string) => {
    const parts = iso.split('-').map(Number) as [number, number, number];
    const [_y, m, d] = parts;
    return `${d} ${months[m - 1]}`;
  };
  return w.from === w.to ? fmt(w.from) : `${fmt(w.from)} – ${fmt(w.to)}`;
}

export function groupByDay(matches: Match[]): Array<[string, Match[]]> {
  const days = new Map<string, Match[]>();
  matches.forEach(m => {
    const day = (m.kickoff ?? '').slice(0, 10);
    if (!days.has(day)) days.set(day, []);
    days.get(day)!.push(m);
  });
  return [...days.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export function formatDayLabel(iso: string): string {
  const d = new Date(iso + 'T12:00:00-05:00');
  if (isNaN(d.getTime())) return iso;
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${dias[d.getDay()]} ${d.getDate()} de ${meses[d.getMonth()]}`;
}
