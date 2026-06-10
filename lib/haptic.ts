/**
 * Vibración háptica corta en móviles que soportan navigator.vibrate.
 * No-op silencioso en desktop o si el navegador no lo soporta.
 *
 * Usar para confirmar acciones de un solo tap: +/- de goles, quick-picks,
 * borrar marcador. NO usar para feedback continuo (sería molesto).
 */
export function tapHaptic(): void {
  if (typeof navigator === 'undefined') return;
  try {
    navigator.vibrate?.(10);
  } catch {
    // iOS Safari < 16.4 no soporta vibrate; ignorar.
  }
}
