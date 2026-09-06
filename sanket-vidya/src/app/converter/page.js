"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import Navbar from "@/components/Navbar";
import SignConverter from "@/components/SignConverter";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ConverterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations("converter");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

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
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        {/* Back Navigation Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/dashboard/student");
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
            <Link href="/dashboard/student" style={{ color: "var(--primary)", textDecoration: "none" }}>{tNav("dashboard")}</Link>
            {" › "}
            <span style={{ color: "var(--text-secondary)" }}>{tNav("converter")}</span>
          </span>
        </div>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #FFF5ED 0%, #FAF5FF 100%)",
          border: "2px solid var(--peach-200)",
          borderRadius: "var(--radius-xl)",
          padding: "24px 28px",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 16,
          boxShadow: "var(--shadow-sm)",
        }}>
          <span style={{ fontSize: 44 }} role="img" aria-label="Converter">🔄</span>
          <div>
            <h1 className="font-display" style={{
              fontSize: 26,
              fontWeight: 800,
              color: "var(--primary)",
              marginBottom: 4,
            }}>
              {t("heading")}
            </h1>
            <p style={{
              color: "var(--text-secondary)",
              fontSize: 14,
              fontWeight: 600,
            }}>
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* How it works */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}>
          {[
            { step: "1", textKey: "step1", icon: "⌨️" },
            { step: "2", textKey: "step2", icon: "🔍" },
            { step: "3", textKey: "step3", icon: "📹" },
          ].map(({ step, textKey, icon }) => (
            <div key={step} style={{
              background: "#FFFFFF",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              boxShadow: "var(--shadow-xs)"
            }}>
              <span style={{ fontSize: 28 }} role="img" aria-label={t(textKey)}>{icon}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {t("stepPrefix")} {step}
              </span>
              <span style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 700 }}>
                {t(textKey)}
              </span>
            </div>
          ))}
        </div>

        {/* Converter */}
        <div className="card" style={{
          padding: 24,
          background: "#FFFFFF",
        }}>
          <SignConverter />
        </div>

        {/* Tip */}
        <div style={{
          marginTop: 20,
          padding: "14px 18px",
          background: "var(--primary-50)",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius-md)",
          fontSize: 14,
          color: "var(--primary)",
          fontWeight: 600,
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
        }}>
          <span style={{ flexShrink: 0 }} role="img" aria-label="Tip">💡</span>
          <span>{t("tip")}</span>
        </div>
      </div>
    </div>
  );
}
