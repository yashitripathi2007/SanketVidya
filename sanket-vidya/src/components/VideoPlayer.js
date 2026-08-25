"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function VideoPlayer({ videoUrl, title, caption }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const t = useTranslations("common");

  const isYouTube = videoUrl && (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));

  return (
    <div style={{
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      background: "#1B2A6B",
      position: "relative",
      width: "100%",
      aspectRatio: "16/9",
      boxShadow: "var(--shadow-md)",
      border: "4px solid #FFFFFF",
    }}>
      {isYouTube && !error ? (
        <>
          {loading && (
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--bg-elevated)",
              zIndex: 1,
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: 48,
                  height: 48,
                  border: "4px solid var(--border)",
                  borderTopColor: "var(--accent)",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 12px",
                }} />
                <p style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 600 }}>{t("videoLoading")}</p>
              </div>
            </div>
          )}
          <iframe
            src={`${videoUrl}?rel=0&modestbranding=1&autoplay=0`}
            title={title || "Sign Language Video"}
            width="100%"
            height="100%"
            style={{ border: "none", position: "absolute", inset: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        </>
      ) : (
        // Animated placeholder when no video / error
        <AnimatedHandPlaceholder title={title} t={t} />
      )}

      {/* Caption overlay */}
      {caption && (
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(transparent, rgba(27,42,107,0.95))",
          padding: "24px 16px 12px",
          fontSize: 15,
          fontWeight: 700,
          color: "#FFFFFF",
        }}>
          {caption}
        </div>
      )}
    </div>
  );
}

function AnimatedHandPlaceholder({ title, t }) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, #1B2A6B 0%, #2E42A0 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      padding: 16,
    }}>
      <div style={{ fontSize: 72, animation: "wave 1.5s ease-in-out infinite" }} role="img" aria-label="Waving hand">🤟</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF" }}>
          {title || t("videoUnavailable")}
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
          Indian Sign Language Demonstration
        </div>
      </div>
      {/* Simulated hand shapes */}
      <div style={{ display: "flex", gap: 20 }}>
        {["🖐", "✌️", "👆", "🤙", "👌"].map((emoji, i) => (
          <span
            key={i}
            style={{
              fontSize: 26,
              animation: `float ${1.5 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
              display: "inline-block",
            }}
            role="img"
            aria-label="Hand sign shape"
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}
