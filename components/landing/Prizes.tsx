import { Crown, Medal, Award, Gift, Instagram } from 'lucide-react';

const PODIUM = [
  {
    place:     '2°',
    label:     'Premio Plata',
    desc:      'Para el subcampeón del Huevómetro',
    tone:      'silver',
    height:    'h-44 md:h-56',
    Icon:      Medal,
    main:      false,
  },
  {
    place:     '1°',
    label:     'Gran Premio',
    desc:      'Para el campeón del Huevómetro Mundialista',
    tone:      'gold',
    height:    'h-60 md:h-72',
    Icon:      Crown,
    main:      true,
  },
  {
    place:     '3°',
    label:     'Premio Bronce',
    desc:      'Para el tercer lugar del ranking final',
    tone:      'bronze',
    height:    'h-36 md:h-44',
    Icon:      Award,
    main:      false,
  },
] as const;

const TONE_STYLES = {
  gold:   { eggGrad: 'linear-gradient(180deg, #FFE48A 0%, #F0BE3A 55%, #B6831A 100%)', edge: '#B6831A', podium: 'linear-gradient(180deg, #F4C544 0%, #B6831A 100%)' },
  silver: { eggGrad: 'linear-gradient(180deg, #FFFFFF 0%, #D4D9E0 55%, #8A929C 100%)', edge: '#8A929C', podium: 'linear-gradient(180deg, #DDE2E8 0%, #8A929C 100%)' },
  bronze: { eggGrad: 'linear-gradient(180deg, #F2BC8B 0%, #B57A4D 55%, #6B4222 100%)', edge: '#6B4222', podium: 'linear-gradient(180deg, #C58758 0%, #6B4222 100%)' },
} as const;

export function Prizes() {
  return (
    <section
      id="premios"
      className="py-20 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--color-bg-1) 0%, var(--color-bg-0) 100%)' }}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-bio-300 font-display font-bold uppercase tracking-widest text-base">
            <Gift className="size-5" strokeWidth={2.5} />
            Premios del torneo
          </span>
          <h2 className="font-display text-5xl md:text-7xl font-bold mt-3 text-white tracking-tight">
            Subí al <span className="text-bio-400">podio</span>
          </h2>
          <p className="text-bio-200/80 mt-5 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Acumulá puntos cada jornada. Los tres con más aciertos al final del Mundial ganan kits de Bio Huevos.
          </p>
        </div>

        {/* Podio */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 items-end mb-10">
          {PODIUM.map(p => {
            const tone = TONE_STYLES[p.tone];
            const Icon = p.Icon;
            return (
              <div key={p.place} className="flex flex-col items-center">
                {/* Huevo con cara feliz */}
                <div
                  className="relative mb-3"
                  style={{
                    width:  p.main ? 110 : 84,
                    height: p.main ? 140 : 108,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-[50%_50%_48%_48%/60%_60%_40%_40%] border-2 shadow-2xl"
                    style={{ background: tone.eggGrad, borderColor: tone.edge }}
                  />
                  {/* Cara */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
                    style={{ top: p.main ? '38%' : '34%' }}
                  >
                    <div className="flex gap-2">
                      <span className="w-1.5 h-2.5 rounded-full bg-bio-900" />
                      <span className="w-1.5 h-2.5 rounded-full bg-bio-900" />
                    </div>
                    <span
                      className="block rounded-b-full mt-1"
                      style={{
                        width: 14, height: 6,
                        borderBottom: '2px solid #4E2706',
                      }}
                    />
                  </div>
                </div>

                {/* Etiqueta de premio */}
                <div className="text-center mb-3 px-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bio-500/15 border border-bio-500/30 mb-2">
                    <Icon className="size-3.5 text-bio-300" strokeWidth={2.5} />
                    <span className="text-[11px] font-display font-bold text-bio-200 uppercase tracking-wider">
                      {p.place} lugar
                    </span>
                  </div>
                  <h3 className={`font-display font-bold text-white leading-tight ${p.main ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
                    {p.label}
                  </h3>
                  <p className="text-xs md:text-sm text-bio-200/70 mt-1 leading-snug">
                    {p.desc}
                  </p>
                </div>

                {/* Bloque del podio */}
                <div
                  className={`w-full rounded-t-xl shadow-2xl border-t-4 flex items-center justify-center font-display font-black text-white ${p.height}`}
                  style={{
                    background: tone.podium,
                    borderColor: tone.edge,
                    fontSize: p.main ? '4rem' : '2.75rem',
                    textShadow: '0 4px 16px rgba(0,0,0,0.45)',
                  }}
                >
                  {p.place}
                </div>
              </div>
            );
          })}
        </div>

        {/* Nota inferior */}
        <div
          className="rounded-3xl p-6 md:p-8 border-2 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(240,137,37,0.15) 0%, var(--color-bg-2) 100%)',
            borderColor: 'rgba(240,137,37,0.35)',
          }}
        >
          <div className="inline-flex items-center gap-2 text-bio-300 font-display font-bold text-sm uppercase tracking-widest mb-3">
            <Instagram className="size-4" strokeWidth={2.5} />
            Cómo participar
          </div>
          <p className="text-bio-100 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Subí tu cartilla a tu historia de Instagram y etiquetá <strong className="text-bio-300">@biohuevos_ec</strong>. Te contactamos por mensaje directo si ganás.
          </p>
        </div>
      </div>
    </section>
  );
}
