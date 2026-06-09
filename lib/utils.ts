import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina className strings con conflict-resolution de Tailwind.
 * Best practice 2026: usar siempre cn() en componentes para merge consistente.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
