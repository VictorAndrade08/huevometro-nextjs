import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FilterType, PredictionsMap, UserProfile, UserStats } from '@/types';

interface GameState {
  // === Datos del usuario ===
  predictions:   PredictionsMap;
  userStats:     UserStats;
  userProfile:   UserProfile;
  goldEggOfWeek: string | null;     // matchId con multiplicador
  goldEggLocked: boolean;            // 🔒 Una vez bloqueado, no se puede cambiar
  goldEggIp:     string | null;      // IP fingerprint del usuario
  isGuest:       boolean;

  // === UI / filtros ===
  currentFilter: FilterType;
  openWeeks:     number[];

  // === Acciones predictions ===
  setPrediction:    (matchId: string, home: number | null, away: number | null) => void;
  applyQuickPick:   (matchId: string, home: number, away: number) => void;
  changePrediction: (matchId: string, team: 'home' | 'away', delta: number) => void;
  clearPrediction:  (matchId: string) => void;
  toggleGoldEgg:    (matchId: string) => void;
  lockGoldEgg:      (ip: string | null) => void;

  // === Acciones UI ===
  setFilter:    (filter: FilterType) => void;
  toggleWeek:   (weekId: number) => void;

  // === Acciones usuario ===
  setProfile:   (p: Partial<UserProfile>) => void;
  setIsGuest:   (g: boolean) => void;
  useChip:      (chipId: string) => void;
  incrementShared: () => void;
  unlockAchievement: (id: string) => void;
  updateStats:  (s: Partial<UserStats>) => void;
}

const initialStats: UserStats = {
  predicted: 0, exact: 0, winner: 0, points: 0,
  streak: 0, maxStreak: 0, triPredicted: 0,
  goldEggsUsed: 0, shared: 0, achievements: [],
  chipsUsed: [],
};

const initialProfile: UserProfile = { name: '', ig: '' };

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      predictions:   {},
      userStats:     initialStats,
      userProfile:   initialProfile,
      goldEggOfWeek: null,
      goldEggLocked: false,
      goldEggIp:     null,
      isGuest:       true,
      currentFilter: 'tri',
      openWeeks:     [1],

      setPrediction: (matchId, home, away) => set(state => ({
        predictions: {
          ...state.predictions,
          [matchId]: {
            home,
            away,
            goldEgg: state.predictions[matchId]?.goldEgg ?? false,
          },
        },
      })),

      applyQuickPick: (matchId, home, away) => set(state => ({
        predictions: { ...state.predictions, [matchId]: { home, away } },
      })),

      changePrediction: (matchId, team, delta) => set(state => {
        const current = state.predictions[matchId] ?? { home: 0, away: 0 };
        const currentValue = current[team] ?? 0;
        const nextValue = Math.max(0, Math.min(9, currentValue + delta));
        return {
          predictions: {
            ...state.predictions,
            [matchId]: { ...current, [team]: nextValue },
          },
        };
      }),

      clearPrediction: (matchId) => set(state => {
        const { [matchId]: _removed, ...rest } = state.predictions;
        return { predictions: rest };
      }),

      toggleGoldEgg: (matchId) => set(state => {
        if (state.goldEggLocked) return state;          // 🔒 ya confirmado, no cambia
        return { goldEggOfWeek: state.goldEggOfWeek === matchId ? null : matchId };
      }),

      lockGoldEgg: (ip) => set(state => ({
        goldEggLocked: state.goldEggOfWeek !== null,    // solo bloquea si hay uno elegido
        goldEggIp:     state.goldEggOfWeek !== null ? ip : state.goldEggIp,
      })),

      setFilter: (currentFilter) => set({ currentFilter }),

      toggleWeek: (weekId) => set(state => {
        const isOpen = state.openWeeks.includes(weekId);
        // Acordeón exclusivo: si abrís uno, los demás se cierran.
        return { openWeeks: isOpen ? [] : [weekId] };
      }),

      setProfile: (p) => set(state => ({ userProfile: { ...state.userProfile, ...p } })),
      setIsGuest: (g) => set({ isGuest: g }),

      useChip: (chipId) => set(state => ({
        userStats: { ...state.userStats, chipsUsed: [...state.userStats.chipsUsed, chipId] },
      })),

      incrementShared: () => set(state => ({
        userStats: { ...state.userStats, shared: state.userStats.shared + 1 },
      })),

      unlockAchievement: (id) => set(state => {
        if (state.userStats.achievements.includes(id)) return state;
        return {
          userStats: { ...state.userStats, achievements: [...state.userStats.achievements, id] },
        };
      }),

      updateStats: (s) => set(state => ({ userStats: { ...state.userStats, ...s } })),
    }),
    {
      name: 'huevometro-game-store',
      storage: createJSONStorage(() => localStorage),
      // ⚠ Predictions NO se persisten — cada visita arranca fresca.
      // Solo persistimos perfil, IP del huevo de oro y stats acumulados.
      partialize: (s) => ({
        userStats:     s.userStats,
        userProfile:   s.userProfile,
        goldEggLocked: s.goldEggLocked,
        goldEggIp:     s.goldEggIp,
        isGuest:       s.isGuest,
      }),
    },
  ),
);
