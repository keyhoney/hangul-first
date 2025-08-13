import React from "react";
import vowelsData from "../../data/vowels.json";
import { VowelItem } from "../../core/types";
import { speak } from "../../core/audio";
import AudioButton from "../../components/AudioButton";

const vowels = (vowelsData as VowelItem[]).map((v) => v.sound);
const uniqueSounds = Array.from(new Set(vowels));

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

const RevealLetter: React.FC = () => {
  const [idx, setIdx] = React.useState(0);
  const sound = uniqueSounds[idx % uniqueSounds.length];
  const [live, setLive] = React.useState("");

  React.useEffect(() => {
    (async () => {
      await delay(100);
      await speak(sound);
      setLive(`${sound} 소리`);
    })();
  }, [sound]);

  const next = () => {
    setIdx((i) => (i + 1) % uniqueSounds.length);
    setLive("다음 글자");
  };

  return (
    <section aria-label="글자 모양 보기" style={{ display: "grid", gap: 16, placeItems: "center" }}>
      <div role="status" aria-live="polite" style={{ position: "absolute", left: -9999 }}>{live}</div>

      <style>{`
        .glyph-wrap { width: 240px; height: 240px; display: grid; place-items: center; }
        .layer { font-size: 180px; font-weight: 800; }
        .dash { fill: none; stroke: #111827; stroke-width: 10px; stroke-dasharray: 16 12; }
        .solid { fill: #111827; }

        @keyframes reveal {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes fillin {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .play-dash { animation: reveal 900ms ease-out forwards; }
        .play-solid { animation: fillin 900ms ease-out forwards; animation-delay: 300ms; }

        @media (prefers-reduced-motion: reduce) {
          .play-dash, .play-solid { animation: none !important; }
        }
      `}</style>

      <div className="glyph-wrap" aria-hidden="true">
        <svg viewBox="0 0 300 300" width="240" height="240" role="img" aria-label={`${sound} 글자`}>
          {/* 점선 레이어 (외곽선 텍스트) */}
          <text x="50%" y="60%" textAnchor="middle" className="layer dash play-dash">{sound}</text>
          {/* 실선 레이어 (채워진 텍스트) */}
          <text x="50%" y="60%" textAnchor="middle" className="layer solid play-solid">{sound}</text>
        </svg>
      </div>

      <button
        type="button"
        onClick={next}
        title="다 봤어요"
        aria-label="다 봤어요"
        style={{
          minHeight: 48,
          padding: "12px 16px",
          borderRadius: 12,
          background: "#2563eb",
          color: "white",
          border: "none",
          fontSize: 16,
          cursor: "pointer",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            next();
          }
        }}
      >
        다 봤어요
      </button>

      <AudioButton text={sound} />
    </section>
  );
};

export default RevealLetter;


