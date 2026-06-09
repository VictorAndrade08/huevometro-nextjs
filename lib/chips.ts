import type { Chip } from '@/types';

// CHIPS / TRUCOS DEL HUEVO (estilo FPL — 1 uso por torneo, no por semana)
export const CHIPS: Chip[] = [
  { id: 'ojito',     emoji: '🔍', name: 'Ojito',       desc: 'Revela el pronóstico mayoritario de la comunidad en un partido' },
  { id: 'tortilla',  emoji: '🍳', name: 'Tortilla',    desc: 'Cambia 1 pronóstico ya bloqueado (sólo antes de empezar el partido +30min)' },
  { id: 'empollada', emoji: '🐣', name: 'Empollada',   desc: 'Multiplica ×4 los puntos de un solo partido (más que el Huevo de Oro)' },
  { id: 'doble',     emoji: '⚡', name: 'Huevo Doble', desc: 'Multiplica ×2 todos los partidos de una semana entera (úsalo en la fase final)' },
];
