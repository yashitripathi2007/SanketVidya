"use client";
import { useAuth } from "@/lib/authContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { MODULES } from "@/lib/mockData";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tRoles = useTranslations("roles");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const roleBadgeClass = {
    student: "badge-student",
    teacher: "badge-teacher",
    parent:  "badge-parent",
  }[user?.role] || "badge-student";

  const roleLabel = user?.role ? tRoles(user.role) : "";

  const dashboardHref =
    user?.role === "teacher"  ? "/dashboard/teacher" :
    user?.role === "parent"   ? "/dashboard/parent" :
    "/dashboard/student";

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "var(--nav-bg)",
      borderBottom: "2px solid rgba(255,255,255,0.15)",
      padding: "0 24px",
      boxShadow: "var(--shadow-md)",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {/* Global Back to Previous Page Button */}
          {pathname !== "/" && (
            <button
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                } else {
                  router.push(dashboardHref || "/");
                }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.35)",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all var(--transition)",
                minHeight: 38,
              }}
              title={t("back")}
              aria-label={t("back")}
            >
              <span style={{ fontSize: 15 }}>←</span>
              <span>{t("back")}</span>
            </button>
          )}

          {/* Logo */}
          <Link href={dashboardHref} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            flexShrink: 0,
          }}
          aria-label={t("home")}
          >
            <span style={{ fontSize: 30 }} role="img" aria-label="Sign Language Symbol">🤟</span>
            <span className="font-display" style={{
              fontWeight: 800,
              fontSize: 22,
              color: "#FFFFFF",
              letterSpacing: "0.02em",
            }}>
              {t("brand")}
            </span>
          </Link>
        </div>

        {/* Module Nav (students only) */}
        {user?.role === "student" && (
          <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "4px 0" }}>
            {MODULES.map((m) => {
              const isActive = pathname.includes(`/learn/${m.key}`);
              return (
                <Link
                  key={m.key}
                  href={`/learn/${m.key}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    borderRadius: "var(--radius-full)",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    background: isActive ? "rgba(255,255,255,0.22)" : "transparent",
                    color: "#FFFFFF",
                    border: isActive ? "1px solid rgba(255,255,255,0.4)" : "1px solid transparent",
                    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                    transition: "all var(--transition)",
                    minHeight: 44,
                  }}
                >
                  <span role="img" aria-hidden="true">{m.emoji}</span>
                  <span>{t(m.key)}</span>
                </Link>
              );
            })}
            <Link
              href="/converter"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: "var(--radius-full)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
                whiteSpace: "nowrap",
                background: pathname.includes("/converter") ? "rgba(255,255,255,0.22)" : "transparent",
                color: "#FFFFFF",
                border: pathname.includes("/converter") ? "1px solid rgba(255,255,255,0.4)" : "1px solid transparent",
                boxShadow: pathname.includes("/converter") ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                transition: "all var(--transition)",
                minHeight: 44,
              }}
            >
              <span role="img" aria-hidden="true">🔄</span>
              <span>{t("converter")}</span>
            </Link>
            <Link
              href="/camera"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: "var(--radius-full)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 700,
                whiteSpace: "nowrap",
                background: pathname.includes("/camera") ? "linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)" : "rgba(249, 115, 22, 0.25)",
                color: "#FFFFFF",
                border: pathname.includes("/camera") ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(249, 115, 22, 0.5)",
                boxShadow: pathname.includes("/camera") ? "0 2px 12px rgba(249,115,22,0.4)" : "none",
                transition: "all var(--transition)",
                minHeight: 44,
              }}
            >
              <span role="img" aria-hidden="true">📷</span>
              <span>{t("camera")}</span>
            </Link>
          </div>
        )}

        {/* Right side: Language Switcher + User Info */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          {/* Always Visible Language Switcher */}
          <LanguageSwitcher />

          {user && (
            <>
              <Link href={dashboardHref} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#FFFFFF",
                    flexShrink: 0,
                    boxShadow: "var(--shadow-xs)",
                  }}>
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>
                      {user.name}
                    </span>
                    <span className={`badge ${roleBadgeClass}`} style={{ fontSize: 10, padding: "2px 8px", alignSelf: "flex-start", marginTop: 2 }}>
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-ghost"
                style={{ 
                  padding: "0 12px", 
                  color: "#FFFFFF", 
                  fontSize: 18, 
                  height: 44, 
                  minWidth: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
                title={t("logout")}
                aria-label={t("logout")}
              >
                <span style={{ fontSize: 18 }}>🚪</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
