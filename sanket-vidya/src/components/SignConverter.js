"use client";
import { useState, useRef, useCallback } from "react";
import VideoPlayer from "./VideoPlayer";
import { useTranslations } from "next-intl";

export default function SignConverter() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null); // array of word objects
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const t = useTranslations("converter");
  const tCommon = useTranslations("common");

  // Build flat video queue from result
  const queue = result ? buildQueue(result) : [];
  const currentItem = queue[currentIdx] || null;

  function buildQueue(words) {
    const items = [];
    for (const w of words) {
      if (w.type === "direct" && w.videoUrl) {
        items.push({ label: w.word, videoUrl: w.videoUrl, type: "word" });
      } else if (w.type === "spelled") {
        for (const l of w.letters) {
          if (l.videoUrl) {
            items.push({ label: l.char, videoUrl: l.videoUrl, type: "letter", parentWord: w.word });
          } else {
            items.push({ label: l.char, videoUrl: null, type: "unknown", parentWord: w.word });
          }
        }
      }
    }
    return items;
  }

  const handleConvert = useCallback(async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentIdx(0);
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Conversion failed");
      setResult(data.words);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [text]);

  const toggleMic = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("તમારો બ્રાઉઝર speech recognition ને support નથી કરતો.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "gu-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setText((prev) => prev ? `${prev} ${transcript}` : transcript);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend   = () => setIsListening(false);
    rec.start();
    recognitionRef.current = rec;
    setIsListening(true);
  }, [isListening]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Input area */}
      <div style={{
        background: "var(--bg-card)",
        border: "1.5px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: 20,
      }}>
        <label style={{
          display: "block",
          fontSize: 14,
          fontWeight: 700,
          color: "var(--text-secondary)",
          marginBottom: 10,
        }}
        htmlFor="converter-input"
        >
          {t("inputLabel")}
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          <textarea
            id="converter-input"
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("inputPlaceholder")}
            style={{
              resize: "none",
              height: 80,
              fontSize: 18,
              fontWeight: 600,
            }}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleConvert())}
          />
          <button
            onClick={toggleMic}
            className="btn btn-secondary"
            style={{
              height: 80,
              width: 60,
              minWidth: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isListening ? "var(--error-light)" : undefined,
              borderColor: isListening ? "var(--error)" : undefined,
              animation: isListening ? "pulse-glow 1.5s ease-in-out infinite" : undefined,
              flexShrink: 0,
              fontSize: 26,
            }}
            title={isListening ? "Stop recording" : "Speak in Gujarati"}
            aria-label={isListening ? "Stop recording" : "Speak in Gujarati"}
          >
            {isListening ? "🔴" : "🎙️"}
          </button>
        </div>
        {isListening && (
          <p style={{ fontSize: 14, color: "var(--error-dark)", fontWeight: 700, marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span role="img" aria-label="Microphone">🎙️</span> {t("listening")}
          </p>
        )}
        <button
          onClick={handleConvert}
          disabled={!text.trim() || loading}
          className="btn btn-primary w-full"
          style={{ marginTop: 16, height: 48 }}
        >
          {loading ? (
            <>⏳ {t("converting")}</>
          ) : t("convertBtn")}
        </button>
        {error && (
          <p className="feedback-wrong" style={{ marginTop: 12 }}>
            <span className="feedback-icon" role="img" aria-label="Error">⚠️</span> {error}
          </p>
        )}
      </div>

      {/* Result */}
      {result && queue.length > 0 && (
        <div style={{ animation: "slideUp 0.4s ease" }}>
          {/* Word chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
            {queue.map((item, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                style={{
                  height: 44, // min target 44px
                  padding: "0 16px",
                  borderRadius: "var(--radius-full)",
                  border: `2px solid ${i === currentIdx ? "var(--primary)" : "var(--border-strong)"}`,
                  background: i === currentIdx ? "var(--primary-50)" : "var(--bg-card)",
                  color: i === currentIdx ? "var(--primary)" : "var(--text-secondary)",
                  fontSize: 16,
                  fontWeight: i === currentIdx ? 800 : 600,
                  cursor: "pointer",
                  transition: "all var(--transition)",
                }}
              >
                {item.label}
                {item.type === "letter" && (
                  <span style={{ fontSize: 11, marginLeft: 4, opacity: 0.7 }}>({t("spell")})</span>
                )}
              </button>
            ))}
          </div>

          {/* Current video */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 10,
              background: "var(--primary)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "var(--radius-full)",
              padding: "6px 18px",
              fontSize: 16,
              fontWeight: 800,
              color: "#FFFFFF",
              boxShadow: "var(--shadow-sm)"
            }}>
              {currentItem?.label}
            </div>
            <VideoPlayer
              videoUrl={currentItem?.videoUrl}
              title={currentItem?.label}
              caption={currentItem?.type === "letter" ? `"${currentItem.parentWord}" → "${currentItem.label}"` : null}
            />
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
            <button
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="btn btn-secondary"
              style={{ flex: 1, height: 48 }}
            >
              {t("prev")}
            </button>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", flexShrink: 0 }}>
              {currentIdx + 1} / {queue.length}
            </span>
            <button
              onClick={() => setCurrentIdx(Math.min(queue.length - 1, currentIdx + 1))}
              disabled={currentIdx === queue.length - 1}
              className="btn btn-indigo"
              style={{ flex: 1, height: 48 }}
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}

      {result && queue.length === 0 && (
        <div 
          className="feedback-wrong"
          style={{ justifyContent: "center" }}
        >
          <span className="feedback-icon" role="img" aria-label="Warning">😕</span>
          <span>{t("noVideos")}</span>
        </div>
      )}
    </div>
  );
}
