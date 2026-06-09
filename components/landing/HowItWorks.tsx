import { ShoppingBag, QrCode, Edit3, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const STEPS = [
  { num: 1, Icon: ShoppingBag, title: 'Compra BIOHUEVOS', desc: 'Encuéntralos en tu supermercado o tienda más cercana. Busca el sello promocional.' },
  { num: 2, Icon: QrCode,      title: 'Escanea el QR',    desc: 'En el empaque encontrarás un código QR. Escanéalo con tu celular para acceder al juego.' },
  { num: 3, Icon: Edit3,       title: 'Pronostica',       desc: 'Ingresa los marcadores de los partidos. Acumula puntos por cada acierto.' },
  { num: 4, Icon: Sparkles,    title: '¡Gana premios!',   desc: 'Acumula puntos para escalar el ranking y ganar premios al instante y en sorteos semanales.' },
] as const;

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-cream py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <span className="text-bio-500 font-bold uppercase tracking-widest text-sm">Paso a paso</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-2 uppercase text-ink">¿Cómo funciona?</h2>
          <div className="deco-line my-4" />
          <p className="text-ink/60 mt-4 max-w-2xl mx-auto">En 4 pasos estás listo para pronosticar, sumar puntos y empezar a ganar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ num, Icon, title, desc }, idx) => {
            const isLast = idx === STEPS.length - 1;
            return (
              <Card
                key={num}
                tilt
                className={`p-6 relative overflow-hidden ${isLast ? 'bg-gradient-to-br from-bio-500 to-bio-600 border-transparent shadow-xl' : ''}`}
              >
                <div className={`absolute -top-6 -right-6 text-9xl font-display font-bold ${isLast ? 'text-white/10' : 'text-bio-50'}`}>
                  {num}
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg relative z-10 ${isLast ? 'bg-white' : 'bg-bio-500'}`}>
                  <Icon className={`size-7 ${isLast ? 'text-bio-600' : 'text-white'}`} strokeWidth={2.5} />
                </div>
                <h3 className={`font-bold text-xl mb-2 relative z-10 ${isLast ? 'text-white' : 'text-ink'}`}>{title}</h3>
                <p className={`text-sm relative z-10 ${isLast ? 'text-white/90' : 'text-ink/60'}`}>{desc}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
