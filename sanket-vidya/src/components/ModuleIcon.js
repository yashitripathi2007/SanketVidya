"use client";
import { useTranslations } from "next-intl";

const MODULE_CONFIG = {
  alphabets: { emoji: "🔤", color: "var(--mod-alphabets)", bg: "rgba(79,70,229,0.08)"  },
  numbers:   { emoji: "🔢", color: "var(--mod-numbers)",   bg: "rgba(217,119,6,0.08)"  },
  words:     { emoji: "💬", color: "var(--mod-words)",     bg: "rgba(5,150,105,0.08)"   },
  math:      { emoji: "➕", color: "var(--mod-math)",      bg: "rgba(219,39,119,0.08)"  },
  science:   { emoji: "🔬", color: "var(--mod-science)",   bg: "rgba(8,145,178,0.08)"   },
};

export default function ModuleIcon({ module, size = "md", showLabel = true, onClick }) {
  const t = useTranslations("nav");
  const cfg = MODULE_CONFIG[module] || { emoji: "📚", color: "var(--primary)", bg: "var(--primary-50)" };
  const sizes = { sm: 40, md: 56, lg: 72 };
  const iconSize = sizes[size] || 56;
  const fontSize = { sm: 18, md: 26, lg: 34 }[size] || 26;

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div style={{
        width: iconSize,
        height: iconSize,
        borderRadius: "var(--radius-md)",
        background: cfg.bg,
        border: `2px solid ${cfg.color}44`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        transition: "transform var(--transition), box-shadow var(--transition)",
        boxShadow: "none",
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = `0 4px 16px ${cfg.color}33`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
      >
        <span role="img" aria-label={module}>{cfg.emoji}</span>
      </div>
      {showLabel && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: size === "sm" ? 12 : 14,
            fontWeight: 800,
            color: cfg.color,
          }}>
            {t(module)}
          </div>
        </div>
      )}
    </div>
  );
}
