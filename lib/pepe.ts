import type { PepeMessage, UserStats } from '@/types';

export const PEPE_MESSAGES: PepeMessage[] = [
  { test: s => s.points >= 50,          msg: '<strong>🥇 ¡Eres una leyenda!</strong> Llegaste al Huevo de Oro.' },
  { test: s => s.points >= 20,          msg: '<strong>🥈 ¡Huevo de Plata!</strong> Sigue así y llegas a Oro.' },
  { test: s => s.streak >= 5,           msg: '<strong>🔥 ¡Racha de fuego!</strong> 5 días seguidos pronosticando.' },
  { test: s => s.exact >= 3,            msg: '<strong>🎯 ¡Marcador clavado!</strong> 3 exactos ya, eres oráculo.' },
  { test: s => s.triPredicted >= 3,     msg: '<strong>🇪🇨 ¡Tri-maníaco!</strong> Pronosticaste a la Tri en todos sus partidos.' },
  { test: s => s.predicted >= 12,       msg: '<strong>🥉 ¡Más de 12 partidos!</strong> Ya estás en zona de Plata.' },
  { test: s => s.predicted >= 6,        msg: '<strong>🥚 ¡6 partidos pronosticados!</strong> Sigue para subir de nivel.' },
  { test: s => s.predicted >= 1,        msg: '<strong>¡Buen comienzo!</strong> Sigue pronosticando para subir a Plata y Oro.' },
  { test: () => true,                    msg: '<strong>¡Hola! Soy Pepe 🥚</strong> Pronostica tu primer partido para empezar a sumar puntos.' },
];

export function getPepeMessage(stats: UserStats): string {
  return PEPE_MESSAGES.find(p => p.test(stats))?.msg ?? PEPE_MESSAGES[PEPE_MESSAGES.length - 1]!.msg;
}
