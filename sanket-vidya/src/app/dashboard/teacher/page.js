"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { MOCK_CLASSES, MOCK_USERS, MODULES } from "@/lib/mockData";
import { getReportCard } from "@/lib/localStorage";
import Navbar from "@/components/Navbar";
import ReportCard from "@/components/ReportCard";
import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function TeacherDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [studentReports, setStudentReports] = useState([]);
  const t = useTranslations("dashboard");
  const tNav = useTranslations("nav");
  const tRoles = useTranslations("roles");
  const tCommon = useTranslations("common");

  useEffect(() => {
    if (!loading && !user) { router.replace("/login"); return; }
    if (!loading && user?.role !== "teacher") router.replace("/dashboard/student");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const myClass = MOCK_CLASSES.find((c) => c.teacherId === user.uid);
    if (!myClass) return;
    const students = MOCK_USERS.filter((u) => myClass.studentIds.includes(u.uid) && u.role === "student");
    const reports = students.map((s) => ({ student: s, report: getReportCard(s.uid) }));
    setTimeout(() => {
      setStudentReports(reports);
    }, 0);
  }, [user]);

  const classAvgScore = studentReports.length > 0
    ? Math.round(
        studentReports.reduce((sum, { report }) =>
          sum + MODULES.reduce((s, m) => s + (report.moduleScores[m.key] || 0), 0) / MODULES.length, 0
        ) / studentReports.length
      )
    : 0;

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
            <span style={{ color: "var(--text-secondary)" }}>{tRoles("teacher")} {tNav("dashboard")}</span>
          </span>
        </div>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #FFF5ED 0%, #FAF5FF 100%)",
          border: "2px solid var(--peach-200)",
          borderRadius: "var(--radius-xl)",
          padding: "28px 32px",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
          boxShadow: "var(--shadow-sm)",
        }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--primary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              📚 {tRoles("teacher")} {tNav("dashboard")}
            </span>
            <h1 className="font-display" style={{ fontSize: 32, fontWeight: 800, marginTop: 4, color: "var(--primary)" }}>{user.name}</h1>
            <p style={{ color: "var(--text-secondary)", fontWeight: 600, marginTop: 2 }}>
              {t("classHeader")} · {studentReports.length} {t("students")}
            </p>
          </div>
          <div style={{ display: "flex", gap: 20, background: "#FFFFFF", padding: "12px 24px", borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", boxShadow: "var(--shadow-xs)" }}>
            {[
              { label: t("students"), value: studentReports.length, color: "var(--primary)" },
              { label: t("classAvg"), value: `${classAvgScore}%`, color: "var(--accent-hover)" },
              { label: t("totalAttempts"), value: studentReports.reduce((s, { report }) => s + report.totalAttempts, 0), color: "var(--success)" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Module summary */}
        <div className="card" style={{
          padding: 24,
          marginBottom: 28,
          background: "#FFFFFF",
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: "var(--primary)" }}>{t("modulePerformance")}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {MODULES.map((m) => {
              const avg = studentReports.length > 0
                ? Math.round(studentReports.reduce((sum, { report }) => sum + (report.moduleScores[m.key] || 0), 0) / studentReports.length)
                : 0;
              const modColor = `var(--mod-${m.key})`;
              return (
                <ProgressBar
                  key={m.key}
                  percent={avg}
                  color={modColor}
                  label={`${m.emoji} ${tNav(m.key)}`}
                  height={8}
                />
              );
            })}
          </div>
        </div>

        {/* Student list */}
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, color: "var(--primary)" }}>🎒 {t("students")}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {studentReports.map(({ student, report }, i) => {
            const avg = Math.round(MODULES.reduce((s, m) => s + (report.moduleScores[m.key] || 0), 0) / MODULES.length);
            return (
              <div key={student.uid}>
                <button
                  className="card"
                  style={{
                    padding: "16px 20px",
                    cursor: "pointer",
                    animation: `slideUp 0.4s ease ${i * 0.05}s both`,
                    width: "100%",
                    textAlign: "left",
                    background: "#FFFFFF",
                    minHeight: 56, // minimum 44px
                    display: "block"
                  }}
                  onClick={() => setSelected(selected?.uid === student.uid ? null : { ...student, report })}
                  aria-expanded={selected?.uid === student.uid ? "true" : "false"}
                  aria-label={`${student.name}, ${avg}%, ${t("seeReportAria")}`}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#FFFFFF",
                      flexShrink: 0,
                    }}>
                      {student.name[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "var(--primary)" }}>{student.name}</div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
                        {report.totalAttempts} {tCommon("attempts")}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      {MODULES.map((m) => (
                        <div key={m.key} title={`${tNav(m.key)}: ${report.moduleScores[m.key] || 0}%`} style={{
                          width: 8, height: 24,
                          borderRadius: 4,
                          background: `var(--mod-${m.key})`,
                          opacity: 0.15 + ((report.moduleScores[m.key] || 0) / 100) * 0.85,
                        }} />
                      ))}
                    </div>
                    <div style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: avg >= 70 ? "var(--success)" : avg >= 40 ? "var(--accent-hover)" : "var(--error-dark)",
                      minWidth: 48,
                      textAlign: "right",
                    }}>
                      {avg}%
                    </div>
                  </div>
                </button>

                {/* Expanded report card */}
                {selected?.uid === student.uid && (
                  <div style={{
                    padding: "0 4px",
                    animation: "fadeIn 0.3s ease",
                    marginTop: 8,
                  }}>
                    <div className="card-elevated" style={{ padding: 20 }}>
                      <ReportCard
                        studentName={student.name}
                        moduleScores={report.moduleScores}
                        totalAttempts={report.totalAttempts}
                        lastActive={report.lastActive}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
