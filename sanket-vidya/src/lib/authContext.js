"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getStoredUser, setStoredUser, clearStoredUser, seedDemoAttempts } from "./localStorage";
import { getUserByEmail } from "./mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session + seed demo data on first load
    const stored = getStoredUser();
    seedDemoAttempts();
    setTimeout(() => {
      if (stored) setUser(stored);
      setLoading(false);
    }, 0);

    // Register service worker for installable PWA
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const registerSW = () => {
        navigator.serviceWorker.register("/sw.js")
          .then((reg) => console.log("Service Worker registered successfully:", reg.scope))
          .catch((err) => console.error("Service Worker registration failed:", err));
      };
      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
      }
    }
  }, []);

  const login = useCallback((email, password) => {
    const found = getUserByEmail(email);
    if (!found || found.password !== password) {
      return { success: false, error: "Invalid email or password." };
    }
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    setStoredUser(safeUser);
    return { success: true, user: safeUser };
  }, []);

  const quickLogin = useCallback((role) => {
    // Demo one-click login by role
    const roleMap = {
      student: "student@demo.com",
      teacher: "teacher@demo.com",
      parent:  "parent@demo.com",
    };
    return login(roleMap[role], "demo123");
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    clearStoredUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, quickLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
