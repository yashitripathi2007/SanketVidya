"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ExerciseCard({ exercise, onAnswer, index, total }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const t = useTranslations("exercise");

  if (!exercise) return null;

  const isCorrect = selected === exercise.correctAnswer;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    onAnswer?.({ exercise, selected, isCorrect });
  };

  return (
    <div style={{
      animation: "slideUp 0.4s ease",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}>
        <span style={{
          background: "var(--bg-elevated)",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius-full)",
          padding: "6px 16px",
          fontSize: 14,
          fontWeight: 700,
          color: "var(--text-primary)",
        }}>
          {t("question")} {index + 1} / {total}
        </span>
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          padding: "6px 16px",
          background: "var(--bg-elevated)",
          borderRadius: "var(--radius-full)",
          border: "1.5px solid var(--border)",
          color: "var(--text-secondary)",
        }}>
          {exercise.difficulty === "easy" ? t("easy") : exercise.difficulty === "medium" ? t("medium") : t("hard")}
        </span>
      </div>

      {/* Question */}
      <div style={{
        background: "var(--bg-elevated)",
        border: "1.5px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        marginBottom: 20,
        fontSize: 20,
        fontWeight: 800,
        color: "var(--text-primary)",
        lineHeight: 1.5,
      }}>
        {exercise.question}
      </div>

      {/* MCQ Options */}
      {exercise.type === "mcq" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {exercise.options.map((opt, i) => {
            let borderColor = "var(--border)";
            let bg = "var(--bg-card)";
            let color = "var(--text-body)";
            let icon = "";

            if (submitted) {
              if (opt === exercise.correctAnswer) {
                borderColor = "var(--success)";
                bg = "var(--success-light)";
                color = "var(--success-dark)";
                icon = "✅ ";
              } else if (opt === selected && !isCorrect) {
                borderColor = "var(--error)";
                bg = "var(--error-light)";
                color = "var(--error-dark)";
                icon = "❌ ";
              }
            } else if (opt === selected) {
              borderColor = "var(--primary)";
              bg = "var(--primary-50)";
              color = "var(--primary)";
            }

            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(opt)}
                disabled={submitted}
                style={{
                  background: bg,
                  border: `2px solid ${borderColor}`,
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                  minHeight: 52, // minimum 44px
                  color,
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: submitted ? "default" : "pointer",
                  transition: "all var(--transition)",
                  textAlign: "center",
                  transform: opt === selected && !submitted ? "scale(1.02)" : "scale(1)",
                  boxShadow: opt === selected && !submitted ? "var(--shadow-accent)" : "none",
                }}
              >
                {icon}{opt}
              </button>
            );
          })}
        </div>
      )}

      {/* Feedback Section (color AND icon always together) */}
      {submitted && (
        <div 
          className={isCorrect ? "feedback-correct" : "feedback-wrong"}
          style={{ marginBottom: 16 }}
        >
          <span className="feedback-icon" role="img" aria-label={isCorrect ? "Correct Icon" : "Wrong Icon"}>
            {isCorrect ? "🎉" : "💡"}
          </span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>
              {isCorrect ? t("correct") : t("wrong")}
            </div>
            {!isCorrect && (
              <div style={{ fontSize: 14, opacity: 0.9, marginTop: 2 }}>
                {t("correctAnswerIs")} <strong style={{ textDecoration: "underline" }}>{exercise.correctAnswer}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="btn btn-indigo w-full"
          style={{ fontSize: 16, height: 48 }}
        >
          {t("submit")}
        </button>
      )}
    </div>
  );
}
