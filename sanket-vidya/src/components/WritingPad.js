"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

export default function WritingPad({ target, onCheck }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [feedback, setFeedback] = useState(null); // null | "correct" | "great"
  const t = useTranslations("writing");

  // Resize canvas to fill container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width  = rect.width  || 300;
    canvas.height = rect.height || 300;
    drawGuide(canvas, target);
  }, [target]);

  function drawGuide(canvas, char) {
    if (!canvas || !char) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Faint guide character
    ctx.font = `800 ${canvas.height * 0.55}px 'Baloo 2', 'Noto Sans Gujarati', 'Noto Sans Devanagari', serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(27,42,107,0.06)";
    ctx.fillText(char, canvas.width / 2, canvas.height / 2);
    // Grid dots
    ctx.fillStyle = "rgba(27,42,107,0.1)";
    const step = 32;
    for (let x = step; x < canvas.width; x += step) {
      for (let y = step; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top)  * scaleY,
    };
  }

  const startDraw = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    setIsDrawing(true);
    setLastPos(getPos(e, canvas));
    setFeedback(null);
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "var(--primary)";
    ctx.lineWidth = 6;
    ctx.lineCap  = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(27,42,107,0.25)";
    ctx.shadowBlur  = 4;
    ctx.stroke();

    setLastPos(pos);
    setHasDrawn(true);
  }, [isDrawing, lastPos]);

  const endDraw = useCallback((e) => {
    e.preventDefault();
    setIsDrawing(false);
    setLastPos(null);
  }, []);

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGuide(canvas, target);
    setHasDrawn(false);
    setFeedback(null);
  };

  const handleCheck = () => {
    if (!hasDrawn) return;
    // Simulate check — always "great job" for demo
    const result = Math.random() > 0.25 ? "great" : "correct";
    setFeedback(result);
    onCheck?.(result);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Target display */}
      {target && (
        <div style={{
          textAlign: "center",
          fontSize: 15,
          fontWeight: 600,
          color: "var(--text-secondary)",
        }}>
          {t("traceLabel")} <span className="font-display" style={{ fontSize: 32, fontWeight: 800, color: "var(--accent)" }}>{target}</span>
        </div>
      )}

      {/* Canvas */}
      <div style={{
        position: "relative",
        width: "100%",
        height: 260,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "#FFFFFF",
        border: `3px solid ${
          feedback === "great"   ? "var(--success)"  :
          feedback === "correct" ? "var(--warning)" :
          "var(--border-strong)"
        }`,
        transition: "border-color var(--transition)",
        cursor: "crosshair",
        boxShadow: "var(--shadow-sm)",
      }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%", touchAction: "none" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          aria-label="Writing pad canvas"
        />

        {/* Feedback overlay (Icon + Color always together) */}
        {feedback && (
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: feedback === "great"
              ? "rgba(47,158,104,0.12)"
              : "rgba(245,158,11,0.12)",
            animation: "fadeIn 0.3s ease",
          }}>
            <div style={{ 
              textAlign: "center",
              background: "#FFFFFF",
              padding: "16px 24px",
              borderRadius: "var(--radius-md)",
              border: `2px solid ${feedback === "great" ? "var(--success)" : "var(--warning)"}`,
              boxShadow: "var(--shadow-md)"
            }}>
              <div style={{ fontSize: 48 }} role="img" aria-label="Feedback Icon">
                {feedback === "great" ? "🌟" : "✅"}
              </div>
              <div style={{
                fontSize: 18,
                fontWeight: 800,
                color: feedback === "great" ? "var(--success)" : "var(--warning)",
                marginTop: 8,
              }}>
                {feedback === "great" ? t("great") : t("good")}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12 }}>
        <button 
          onClick={handleClear} 
          className="btn btn-secondary" 
          style={{ flex: 1, height: 48 }}
          aria-label={t("clear")}
        >
          {t("clear")}
        </button>
        <button
          onClick={handleCheck}
          className="btn btn-primary"
          disabled={!hasDrawn}
          style={{ flex: 2, height: 48 }}
          aria-label={t("check")}
        >
          {t("check")}
        </button>
      </div>

      <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
        {t("hint")}
      </p>
    </div>
  );
}
