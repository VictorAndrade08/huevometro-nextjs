// ============================================================
// === Types globales del Huevómetro Mundialista
// ============================================================

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  kickoff: string;         // ISO 8601
  stage: string;
  venue: string;
  isTri: boolean;
  group?: string;
  isPlaceholder?: boolean;
  score?: MatchScore | null;
}

export interface MatchScore {
  home: number;
  away: number;
  status: string;
}

export interface Prediction {
  home: number | null;
  away: number | null;
  goldEgg?: boolean;
}

export interface PredictionsMap {
  [matchId: string]: Prediction;
}

export interface UserStats {
  predicted: number;
  exact: number;
  winner: number;
  points: number;
  streak: number;
  maxStreak: number;
  triPredicted: number;
  goldEggsUsed: number;
  shared: number;
  achievements: string[];
  chipsUsed: string[];
  lastPredictionDay?: string;
}

export interface UserProfile {
  name: string;
  ig: string;
}

export interface EggLevel {
  min: number;
  max: number;
  name: string;
  emoji: string;
  desc: string;
}

export interface WeekBucket {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  from: string;            // YYYY-MM-DD
  to: string;
  isTri?: boolean;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  check: (s: UserStats) => boolean;
}

export interface Chip {
  id: string;
  emoji: string;
  name: string;
  desc: string;
}

export interface League {
  id: number;
  name: string;
  short: string;
  emoji: string;
  minPts: number;
  color: string;
}

export interface LeagueMockPlayer {
  name: string;
  city: string;
  pts: number;
  me?: boolean;
}

export type FilterType = 'tri' | 'all' | 'upcoming' | 'pending' | 'done';

export type ProviderName = 'openfootball' | 'thesportsdb' | 'football-data' | 'balldontlie' | 'api-football';

export interface ApiConfig {
  enabled: boolean;
  provider: ProviderName;
  apiKey: string;
  season: number;
  refreshMs: number;
}

export interface PepeMessage {
  test: (s: UserStats) => boolean;
  msg: string;
}

export interface SocialProof {
  total: number;
  homePct: number;
  drawPct: number;
  awayPct: number;
}
