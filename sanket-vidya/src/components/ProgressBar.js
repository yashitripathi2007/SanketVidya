"use client";

export default function ProgressBar({ percent = 0, color = "var(--primary)", height = 8, label, showLabel = true }) {
  return (
    <div style={{ width: "100%" }}>
      {showLabel && label && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
          fontSize: 13,
          fontWeight: 700,
        }}>
          <span style={{ color: "var(--text-secondary)" }}>
            {label}
          </span>
          <span style={{ color, fontWeight: 800 }}>{Math.round(percent)}%</span>
        </div>
      )}
      <div style={{
        height,
        background: "var(--bg-elevated)",
        borderRadius: 999,
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}>
        <div style={{
          height: "100%",
          width: `${Math.min(100, Math.max(0, percent))}%`,
          background: color,
          borderRadius: 999,
          transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 1px 4px ${color}44`,
        }} />
      </div>
    </div>
  );
}
