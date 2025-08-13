import React from "react";
import { speak } from "../../core/audio";
import { useStore } from "../../core/useStore";

function delay(ms: number): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }

const ONSET = "ㅇ";
const NUCLEUS = "ㅏ";

const MergeBlocks: React.FC = () => {
  const { actions } = useStore();
  const [step, setStep] = React.useState<0 | 1 | 2>(0); // 0: onset, 1: nucleus, 2: done
  const [live, setLive] = React.useState("");
  const [wrongHint, setWrongHint] = React.useState(false);

  const composed = step === 2 ? "아" : "·"; // 미리보기 (완료 시 "아")

  const onPick = async (symbol: string) => {
    if (step === 2) return;
    if (step === 0) {
      if (symbol === ONSET) {
        setStep(1);
        setLive("첫 번째 성공");
      } else {
        setLive("순서가 달라요. 먼저 ㅇ");
        try { navigator.vibrate?.(50); } catch {}
        setWrongHint(true);
        await delay(500);
        setWrongHint(false);
      }
      return;
    }
    if (step === 1) {
      if (symbol === NUCLEUS) {
        setStep(2);
        setLive("정답");
        actions.recordResult("merge-아", true);
        await speak("아");
      } else {
        setLive("순서가 달라요. 다음은 ㅏ");
        try { navigator.vibrate?.(50); } catch {}
        setWrongHint(true);
        await delay(500);
        setWrongHint(false);
      }
    }
  };

  const reset = () => {
    setStep(0);
    setLive("다시 시도");
  };

  return (
    <section aria-label="블록 합치기" style={{ display: "grid", gap: 16 }}>
      <style>{`
        .block {
          min-height: 56px; /* ≥48px */
          min-width: 56px;
          padding: 12px 16px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          background: #ffffff;
          font-size: 28px;
          cursor: pointer;
        }
        .hint {
          position: absolute;
          top: -8px; right: -8px;
          width: 24px; height: 24px;
          border-radius: 9999px;
          background: #2563eb; color: #fff;
          display: grid; place-items: center;
          font-size: 14px;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .pulse { animation: pulse 600ms ease; }
      `}</style>

      <div aria-live="polite" style={{ position: "absolute", left: -9999 }}>{live}</div>

      <header>
        <h2 style={{ margin: 0, fontSize: 18 }}>순서대로 눌러 "아" 만들기</h2>
        <p style={{ margin: 0, fontSize: 14 }}>1단계: ㅇ → 2단계: ㅏ</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="block"
            onClick={() => onPick(ONSET)}
            title="첫 번째: ㅇ"
            aria-label="첫 번째: ㅇ"
            aria-pressed={step > 0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(ONSET); }
            }}
          >
            {ONSET}
          </button>
          <span className={`hint ${wrongHint ? "pulse" : ""}`} aria-hidden>1</span>
        </div>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="block"
            onClick={() => onPick(NUCLEUS)}
            title="두 번째: ㅏ"
            aria-label="두 번째: ㅏ"
            aria-pressed={step === 2}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(NUCLEUS); }
            }}
          >
            {NUCLEUS}
          </button>
          <span className={`hint ${wrongHint ? "pulse" : ""}`} aria-hidden>2</span>
        </div>
      </div>

      <div
        role="status"
        aria-label="결과 미리보기"
        style={{
          minHeight: 80,
          borderRadius: 12,
          border: "2px solid #e5e7eb",
          background: "#f9fafb",
          display: "grid",
          placeItems: "center",
          fontSize: 48,
        }}
      >
        {composed}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={reset}
          title="다시"
          aria-label="다시"
          style={{
            minHeight: 48,
            padding: "12px 16px",
            borderRadius: 12,
            background: "#e5e7eb",
            border: "none",
            cursor: "pointer",
          }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reset(); } }}
        >
          다시
        </button>

        <button
          type="button"
          onClick={() => speak("아")}
          title="듣기"
          aria-label="듣기"
          style={{
            minHeight: 48,
            padding: "12px 16px",
            borderRadius: 12,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); speak("아"); } }}
        >
          🔊
        </button>
      </div>
    </section>
  );
};

export default MergeBlocks;


