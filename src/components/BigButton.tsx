import React from "react";

type BigButtonProps = {
  label: string;
  title?: string;
  icon?: React.ReactNode;
  shape?: "circle" | "rect";
  onClick?: () => void;
};

const BigButton: React.FC<BigButtonProps> = React.memo(({ label, title, icon, shape = "rect", onClick }) => {
  const radius = shape === "circle" ? 9999 : 12;
  return (
    <button
      type="button"
      onClick={onClick}
      title={title ?? label}
      aria-label={label}
      className="big-btn"
      style={{
        minWidth: 112,
        minHeight: 56,
        padding: "12px 16px",
        borderRadius: radius,
        border: "2px solid transparent",
        background: "#1976d2",
        color: "white",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontSize: 18,
        cursor: "pointer",
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
});

export default BigButton;


