// ============================================================
// === REGLAS OFICIALES DEL TORNEO
// ============================================================
// Toda regla del juego se define acá. Cambios futuros: solo en este archivo.

export const RULES = {
  LOCK_MINUTES_BEFORE_KICKOFF: 20,   // 🔒 Lock 20 min antes del pitazo inicial
  WARN_MINUTES_BEFORE_KICKOFF: 60,   // ⚠️ Avisar que se acerca cierre (rojo)
  POINTS_EXACT: 3,
  POINTS_OUTCOME_CLOSE: 1.5,
  POINTS_OUTCOME: 1,
  POINTS_WRONG: 0,
  MULTIPLIER_TRI: 2,
  MULTIPLIER_GOLD_EGG: 3,
  MULTIPLIER_EMPOLLADA_CHIP: 4,
  MAX_GOLD_EGGS_PER_WEEK: 1,
  MAX_CHIPS_PER_TOURNAMENT: 4,
  MAX_GOALS_PER_TEAM: 9,
  STREAK_BONUS_AT: 5,
  STREAK_BONUS_PTS: 1,
  KNOCKOUT_USES_90MIN_SCORE: true,
  CANCELLED_MATCH_RETURNS_CHIPS: true,
  POSTPONED_KEEPS_PREDICTION: true,
} as const;

export const TOURNAMENT_START = new Date('2026-06-11T19:00:00-05:00').getTime();
export const FINAL_DATE       = new Date('2026-07-19T15:00:00-05:00').getTime();

export const API_CONFIG = {
  enabled:        true,
  provider:       'openfootball' as const,
  apiKey:         '',
  season:         2026,
  refreshMs:      60_000,
} as const;
