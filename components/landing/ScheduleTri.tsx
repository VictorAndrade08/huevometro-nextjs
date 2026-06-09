import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface TriMatchRow {
  day: number;
  dayLabel: string;
  time: string;
  leftFlag: string;
  leftTeam: string;
  rightFlag: string;
  rightTeam: string;
  venue: string;
  city: string;
  ecuadorSide: 'left' | 'right';
}

const TRI_MATCHES: TriMatchRow[] = [
  { day: 14, dayLabel: 'Jun · Dom', time: '18:00 ECU', leftFlag: '🇨🇮', leftTeam: 'Costa de Marfil', rightFlag: '🇪🇨', rightTeam: 'Ecuador',   venue: 'Lincoln Financial Field', city: 'Filadelfia',          ecuadorSide: 'right' },
  { day: 20, dayLabel: 'Jun · Sáb', time: '21:00 ECU', leftFlag: '🇪🇨', leftTeam: 'Ecuador',         rightFlag: '🇨🇼', rightTeam: 'Curazao',   venue: 'Arrowhead Stadium',       city: 'Kansas City',         ecuadorSide: 'left'  },
  { day: 25, dayLabel: 'Jun · Jue', time: '15:00 ECU', leftFlag: '🇪🇨', leftTeam: 'Ecuador',         rightFlag: '🇩🇪', rightTeam: 'Alemania',  venue: 'MetLife Stadium',         city: 'East Rutherford NJ',  ecuadorSide: 'left'  },
];

const BRACKET_STAGES = [
  { emoji: '⚔️',   title: '16avos',            dates: '28 Jun — 3 Jul' },
  { emoji: '🗡️',   title: 'Octavos',           dates: '4 — 7 Jul' },
  { emoji: '💪',   title: 'Cuartos · Semis',   dates: '9 — 15 Jul' },
  { emoji: '🏆',   title: 'Gran Final',        dates: '19 Jul · MetLife', highlight: true },
] as const;

export function ScheduleTri() {
  return (
    <section id="cronograma" className="bg-cream py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-bio-500 font-bold uppercase tracking-widest text-sm">📅 Cronograma oficial</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-2 uppercase text-ink">La Tri en el Mundial</h2>
          <div className="deco-line my-4" />
          <p className="text-ink/60 mt-4 max-w-2xl mx-auto">
            Del 11 de junio al 19 de julio · EE.UU., México y Canadá · 48 selecciones · Grupo E
          </p>
        </div>

        <div className="bg-gradient-to-r from-bio-500 to-bio-600 text-white rounded-2xl p-6 mb-8 text-center shadow-xl">
          <p className="font-display text-2xl md:text-3xl font-bold italic">
            &ldquo;El que sabe de fútbol, sabe de huevos.&rdquo;
          </p>
        </div>

        {/* Tabla de partidos */}
        <div className="bg-white border border-bio-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-bio-500 to-bio-600 text-white px-6 py-4 flex justify-between items-center">
            <div>
              <div className="font-display text-xl md:text-2xl uppercase font-bold">🇪🇨 Fase de grupos · Grupo E</div>
              <div className="text-sm text-white/80 mt-1">14 — 25 de junio de 2026</div>
            </div>
            <Badge tone="white" size="sm">LA TRI</Badge>
          </div>
          <div className="divide-y divide-bio-100">
            {TRI_MATCHES.map((m, i) => <TriMatchTableRow key={i} {...m} />)}
          </div>
        </div>

        {/* Bracket preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {BRACKET_STAGES.map((s, i) => (
            <div
              key={i}
              className={`rounded-2xl p-4 text-center ${
                s.highlight ? 'bg-gradient-to-br from-bio-500 to-bio-600 text-white shadow-lg' : 'bg-white border border-bio-100'
              }`}
            >
              <div className="text-2xl mb-2">{s.emoji}</div>
              <div className={`font-bold text-sm ${s.highlight ? 'text-white' : 'text-ink'}`}>{s.title}</div>
              <div className={`text-xs mt-1 ${s.highlight ? 'text-white/90' : 'text-ink/50'}`}>{s.dates}</div>
            </div>
          ))}
        </div>

        {/* Leyenda Bronce/Plata/Oro */}
        <div className="mt-10 bg-white border border-bio-100 rounded-3xl p-6 md:p-8">
          <h3 className="font-display text-2xl uppercase font-bold text-ink mb-4 text-center">🥚 Niveles del Huevómetro</h3>
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <LevelCard emoji="🥉" name="Bronce" range="0 — 19 pts" desc="Recién empezando" tone="bronze" />
            <LevelCard emoji="🥈" name="Plata"  range="20 — 49 pts" desc="¡Vas dorado!"     tone="silver" />
            <LevelCard emoji="🥇" name="Oro"    range="50+ pts"     desc="¡Eres leyenda!"   tone="gold" />
          </div>
        </div>

        {/* Sistema de puntos */}
        <div className="mt-6 bg-gradient-to-br from-bio-50 to-white border-2 border-bio-200 rounded-3xl p-6 md:p-8">
          <h3 className="font-display text-2xl uppercase font-bold text-ink mb-4 text-center">🎯 Cómo se ganan puntos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ScoreCard value="3"   label="PUNTOS" desc="Marcador exacto" />
            <ScoreCard value="1.5" label="PUNTOS" desc="Ganador + score cerca (±1)" />
            <ScoreCard value="1"   label="PUNTO"  desc="Solo el ganador correcto" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-bio-100 rounded-xl px-3 py-2 text-xs"><strong className="text-bio-700">×2</strong> Partidos de la Tri</div>
            <div className="bg-yellow-100 rounded-xl px-3 py-2 text-xs"><strong className="text-yellow-800">×3</strong> Huevo de Oro semanal</div>
            <div className="bg-bio-100 rounded-xl px-3 py-2 text-xs"><strong className="text-bio-700">×4</strong> Truco Empollada</div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/dashboard">
            <Button size="lg">🥚 Poner mis huevos en la cancha →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function TriMatchTableRow({ day, dayLabel, time, leftFlag, leftTeam, rightFlag, rightTeam, venue, city, ecuadorSide }: TriMatchRow) {
  return (
    <div className="bg-bio-50 px-4 md:px-6 py-5 grid grid-cols-12 items-center gap-3">
      <div className="col-span-2 text-center">
        <div className="font-display text-3xl font-bold text-bio-700 leading-none">{day}</div>
        <div className="text-[10px] uppercase text-ink/50 font-bold">{dayLabel}</div>
        <div className="text-[10px] uppercase text-bio-600 font-bold mt-1">{time}</div>
      </div>
      <div className="col-span-3 text-center">
        <div className="text-3xl md:text-4xl">{leftFlag}</div>
        <div className={`text-sm mt-1 ${ecuadorSide === 'left' ? 'font-bold text-bio-700' : 'font-bold text-ink'}`}>
          {leftTeam}
        </div>
      </div>
      <div className="col-span-2 text-center">
        <div className="font-display text-xl text-ink/30">VS</div>
      </div>
      <div className="col-span-3 text-center">
        <div className="text-3xl md:text-4xl">{rightFlag}</div>
        <div className={`text-sm mt-1 ${ecuadorSide === 'right' ? 'font-bold text-bio-700' : 'font-bold text-ink'}`}>
          {rightTeam}
        </div>
      </div>
      <div className="col-span-2 text-right text-[10px] text-ink/50 hidden md:block">
        {venue}<br />{city}
      </div>
    </div>
  );
}

function LevelCard({ emoji, name, range, desc, tone }: { emoji: string; name: string; range: string; desc: string; tone: 'bronze' | 'silver' | 'gold' }) {
  const styles = {
    bronze: 'bg-gradient-to-br from-amber-50 to-white border-2 border-amber-700/30',
    silver: 'bg-gradient-to-br from-slate-50 to-white border-2 border-slate-400/40',
    gold:   'bg-gradient-to-br from-yellow-100 to-white border-2 border-yellow-400 shadow-lg',
  } as const;
  const colors = { bronze: 'text-amber-800', silver: 'text-slate-600', gold: 'text-yellow-700' } as const;
  return (
    <div className={`text-center p-4 rounded-2xl ${styles[tone]}`}>
      <div className="text-5xl mb-2">{emoji}</div>
      <div className={`font-display text-xl font-bold ${colors[tone]}`}>{name}</div>
      <div className={`text-xs mt-1 font-semibold ${tone === 'gold' ? 'text-bio-700 font-bold' : 'text-ink/50'}`}>{range}</div>
      <div className="text-[10px] text-ink/40 mt-2">{desc}</div>
    </div>
  );
}

function ScoreCard({ value, label, desc }: { value: string; label: string; desc: string }) {
  return (
    <div className="bg-white border border-bio-100 rounded-2xl p-4 text-center">
      <div className="font-display text-4xl font-bold text-bio-600">{value}</div>
      <div className="font-bold text-sm text-ink mt-1">{label}</div>
      <div className="text-xs text-ink/50 mt-1">{desc}</div>
    </div>
  );
}
