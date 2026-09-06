"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import Navbar from "@/components/Navbar";
import CameraSignRecognizer from "@/components/CameraSignRecognizer";
import { useTranslations } from "next-intl";

function CameraContent() {
  const searchParams = useSearchParams();
  const target = searchParams.get("target");

  return <CameraSignRecognizer initialTarget={target} />;
}

export default function CameraPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations("camera");
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
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px" }}>
        {/* Breadcrumb & Back Navigation */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 13,
          color: "var(--text-muted)",
          marginBottom: 20,
          fontWeight: 600,
        }}>
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
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: 13,
              fontWeight: 700,
              height: 38,
            }}
            aria-label={tCommon("back")}
          >
            <span style={{ fontSize: 16 }}>←</span>
            <span>{tCommon("back")}</span>
          </button>
          <a href="/dashboard/student" style={{ color: "var(--primary)", textDecoration: "none" }}>
            🏠 {tNav("dashboard")}
          </a>
          <span>›</span>
          <span style={{ color: "var(--text-secondary)" }}>
            📷 {t("title")}
          </span>
        </div>

        {/* Feature Hero Description Banner */}
        <div style={{
          background: "linear-gradient(135deg, #FFF5ED 0%, #FAF5FF 100%)",
          border: "2px solid var(--peach-200)",
          borderRadius: "var(--radius-xl)",
          padding: "24px 28px",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ fontSize: 44 }} role="img" aria-label="Camera sign recognition">📸</span>
            <div>
              <h1 className="font-display" style={{
                fontSize: 24,
                fontWeight: 800,
                color: "var(--primary)",
                margin: 0,
                marginBottom: 4,
              }}>
                {t("heroHeading")}
              </h1>
              <p style={{
                color: "var(--text-secondary)",
                fontSize: 14,
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.5,
                maxWidth: 620,
              }}>
                {t("heroSubtitle")}
              </p>
            </div>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#FFFFFF",
            padding: "8px 16px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border)",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--primary)",
            boxShadow: "var(--shadow-xs)",
          }}>
            <span>🔒</span>
            <span>{t("privacyBadge")}</span>
          </div>
        </div>

        {/* Camera Recognition Component inside Suspense */}
        <Suspense fallback={
          <div style={{ textAlign: "center", padding: 48 }}>
            <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          </div>
        }>
          <CameraContent />
        </Suspense>
      </main>
    </div>
  );
}
