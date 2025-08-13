import React from "react";
import vowelsData from "../../data/vowels.json";
import { VowelItem } from "../../core/types";
import { speak } from "../../core/audio";
import { useStore } from "../../core/useStore";
import StarReward from "../../components/StarReward";
import AudioButton from "../../components/AudioButton";

const vowels = vowelsData as VowelItem[];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

const ListenMatch: React.FC = () => {
  const { actions, selectors } = useStore();
  const recentAccuracy = selectors.recentAccuracy();

  const [current, setCurrent] = React.useState<VowelItem>(() => getRandomItem(vowels));
  const [feedback, setFeedback] = React.useState<"idle" | "correct" | "wrong">("idle");
  const [live, setLive] = React.useState("");
  const wrongIdsRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    // 라운드 시작 시 정답 소리 재생
    speak(current.sound);
  }, [current]);

  const onChoice = async (choice: string) => {
    if (feedback !== "idle") return;
    const isCorrect = choice === current.sound;
    useStore.getState().actions.recordResult(current.id, isCorrect);

    if (isCorrect) {
      setFeedback("correct");
      setLive("정답");
      await delay(600);
      setFeedback("idle");
      setCurrent(getRandomItem(vowels));
    } else {
      wrongIdsRef.current.push(current.id);
      try { navigator.vibrate?.(50); } catch {}
      setFeedback("wrong");
      setLive("오답");
      // 느린 TTS 반복: 간단히 2회 반복 재생으로 구현
      await speak(current.sound);
      await delay(250);
      await speak(current.sound);
      setFeedback("idle");
    }
  };

  React.useEffect(() => {
    // 간략: 매 5문항 이후 적응 추천 업데이트 (정교한 세트 구분은 추후 확장)
    const total = useStore.getState().progress.correct + useStore.getState().progress.wrong;
    if (total > 0 && total % 5 === 0) {
      useStore.getState().actions.applyAdaptationAfterSet({
        wrongItemIds: wrongIdsRef.current,
        fallbackTo: "/play/listen-match",
        activityName: "단모음 소리 구분",
      });
      wrongIdsRef.current = [];
    }
  });

  return (
    <section aria-label="단모음 듣고 맞추기" style={{ display: "grid", gap: 16 }}>
      <div aria-live="polite" style={{ position: "absolute", left: -9999 }}>{live}</div>

      <header style={{ display: "grid", gap: 8 }}>
        <div style={{ height: 8, background: "#e5e7eb", borderRadius: 9999 }} aria-hidden>
          <div
            style={{
              width: `${recentAccuracy}%`,
              height: 8,
              background: "#22c55e",
              borderRadius: 9999,
              transition: "width 300ms ease",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
          <span>최근 정확도: {recentAccuracy}%</span>
          <button
            type="button"
            onClick={() => speak(current.sound)}
            aria-label="다시 듣기"
            title="다시 듣기"
            style={{
              minHeight: 40,
              padding: "8px 12px",
              borderRadius: 8,
              background: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            🔊 다시 듣기
          </button>
        </div>
      </header>

      <div
        role="group"
        aria-label="선택지"
        style={{ display: "grid", gap: 12 }}
      >
        {current.choices.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChoice(c)}
            title={`${c} 선택`}
            aria-label={`${c} 선택`}
            className="big-btn"
            style={{
              minHeight: 56, // ≥48px
              borderRadius: 12,
              border: "2px solid #e5e7eb",
              background: "#ffffff",
              fontSize: 24,
              padding: "12px 16px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChoice(c);
              }
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {feedback === "correct" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StarReward count={3} />
          <span role="status" aria-live="polite">잘했어요!</span>
        </div>
      )}

      <AudioButton text={current.sound} />
    </section>
  );
};

export default ListenMatch;


