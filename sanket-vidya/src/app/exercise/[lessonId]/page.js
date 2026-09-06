"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { getExercisesByLessonId, getLessonById, MODULES } from "@/lib/mockData";
import { saveAttempt } from "@/lib/localStorage";
import Navbar from "@/components/Navbar";
import ExerciseCard from "@/components/ExerciseCard";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ExercisePage() {
  const { lessonId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations("exercise");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const [exercises, setExercises] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    const exs = getExercisesByLessonId(lessonId);
    const les = getLessonById(lessonId);
    setTimeout(() => {
      setExercises(exs);
      setLesson(les);
      setStep(0);
      setAnswers([]);
      setDone(false);
    }, 0);
  }, [lessonId]);

  const handleAnswer = (result) => {
    const newAnswers = [...answers, result];
    setAnswers(newAnswers);

    // Save attempt
    if (user?.uid) {
      saveAttempt({
        studentId: user.uid,
        exerciseId: result.exercise.id,
        module: result.exercise.module,
        score: result.isCorrect ? 1 : 0,
        isCorrect: result.isCorrect,
      });
    }

    setTimeout(() => {
      if (step < exercises.length - 1) {
        setStep(step + 1);
      } else {
        setDone(true);
      }
    }, 1200);
  };

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const score = exercises.length > 0 ? Math.round((correctCount / exercises.length) * 100) : 0;

  const activeModule = exercises[0]?.module || "alphabets";
  const modColor = `var(--mod-${activeModule})`;

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
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 24px" }}>
        {/* Back Navigation Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push(lesson ? `/learn/${lesson.module}` : "/dashboard/student");
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
          {lesson && (
            <span style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>
              <Link href={`/learn/${lesson.module}`} style={{ color: "var(--primary)", textDecoration: "none" }}>
                {tNav(lesson.module)}
              </Link>
              {" › "}
              <span style={{ color: "var(--text-secondary)" }}>{lesson.title}</span>
            </span>
          )}
        </div>

        {!done ? (
          <>
            {/* Progress bar */}
            {exercises.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  marginBottom: 8,
                }}>
                  {/* Keeping lesson details in Gujarati as it is taught */}
                  <span>{lesson?.title || "Exercise"}</span>
                  <span>{step + 1}/{exercises.length}</span>
                </div>
                <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: 999, overflow: "hidden", border: "1px solid var(--border)" }}>
                  <div style={{
                    height: "100%",
                    width: `${((step) / exercises.length) * 100}%`,
                    background: modColor,
                    borderRadius: 999,
                    transition: "width 0.5s ease",
                    boxShadow: `0 1px 4px ${modColor}44`,
                  }} />
                </div>
              </div>
            )}

            {exercises.length > 0 ? (
              <div className="card" style={{
                padding: "28px 28px",
                background: "#FFFFFF",
              }}>
                <ExerciseCard
                  key={exercises[step]?.id}
                  exercise={exercises[step]}
                  index={step}
                  total={exercises.length}
                  onAnswer={handleAnswer}
                />
              </div>
            ) : (
              <div className="feedback-wrong" style={{ justifyContent: "center", padding: 32 }}>
                <span className="feedback-icon" role="img" aria-label="Warning">📭</span>
                <span>{t("noExercises")}</span>
                <Link
                  href={`/learn/${activeModule}`}
                  className="btn btn-secondary"
                  style={{ marginTop: 20 }}
                >
                  {t("backToLesson")}
                </Link>
              </div>
            )}
          </>
        ) : (
          /* Results screen */
          <div className="card" style={{
            padding: "40px 32px",
            textAlign: "center",
            animation: "slideUp 0.5s ease",
            background: "#FFFFFF",
          }}>
            <div style={{ fontSize: 72, marginBottom: 16, animation: "float 2s ease-in-out infinite" }} role="img" aria-label="Trophy">
              {score >= 80 ? "🏆" : score >= 50 ? "🌟" : "💪"}
            </div>
            <h2 className="font-display" style={{
              fontSize: 32,
              fontWeight: 800,
              marginBottom: 8,
              color: score >= 80 ? "var(--success)" : score >= 50 ? "var(--accent-hover)" : "var(--error-dark)",
            }}>
              {score >= 80 ? t("excellent") : score >= 50 ? t("goodEffort") : t("keepTrying")}
            </h2>

            {/* Score ring */}
            <div style={{ display: "flex", justifyContent: "center", position: "relative", marginBottom: 24 }}>
              <svg width={120} height={120} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={60} cy={60} r={50} fill="none" stroke="var(--bg-elevated)" strokeWidth={10} />
                <circle
                  cx={60} cy={60} r={50}
                  fill="none"
                  stroke={score >= 80 ? "var(--success)" : score >= 50 ? "var(--accent)" : "var(--error)"}
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - score / 100)}
                  style={{ transition: "stroke-dashoffset 1s ease", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" }}
                />
              </svg>
              <div style={{ position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", width: 120, height: 120, flexDirection: "column" }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)" }}>{score}%</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{t("yourScore")}</span>
              </div>
            </div>

            <p style={{ color: "var(--text-secondary)", fontWeight: 700, marginBottom: 28, fontSize: 16 }}>
              {correctCount} / {exercises.length} {t("correctAnswers")}
            </p>

            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href={`/learn/${activeModule}`}
                className="btn btn-secondary"
                style={{ height: 48 }}
              >
                {t("backToLesson")}
              </Link>
              <button
                onClick={() => { setStep(0); setAnswers([]); setDone(false); }}
                className="btn btn-primary"
                style={{ height: 48 }}
              >
                {t("retake")}
              </button>
              <Link href="/dashboard/student" className="btn btn-secondary" style={{ height: 48 }}>
                {t("backToDashboard")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
