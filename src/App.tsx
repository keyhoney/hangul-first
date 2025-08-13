import React from "react";
import { NavLink, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { unlockAudio } from "./core/audio";

function App(): React.JSX.Element {
  const element = useRoutes(routes);
  const [audioModalOpen, setAudioModalOpen] = React.useState(true);

  const closeAndUnlock = React.useCallback(() => {
    unlockAudio();
    setAudioModalOpen(false);
    try { navigator.vibrate?.(50); } catch {}
  }, []);

  return (
    <div className="app-root">
      <header className="app-header" role="banner">
        <h1 style={{ margin: 0, fontSize: 20 }}>한글 첫걸음</h1>
      </header>

      <main className="app-main" role="main" aria-live="polite">
        <React.Suspense fallback={<div>불러오는 중…</div>}>{element}</React.Suspense>
      </main>

      <footer className="app-footer" role="contentinfo">
        <nav className="app-tabs" role="navigation" aria-label="주요 탭">
          <NavLink
            to="/"
            end
            className="tab"
            title="홈"
            aria-label="홈"
          >
            홈
          </NavLink>
          <NavLink
            to="/play/listen-match"
            className="tab"
            title="학습"
            aria-label="학습"
          >
            학습
          </NavLink>
          <NavLink
            to="/rewards"
            className="tab"
            title="보상"
            aria-label="보상"
          >
            보상
          </NavLink>
          <NavLink
            to="/about"
            className="tab"
            title="정보"
            aria-label="정보"
          >
            정보
          </NavLink>
        </nav>
      </footer>

      {audioModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="오디오 활성화 안내"
          className="modal"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
          onClick={closeAndUnlock}
        >
          <div
            style={{
              maxWidth: 420,
              width: "100%",
              background: "white",
              color: "#111827",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, fontSize: 18 }}>오디오 활성화</h2>
            <p style={{ marginBottom: 16 }}>
              iOS 및 일부 브라우저에서는 첫 사용자 제스처 이후에만 소리 재생이 가능합니다.
              아래 버튼을 눌러 오디오를 활성화해 주세요.
            </p>
            <button
              type="button"
              onClick={closeAndUnlock}
              title="오디오 활성화"
              aria-label="오디오 활성화"
              style={{
                minHeight: 48,
                padding: "12px 16px",
                borderRadius: 12,
                background: "#2563eb",
                color: "white",
                border: "none",
                width: "100%",
                fontSize: 16,
                cursor: "pointer",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  closeAndUnlock();
                }
              }}
            >
              오디오 활성화하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


