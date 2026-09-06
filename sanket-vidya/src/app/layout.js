import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import { LocaleProvider } from "@/lib/localeContext";

export const metadata = {
  title: "સંકેતવિદ્યા — ISL Learning App",
  description: "Indian Sign Language learning app for deaf and mute students in Gujarati-medium schools.",
  manifest: "/manifest.json",
  keywords: ["ISL", "Indian Sign Language", "Gujarati", "deaf", "mute", "education", "learning"],
  openGraph: {
    title: "સંકેતવિદ્યા",
    description: "Learn Indian Sign Language in Gujarati",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#1B2A6B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="gu" style={{ scrollBehavior: "smooth" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Noto+Sans+Gujarati:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.jpg" />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <LocaleProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
