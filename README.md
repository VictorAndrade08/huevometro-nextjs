# 🥚 El Huevómetro Mundialista — Next.js

Migración a Next.js 15 + React 19 + TypeScript + Tailwind v4 del proyecto HTML original.
Diseño, clases, texto y funcionalidad 100% preservados.

## 🚀 Quick start

```bash
cd huevometro-nextjs
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 🧱 Stack

| Tecnología       | Versión  | Por qué                                          |
|------------------|----------|---------------------------------------------------|
| Next.js          | 15.x     | App Router + Server Components + Turbopack       |
| React            | 19       | Hooks modernos + Server Components               |
| TypeScript       | 5.7      | `strict: true` + `noUncheckedIndexedAccess`      |
| Tailwind CSS     | 4        | `@theme` directive, sin config JS                |
| Zustand          | 5        | State global con persistencia en localStorage    |
| lucide-react     | latest   | Íconos consistentes y tree-shakeable             |
| html2canvas      | 1.4      | Generación PNG de la tarjeta compartible         |
| CVA              | latest   | Variants tipadas para componentes UI             |

## 📁 Estructura

```
huevometro-nextjs/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout + fonts + metadata
│   ├── page.tsx                  # Landing (Server Component)
│   ├── globals.css               # Tailwind v4 + tema brand bio
│   ├── api/fixtures/route.ts     # Proxy del openfootball API
│   ├── dashboard/page.tsx        # Vista de pronósticos
│   └── login/page.tsx            # Login/registro (opcional)
│
├── components/
│   ├── ui/                       # Primitivas reutilizables
│   │   ├── Button.tsx            # CVA variants (primary/ghost/white/dark)
│   │   ├── Card.tsx
│   │   ├── Modal.tsx             # Dialog accesible
│   │   ├── Toast.tsx
│   │   └── Badge.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Ticker.tsx            # Banner animado superior
│   ├── landing/
│   │   ├── Hero.tsx              # Hero + countdown al primer partido
│   │   ├── HowItWorks.tsx        # 4 pasos
│   │   ├── ScheduleTri.tsx       # Cronograma de la Tri con datos reales
│   │   ├── Prizes.tsx            # Premios "por confirmar"
│   │   ├── Leaderboard.tsx       # Top 5 mock
│   │   ├── FAQ.tsx
│   │   └── CTAFinal.tsx
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx   # Header naranja clickeable
│   │   ├── FilterTabs.tsx        # 🇪🇨 La Tri / Todos / ✓ Hechos
│   │   ├── MatchesList.tsx       # Orquesta Tri spotlight + semanas
│   │   ├── TriSpotlight.tsx      # Sección 🇪🇨 destacada
│   │   ├── WeekAccordion.tsx     # 12 jornadas colapsables
│   │   ├── MatchCard.tsx         # Card individual de partido
│   │   ├── EggCounter.tsx        # Botones touch-friendly +/-
│   │   ├── QuickPicks.tsx        # 1-0, 2-1, 1-1, 0-0, 🎲
│   │   ├── SaveButton.tsx        # FAB de Guardar + Reglas
│   │   ├── ProfileDrawer.tsx     # Drawer "Mi cuenta y juego"
│   │   ├── StatsHeader.tsx       # Header compacto con stats
│   │   ├── PepeMascot.tsx        # Mascota con speech bubble dinámico
│   │   ├── ChipsPanel.tsx        # 4 trucos del huevo (FPL-style)
│   │   └── LeagueBanner.tsx      # Liga semanal Duolingo-style
│   └── modals/
│       ├── ShareCardModal.tsx    # Tarjeta naranja exportable a PNG
│       ├── RulesModal.tsx        # 8 secciones de reglas oficiales
│       ├── OnboardingModal.tsx   # Tour 3 steps primera vez
│       └── PrivateLeagueModal.tsx
│
├── lib/                          # Lógica pura, sin React
│   ├── utils.ts                  # cn() para merge de Tailwind
│   ├── constants.ts              # RULES + API_CONFIG + fechas torneo
│   ├── teams.ts                  # TEAM_FLAGS + TEAM_NAMES_ES (~70 países)
│   ├── weeks.ts                  # 12 buckets de jornadas + helpers
│   ├── scoring.ts                # calcPointsForMatch + niveles 🥉🥈🥇
│   ├── achievements.ts           # 10 logros
│   ├── chips.ts                  # 4 chips (Ojito/Tortilla/Empollada/Doble)
│   ├── leagues.ts                # 6 divisiones + 29 jugadores mock EC
│   ├── pepe.ts                   # Mensajes contextuales de la mascota
│   └── api/openfootball.ts       # Cliente del JSON público
│
├── hooks/                        # Custom hooks
│   ├── useCountdown.ts           # Countdown al kickoff
│   ├── useFixtures.ts            # Fetch /api/fixtures + auto-refresh
│   └── useToast.ts
│
├── store/
│   └── gameStore.ts              # Zustand con persistencia localStorage
│
├── types/
│   └── index.ts                  # Match, Prediction, UserStats, etc.
│
├── package.json
├── tsconfig.json                 # strict + noUncheckedIndexedAccess
├── next.config.ts
├── postcss.config.mjs
└── README.md
```

## 🎨 Design system

Las clases Tailwind y los tokens de color se preservaron 1:1 del HTML original:

```css
@theme {
  --color-bio-50  ... --color-bio-900;   /* Brand naranja escalado */
  --color-cream:  #FBF7EE;
  --color-ink:    #2A1F12;
  --font-display: 'Bebas Neue';
}
```

Componentes con **CVA** para variants tipadas:

```tsx
<Button variant="primary" size="lg">¡JUGAR AHORA!</Button>
<Badge tone="success" size="xs">CERRADO</Badge>
```

## 🧠 State management — Zustand

Un solo store global con persistencia automática:

```ts
import { useGameStore } from '@/store/gameStore';

// En cualquier componente:
const predictions     = useGameStore(s => s.predictions);
const changePrediction = useGameStore(s => s.changePrediction);
```

Persiste en localStorage: `predictions`, `userStats`, `userProfile`, `goldEggOfWeek`, `isGuest`.

## 🌐 Data fetching

Server-side via `app/api/fixtures/route.ts` que proxea al JSON público de
[openfootball/worldcup.json](https://github.com/openfootball/worldcup.json).
Cache 5 min, stale-while-revalidate 10 min.

## 🎯 Lógica del juego

**Sistema Superbru 3/1.5/1/0:**
```
Exacto                       → 3 pts
Ganador + score cerca (±1)   → 1.5 pts
Solo ganador                 → 1 pt
Fallo                        → 0 pts
```

**Multiplicadores acumulables** (× sobre los pts base):
- 🇪🇨 Partidos de la Tri → ×2
- 🥇 Huevo de Oro semanal → ×3
- 🐣 Truco Empollada → ×4

**Lock:** 5 min antes del kickoff (con warning rojo desde 60 min antes).

## 🚦 Scripts

```bash
npm run dev        # Desarrollo con Turbopack
npm run build      # Build production
npm start          # Servir build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## 📦 Próximos pasos sugeridos

- [ ] Conectar a base de datos (Postgres + Drizzle/Prisma) para persistir cuentas reales
- [ ] Auth real (NextAuth/Clerk) reemplazando el `isGuest`
- [ ] Realtime con Supabase Realtime / Pusher para la liga privada
- [ ] Server-side share card con `@vercel/og` (más rápido que html2canvas)
- [ ] Cron job que cada hora actualice scores y recalcule puntos
- [ ] Tests E2E con Playwright

## 📜 Reglas oficiales

Ver `components/modals/RulesModal.tsx` para las 8 secciones completas:
puntos, cierre, chips, Huevo de Oro, casos especiales, ligas, desempates y juego limpio.

---

**Una campaña de BIOHUEVOS · Mundial 2026 · #HuevómetroMundialista**
