"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { MOCK_USERS } from "@/lib/mockData";
import { getReportCard } from "@/lib/localStorage";
import Navbar from "@/components/Navbar";
import ReportCard from "@/components/ReportCard";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ParentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [activeChildId, setActiveChildId] = useState(null);
  const t = useTranslations("dashboard");
  const tRoles = useTranslations("roles");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  useEffect(() => {
    if (!loading && !user) { router.replace("/login"); return; }
    if (!loading && user?.role !== "parent") router.replace("/dashboard/student");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const kids = MOCK_USERS.filter(
      (u) => u.role === "student" && user.linkedStudentIds?.includes(u.uid)
    );
    const withReports = kids.map((k) => ({ ...k, report: getReportCard(k.uid) }));
    setTimeout(() => {
      setChildren(withReports);
      if (withReports.length > 0) {
        setActiveChildId((prev) => prev || withReports[0].uid);
      }
    }, 0);
  }, [user]);

  const activeChild = children.find((c) => c.uid === activeChildId);

  if (loading || !user) {
    return (
      <div className="page-bg" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ width: 48, height: 48, border: "4px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <div className="page-bg" style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
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
            <span style={{ color: "var(--text-secondary)" }}>{tRoles("parent")} {tNav("dashboard")}</span>
          </span>
        </div>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #FFF5ED 0%, #FAF5FF 100%)",
          border: "2px solid var(--peach-200)",
          borderRadius: "var(--radius-xl)",
          padding: "28px 32px",
          marginBottom: 28,
          boxShadow: "var(--shadow-sm)",
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--primary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            👨‍👩‍👧 {tRoles("parent")} {tNav("dashboard")}
          </span>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 800, marginTop: 4, color: "var(--primary)" }}>{user.name}</h1>
          <p style={{ color: "var(--text-secondary)", fontWeight: 600, marginTop: 2 }}>
            {children.length} {t("children")}
          </p>
        </div>

        {/* Child selector */}
        {children.length > 1 && (
          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            {children.map((child) => {
              const isActive = child.uid === activeChildId;
              return (
                <button
                  key={child.uid}
                  onClick={() => setActiveChildId(child.uid)}
                  className="btn"
                  style={{
                    background: isActive ? "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)" : "#FFFFFF",
                    border: `2px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
                    color: isActive ? "#FFFFFF" : "var(--text-primary)",
                    fontSize: 14,
                    fontWeight: 700,
                    height: 48, // minimum 44px
                    padding: "0 20px",
                    boxShadow: isActive ? "var(--shadow-purple)" : "var(--shadow-xs)",
                  }}
                  aria-current={isActive ? "true" : "false"}
                >
                  🎒 {child.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Report Card */}
        {activeChild && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <ReportCard
              studentName={activeChild.name}
              moduleScores={activeChild.report.moduleScores}
              totalAttempts={activeChild.report.totalAttempts}
              lastActive={activeChild.report.lastActive}
            />

            {/* Recent activity */}
            <div className="card" style={{
              padding: 24,
              marginTop: 20,
              background: "#FFFFFF",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: "var(--primary)" }}>{t("recentActivity")}</h2>
              {activeChild.report.totalAttempts === 0 ? (
                <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14 }}>
                  {t("noAttempts")}
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {Object.entries(activeChild.report.moduleScores)
                    .filter(([, v]) => v > 0)
                    .map(([mod, score]) => {
                      const modColor = `var(--mod-${mod})`;
                      return (
                        <div key={mod} style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 18px",
                          background: "var(--bg-elevated)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border)",
                          fontSize: 15,
                        }}>
                          <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                            {tNav(mod)}
                          </span>
                          <span style={{
                            fontWeight: 800,
                            color: score >= 70 ? "var(--success)" : score >= 40 ? "var(--accent-hover)" : "var(--error-dark)",
                          }}>
                            {score}%
                          </span>
                        </div>
                      );
                    })
                  }
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
