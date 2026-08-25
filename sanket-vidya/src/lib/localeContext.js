"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";

import enMessages from "../../messages/en.json";
import hiMessages from "../../messages/hi.json";
import guMessages from "../../messages/gu.json";

const ALL_MESSAGES = { en: enMessages, hi: hiMessages, gu: guMessages };
const STORAGE_KEY = "sv_locale";
const DEFAULT_LOCALE = "en";

const LocaleCtx = createContext({ locale: DEFAULT_LOCALE, setLocale: () => {} });

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setTimeout(() => {
      if (stored && ALL_MESSAGES[stored]) setLocaleState(stored);
      setMounted(true);
    }, 0);
  }, []);

  const setLocale = (loc) => {
    if (!ALL_MESSAGES[loc]) return;
    setLocaleState(loc);
    localStorage.setItem(STORAGE_KEY, loc);
  };

  // Avoid hydration mismatch — render null until client locale is resolved
  if (!mounted) return null;

  return (
    <LocaleCtx.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider
        locale={locale}
        messages={ALL_MESSAGES[locale]}
        timeZone="Asia/Kolkata"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleCtx.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleCtx);
}
