import { create } from "zustand";
import { getItem, setItem } from "./storage";

type Progress = {
  stage: "A" | "B";
  seenIds: string[];
  correct: number;
  wrong: number;
  todayStickerClaimed: boolean;
};

type StoreState = {
  progress: Progress;
  recentResults: boolean[]; // 최근 10 문제 결과용 고정 길이 배열
  recommendedNext: { to: string; label: string; reviewIds?: string[] } | null;
  actions: {
    reset: () => void;
    recordResult: (itemId: string, isCorrect: boolean) => void;
    claimDailySticker: () => void;
    applyAdaptationAfterSet: (args: { wrongItemIds: string[]; fallbackTo: string; activityName: string }) => void;
  };
  selectors: {
    recentAccuracy: () => number;
    recommendation: () => { to: string; label: string; reviewIds?: string[] } | null;
  };
};

const defaultProgress: Progress = {
  stage: "A",
  seenIds: [],
  correct: 0,
  wrong: 0,
  todayStickerClaimed: false,
};

const STORAGE_KEY = "progress";
const RECENT_KEY = "recentResults";

export const useStore = create<StoreState>((set, get) => {
  // 초기 복원
  const restored = getItem<Progress>(STORAGE_KEY) ?? defaultProgress;
  const restoredRecent = getItem<boolean[]>(RECENT_KEY) ?? [];

  // 파생 계산: 최근 10문제 정확도
  const recentAccuracy = () => {
    const recent = get().recentResults;
    if (recent.length === 0) return 0;
    const correctCount = recent.reduce((acc, v) => acc + (v ? 1 : 0), 0);
    return Math.round((correctCount / recent.length) * 100);
  };

  const setProgress = (next: Progress) => set({ progress: next });

  return {
    progress: restored,
    recentResults: restoredRecent.slice(-10),
    recommendedNext: null,
    actions: {
      reset: () => set({ progress: { ...defaultProgress }, recentResults: [] }),
      recordResult: (itemId, isCorrect) => {
        const current = get().progress;
        const next: Progress = {
          ...current,
          seenIds: current.seenIds.includes(itemId)
            ? current.seenIds
            : [...current.seenIds, itemId],
          correct: isCorrect ? current.correct + 1 : current.correct,
          wrong: isCorrect ? current.wrong : current.wrong + 1,
        };
        const nextRecent = [...get().recentResults, isCorrect].slice(-10);
        set({ progress: next, recentResults: nextRecent });
      },
      claimDailySticker: () => {
        const current = get().progress;
        if (current.todayStickerClaimed) return;
        setProgress({ ...current, todayStickerClaimed: true });
      },
      applyAdaptationAfterSet: ({ wrongItemIds, fallbackTo, activityName }) => {
        const acc = get().selectors.recentAccuracy();
        if (acc >= 80) {
          set({ recommendedNext: { to: fallbackTo, label: `${activityName} 다음 세트(새 모음)` } });
          return;
        }
        if (acc < 60) {
          const uniqueWrong = Array.from(new Set(wrongItemIds)).slice(0, 3);
          set({ recommendedNext: { to: fallbackTo, label: `${activityName} 복습 팩 포함 반복`, reviewIds: uniqueWrong } });
          return;
        }
        set({ recommendedNext: { to: fallbackTo, label: `${activityName} 계속 진행` } });
      },
    },
    selectors: {
      recentAccuracy,
      recommendation: () => get().recommendedNext,
    },
  };
});

// 스토리지 영속화 구독
useStore.subscribe((state) => {
  setItem(STORAGE_KEY, state.progress);
});
useStore.subscribe((state) => {
  setItem(RECENT_KEY, state.recentResults);
});


