import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LANDING_LEADERBOARD } from '@/lib/leagues';

export function Leaderboard() {
  return (
    <section id="ranking" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-bio-500 font-bold uppercase tracking-widest text-sm">Tabla de líderes</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-2 uppercase text-ink">Top jugadores</h2>
          <div className="deco-line my-4" />
          <p className="text-ink/60 mt-4">Los mejores huevómetros del país. ¿Te animas a entrar?</p>
        </div>

        <div className="bg-cream border border-bio-100 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="space-y-3">
            {LANDING_LEADERBOARD.map(p => (
              <div
                key={p.rank}
                className={`flex items-center gap-4 p-4 rounded-2xl ${p.rank <= 3 ? 'bg-gradient-to-r from-bio-100 to-bio-50 border border-bio-200' : 'bg-white border border-bio-100'}`}
              >
                <div className={`font-display text-2xl ${p.rank <= 3 ? '' : 'text-ink/40 w-8 text-center'}`}>{p.flag}</div>
                <div className="flex-1">
                  <div className="font-bold text-ink">{p.name}</div>
                  <div className="text-xs text-ink/50 font-semibold">Nivel {p.level}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-bio-600">{p.points}</div>
                  <div className="text-[10px] text-ink/50 uppercase font-bold">Puntos</div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard" className="block mt-6">
            <Button size="lg" block>Sumarme al ranking</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
