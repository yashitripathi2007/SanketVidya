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
      background: "var(--primary)",
      borderBottom: "2px solid rgba(255,255,255,0.1)",
      padding: "0 24px",
      boxShadow: "var(--shadow-sm)",
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
          <span style={{ fontSize: 32 }} role="img" aria-label="Sign Language Symbol">🤟</span>
          <span className="font-display" style={{
            fontWeight: 800,
            fontSize: 24,
            color: "#FFFFFF",
            letterSpacing: "0.02em",
          }}>
            {t("brand")}
          </span>
        </Link>

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
                    background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                    color: "#FFFFFF",
                    border: isActive ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
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
                background: pathname.includes("/converter") ? "rgba(255,255,255,0.15)" : "transparent",
                color: "#FFFFFF",
                border: pathname.includes("/converter") ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
                transition: "all var(--transition)",
                minHeight: 44,
              }}
            >
              <span role="img" aria-hidden="true">🔄</span>
              <span>{t("converter")}</span>
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
                  fontSize: 20, 
                  height: 44, 
                  minWidth: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                title={t("logout")}
                aria-label={t("logout")}
              >
                ↩
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
