"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import SignHandDiagram from "./SignHandDiagram";

export default function VideoPlayer({
  videoUrl,
  title,
  caption,
  gestureEmoji,
  gestureName,
  gestureDescription,
  targetSign,
  animationType = "fist",
  diagramType = "fist",
  tutorialImage = null,
  steps = [],
  watchUrl,
  hasVideo = true,
}) {
  const isVideoAvailable = Boolean(hasVideo && videoUrl);
  // Default to 'tutorial' when video is not available, otherwise 'demo'
  const [playerMode, setPlayerMode] = useState(() => (!isVideoAvailable ? "tutorial" : "demo"));

  useEffect(() => {
    if (!isVideoAvailable) {
      setPlayerMode("tutorial");
    }
  }, [isVideoAvailable, videoUrl]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1); // 1x or 0.5x
  const [currentStep, setCurrentStep] = useState(0);
  const [ytLoading, setYtLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const tCommon = useTranslations("common");
  const tLesson = useTranslations("lesson");

  // Determine watchUrl from videoUrl if not provided
  const directWatchUrl = watchUrl || (videoUrl ? videoUrl.replace("/embed/", "/watch?v=").split("?")[0] : null);

  // Derived or fallback steps
  const displaySteps = steps && steps.length > 0
    ? steps
    : [
        "પગલું ૧: હથેળી સામે રાખો (Position hand in front)",
        "પગલું ૨: સંકેત મુદ્રા બનાવો (Form target sign shape)",
        "પગલું ૩: ૧-૨ સેકન્ડ સંકેત સ્થિર રાખો (Hold steady for 1-2 sec)",
      ];

  // Auto cycle through steps during animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = (2400 / speed);
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % displaySteps.length);
    }, intervalTime / displaySteps.length);

    return () => clearInterval(interval);
  }, [isPlaying, speed, displaySteps.length]);

  // Audio pronunciation helper
  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const text = targetSign || title || "સંકેત";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "gu-IN";
      utterance.rate = 0.85;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech error:", e);
      setIsSpeaking(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Mode Switcher Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
        background: "#FFFFFF",
        padding: "8px 12px",
        borderRadius: "var(--radius-md)",
        border: "1.5px solid var(--border)",
        boxShadow: "var(--shadow-xs)",
      }}>
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {/* 1. Interactive Demo Player */}
          <button
            id="tab-btn-demo"
            type="button"
            onClick={() => setPlayerMode("demo")}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: playerMode === "demo" ? "linear-gradient(135deg, var(--primary-light), var(--primary))" : "transparent",
              color: playerMode === "demo" ? "#FFFFFF" : "var(--text-secondary)",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              boxShadow: playerMode === "demo" ? "var(--shadow-purple)" : "none",
            }}
          >
            <span>✨</span>
            <span>{tLesson("tabDemo")}</span>
          </button>

          {/* 2. Tutorial Image / Diagram */}
          <button
            id="tab-btn-tutorial"
            type="button"
            onClick={() => setPlayerMode("tutorial")}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: playerMode === "tutorial" ? "linear-gradient(135deg, var(--primary-light), var(--primary))" : "transparent",
              color: playerMode === "tutorial" ? "#FFFFFF" : "var(--text-secondary)",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              boxShadow: playerMode === "tutorial" ? "var(--shadow-purple)" : "none",
            }}
          >
            <span>🖼️</span>
            <span>{tLesson("tabTutorial")}</span>
            {!isVideoAvailable && (
              <span style={{
                background: "var(--accent)",
                color: "#FFFFFF",
                fontSize: 10,
                padding: "2px 7px",
                borderRadius: "var(--radius-full)",
                fontWeight: 800,
              }}>
                {tLesson("primaryBadge")}
              </span>
            )}
          </button>

          {/* 3. YouTube Player */}
          <button
            id="tab-btn-youtube"
            type="button"
            onClick={() => setPlayerMode("youtube")}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-full)",
              border: "none",
              background: playerMode === "youtube" ? "linear-gradient(135deg, var(--primary-light), var(--primary))" : "transparent",
              color: playerMode === "youtube" ? "#FFFFFF" : "var(--text-secondary)",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              boxShadow: playerMode === "youtube" ? "var(--shadow-purple)" : "none",
            }}
          >
            <span>📺</span>
            <span>{tLesson("tabYoutube")}</span>
            {!isVideoAvailable && (
              <span style={{ fontSize: 11, opacity: 0.75 }}>{tLesson("diagramAvailable")}</span>
            )}
          </button>
        </div>

        {/* External Link */}
        {directWatchUrl && isVideoAvailable && (
          <a
            href={directWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--primary)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              background: "var(--primary-50)",
            }}
          >
            <span>YouTube પર જુઓ ↗</span>
          </a>
        )}
      </div>

      {/* Main Player Display Box */}
      <div style={{
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "#0F172A",
        position: "relative",
        width: "100%",
        aspectRatio: playerMode === "tutorial" ? "auto" : (isZoomed ? "4/3" : "16/9"),
        minHeight: playerMode === "tutorial" ? (isZoomed ? 440 : 360) : (isZoomed ? 340 : 250),
        boxShadow: "var(--shadow-md)",
        border: "4px solid #FFFFFF",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* MODE 1: Interactive Native Sign Demonstration (100% Reliable) */}
        {playerMode === "demo" && (
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(145deg, #0F172A 0%, #1E293B 50%, #1B2A6B 100%)",
            padding: "18px 22px",
            color: "#FFFFFF",
          }}>
            {/* Top Stage Badges */}
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(6px)",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
                <span style={{ fontSize: 18 }}>{gestureEmoji || "🤟"}</span>
                <span style={{ fontSize: 14, fontWeight: 800 }}>{targetSign || title}</span>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleSpeak}
                  disabled={isSpeaking}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#FFFFFF",
                    borderRadius: "var(--radius-full)",
                    padding: "6px 12px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  title="Speak sign pronunciation"
                >
                  <span>🔊</span>
                  <span>{tLesson("speakSign")}</span>
                </button>
              </div>
            </div>

            {/* Central Animated Hand Visual Stage */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              flex: 1,
            }}>
              {/* Radial glow background */}
              <div style={{
                position: "absolute",
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, rgba(124, 58, 237, 0.15) 60%, transparent 80%)",
                animation: isPlaying ? "pulse 2s infinite ease-in-out" : "none",
              }} />

              {/* Dynamic Animated Hand Art */}
              <AnimatedHandSign
                type={animationType}
                emoji={gestureEmoji || "🤟"}
                isPlaying={isPlaying}
                speed={speed}
              />

              {/* Motion Label */}
              <div style={{
                marginTop: 12,
                fontSize: 14,
                fontWeight: 800,
                color: "#FFFFFF",
                textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                background: "rgba(46, 16, 101, 0.75)",
                padding: "4px 14px",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(255,255,255,0.2)",
                textAlign: "center",
              }}>
                {gestureName || tLesson("handPosture")}
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(46, 16, 101, 0.85)",
              backdropFilter: "blur(8px)",
              padding: "10px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}>
              {/* Play / Pause Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                    border: "none",
                    color: "#FFFFFF",
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    cursor: "pointer",
                    boxShadow: "var(--shadow-accent)",
                  }}
                  title={isPlaying ? tLesson("pause") : tLesson("play")}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>

                {/* Speed buttons */}
                <button
                  onClick={() => setSpeed(speed === 1 ? 0.5 : 1)}
                  style={{
                    background: speed === 0.5 ? "rgba(249, 115, 22, 0.3)" : "rgba(255,255,255,0.12)",
                    border: speed === 0.5 ? "1.5px solid var(--accent)" : "1px solid rgba(255,255,255,0.25)",
                    color: "#FFFFFF",
                    padding: "5px 12px",
                    borderRadius: "var(--radius-full)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {speed === 0.5 ? `🐢 ${tLesson("slowSpeed")}` : `⚡ ${tLesson("normalSpeed")}`}
                </button>
              </div>

              {/* Current Step Progression Highlight */}
              <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", textAlign: "right", maxWidth: "60%" }}>
                {displaySteps[currentStep] || displaySteps[0]}
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* MODE 2: High-Definition Vector Tutorial Image & Diagram Mode */}
        {playerMode === "tutorial" && (
          <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, #FFFDFB 0%, #FFF7ED 50%, #FAF5FF 100%)",
            color: "var(--text-body)",
            padding: "16px 18px",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-xs)",
          }}>
            {/* Top Bar with Title and Actions (Clean wrapping - No collision) */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: "1.5px solid var(--border)",
              flexWrap: "wrap",
              gap: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{
                  background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 800,
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  whiteSpace: "nowrap",
                  boxShadow: "var(--shadow-accent)",
                }}>
                  {tLesson("tutorialDiagramOnly")}
                </span>
                <span style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>{targetSign || title}</span>
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  style={{
                    background: isZoomed ? "var(--primary)" : "#FFFFFF",
                    border: "1.5px solid var(--border)",
                    color: isZoomed ? "#FFFFFF" : "var(--text-primary)",
                    borderRadius: "var(--radius-full)",
                    padding: "4px 14px",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: "var(--shadow-xs)",
                    transition: "all var(--transition)",
                  }}
                >
                  {isZoomed ? `🔍 ${tLesson("resetZoom")}` : `🔍 ${tLesson("zoom")}`}
                </button>
                <button
                  onClick={handleSpeak}
                  style={{
                    background: "#FFFFFF",
                    border: "1.5px solid var(--border)",
                    color: "var(--text-primary)",
                    borderRadius: "var(--radius-full)",
                    padding: "4px 14px",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: "var(--shadow-xs)",
                    transition: "all var(--transition)",
                  }}
                >
                  🔊 {tLesson("speakSign")}
                </button>
              </div>
            </div>

            {/* Central Tutorial Diagram Stage */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isZoomed ? "1fr" : "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 14,
              alignItems: "stretch",
            }}>
              {/* Left Column: Graphic Vector Hand Diagram */}
              <div style={{
                background: "#FFFFFF",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid rgba(249, 115, 22, 0.25)",
                boxShadow: "var(--shadow-xs)",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {tutorialImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={tutorialImage}
                    alt={title || "Sign Tutorial"}
                    style={{ maxWidth: "100%", maxHeight: 220, objectFit: "contain", borderRadius: 8 }}
                  />
                ) : (
                  <SignHandDiagram
                    diagramType={diagramType || animationType}
                    targetSign={targetSign || title}
                    gestureName={gestureName}
                    gestureDescription={gestureDescription}
                    emoji={gestureEmoji}
                  />
                )}
              </div>

              {/* Right Column: Step-by-Step Educational Breakdown */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                justifyContent: "center",
                background: "var(--primary-50)",
                padding: "14px",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--primary-100)",
              }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--primary)",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}>
                  <span>📋</span>
                  <span>{tLesson("howToGuide")}</span>
                </div>

                {gestureName && (
                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--accent-hover)",
                    lineHeight: 1.4,
                    background: "var(--peach-100)",
                    padding: "6px 12px",
                    borderRadius: "var(--radius-sm)",
                    borderLeft: "3.5px solid var(--accent)",
                  }}>
                    {gestureName}
                  </div>
                )}

                {/* Steps List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {displaySteps.map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: 12.5,
                        color: "var(--text-body)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        background: "#FFFFFF",
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                      }}
                    >
                      <span style={{
                        background: "linear-gradient(135deg, var(--primary-light), var(--primary))",
                        color: "#FFFFFF",
                        fontSize: 11,
                        fontWeight: 800,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}>
                        {idx + 1}
                      </span>
                      <span style={{ lineHeight: 1.4, fontWeight: 600 }}>{step}</span>
                    </div>
                  ))}
                </div>

                {gestureDescription && (
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)", fontStyle: "italic", marginTop: 2 }}>
                    💡 {gestureDescription}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* MODE 3: YouTube Iframe View (With graceful fallback if no video) */}
        {playerMode === "youtube" && (
          <>
            {isVideoAvailable ? (
              <>
                {ytLoading && (
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
                        width: 44,
                        height: 44,
                        border: "4px solid var(--border)",
                        borderTopColor: "var(--accent)",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        margin: "0 auto 12px",
                      }} />
                      <p style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 600 }}>{t("videoLoading")}</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={`${videoUrl}${videoUrl?.includes("?") ? "&" : "?"}rel=0&modestbranding=1&autoplay=0`}
                  title={title || "Sign Language Video"}
                  width="100%"
                  height="100%"
                  style={{ border: "none", position: "absolute", inset: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setYtLoading(false)}
                />

                {/* Notice Overlay */}
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(15, 23, 42, 0.95))",
                  padding: "16px 16px 10px",
                  fontSize: 13,
                  color: "#FFFFFF",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                }}>
                  <span>ℹ️ જો YouTube વિડિઓ 'Unavailable' બતાવે, તો 'સંકેત ડેમો' અથવા 'ટ્યુટોરીયલ ચિત્ર' વાપરો.</span>
                  {directWatchUrl && (
                    <a
                      href={directWatchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--accent)",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      YouTube પર જુઓ ↗
                    </a>
                  )}
                </div>
              </>
            ) : (
              /* No video available fallback card */
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(145deg, #1E293B 0%, #0F172A 100%)",
                padding: "24px",
                textAlign: "center",
                color: "#FFFFFF",
              }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🖼️</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent)", marginBottom: 6 }}>
                  સત્તાવાર ટ્યુટોરીયલ ચિત્ર ઉપલબ્ધ છે
                </div>
                <p style={{ fontSize: 14, color: "#CBD5E1", maxWidth: 460, lineHeight: 1.5, marginBottom: 18 }}>
                  આ ચોક્કસ સંકેત માટે કોઈ બાહ્ય YouTube વિડિઓ નથી, પરંતુ SanketVidya નું સંપૂર્ણ સ્ટેપ-બાય-સ્ટેપ <strong>ટ્યુટોરીયલ ચિત્ર</strong> અને <strong>એનિમેટેડ ડેમો</strong> તૈયાર છે!
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setPlayerMode("tutorial")}
                    className="btn btn-primary"
                    style={{ padding: "8px 18px", fontSize: 13, borderRadius: "var(--radius-full)" }}
                  >
                    🖼️ ટ્યુટોરીયલ ચિત્ર જુઓ
                  </button>
                  <button
                    onClick={() => setPlayerMode("demo")}
                    className="btn btn-secondary"
                    style={{ padding: "8px 18px", fontSize: 13, borderRadius: "var(--radius-full)" }}
                  >
                    ✨ એનિમેટેડ ડેમો જુઓ
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Interactive Hand Posture & Sign Guide Card with Camera Link */}
      {(gestureEmoji || gestureName || gestureDescription) && (
        <div style={{
          background: "var(--bg-card)",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              fontSize: 32,
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--primary-50)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--primary-100)",
              flexShrink: 0,
            }}>
              {gestureEmoji || "🤟"}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--primary)" }}>
                {gestureName || "સંકેત મુદ્રા (Hand Shape Guide)"}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2, lineHeight: 1.4 }}>
                {gestureDescription}
              </div>
            </div>
          </div>
          <a
            href={`/camera?target=${encodeURIComponent(targetSign || title || "")}`}
            className="btn btn-outline"
            style={{
              padding: "8px 14px",
              fontSize: 13,
              borderRadius: "var(--radius-full)",
              borderColor: "var(--accent)",
              color: "var(--accent-hover)",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
            }}
          >
            <span>📷</span>
            <span>કૅમેરામાં પ્રેક્ટિસ કરો</span>
          </a>
        </div>
      )}
    </div>
  );
}

// ─── High Definition SVG Hand Sign Tutorial Diagram ───────────────────────────
function HandSignTutorialDiagram({ diagramType, emoji, targetSign, gestureName, gestureDescription }) {
  return (
    <SignHandDiagram
      diagramType={diagramType}
      targetSign={targetSign}
      gestureName={gestureName}
      gestureDescription={gestureDescription}
      emoji={emoji}
    />
  );
}

// ─── Interactive Animated Hand Vector Visualizer ──────────────────────────────
function AnimatedHandSign({ type, emoji, isPlaying, speed }) {
  const animDuration = (2 / speed) + "s";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    }}>
      {/* Animated Emoji Symbol */}
      <div style={{
        fontSize: 76,
        lineHeight: 1,
        filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.5))",
        animation: isPlaying ? `handWave ${animDuration} ease-in-out infinite alternate` : "none",
        transformOrigin: "bottom center",
      }}>
        {emoji}
      </div>

      {/* SVG Motion Trajectory & Hand Posture Diagram */}
      <svg width="120" height="40" viewBox="0 0 120 40" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#F2994A" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>

        {/* Motion guide path */}
        <path
          d="M 15 20 Q 60 5 105 20"
          fill="none"
          stroke="url(#neonGrad)"
          strokeWidth="3"
          strokeDasharray="6,4"
          strokeLinecap="round"
        />

        {/* Moving focal bead along the gesture line */}
        {isPlaying && (
          <circle r="5" fill="#FFFFFF" stroke="#F2994A" strokeWidth="2">
            <animateMotion
              path="M 15 20 Q 60 5 105 20"
              dur={animDuration}
              repeatCount="indefinite"
            />
          </circle>
        )}

        <text x="60" y="36" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle" fontWeight="600">
          સંકેત દિશા (Motion Flow)
        </text>
      </svg>
    </div>
  );
}
