import React from "react";
import { RouteObject, Link } from "react-router-dom";
import { useStore } from "./core/useStore";
import { speak } from "./core/audio";
import stickers from "./data/stickers.json";
import Rewards from "./pages/Rewards";
import About from "./pages/About";

const ListenMatch = React.lazy(() => import("./games/listen-match"));
const PictureAudio = React.lazy(() => import("./games/picture-audio"));
const RevealLetter = React.lazy(() => import("./games/reveal-letter"));
const MergeBlocks = React.lazy(() => import("./games/merge-blocks"));

const Home: React.FC = () => {
  const { progress, actions, selectors } = useStore();
  const accuracy = selectors.recentAccuracy();
  const todaySticker = (stickers as { id: string; img: string }[])[0];

  const Card: React.FC<{ to: string; label: string; desc: string }> = ({ to, label, desc }) => (
    <div style={{ border: "2px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>{label}</strong>
        <button
          type="button"
          onClick={() => speak(label + ". " + desc)}
          aria-label={`${label} 설명 듣기`}
          title={`${label} 설명 듣기`}
          style={{ minHeight: 40, minWidth: 40, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}
        >
          🔊
        </button>
      </div>
      <p style={{ margin: 0, fontSize: 14 }}>{desc}</p>
      <Link
        to={to}
        role="button"
        aria-label={`${label} 시작하기`}
        title={`${label} 시작하기`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 48,
          padding: "12px 16px",
          borderRadius: 12,
          background: "#2563eb",
          color: "white",
          textDecoration: "none",
          width: "fit-content",
        }}
      >
        시작하기
      </Link>
    </div>
  );

  const rec = useStore.getState().selectors.recommendation();
  return (
    <section aria-label="홈" style={{ display: "grid", gap: 16 }}>
      {/* 진행 개요 */}
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>오늘의 진행</h2>
        <div style={{ display: "flex", gap: 12, fontSize: 14 }}>
          <span aria-label="정답 수">정답 {progress.correct}</span>
          <span aria-label="오답 수">오답 {progress.wrong}</span>
          <span aria-label="최근 정확도">최근 정확도 {accuracy}%</span>
        </div>
      </div>

      {/* 게임 카드 4개 */}
      <div role="list" aria-label="학습 카드" style={{ display: "grid", gap: 12 }}>
        <div role="listitem">
          <Card to="/play/listen-match" label="단모음 소리 구분" desc="소리를 듣고 알맞은 모음을 골라요." />
        </div>
        <div role="listitem">
          <Card to="/play/picture-audio" label="그림과 소리" desc="듣고 알맞은 그림을 찾아요." />
        </div>
        <div role="listitem">
          <Card to="/play/reveal-letter" label="글자 모양 보기" desc="소리와 글자 모양을 연결해요." />
        </div>
        <div role="listitem">
          <Card to="/play/merge-blocks" label="블록 합치기" desc="순서대로 눌러 글자를 만들어요." />
        </div>
      </div>

      {/* 추천 다음 활동 */}
      {rec && (
        <div style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>추천</h3>
          <Link to={rec.to} className="tab" aria-label={`추천: ${rec.label}`} title={`추천: ${rec.label}`}>
            추천: {rec.label}
          </Link>
        </div>
      )}

      {/* 오늘의 스티커 */}
      <div style={{ display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>오늘의 스티커</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={todaySticker.img} alt="오늘의 스티커" width={48} height={48} />
          {progress.todayStickerClaimed ? (
            <span aria-live="polite">오늘 스티커를 받았어요!</span>
          ) : (
            <button
              type="button"
              onClick={() => actions.claimDailySticker()}
              aria-label="오늘의 스티커 받기"
              title="오늘의 스티커 받기"
              style={{
                minHeight: 48,
                padding: "12px 16px",
                borderRadius: 12,
                background: "#22c55e",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              받기
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/play/listen-match", element: <ListenMatch /> },
  { path: "/play/picture-audio", element: <PictureAudio /> },
  { path: "/play/reveal-letter", element: <RevealLetter /> },
  { path: "/play/merge-blocks", element: <MergeBlocks /> },
  { path: "/rewards", element: <Rewards /> },
  { path: "/about", element: <About /> },
];


