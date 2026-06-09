import type { EggLevel, Match, MatchScore, Prediction } from '@/types';
import { RULES } from './constants';

// Niveles de huevo: Bronce → Plata → Oro
export const EGG_LEVELS: EggLevel[] = [
  { min: 0,  max: 19,   name: 'Huevo de Bronce', emoji: '🥉', desc: 'Recién empezando · sigue así' },
  { min: 20, max: 49,   name: 'Huevo de Plata',  emoji: '🥈', desc: '¡Vas dorado! Top intermedio' },
  { min: 50, max: 9999, name: 'Huevo de Oro',    emoji: '🥇', desc: '¡Eres una leyenda del torneo!' },
];

export function getEggLevel(points: number): EggLevel {
  return EGG_LEVELS.find(l => points >= l.min && points <= l.max) ?? EGG_LEVELS[0]!;
}

/**
 * Sistema de puntos estilo Superbru (3 / 1.5 / 1 / 0)
 * - Exacto = 3 pts
 * - Outcome + close score (±1) = 1.5 pts
 * - Outcome solo = 1 pt
 * - Fallo = 0
 * Multiplicadores acumulables:
 *   isTri → x2 · Huevo de Oro → x3 · Empollada chip → x4
 */
export function calcPointsForMatch(
  match: Match,
  prediction: Prediction,
  actualScore: MatchScore | null | undefined,
  goldEggMatchId: string | null,
): number {
  if (!prediction || typeof prediction.home !== 'number' || typeof prediction.away !== 'number') return 0;
  if (!actualScore) return 0;

  const exact = prediction.home === actualScore.home && prediction.away === actualScore.away;
  const winnerPred = Math.sign(prediction.home - prediction.away);
  const winnerReal = Math.sign(actualScore.home - actualScore.away);
  const close =
    Math.abs(prediction.home - actualScore.home) <= 1 &&
    Math.abs(prediction.away - actualScore.away) <= 1;

  let base: number;
  if (exact)                                       base = RULES.POINTS_EXACT;
  else if (winnerPred === winnerReal && close)     base = RULES.POINTS_OUTCOME_CLOSE;
  else if (winnerPred === winnerReal)              base = RULES.POINTS_OUTCOME;
  else                                              base = RULES.POINTS_WRONG;

  let multiplier = 1;
  if (match.isTri) multiplier *= RULES.MULTIPLIER_TRI;
  if (goldEggMatchId === match.id) multiplier *= RULES.MULTIPLIER_GOLD_EGG;

  return base * multiplier;
}

export function isLocked(match: Match): boolean {
  const t = new Date(match.kickoff).getTime();
  if (isNaN(t)) return false;
  return Date.now() > t - RULES.LOCK_MINUTES_BEFORE_KICKOFF * 60 * 1000;
}

export function isClosingSoon(match: Match): boolean {
  const t = new Date(match.kickoff).getTime();
  if (isNaN(t)) return false;
  const ms = t - Date.now();
  return ms > 0 && ms < RULES.WARN_MINUTES_BEFORE_KICKOFF * 60 * 1000;
}

export function formatMatchDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Fecha por confirmar';
  return d.toLocaleString('es-EC', {
    day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).replace('.', '');
}

export function timeUntilKickoff(iso: string): string | null {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return null;
  const diff = t - Date.now();
  if (diff <= 0) return null;
  const days  = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins  = Math.floor((diff % 3_600_000) / 60_000);
  if (days > 0)  return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function getEggDisplay(n: number): string {
  if (n === 0) return '∅';
  return '🥚'.repeat(Math.min(n, 5));
}

// Social proof mock (en producción viene del backend)
export function getSocialProof(matchId: string) {
  const seed = matchId.charCodeAt(2) || 5;
  const total = 400 + (seed * 47) % 800;
  const homePct = 30 + (seed * 13) % 50;
  return { total, homePct, drawPct: 25, awayPct: 100 - homePct - 25 };
}
