"use client";
import { useEffect, useState } from "react";
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

  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [writingDone, setWritingDone] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    const fetched = getLessonsByModule(module);
    setTimeout(() => {
      setLessons(fetched);
      if (fetched.length > 0) setActiveLesson(fetched[0]);
      setWritingDone(false);
    }, 0);
  }, [module]);

  const moduleCfg = MODULES.find((m) => m.key === module) || { label: module, emoji: "📚" };
  const modColor = `var(--mod-${module})`;

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
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "flex", gap: 24, flexWrap: "wrap" }}>

        {/* Sidebar */}
        <aside style={{
          width: 280,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          {/* Module header */}
          <div style={{
            background: "var(--bg-card)",
            border: `2px solid ${modColor}`,
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>{moduleCfg.emoji}</div>
            <div className="font-display" style={{
              fontSize: 22,
              fontWeight: 800,
              color: modColor,
            }}>
              {tNav(module)}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700, marginTop: 2, textTransform: "uppercase" }}>
              {lessons.length} {t("lessons")}
            </div>
          </div>

          {/* Lesson list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {lessons.map((lesson, i) => {
              const isActive = activeLesson?.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => { setActiveLesson(lesson); setWritingDone(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    border: `2.5px solid ${isActive ? modColor : "var(--border)"}`,
                    background: isActive ? "var(--bg-card)" : "var(--bg-card)",
                    cursor: "pointer",
                    transition: "all var(--transition)",
                    textAlign: "left",
                    width: "100%",
                    minHeight: 52, // minimum 44px
                    boxShadow: isActive ? "var(--shadow-sm)" : "none",
                  }}
                >
                  <span style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: isActive ? modColor : "var(--bg-elevated)",
                    color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 800,
                    flexShrink: 0,
                    transition: "all var(--transition)",
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Always keep actual lesson letters in original script (Gujarati) */}
                    <div style={{
                      fontWeight: 800,
                      fontSize: 15,
                      color: isActive ? modColor : "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {lesson.gujaratiChar || lesson.title}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                      {lesson.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {activeLesson ? (
            <div style={{ animation: "fadeIn 0.4s ease" }} key={activeLesson.id}>
              {/* Lesson title */}
              <div className="card" style={{ padding: 24, marginBottom: 20, background: "#FFFFFF" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}>
                  {activeLesson.gujaratiChar && (
                    <span className="font-display" style={{
                      fontSize: 60,
                      fontWeight: 800,
                      color: modColor,
                      lineHeight: 1,
                      textShadow: `0 2px 10px rgba(0,0,0,0.06)`,
                    }}>
                      {activeLesson.gujaratiChar}
                    </span>
                  )}
                  <div>
                    {/* Actual lesson title / character content stays in Gujarati as taught */}
                    <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: "var(--primary)" }}>{activeLesson.title}</h1>
                    {activeLesson.textContent && (
                      <p style={{
                        color: "var(--text-secondary)",
                        fontSize: 15,
                        lineHeight: 1.6,
                        fontWeight: 500,
                      }}>
                        {activeLesson.textContent}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Two-column: Video + WritingPad */}
              <div style={{ display: "grid", gridTemplateColumns: activeLesson.writingPracticeTarget ? "1fr 1fr" : "1fr", gap: 20, marginBottom: 24 }}>
                {/* Video */}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-secondary)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    {t("signVideo")}
                  </div>
                  <VideoPlayer
                    videoUrl={activeLesson.signVideoUrl}
                    title={activeLesson.title}
                    caption={activeLesson.gujaratiChar ? `${activeLesson.gujaratiChar} — ${activeLesson.title}` : activeLesson.title}
                  />
                </div>

                {/* Writing Pad */}
                {activeLesson.writingPracticeTarget && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-secondary)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                      {t("writingPractice")}
                    </div>
                    <WritingPad
                      target={activeLesson.writingPracticeTarget}
                      onCheck={(result) => setWritingDone(true)}
                    />
                  </div>
                )}
              </div>

              {/* Navigation */}
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
              <span>No lessons found.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
