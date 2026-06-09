const ITEMS = [
  '🥚 El que sabe de fútbol, sabe de huevos',
  '🏆 Premios sorpresa todas las semanas',
  '⚽ 104 partidos del Mundial 2026',
  '🇪🇨 La Tri en el Grupo E · vs Costa de Marfil, Curazao y Alemania',
  '🥇 Huevo de Oro semanal: multiplica x3 tus puntos',
  '📱 Juega sin registrarte',
  '#HuevómetroMundialista · #HuevosEnLaCancha',
];

export function Ticker() {
  // Duplicamos los items para que el loop sea continuo
  const allItems = [...ITEMS, ...ITEMS];
  return (
    <div className="bg-bio-500 text-white py-2 overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap font-bold text-sm">
        {allItems.map((text, i) => (
          <span key={i} className="px-8">{text}</span>
        ))}
      </div>
    </div>
  );
}
