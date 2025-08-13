import React from "react";
import { speak } from "../core/audio";

type AudioButtonProps = {
  text: string;
};

const AudioButton: React.FC<AudioButtonProps> = React.memo(({ text }) => {
  const [busy, setBusy] = React.useState(false);
  return (
    <button
      type="button"
      className="audio-btn"
      onClick={async () => {
        if (busy) return;
        setBusy(true);
        try {
          await speak(text);
        } finally {
          setBusy(false);
        }
      }}
      aria-label="다시 듣기"
      title="다시 듣기"
      aria-pressed={busy}
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        minHeight: 56,
        minWidth: 56,
        borderRadius: 9999,
        background: "#2e7d32",
        color: "white",
        border: "none",
        padding: "12px 16px",
        fontSize: 16,
        cursor: "pointer",
      }}
    >
      {busy ? "재생 중… 🔊" : "다시 듣기 🔊"}
    </button>
  );
});

export default AudioButton;


