"use client";
import { useLocale } from "@/lib/localeContext";

export default function LanguageSwitcher({ theme = "auto" }) {
  const { locale, setLocale } = useLocale();

  const options = [
    { key: "en", label: "EN" },
    { key: "hi", label: "हि" },
    { key: "gu", label: "ગુ" },
  ];

  const isLight = theme === "light";

  return (
    <div 
      style={{ 
        display: "inline-flex", 
        background: isLight ? "#FFFFFF" : "rgba(255, 255, 255, 0.12)", 
        borderRadius: "var(--radius-full)", 
        padding: 4,
        border: isLight ? "1.5px solid var(--border)" : "1px solid rgba(255, 255, 255, 0.22)",
        boxShadow: isLight ? "var(--shadow-xs)" : "0 2px 8px rgba(0,0,0,0.15)",
      }}
      role="group"
      aria-label="Language Selector"
    >
      {options.map((opt) => {
        const isActive = locale === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => setLocale(opt.key)}
            style={{
              height: 36,
              minWidth: 42,
              padding: "0 14px",
              borderRadius: "var(--radius-full)",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              transition: "all var(--transition)",
              background: isActive 
                ? "linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)" 
                : "transparent",
              color: isActive ? "#FFFFFF" : (isLight ? "var(--text-primary)" : "#FFFFFF"),
              boxShadow: isActive ? "0 2px 10px rgba(249, 115, 22, 0.4)" : "none",
            }}
            aria-current={isActive ? "true" : "false"}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
