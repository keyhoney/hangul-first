import React from "react";
import stickersData from "../data/stickers.json";
import { resolveImage } from "../assets/images";
import { getItem, setItem } from "../core/storage";
import { useStore } from "../core/useStore";

type Sticker = { id: string; img: string; name?: string };
type Pos = { x: number; y: number };

const ALL_STICKERS = stickersData as Sticker[];
const POS_KEY = "stickers/positions";
const UNLOCK_KEY = "stickers/unlocked";
const ELIGIBLE_MS = 10 * 60 * 1000; // 10분

const Rewards: React.FC = () => {
  const { progress, actions } = useStore();
  const [positions, setPositions] = React.useState<Record<string, Pos>>(
    () => getItem<Record<string, Pos>>(POS_KEY) ?? {}
  );
  const [unlocked, setUnlocked] = React.useState<string[]>(
    () => getItem<string[]>(UNLOCK_KEY, []) ?? []
  );
  const [live, setLive] = React.useState("");
  const [startAt] = React.useState<number>(() => Date.now());
  const [now, setNow] = React.useState<number>(() => Date.now());

  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const msElapsed = now - startAt;
  const canUnlockByTime = msElapsed >= ELIGIBLE_MS;
  const hasLocked = unlocked.length < ALL_STICKERS.length;
  const canUnlock = !progress.todayStickerClaimed && hasLocked && (canUnlockByTime);

  const savePositions = (next: Record<string, Pos>) => {
    setPositions(next);
    setItem(POS_KEY, next);
  };
  const saveUnlocked = (next: string[]) => {
    setUnlocked(next);
    setItem(UNLOCK_KEY, next);
  };

  const unlockOne = () => {
    if (!canUnlock) return;
    const nextSticker = ALL_STICKERS.find((s) => !unlocked.includes(s.id));
    if (!nextSticker) return;
    const next = [...unlocked, nextSticker.id];
    saveUnlocked(next);
    actions.claimDailySticker();
    try { navigator.vibrate?.(50); } catch {}
    setLive("스티커 잠금 해제됨");
  };

  const canvasRef = React.useRef<HTMLDivElement | null>(null);
  const draggingRef = React.useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const onPointerDown = (id: string, e: React.PointerEvent<HTMLButtonElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const curr = positions[id] ?? { x: 8, y: 8 };
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    draggingRef.current = { id, offsetX: pointerX - curr.x, offsetY: pointerY - curr.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = draggingRef.current;
    const canvas = canvasRef.current;
    if (!d || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - d.offsetX;
    const y = e.clientY - rect.top - d.offsetY;
    const next = { ...positions, [d.id]: { x: Math.max(0, x), y: Math.max(0, y) } };
    setPositions(next);
  };
  const onPointerUp = () => {
    if (draggingRef.current) {
      savePositions(positions);
    }
    draggingRef.current = null;
  };

  const moveByKeyboard = (id: string, dx: number, dy: number) => {
    const curr = positions[id] ?? { x: 8, y: 8 };
    const next = { ...positions, [id]: { x: curr.x + dx, y: curr.y + dy } };
    savePositions(next);
  };

  return (
    <section aria-label="스티커북" style={{ display: "grid", gap: 16 }}>
      <div role="status" aria-live="polite" style={{ position: "absolute", left: -9999 }}>{live}</div>

      <header style={{ display: "grid", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>스티커</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 14 }}>
          <span>오늘 잠금 해제: {progress.todayStickerClaimed ? "완료" : "대기"}</span>
          <span>보유: {unlocked.length} / {ALL_STICKERS.length}</span>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ height: 8, background: "#e5e7eb", borderRadius: 9999 }} aria-hidden>
            <div
              style={{
                width: `${Math.min(100, Math.round((msElapsed / ELIGIBLE_MS) * 100))}%`,
                height: 8,
                background: canUnlock ? "#22c55e" : "#94a3b8",
                borderRadius: 9999,
                transition: "width 300ms ease",
              }}
            />
          </div>
          <small>
            {canUnlock ? "잠금 해제 가능" : `잠금 해제까지 ${(Math.max(0, ELIGIBLE_MS - msElapsed) / 1000).toFixed(0)}초`}
          </small>
        </div>
        <button
          type="button"
          onClick={unlockOne}
          disabled={!canUnlock}
          aria-label="오늘의 스티커 받기"
          title="오늘의 스티커 받기"
          style={{
            minHeight: 48,
            padding: "12px 16px",
            borderRadius: 12,
            background: canUnlock ? "#22c55e" : "#9ca3af",
            color: "white",
            border: "none",
            cursor: canUnlock ? "pointer" : "not-allowed",
            width: "fit-content",
          }}
        >
          오늘의 스티커 받기
        </button>
      </header>

      <div style={{ display: "grid", gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>스티커 목록</h3>
        <div role="list" aria-label="보유 스티커" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ALL_STICKERS.map((s) => {
            const isUnlocked = unlocked.includes(s.id);
            return (
              <div key={s.id} role="listitem" style={{ display: "grid", gap: 4, placeItems: "center" }}>
                <img src={resolveImage(s.img)} alt={s.name ?? `스티커 ${s.id}`} width={40} height={40} style={{ opacity: isUnlocked ? 1 : 0.3 }} />
                <small aria-hidden>{isUnlocked ? "해제" : "잠김"}</small>
              </div>
            );
          })}
        </div>
      </div>

      <div
        ref={canvasRef}
        role="region"
        aria-label="스티커 배치 캔버스"
        style={{
          position: "relative",
          minHeight: 240,
          border: "2px dashed #cbd5e1",
          borderRadius: 12,
          background: "#f8fafc",
        }}
      >
        {unlocked.map((id) => {
          const s = ALL_STICKERS.find((x) => x.id === id)!;
          const p = positions[id] ?? { x: 8, y: 8 };
          return (
            <button
              key={id}
              type="button"
              aria-label={`${s.name ?? `스티커 ${id}`} 이동`}
              title={`${s.name ?? `스티커 ${id}`} 이동`}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                border: "none",
                background: "transparent",
                padding: 0,
                touchAction: "none",
              }}
              onPointerDown={(e) => onPointerDown(id, e)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onKeyDown={(e) => {
                const STEP = 5;
                if (e.key === "ArrowLeft") { e.preventDefault(); moveByKeyboard(id, -STEP, 0); }
                if (e.key === "ArrowRight") { e.preventDefault(); moveByKeyboard(id, STEP, 0); }
                if (e.key === "ArrowUp") { e.preventDefault(); moveByKeyboard(id, 0, -STEP); }
                if (e.key === "ArrowDown") { e.preventDefault(); moveByKeyboard(id, 0, STEP); }
              }}
            >
              <img src={resolveImage(s.img)} alt="" aria-hidden width={48} height={48} />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Rewards;


