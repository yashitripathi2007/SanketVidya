"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { getLessonsByModule, MODULES } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import WritingPad from "@/components/WritingPad";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LearnModulePage() {
  const { module } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations("lesson");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [writingDone, setWritingDone] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Interactive 1-100 Number Explorer state
  const [explorerNumber, setExplorerNumber] = useState(25);
  const [showNumberExplorer, setShowNumberExplorer] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    const fetched = getLessonsByModule(module);
    setTimeout(() => {
      setLessons(fetched);
      if (fetched.length > 0) setActiveLesson(fetched[0]);
      setWritingDone(false);
      setSelectedGroup("all");
      setSearchQuery("");
    }, 0);
  }, [module]);

  // Dynamic filter groups based on module
  const groupFilters = useMemo(() => {
    if (module === "alphabets") {
      return [
        { key: "all", label: `${t("filter_all")} (34)` },
        { key: "k-varg", label: t("filter_k_varg") },
        { key: "ch-varg", label: t("filter_ch_varg") },
        { key: "t-varg", label: t("filter_t_varg") },
        { key: "ta-varg", label: t("filter_ta_varg") },
        { key: "p-varg", label: t("filter_p_varg") },
        { key: "antahstha", label: t("filter_antahstha") },
        { key: "ushmakshar", label: t("filter_ushmakshar") },
      ];
    } else if (module === "numbers") {
      return [
        { key: "all", label: t("filter_all") },
        { key: "0-10", label: t("filter_zero_to_ten") },
        { key: "tens", label: t("filter_tens") },
      ];
    } else if (module === "words") {
      return [
        { key: "all", label: t("filter_all") },
        { key: "courtesy", label: t("filter_courtesy") },
        { key: "family", label: t("filter_family") },
        { key: "food", label: t("filter_food") },
        { key: "daily", label: t("filter_daily") },
        { key: "emotions", label: t("filter_emotions") },
      ];
    } else if (module === "science") {
      return [
        { key: "all", label: t("filter_all") },
        { key: "astronomy", label: t("filter_astronomy") },
        { key: "earth", label: t("filter_earth") },
        { key: "biology", label: t("filter_biology") },
        { key: "physics", label: t("filter_physics") },
      ];
    }
    return [{ key: "all", label: t("filter_all") }];
  }, [module, t]);

  // Filtered lessons list
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesGroup = selectedGroup === "all" || lesson.group === selectedGroup;
      const matchesSearch =
        !searchQuery.trim() ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lesson.gujaratiChar && lesson.gujaratiChar.includes(searchQuery.trim())) ||
        (lesson.textContent && lesson.textContent.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesGroup && matchesSearch;
    });
  }, [lessons, selectedGroup, searchQuery]);

  const moduleCfg = MODULES.find((m) => m.key === module) || { label: module, emoji: "📚" };
  const modColor = `var(--mod-${module})`;

  // Decompose numbers 1-100 for interactive explorer
  const getNumberBreakdown = (num) => {
    const gujaratiDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
    const tensNames = {
      10: "દસ (Ten)", 20: "વીસ (Twenty)", 30: "ત્રીસ (Thirty)", 40: "ચાલીસ (Forty)",
      50: "પચાસ (Fifty)", 60: "સાઈઠ (Sixty)", 70: "સિત્તેર (Seventy)", 80: "એંસી (Eighty)",
      90: "નેવું (Ninety)", 100: "સો (One Hundred)"
    };
    const tensDigit = Math.floor(num / 10);
    const unitDigit = num % 10;
    const gujaratiText = num.toString().split("").map((d) => gujaratiDigits[parseInt(d)]).join("");

    return {
      gujaratiNum: gujaratiText,
      tensDigit,
      unitDigit,
      tensChar: tensDigit > 0 ? gujaratiDigits[tensDigit] : null,
      unitChar: gujaratiDigits[unitDigit],
      label: tensNames[num] || `સંખ્યા ${num}`,
    };
  };

  if (loading || !user) {
    return (
      <div className="page-bg" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ width: 48, height: 48, border: "4px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  const breakdown = getNumberBreakdown(explorerNumber);

  return (
    <div className="page-bg" style={{ minHeight: "100vh" }}>
      <Navbar />
      
      {/* Back Navigation Bar */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "20px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
          <span style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>
            <Link href="/dashboard/student" style={{ color: "var(--primary)", textDecoration: "none" }}>{tNav("dashboard")}</Link>
            {" › "}
            <span style={{ color: "var(--text-secondary)" }}>{moduleCfg?.emoji} {tNav(module)}</span>
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "20px 20px 28px", display: "flex", gap: 24, flexWrap: "wrap" }}>

        {/* Sidebar */}
        <aside style={{
          width: 310,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
          {/* Module header */}
          <div style={{
            background: "var(--bg-card)",
            border: `2px solid ${modColor}`,
            borderRadius: "var(--radius-lg)",
            padding: "18px 20px",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 36 }}>{moduleCfg.emoji}</div>
              <span style={{
                background: "var(--primary-50)",
                color: "var(--primary)",
                fontSize: 12,
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
              }}>
                {lessons.length} {t("lessons")}
              </span>
            </div>
            <div className="font-display" style={{
              fontSize: 22,
              fontWeight: 800,
              color: modColor,
              marginTop: 6,
            }}>
              {tNav(module)}
            </div>

            {/* Special Number Explorer Toggle */}
            {module === "numbers" && (
              <button
                onClick={() => setShowNumberExplorer(!showNumberExplorer)}
                style={{
                  marginTop: 12,
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--accent)",
                  background: showNumberExplorer ? "var(--accent)" : "rgba(242, 153, 74, 0.1)",
                  color: showNumberExplorer ? "#FFFFFF" : "var(--accent-hover)",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transition: "all 0.2s",
                }}
              >
                <span>🔢</span>
                <span>{showNumberExplorer ? t("prevLesson") : t("explorerTitle")}</span>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              style={{
                width: "100%",
                padding: "9px 12px 9px 34px",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--border)",
                fontSize: 13,
                background: "#FFFFFF",
                outline: "none",
              }}
            />
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: 0.5 }}>
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: 12,
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Group Filter Chips */}
          {groupFilters.length > 1 && (
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              background: "var(--bg-card)",
              padding: "8px 10px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
            }}>
              {groupFilters.map((grp) => (
                <button
                  key={grp.key}
                  onClick={() => setSelectedGroup(grp.key)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "var(--radius-full)",
                    border: "none",
                    background: selectedGroup === grp.key ? modColor : "var(--bg-elevated)",
                    color: selectedGroup === grp.key ? "#FFFFFF" : "var(--text-secondary)",
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {grp.label}
                </button>
              ))}
            </div>
          )}

          {/* Lesson list */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            maxHeight: 520,
            overflowY: "auto",
            paddingRight: 4,
          }}>
            {filteredLessons.map((lesson) => {
              const isActive = activeLesson?.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setActiveLesson(lesson);
                    setWritingDone(false);
                    setShowNumberExplorer(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    border: `2px solid ${isActive ? modColor : "var(--border)"}`,
                    background: isActive ? "var(--bg-card)" : "#FFFFFF",
                    cursor: "pointer",
                    transition: "all var(--transition)",
                    textAlign: "left",
                    width: "100%",
                    minHeight: 48,
                    boxShadow: isActive ? "var(--shadow-sm)" : "none",
                  }}
                >
                  <span style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: isActive ? modColor : "var(--bg-elevated)",
                    color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}>
                    {lesson.gujaratiChar || lesson.order}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 800,
                      fontSize: 14,
                      color: isActive ? modColor : "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {lesson.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                      <span>{lesson.gestureEmoji}</span>
                      <span>{lesson.hasVideo ? "📹 Video" : "🖼️ Diagram"}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* SPECIAL: Interactive 1-100 Number Explorer Widget */}
          {module === "numbers" && showNumberExplorer ? (
            <div className="card" style={{ padding: 28, background: "#FFFFFF", animation: "fadeIn 0.3s ease", border: "1.5px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)" }}>
                    🔢 {t("explorerTitle")}
                  </h1>
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
                    {t("explorerSubtitle")}
                  </p>
                </div>
                <button
                  onClick={() => setShowNumberExplorer(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: 13, padding: "6px 16px", height: 40 }}
                >
                  ✕ {tCommon("back")}
                </button>
              </div>

              {/* Number Slider and Input */}
              <div style={{
                background: "var(--bg-elevated)",
                padding: "20px",
                borderRadius: "var(--radius-lg)",
                marginBottom: 24,
                border: "1.5px solid var(--border)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>
                    {t("targetSign")}:
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="font-display" style={{ fontSize: 36, fontWeight: 800, color: "var(--accent)" }}>
                      {breakdown.gujaratiNum}
                    </span>
                    <span style={{ fontSize: 18, color: "var(--text-muted)", fontWeight: 700 }}>
                      ({explorerNumber})
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={explorerNumber}
                  onChange={(e) => setExplorerNumber(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer", height: 8 }}
                />

                {/* Quick select chips */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                  {[1, 5, 10, 15, 21, 25, 50, 75, 99, 100].map((num) => (
                    <button
                      key={num}
                      onClick={() => setExplorerNumber(num)}
                      style={{
                        padding: "5px 14px",
                        borderRadius: "var(--radius-full)",
                        border: "1.5px solid var(--border)",
                        background: explorerNumber === num ? "linear-gradient(135deg, var(--accent), var(--accent-hover))" : "#FFFFFF",
                        color: explorerNumber === num ? "#FFFFFF" : "var(--text-primary)",
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: "pointer",
                        boxShadow: explorerNumber === num ? "var(--shadow-accent)" : "none",
                        transition: "all var(--transition)",
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Two-stage ISL Combination Breakdown */}
              <div style={{
                display: "grid",
                gridTemplateColumns: breakdown.tensChar ? "1fr 1fr" : "1fr",
                gap: 20,
                marginBottom: 24,
              }}>
                {/* Stage 1: Tens Digit (if applicable) */}
                {breakdown.tensChar && (
                  <div style={{
                    background: "linear-gradient(145deg, #FFFFFF 0%, var(--peach-50) 100%)",
                    padding: "20px",
                    borderRadius: "var(--radius-md)",
                    textAlign: "center",
                    border: "2px solid var(--border)",
                    boxShadow: "var(--shadow-xs)",
                  }}>
                    <div style={{ fontSize: 12, color: "var(--accent-hover)", fontWeight: 800, textTransform: "uppercase" }}>
                      {t("tensPlace")} (1)
                    </div>
                    <div className="font-display" style={{ fontSize: 52, fontWeight: 800, color: "var(--primary)", margin: "8px 0" }}>
                      {breakdown.tensChar}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-secondary)" }}>
                      {t("tensPlace")}: {breakdown.tensDigit}
                    </div>
                  </div>
                )}

                {/* Stage 2: Unit Digit */}
                <div style={{
                  background: "linear-gradient(145deg, #FFFFFF 0%, var(--primary-50) 100%)",
                  padding: "20px",
                  borderRadius: "var(--radius-md)",
                  textAlign: "center",
                  border: "2px solid var(--border)",
                  boxShadow: "var(--shadow-xs)",
                }}>
                  <div style={{ fontSize: 12, color: "var(--primary-light)", fontWeight: 800, textTransform: "uppercase" }}>
                    {t("unitsPlace")} (2)
                  </div>
                  <div className="font-display" style={{ fontSize: 52, fontWeight: 800, color: "var(--primary-violet)", margin: "8px 0" }}>
                    {breakdown.unitChar}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-secondary)" }}>
                    {t("unitsPlace")}: {breakdown.unitDigit}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined" && "speechSynthesis" in window) {
                      const utterance = new SpeechSynthesisUtterance(breakdown.gujaratiNum);
                      utterance.lang = "gu-IN";
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  className="btn btn-secondary"
                  style={{ gap: 6 }}
                >
                  <span>🔊</span>
                  <span>{t("speakSign")}</span>
                </button>
                <a
                  href={`/camera?target=${encodeURIComponent(breakdown.gujaratiNum)}`}
                  className="btn btn-primary"
                  style={{ gap: 6, textDecoration: "none" }}
                >
                  <span>📷</span>
                  <span>{tNav("camera")}</span>
                </a>
              </div>
            </div>
          ) : activeLesson ? (
            /* ───────────────────────────────────────────────────────────────── */
            /* Standard Lesson View */
            <div style={{ animation: "fadeIn 0.35s ease" }} key={activeLesson.id}>
              {/* Lesson title banner */}
              <div className="card" style={{ padding: 22, marginBottom: 18, background: "#FFFFFF" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}>
                  {activeLesson.gujaratiChar && (
                    <span className="font-display" style={{
                      fontSize: 56,
                      fontWeight: 800,
                      color: modColor,
                      lineHeight: 1,
                      textShadow: `0 2px 8px rgba(0,0,0,0.06)`,
                    }}>
                      {activeLesson.gujaratiChar}
                    </span>
                  )}
                  <div>
                    <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, color: "var(--primary)" }}>
                      {activeLesson.title}
                    </h1>
                    {activeLesson.textContent && (
                      <p style={{
                        color: "var(--text-secondary)",
                        fontSize: 14.5,
                        lineHeight: 1.5,
                        fontWeight: 500,
                      }}>
                        {activeLesson.textContent}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Two-column: Video/Tutorial Player + WritingPad */}
              <div
                className={activeLesson.writingPracticeTarget ? "learn-player-grid" : ""}
                style={!activeLesson.writingPracticeTarget ? { display: "grid", gridTemplateColumns: "1fr", gap: 20, marginBottom: 24 } : undefined}
              >
                {/* Video / Tutorial Player */}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{activeLesson.hasVideo ? t("videoAndDiagram") : t("tutorialDiagramOnly")}</span>
                  </div>
                  <VideoPlayer
                    videoUrl={activeLesson.signVideoUrl}
                    title={activeLesson.title}
                    caption={activeLesson.gujaratiChar ? `${activeLesson.gujaratiChar} — ${activeLesson.title}` : activeLesson.title}
                    gestureEmoji={activeLesson.gestureEmoji}
                    gestureName={activeLesson.gestureName}
                    gestureDescription={activeLesson.gestureDescription}
                    targetSign={activeLesson.gujaratiChar || activeLesson.title}
                    animationType={activeLesson.animationType}
                    diagramType={activeLesson.diagramType}
                    tutorialImage={activeLesson.tutorialImage}
                    steps={activeLesson.steps}
                    watchUrl={activeLesson.watchUrl}
                    hasVideo={activeLesson.hasVideo}
                  />
                </div>

                {/* Writing Pad */}
                {activeLesson.writingPracticeTarget && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-secondary)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      {t("writingPractice")}
                    </div>
                    <WritingPad
                      target={activeLesson.writingPracticeTarget}
                      onCheck={(result) => setWritingDone(true)}
                    />
                  </div>
                )}
              </div>

              {/* Navigation Bar */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {/* Previous */}
                {lessons.findIndex((l) => l.id === activeLesson.id) > 0 && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      const idx = lessons.findIndex((l) => l.id === activeLesson.id);
                      setActiveLesson(lessons[idx - 1]);
                      setWritingDone(false);
                    }}
                    style={{ height: 48 }}
                  >
                    {t("prevLesson")}
                  </button>
                )}

                {/* Exercise CTA */}
                <Link
                  href={`/exercise/${activeLesson.id}`}
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: "center", height: 48 }}
                >
                  {t("takeExercise")}
                </Link>

                {/* Next lesson */}
                {lessons.findIndex((l) => l.id === activeLesson.id) < lessons.length - 1 && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      const idx = lessons.findIndex((l) => l.id === activeLesson.id);
                      setActiveLesson(lessons[idx + 1]);
                      setWritingDone(false);
                    }}
                    style={{ height: 48 }}
                  >
                    {t("nextLesson")}
                  </button>
                )}
              </div>

              {writingDone && (
                <div 
                  className="feedback-correct" 
                  style={{ marginTop: 16 }}
                >
                  <span className="feedback-icon" role="img" aria-label="Success">🌟</span>
                  <span>{t("writingDone")}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="feedback-wrong" style={{ justifyContent: "center", padding: 32 }}>
              <span className="feedback-icon" role="img" aria-label="Empty State">📭</span>
              <span>{t("noLessonsFound")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
