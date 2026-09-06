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
  const tCommon = useTranslations("common");

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
        {/* Back Navigation Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            className="btn btn-secondary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: "var(--radius-full)",
              fontSize: 13,
              fontWeight: 700,
              height: 40,
            }}
            aria-label={tCommon("back")}
          >
            <span style={{ fontSize: 16 }}>←</span>
            <span>{tCommon("back")}</span>
          </button>
          <span style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>
            <Link href="/" style={{ color: "var(--primary)", textDecoration: "none" }}>{tNav("home")}</Link>
            {" › "}
            <span style={{ color: "var(--text-secondary)" }}>{tNav("dashboard")}</span>
          </span>
        </div>

        {/* Welcome header */}
        <div style={{
          background: "linear-gradient(135deg, var(--peach-50) 0%, var(--primary-50) 60%, var(--pink-50) 100%)",
          border: "2px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "28px 32px",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
          boxShadow: "var(--shadow-sm)",
        }}>
          <div>
            <p style={{ color: "var(--accent-hover)", fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
              {greeting()}
            </p>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--primary)" }}>{user.name}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 15, fontWeight: 600, marginTop: 4 }}>
              {t("learnToday")}
            </p>
          </div>
          <div style={{ display: "flex", gap: 28, background: "#FFFFFF", padding: "12px 24px", borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", boxShadow: "var(--shadow-xs)" }}>
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

        {/* Module cards (large icon-led tappable tiles) */}
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
                    background: "#FFFFFF",
                    border: `2px solid var(--border)`,
                    animation: `slideUp 0.4s ease ${i * 0.05}s both`,
                    boxShadow: "var(--shadow-xs)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = modColor;
                    e.currentTarget.style.boxShadow = `0 8px 24px rgba(249, 115, 22, 0.14), 0 4px 12px rgba(109, 40, 217, 0.10)`;
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "var(--shadow-xs)";
                    e.currentTarget.style.transform = "none";
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
                    <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{m.labelEn}</div>
                  </div>
                  <div style={{ width: "100%", marginTop: 12, height: 6, background: "var(--primary-50)", borderRadius: 999, overflow: "hidden" }}>
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
                background: "#FFFFFF",
                border: "2px solid var(--border)",
                animation: "slideUp 0.4s ease 0.3s both",
                boxShadow: "var(--shadow-xs)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--mod-converter)";
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(147, 51, 234, 0.18)`;
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "var(--shadow-xs)";
                e.currentTarget.style.transform = "none";
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
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{t("converterDesc")}</div>
              </div>
              <div style={{ width: "100%", height: 6, background: "var(--primary-50)", borderRadius: 999, marginTop: 12 }} />
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--accent-hover)", marginTop: 6, fontWeight: 700 }}>
                <span>{t("converterTag")}</span>
              </div>
            </div>
          </Link>

          {/* Sign Camera Card */}
          <Link href="/camera" style={{ textDecoration: "none" }}>
            <div 
              className="module-tile"
              style={{
                border: "2px solid var(--accent)",
                animation: "slideUp 0.4s ease 0.35s both",
                background: "linear-gradient(135deg, #FFFFFF 0%, var(--peach-50) 100%)",
                boxShadow: "var(--shadow-xs)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-hover)";
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(249, 115, 22, 0.25)`;
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.boxShadow = "var(--shadow-xs)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 12 }}>
                <span style={{ fontSize: 48 }} role="img" aria-label="Camera sign recognition">📸</span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 800,
                  background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  color: "#FFFFFF",
                  padding: "3px 10px",
                  borderRadius: "var(--radius-full)",
                  textTransform: "uppercase",
                  boxShadow: "var(--shadow-accent)",
                }}>
                  {t("newAi")}
                </span>
              </div>
              <div style={{ width: "100%" }}>
                <div className="font-display" style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--primary)", marginBottom: 2 }}>
                  {tNav("camera")}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{t("cameraDesc")}</div>
              </div>
              <div style={{ width: "100%", height: 6, background: "var(--peach-100)", borderRadius: 999, marginTop: 12 }}>
                <div style={{ width: "100%", height: "100%", background: "var(--accent)", borderRadius: 999 }} />
              </div>
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--accent-hover)", marginTop: 6, fontWeight: 700 }}>
                <span>{t("cameraTag")}</span>
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
