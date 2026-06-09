import { Plus } from 'lucide-react';

const FAQS = [
  {
    q: '¿Tengo que registrarme para jugar?',
    a: '¡No! Puedes empezar a pronosticar de inmediato sin crear una cuenta. Si quieres guardar tu progreso y participar por los premios, te recomendamos registrarte.',
  },
  {
    q: '¿Quién puede participar por los premios?',
    a: 'Cualquier persona mayor de 18 años residente en Ecuador, con un código válido obtenido al comprar productos BIOHUEVOS.',
  },
  {
    q: '¿Cómo se calculan los puntos?',
    a: 'Marcador exacto: 3 pts · Ganador + marcador cerca (±1 gol): 1.5 pts · Solo ganador: 1 pt · Fallo: 0 pts. Partidos de la Tri suman x2 y el Huevo de Oro semanal x3 (acumulable).',
  },
  {
    q: '¿Cuándo y cómo entregan los premios?',
    a: 'Premios instantáneos: se notifican al ingresar el código. Sorteos semanales: cada lunes. Gran premio final: al cierre del Mundial. Los ganadores son contactados por correo.',
  },
  {
    q: '¿Hasta cuándo puedo pronosticar un partido?',
    a: 'Hasta 5 minutos antes del inicio del partido. Después de ese tiempo el pronóstico queda bloqueado.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 px-4 bg-cream">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-bio-500 font-bold uppercase tracking-widest text-sm">Resuelve tus dudas</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-2 uppercase text-ink">Preguntas frecuentes</h2>
          <div className="deco-line my-4" />
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <details key={i} className="group bg-white border border-bio-100 rounded-2xl p-5 shadow-sm">
              <summary className="flex items-center justify-between font-bold text-ink list-none cursor-pointer">
                {q}
                <Plus className="text-bio-500 size-5 transition group-open:rotate-45" />
              </summary>
              <p className="text-ink/70 mt-3 text-sm leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
