"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { getReportCard } from "@/lib/localStorage";
import { MODULES } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ProgressRing } from "@/components/ReportCard";
import { useTranslations } from "next-intl";

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reportCard, setReportCard] = useState(null);
  const t = useTranslations("dashboard");
  const tNav = useTranslations("nav");

  useEffect(() => {
    if (!loading && !user) { router.replace("/login"); return; }
    if (!loading && user?.role !== "student") {
      router.replace(user.role === "teacher" ? "/dashboard/teacher" : "/dashboard/parent");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.uid) {
      setTimeout(() => {
        setReportCard(getReportCard(user.uid));
      }, 0);
    }
  }, [user]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t("greeting_morning");
    if (h < 17) return t("greeting_afternoon");
    return t("greeting_evening");
  };

  if (loading || !user) {
    return (
      <div className="page-bg" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ width: 48, height: 48, border: "4px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const overallScore = reportCard ? Math.round(
    MODULES.reduce((s, m) => s + (reportCard.moduleScores[m.key] || 0), 0) / MODULES.length
  ) : 0;

  return (
    <div className="page-bg" style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Welcome header */}
        <div style={{
          background: "linear-gradient(135deg, var(--primary-50), rgba(27,42,107,0.04))",
          border: "2px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "28px 32px",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
          boxShadow: "var(--shadow-xs)",
        }}>
          <div>
            <p style={{ color: "var(--accent-hover)", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
              {greeting()}
            </p>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--primary)" }}>{user.name}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 15, fontWeight: 600, marginTop: 4 }}>
              {t("learnToday")}
            </p>
          </div>
          <div style={{ display: "flex", gap: 28, background: "#FFFFFF", padding: "12px 24px", borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)" }}>
                {reportCard?.totalAttempts || 0}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{t("attempts")}</div>
            </div>
            <div style={{ width: 1.5, background: "var(--border)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--success)" }}>
                {overallScore}%
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{t("score")}</div>
            </div>
          </div>
        </div>

        {/* Module cards (redesigned as large icon-led tappable tiles) */}
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: "var(--primary)" }}>
          📚 {t("chooseModule")}
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}>
          {MODULES.map((m, i) => {
            const score = reportCard?.moduleScores?.[m.key] || 0;
            const modColor = `var(--mod-${m.key})`;
            return (
              <Link key={m.key} href={`/learn/${m.key}`} style={{ textDecoration: "none" }}>
                <div
                  className="module-tile"
                  style={{
                    border: `2px solid var(--border)`,
                    animation: `slideUp 0.4s ease ${i * 0.05}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = modColor;
                    e.currentTarget.style.boxShadow = `0 8px 24px rgba(27,42,107,0.12)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "var(--shadow-xs)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 12 }}>
                    <span style={{ fontSize: 48 }} role="img" aria-label={m.labelEn}>{m.emoji}</span>
                    <ProgressRing percent={score} size={48} stroke={5} color={modColor} />
                  </div>
                  <div style={{ width: "100%" }}>
                    <div className="font-display" style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "var(--primary)",
                      marginBottom: 2,
                    }}>{tNav(m.key)}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{m.labelEn}</div>
                  </div>
                  <div style={{ width: "100%", marginTop: 12, height: 6, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${score}%`,
                      background: modColor,
                      borderRadius: 999,
                      transition: "width 0.7s ease",
                      boxShadow: `0 1px 4px ${modColor}44`,
                    }} />
                  </div>
                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)", marginTop: 6, fontWeight: 700 }}>
                    <span>{score}{t("percentComplete")}</span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Converter card */}
          <Link href="/converter" style={{ textDecoration: "none" }}>
            <div 
              className="module-tile"
              style={{
                border: "2px solid var(--border)",
                animation: "slideUp 0.4s ease 0.3s both"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--mod-converter)";
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(27,42,107,0.12)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "var(--shadow-xs)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 12 }}>
                <span style={{ fontSize: 48 }} role="img" aria-label="Converter">🔄</span>
                <span style={{ fontSize: 24 }} role="img" aria-hidden="true">➡️</span>
              </div>
              <div style={{ width: "100%" }}>
                <div className="font-display" style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--primary)", marginBottom: 2 }}>
                  {tNav("converter")}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>Gujarati Text → Sign</div>
              </div>
              <div style={{ width: "100%", height: 6, background: "var(--bg-elevated)", borderRadius: 999, marginTop: 12 }} />
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)", marginTop: 6, fontWeight: 700 }}>
                <span>Interactive tool</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick practice section */}
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: "var(--text-secondary)" }}>
          {t("quickPractice")}
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {MODULES.slice(0, 3).map((m) => {
            const modColor = `var(--mod-${m.key})`;
            return (
              <Link key={m.key} href={`/learn/${m.key}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 24px",
                  background: "var(--bg-card)",
                  border: `2px solid var(--border)`,
                  borderRadius: "var(--radius-full)",
                  cursor: "pointer",
                  transition: "all var(--transition)",
                  color: "var(--primary)",
                  fontWeight: 700,
                  fontSize: 15,
                  minHeight: 44, // minimum 44px
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = modColor;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "none";
                }}
                >
                  <span role="img" aria-hidden="true">{m.emoji}</span> {tNav(m.key)}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
