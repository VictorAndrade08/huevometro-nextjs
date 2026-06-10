'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Activity } from 'lucide-react';
import { DashboardHeader }    from '@/components/dashboard/DashboardHeader';
import { FilterTabs }         from '@/components/dashboard/FilterTabs';
import { MatchesList }        from '@/components/dashboard/MatchesList';
import { InfoDrawer }         from '@/components/dashboard/InfoDrawer';
import { SaveButton }         from '@/components/dashboard/SaveButton';
import { MusicPlayer }        from '@/components/dashboard/MusicPlayer';
import { Toast }              from '@/components/ui/Toast';
import { RulesModal }         from '@/components/modals/RulesModal';
import { OnboardingModal }    from '@/components/modals/OnboardingModal';
import { ShareCardModal }     from '@/components/modals/ShareCardModal';
import { ProfileCaptureModal } from '@/components/modals/ProfileCaptureModal';
import { CartillaPickerModal } from '@/components/modals/CartillaPickerModal';
import { useFixtures }        from '@/hooks/useFixtures';
import { useToast }           from '@/hooks/useToast';
import { useGameStore }       from '@/store/gameStore';
import { ACHIEVEMENTS } from '@/lib/achievements';
import type { Match } from '@/types';

export default function DashboardPage() {
  const { matches, loading } = useFixtures();
  const { toast, showToast } = useToast();

  const [rulesOpen,      setRulesOpen]      = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [shareOpen,      setShareOpen]      = useState(false);
  const [profileOpen,    setProfileOpen]    = useState(false);
  const [pickerOpen,     setPickerOpen]     = useState(false);
  const [shareMatches,   setShareMatches]   = useState<Match[] | null>(null);
  const [shareTitle,     setShareTitle]     = useState<string>('');

  // Onboarding solo primera vez
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('huevo-onboarded')) {
      const t = setTimeout(() => setOnboardingOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  const predictions       = useGameStore(s => s.predictions);
  const userStats         = useGameStore(s => s.userStats);
  const userProfile       = useGameStore(s => s.userProfile);
  const updateStats       = useGameStore(s => s.updateStats);
  const unlockAchievement = useGameStore(s => s.unlockAchievement);

  // Si el perfil ya está completo, saltamos el ProfileCaptureModal
  const profileReady = !!(userProfile.name?.trim() && userProfile.ig?.trim());

  function openShareFlow(picked: Match[], label: string) {
    setShareMatches(picked);
    setShareTitle(label);
    if (profileReady) {
      persistStats();
      setShareOpen(true);
    } else {
      setProfileOpen(true);
    }
  }

  // Compartir un solo partido
  function handleShareMatch(match: Match) {
    openShareFlow([match], `${match.homeTeam} vs ${match.awayTeam}`);
  }

  // Compartir una jornada entera (o La Tri)
  function handleShareGroup(matches: Match[], label: string) {
    openShareFlow(matches, label);
  }

  function handleProfileComplete() {
    setProfileOpen(false);
    persistStats();
    setShareOpen(true);
  }

  function persistStats() {
    const newStats = {
      predicted:    totalPredicted,
      triPredicted: Object.entries(predictions)
        .filter(([mid, p]) => {
          if (typeof p.home !== 'number' || typeof p.away !== 'number') return false;
          return matches.find(m => m.id === mid)?.isTri ?? false;
        })
        .length,
    };
    updateStats(newStats);
    const updatedStats = { ...userStats, ...newStats };
    ACHIEVEMENTS.forEach(a => {
      if (a.check(updatedStats) && !updatedStats.achievements.includes(a.id)) {
        unlockAchievement(a.id);
      }
    });
  }

  const totalPlayable = useMemo(() => matches.filter(m => !m.isPlaceholder).length, [matches]);
  const totalPredicted = useMemo(
    () => Object.values(predictions).filter(p => typeof p.home === 'number' && typeof p.away === 'number').length,
    [predictions],
  );

  // Botón flotante = abrir el picker (el usuario elige qué cartilla exportar)
  function handleSave() {
    if (totalPredicted === 0) {
      showToast('Aún no has pronosticado ningún partido', 'warn');
      return;
    }
    setPickerOpen(true);
  }

  function handlePickerChoose(picked: Match[], label: string) {
    setPickerOpen(false);
    openShareFlow(picked, label);
    launchConfetti();
  }

  return (
    <div className="min-h-screen pb-28 font-sans">
      <DashboardHeader />

      {/* Portada oficial */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div
          className="relative rounded-3xl overflow-hidden border-2 shadow-2xl"
          style={{ borderColor: 'rgba(240,137,37,0.4)' }}
        >
          <Image
            src="/portada.webp"
            alt="El Huevómetro Mundialista — Bio Huevos"
            width={1823}
            height={863}
            className="w-full h-auto block"
            priority
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 space-y-5">
        <FilterTabs totalPlayable={totalPlayable} totalPredicted={totalPredicted} />

        {loading ? (
          <div className="text-center py-12 text-ink/50">
            <Activity className="size-8 mx-auto mb-3 text-bio-300 animate-pulse" strokeWidth={2} />
            <p className="font-display font-semibold">Cargando partidos...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <MatchesList
              matches={matches}
              onShareMatch={handleShareMatch}
              onShareGroup={handleShareGroup}
            />
          </div>
        )}

        {/* Premios — imagen oficial del podio */}
        <section
          className="rounded-3xl overflow-hidden border-2 shadow-2xl mt-8"
          style={{
            borderColor: 'rgba(240,137,37,0.4)',
            background: 'linear-gradient(180deg, var(--color-bg-2) 0%, var(--color-bg-1) 100%)',
          }}
        >
          <div className="text-center pt-8 px-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-bio-500/20 text-bio-300 font-display font-bold text-sm uppercase tracking-widest border border-bio-500/40">
              Premios del torneo
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mt-4 tracking-tight">
              Subí al <span className="text-bio-400">podio</span>
            </h2>
            <p className="text-bio-200/80 text-base md:text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
              Los tres con más aciertos al final del Mundial ganan kits de Bio Huevos.
            </p>
          </div>
          <Image
            src="/premios.webp"
            alt="Podio de premios — Bio Huevos"
            width={1254}
            height={1254}
            className="w-full max-w-2xl mx-auto h-auto block mt-4"
          />
          <div className="text-center px-6 pb-8">
            <p className="text-bio-100 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Subí tu cartilla a tu historia de Instagram y etiquetá{' '}
              <strong className="text-bio-300">@biohuevos_ec</strong> para participar.
            </p>
          </div>
        </section>

        <InfoDrawer onOpenRules={() => setRulesOpen(true)} />
      </main>

      <SaveButton onSave={handleSave} onOpenRules={() => setRulesOpen(true)} />

      <MusicPlayer />

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />

      <RulesModal         open={rulesOpen}      onClose={() => setRulesOpen(false)} />
      <OnboardingModal    open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
      <ProfileCaptureModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onComplete={handleProfileComplete}
        picksCount={shareMatches?.length ?? totalPredicted}
      />
      <ShareCardModal
        open={shareOpen}
        onClose={() => { setShareOpen(false); setShareMatches(null); }}
        matches={shareMatches}
        title={shareTitle}
        onShared={showToast}
      />
      <CartillaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        matches={matches}
        onPick={handlePickerChoose}
      />
    </div>
  );
}

function launchConfetti() {
  if (typeof document === 'undefined') return;
  const colors = ['#F08925', '#FB9230', '#FFC684', '#FFE0B5', '#FFE48A'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)]!;
    piece.style.animationDelay = Math.random() * .3 + 's';
    piece.style.animationDuration = (2 + Math.random() * 1.5) + 's';
    piece.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}
