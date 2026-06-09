import type { League, LeagueMockPlayer } from '@/types';

// LIGAS — sistema Duolingo-style 6 divisiones
export const LEAGUES: League[] = [
  { id: 1, name: 'Liga del Bronce',   short: 'Bronce',   emoji: '🥉', minPts: 0,   color: '#8D6E63' },
  { id: 2, name: 'Liga de la Plata',  short: 'Plata',    emoji: '🥈', minPts: 30,  color: '#90A4AE' },
  { id: 3, name: 'Liga del Oro',      short: 'Oro',      emoji: '🥇', minPts: 80,  color: '#F9A825' },
  { id: 4, name: 'Liga del Platino',  short: 'Platino',  emoji: '💎', minPts: 150, color: '#26A69A' },
  { id: 5, name: 'Liga del Diamante', short: 'Diamante', emoji: '💠', minPts: 250, color: '#7E57C2' },
  { id: 6, name: 'Liga del Maestro',  short: 'Maestro',  emoji: '👑', minPts: 400, color: '#D32F2F' },
];

export function getLeagueFor(points: number): League {
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (points >= LEAGUES[i]!.minPts) return LEAGUES[i]!;
  }
  return LEAGUES[0]!;
}

// Mock de jugadores ecuatorianos para el leaderboard semanal
export const LEAGUE_MOCK_PLAYERS: LeagueMockPlayer[] = [
  { name: 'Mateo Q.',    city: 'Quito',     pts: 24 }, { name: 'Valeria G.',  city: 'Guayaquil', pts: 22 },
  { name: 'Andrés P.',   city: 'Cuenca',    pts: 21 }, { name: 'Daniela L.',  city: 'Ambato',    pts: 19 },
  { name: 'Sebastián R.',city: 'Manta',     pts: 18 }, { name: 'Camila T.',   city: 'Loja',      pts: 17 },
  { name: 'Joaquín V.',  city: 'Riobamba',  pts: 16 }, { name: 'Sofía B.',    city: 'Ibarra',    pts: 15 },
  { name: 'Nicolás C.',  city: 'Machala',   pts: 14 }, { name: 'Antonella M.',city: 'Portoviejo',pts: 13 },
  { name: 'Diego S.',    city: 'Quito',     pts: 12 }, { name: 'Lucía A.',    city: 'Guayaquil', pts: 11 },
  { name: 'Pablo Z.',    city: 'Esmeraldas',pts: 10 }, { name: 'Renata N.',   city: 'Latacunga', pts: 9  },
  { name: 'Felipe E.',   city: 'Tena',      pts: 8  }, { name: 'Karla F.',    city: 'Tulcán',    pts: 7  },
  { name: 'Tomás J.',    city: 'Babahoyo',  pts: 6  }, { name: 'Isabella W.', city: 'Quito',     pts: 5  },
  { name: 'Bruno H.',    city: 'Cuenca',    pts: 4  }, { name: 'Emilia O.',   city: 'Ambato',    pts: 3  },
  { name: 'Cristóbal U.',city: 'Manta',     pts: 3  }, { name: 'Paula D.',    city: 'Guayaquil', pts: 2  },
  { name: 'Ignacio K.',  city: 'Quito',     pts: 2  }, { name: 'Renato Y.',   city: 'Loja',      pts: 1  },
  { name: 'Luciana X.',  city: 'Riobamba',  pts: 1  }, { name: 'Esteban I.',  city: 'Ibarra',    pts: 1  },
  { name: 'Mía F.',      city: 'Machala',   pts: 0  }, { name: 'Gabriel A.',  city: 'Portoviejo',pts: 0  },
  { name: 'Antonio S.',  city: 'Esmeraldas',pts: 0  },
];

// Leaderboard de ejemplo para la landing
export const LANDING_LEADERBOARD = [
  { rank: 1, name: 'Juan P.',   points: 64,  flag: '🥇', city: 'Quito',     exact: 6, level: 'Oro'   },
  { rank: 2, name: 'María C.',  points: 58,  flag: '🥈', city: 'Guayaquil', exact: 5, level: 'Oro'   },
  { rank: 3, name: 'Diego A.',  points: 52,  flag: '🥉', city: 'Cuenca',    exact: 4, level: 'Oro'   },
  { rank: 4, name: 'Sofía L.',  points: 47,  flag: '4',  city: 'Ambato',    exact: 3, level: 'Plata' },
  { rank: 5, name: 'Andrés V.', points: 41,  flag: '5',  city: 'Manta',     exact: 3, level: 'Plata' },
];
