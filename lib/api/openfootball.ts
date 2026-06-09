import type { Match } from '@/types';
import { flagFor, isEcuador, teamName } from '../teams';

// ============================================================
// === Cliente público de openfootball (JSON en GitHub)
// ============================================================
// Sin auth, sin signup. 100% gratis.
// https://github.com/openfootball/worldcup.json

interface OpenfootballMatch {
  round?: string;
  date: string;
  time?: string;
  team1: string;
  team2: string;
  group?: string;
  ground?: string;
  score1?: number;
  score2?: number;
}

interface OpenfootballResponse {
  name: string;
  matches: OpenfootballMatch[];
}

const SOURCE_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';

export async function fetchOpenfootballFixtures(): Promise<Match[]> {
  const res = await fetch(SOURCE_URL, {
    next: { revalidate: 60 },     // revalida cada 60s en server (live scores)
  });
  if (!res.ok) throw new Error(`openfootball ${res.status}`);
  const data: OpenfootballResponse = await res.json();
  return (data.matches ?? []).map(normalizeOpenfootball);
}

function normalizeOpenfootball(m: OpenfootballMatch): Match {
  // m.time es tipo "13:00 UTC-6" — la convertimos a ISO con tz bien parseado
  const timeMatch = (m.time ?? '').match(/^(\d{1,2}):(\d{2})\s*UTC\s*([+-])(\d+)/);
  let kickoff = m.date + 'T12:00:00-05:00';
  if (timeMatch) {
    const [, hh, mm, tzSign, tzHours] = timeMatch;
    kickoff = `${m.date}T${hh!.padStart(2,'0')}:${mm}:00${tzSign}${tzHours!.padStart(2,'0')}:00`;
  }

  const tri = isEcuador(m.team1) || isEcuador(m.team2);

  // Detectar placeholders de eliminatorias (W74, L101, 2A, 1E, 3A/B/C/D/F, Winner..., Runner...)
  const placeholderRe = /^(W\d|L\d|RU\d|[A-L]\d|\d[A-L]|Winner|Runner)/i;
  const isPlaceholder = placeholderRe.test(m.team1 ?? '') || placeholderRe.test(m.team2 ?? '');

  // Stage limpio sin duplicar group y round
  let stage: string;
  if (m.group && m.round) stage = `${m.group} · ${m.round}`;
  else                    stage = m.round ?? m.group ?? 'Fase de grupos';

  return {
    id: 'of-' + (m.date + '-' + m.team1 + '-' + m.team2).replace(/\W+/g, '-').toLowerCase(),
    homeTeam: teamName(m.team1),
    awayTeam: teamName(m.team2),
    homeFlag: flagFor(m.team1),
    awayFlag: flagFor(m.team2),
    kickoff,
    stage,
    venue: m.ground ?? '',
    isTri: tri,
    ...(m.group !== undefined ? { group: m.group } : {}),
    isPlaceholder,
    score: (m.score1 != null && m.score2 != null)
      ? { home: m.score1, away: m.score2, status: 'FT' }
      : null,
  };
}
