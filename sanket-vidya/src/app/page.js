"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations("login");
  const tNav = useTranslations("nav");

  useEffect(() => {
    if (!loading && user) {
      const dest =
        user.role === "teacher" ? "/dashboard/teacher" :
        user.role === "parent"  ? "/dashboard/parent"  :
        "/dashboard/student";
      router.replace(dest);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="page-bg" style={{ display: "flex", alignItems: "center", justifyContext: "center", minHeight: "100vh" }}>
        <div style={{
          width: 48, height: 48,
          border: "4px solid var(--border)",
          borderTopColor: "var(--primary)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto",
        }} />
      </div>
    );
  }

  return (
    <div className="page-bg" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header with Lang Switcher */}
      <header style={{
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 28 }} role="img" aria-label="Sign Language Symbol">🤟</span>
          <span className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)" }}>
            {tNav("brand")}
          </span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Hero */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center",
        maxWidth: 800,
        margin: "0 auto",
        width: "100%",
      }}>
        {/* Animated logo */}
        <div style={{ marginBottom: 24, animation: "float 3s ease-in-out infinite" }}>
          <div style={{
            width: 120,
            height: 120,
            borderRadius: "var(--radius-xl)",
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 60,
            margin: "0 auto",
            boxShadow: "var(--shadow-md)",
            border: "4px solid #FFFFFF",
          }}>
            🤟
          </div>
        </div>

        <h1 className="font-display" style={{
          fontSize: "clamp(38px, 6vw, 64px)",
          fontWeight: 800,
          marginBottom: 12,
          color: "var(--primary)",
          lineHeight: 1.1,
        }}>
          {tNav("brand")}
        </h1>

        <p className="font-display" style={{
          fontSize: "clamp(18px, 2.5vw, 24px)",
          color: "var(--accent-hover)",
          fontWeight: 700,
          marginBottom: 6,
          lineHeight: 1.4,
        }}>
          {t("subtitle")}
        </p>
        <p style={{
          fontSize: 15,
          color: "var(--text-muted)",
          marginBottom: 40,
          fontWeight: 600,
        }}>
          Indian Sign Language · Designed for Gujarati-medium Schools
        </p>

        {/* Feature chips */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
          marginBottom: 48,
        }}>
          {[
            { emoji: "🔤", textKey: "alphabets" },
            { emoji: "🔢", textKey: "numbers" },
            { emoji: "💬", textKey: "words" },
            { emoji: "➕", textKey: "math" },
            { emoji: "🔬", textKey: "science" },
            { emoji: "🔄", textKey: "converter" },
          ].map(({ emoji, textKey }) => (
            <span key={textKey} style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              background: "var(--bg-card)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-full)",
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text-secondary)",
              boxShadow: "var(--shadow-xs)",
            }}>
              <span role="img" aria-hidden="true">{emoji}</span> {tNav(textKey)}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/login" className="btn btn-primary btn-lg" style={{ minWidth: 200, height: 56 }}>
            🚀 {t("loginBtn")}
          </Link>
        </div>

        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 20, fontWeight: 500 }}>
          Demo accounts available · No registration required
        </p>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "20px 24px",
        borderTop: "1.5px solid var(--border)",
        fontSize: 13,
        color: "var(--text-muted)",
        fontWeight: 600,
      }}>
        {tNav("brand")} · Smart Education · SVH26012
      </footer>
    </div>
  );
}
