"use client";
import { MODULES } from "@/lib/mockData";
import { useTranslations } from "next-intl";

// Circular SVG progress ring
export function ProgressRing({ percent = 0, size = 80, stroke = 7, color = "#1B2A6B", label }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth={stroke} />
        {/* Fill */}
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 2px ${color}88)` }}
        />
      </svg>
      {label && <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)" }}>{label}</span>}
    </div>
  );
}

// Full report card for a student
export default function ReportCard({ studentName, moduleScores = {}, totalAttempts = 0, lastActive }) {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");

  const formatDate = (iso) => {
    if (!iso) return tCommon("never");
    // Show short date
    try {
      return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return iso;
    }
  };

  const overall = MODULES.length > 0
    ? Math.round(MODULES.reduce((sum, m) => sum + (moduleScores[m.key] || 0), 0) / MODULES.length)
    : 0;

  return (
    <div>
      {/* Student header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "20px 24px",
        background: "var(--primary)",
        borderRadius: "var(--radius-lg)",
        color: "#FFFFFF",
        boxShadow: "var(--shadow-sm)",
        marginBottom: 20,
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 800,
          color: "#FFFFFF",
          flexShrink: 0,
        }}>
          {studentName?.[0]?.toUpperCase() || "S"}
        </div>
        <div style={{ flex: 1 }}>
          <div className="font-display" style={{ fontWeight: 800, fontSize: 20 }}>{studentName || "Student"}</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 2 }}>
            {totalAttempts} {tCommon("attempts")} · {tCommon("lastActive")} {formatDate(lastActive)}
          </div>
        </div>
        <div style={{ textAlign: "center", background: "rgba(255,255,255,0.15)", padding: "8px 16px", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)" }}>
            {overall}%
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase" }}>{tCommon("overall")}</div>
        </div>
      </div>

      {/* Module rings */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 12,
        padding: "20px",
        background: "var(--bg-card)",
        borderRadius: "var(--radius-lg)",
        border: "1.5px solid var(--border)",
        boxShadow: "var(--shadow-xs)",
      }}>
        {MODULES.map((m) => {
          const score = moduleScores[m.key] || 0;
          const modColor = `var(--mod-${m.key})`;
          return (
            <div key={m.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <ProgressRing percent={score} size={64} stroke={6} color={modColor} />
              <span style={{ fontSize: 22 }} role="img" aria-label={m.labelEn}>{m.emoji}</span>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                }}>{tNav(m.key)}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: modColor }}>{score}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
