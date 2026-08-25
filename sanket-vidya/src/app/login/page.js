"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const { login, quickLogin } = useAuth();
  const router = useRouter();
  const t = useTranslations("login");
  const tNav = useTranslations("nav");
  const tRoles = useTranslations("roles");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const DEMO_ACCOUNTS = [
    {
      role: "student",
      label: tRoles("student"),
      emoji: "🎒",
      email: "student@demo.com",
      color: "var(--primary)",
      bg: "var(--primary-50)",
      desc: t("studentDesc"),
    },
    {
      role: "teacher",
      label: tRoles("teacher"),
      emoji: "📚",
      email: "teacher@demo.com",
      color: "var(--accent-hover)",
      bg: "var(--accent-light)",
      desc: t("teacherDesc"),
    },
    {
      role: "parent",
      label: tRoles("parent"),
      emoji: "👨‍👩‍👧",
      email: "parent@demo.com",
      color: "var(--success-dark)",
      bg: "var(--success-light)",
      desc: t("parentDesc"),
    },
  ];

  const doLogin = (result) => {
    if (result.success) {
      const dest =
        result.user.role === "teacher" ? "/dashboard/teacher" :
        result.user.role === "parent"  ? "/dashboard/parent"  :
        "/dashboard/student";
      router.push(dest);
    } else {
      setError(t("invalidCredentials"));
      setLoggingIn(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoggingIn(true);
    setTimeout(() => doLogin(login(email, password)), 400);
  };

  const handleQuick = (role) => {
    setError("");
    setLoggingIn(true);
    setTimeout(() => doLogin(quickLogin(role)), 400);
  };

  return (
    <div className="page-bg" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
    }}>
      {/* Header */}
      <header style={{
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 28 }} role="img" aria-label="Sign Language Symbol">🤟</span>
          <span className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)" }}>
            {tNav("brand")}
          </span>
        </Link>
        <LanguageSwitcher />
      </header>

      <div style={{ width: "100%", maxWidth: 440, padding: "20px 24px", marginTop: 20 }}>
        {/* Intro */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 44 }} role="img" aria-label="Sign Language Logo">🤟</span>
          <h1 className="font-display" style={{
            fontSize: 28,
            fontWeight: 800,
            color: "var(--primary)",
            marginTop: 8,
          }}>
            {t("title")}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 600, marginTop: 4 }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Demo role cards */}
        <div className="card" style={{
          padding: 20,
          marginBottom: 20,
          background: "#FFFFFF",
        }}>
          <p style={{
            fontSize: 12,
            fontWeight: 800,
            color: "var(--text-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 12,
            textAlign: "center",
          }}>
            {t("quickLogin")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                onClick={() => handleQuick(acc.role)}
                disabled={loggingIn}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  background: acc.bg,
                  border: `2px solid ${acc.color}22`,
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  transition: "all var(--transition)",
                  textAlign: "left",
                  width: "100%",
                  minHeight: 52, // minimum 44px
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${acc.color}66`;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${acc.color}22`;
                  e.currentTarget.style.transform = "none";
                }}
              >
                <span style={{ fontSize: 32, flexShrink: 0 }} role="img" aria-label={acc.label}>{acc.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{
                      fontWeight: 800,
                      color: acc.color,
                      fontSize: 16,
                    }}>{acc.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2, fontWeight: 500 }}>{acc.desc}</div>
                </div>
                <span style={{ color: acc.color, fontSize: 20, fontWeight: 800 }}>→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1.5, background: "var(--border)" }} />
          <span style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 700 }}>{t("orLabel")}</span>
          <div style={{ flex: 1, height: 1.5, background: "var(--border)" }} />
        </div>

        {/* Manual login form */}
        <form
          onSubmit={handleSubmit}
          className="card"
          style={{
            padding: 20,
            background: "#FFFFFF",
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6 }} htmlFor="email">
              {t("emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@demo.com"
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6 }} htmlFor="password">
              {t("passwordLabel")}
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo123"
              required
            />
          </div>
          {error && (
            <div className="feedback-wrong" style={{ padding: "10px 14px", marginBottom: 12 }}>
              <span className="feedback-icon" role="img" aria-label="Error">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={loggingIn}
            className="btn btn-indigo w-full"
            style={{ height: 48 }}
          >
            {loggingIn ? t("loggingIn") : `${t("loginBtn")} →`}
          </button>
          <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 12, fontWeight: 500 }}>
            {t("demoNote")}
          </p>
        </form>
      </div>
    </div>
  );
}
