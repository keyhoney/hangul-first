import React from "react";

type StarRewardProps = { count: number };

const StarReward: React.FC<StarRewardProps> = React.memo(({ count }) => {
  return (
    <div aria-live="polite" style={{ display: "flex", gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: 24,
            height: 24,
            background: "gold",
            clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            animation: "pop 600ms ease-out both",
            animationDelay: `${i * 80}ms`,
          }}
        />
      ))}
      <style>{`
        @keyframes pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          span { animation: none !important; }
        }
      `}</style>
    </div>
  );
});

export default StarReward;


