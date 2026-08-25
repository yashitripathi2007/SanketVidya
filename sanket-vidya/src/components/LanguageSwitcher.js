"use client";
import { useLocale } from "@/lib/localeContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const options = [
    { key: "en", label: "EN" },
    { key: "hi", label: "हि" },
    { key: "gu", label: "ગુ" },
  ];

  return (
    <div 
      style={{ 
        display: "inline-flex", 
        background: "rgba(255,255,255,0.08)", 
        borderRadius: "var(--radius-full)", 
        padding: 4,
        border: "1px solid rgba(255,255,255,0.15)"
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
              height: 38,
              minWidth: 44,
              padding: "0 12px",
              borderRadius: "var(--radius-full)",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              transition: "all var(--transition)",
              background: isActive ? "var(--accent)" : "transparent",
              color: "#fff",
              boxShadow: isActive ? "var(--shadow-sm)" : "none",
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
