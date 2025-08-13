import React from "react";
import wordsData from "../../data/words.json";
import { PictureAudioItem } from "../../core/types";
import { speak } from "../../core/audio";
import { useStore } from "../../core/useStore";
import StarReward from "../../components/StarReward";
import AudioButton from "../../components/AudioButton";
import { resolveImage } from "../../assets/images";
import { Link } from "react-router-dom";

const items = wordsData as PictureAudioItem[];

function getShuffledIndices(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

const SET_SIZE = 5;

const PictureAudio: React.FC = () => {
  const { actions } = useStore();
  const orderRef = React.useRef<number[]>(getShuffledIndices(items.length));
  const [round, setRound] = React.useState(0);
  const [shakeIdx, setShakeIdx] = React.useState<number | null>(null);
  const [live, setLive] = React.useState("");
  const [setCorrect, setSetCorrect] = React.useState(0);
  const wrongIdsRef = React.useRef<string[]>([]);
  const done = round >= SET_SIZE;

  const current = items[orderRef.current[round % items.length]];

  React.useEffect(() => {
    if (!done) speak(current.audioText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, done]);

  const onPick = async (optIdx: number) => {
    if (done) return;
    const opt = current.options[optIdx];
    const isCorrect = !!opt.correct;
    actions.recordResult(current.id, isCorrect);
    if (isCorrect) {
      setLive("정답");
      setSetCorrect((c) => c + 1);
      await delay(500);
      setRound((r) => r + 1);
    } else {
      wrongIdsRef.current.push(current.id);
      try { navigator.vibrate?.(50); } catch {}
      setLive("오답");
      setShakeIdx(optIdx);
      await delay(350);
      setShakeIdx(null);
      // 오답 시 힌트로 한 번 더 읽어주기
      await speak(current.audioText);
    }
  };

  if (done) {
    const accuracy = Math.round((setCorrect / SET_SIZE) * 100);
    // 적응 추천 적용
    actions.applyAdaptationAfterSet({
      wrongItemIds: wrongIdsRef.current,
      fallbackTo: "/play/picture-audio",
      activityName: "그림과 소리",
    });
    return (
      <section aria-label="세트 결과" style={{ display: "grid", gap: 16 }}>
        <div aria-live="polite" style={{ position: "absolute", left: -9999 }}>{live}</div>
        <h2 style={{ margin: 0 }}>결과 요약</h2>
        <p style={{ margin: 0 }}>정확도: {accuracy}% ({setCorrect}/{SET_SIZE})</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <StarReward count={Math.max(1, Math.round((accuracy / 100) * 3))} />
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <Link to="/play/reveal-letter" className="tab" aria-label="다음 활동: 글자 모양" title="다음 활동: 글자 모양">
            다음 활동: 글자 모양
          </Link>
          <Link to="/play/listen-match" className="tab" aria-label="다시하기: 단모음 소리" title="다시하기: 단모음 소리">
            다시하기: 단모음 소리
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="그림과 소리 매칭" style={{ display: "grid", gap: 16 }}>
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
          100% { transform: translateX(0); }
        }
        .shake { animation: shake 300ms ease; }
      `}</style>

      <div role="status" aria-live="polite" style={{ position: "absolute", left: -9999 }}>{live}</div>

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 14 }}>문항 {round + 1} / {SET_SIZE}</span>
        </div>
        <button
          type="button"
          onClick={() => speak(current.audioText)}
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
          🔊
        </button>
      </header>

      <div
        role="list"
        aria-label="그림 선택지"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
        }}
      >
        {current.options.map((opt, idx) => (
          <button
            key={idx}
            role="listitem"
            type="button"
            onClick={() => onPick(idx)}
            aria-label={opt.correct ? "정답 후보" : "오답 후보"}
            title={opt.correct ? "정답 후보" : "오답 후보"}
            className={shakeIdx === idx ? "shake" : undefined}
            style={{
              minHeight: 96, // ≥48px 충분
              padding: 8,
              borderRadius: 12,
              border: "2px solid #e5e7eb",
              background: "#fff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPick(idx);
              }
            }}
          >
            {/* 이미지는 public 경로 기준 상대 참조 */}
            <img src={resolveImage(opt.img)} alt="" aria-hidden="true" style={{ width: 96, height: 96 }} />
          </button>
        ))}
      </div>

      <AudioButton text={current.audioText} />
    </section>
  );
};

export default PictureAudio;


