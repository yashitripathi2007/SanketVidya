"use client";
import { useTranslations } from "next-intl";

/**
 * High-Definition SVG Vector Hand Sign Illustrations
 * Accurately represents Indian Sign Language (ISL) hand shapes,
 * fingers, wrist posture, and directional motion guides.
 *
 * Enhanced with a warm educational studio stage, vivid anatomical
 * clarity, and localized indicator badges.
 */

export default function SignHandDiagram({
  diagramType = "fist",
  targetSign = "",
  gestureName = "",
  gestureDescription = "",
  emoji = "🤟",
  size = "md",
}) {
  const normType = (diagramType || "").toLowerCase();
  const t = useTranslations("lesson");

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      padding: "10px",
      gap: 12,
    }}>
      {/* 1. Main Vector SVG Diagram Stage (Warm Studio Canvas) */}
      <div style={{
        width: "100%",
        maxWidth: 250,
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 35%, #FFFDF8 0%, #FFF3EA 50%, #FEE5D5 85%, #F5ECFF 100%)",
        borderRadius: "var(--radius-lg)",
        border: "1.5px solid rgba(249, 115, 22, 0.3)",
        boxShadow: "0 6px 22px rgba(59, 24, 95, 0.10), 0 2px 8px rgba(249, 115, 22, 0.12)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Warm isometric/radial grid background */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(124, 58, 237, 0.10) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          pointerEvents: "none",
        }} />

        <svg
          viewBox="0 0 240 170"
          width="100%"
          height="100%"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Skin Gradient — Natural Warm Tones */}
            <linearGradient id="skinBase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="50%" stopColor="#FDBA74" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>

            {/* Shadow Skin */}
            <linearGradient id="skinShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>

            {/* Cyan Glow Path */}
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>

            {/* Orange Glow Path */}
            <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>

            {/* Violet Motion Path */}
            <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>

            {/* Soft Studio Shadow Filter */}
            <filter id="handShadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#3B185F" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Studio Focus Ring Aura */}
          <circle cx="120" cy="85" r="68" fill="rgba(249, 115, 22, 0.05)" stroke="rgba(124, 58, 237, 0.15)" strokeWidth="1.5" strokeDasharray="4,4" />

          {/* Dynamic Gesture Anatomy */}
          <g filter="url(#handShadow)">
            {renderHandGraphic(normType)}
          </g>
        </svg>

        {/* Companion Emoji in Top-Right Corner */}
        {emoji && (
          <div style={{
            position: "absolute",
            top: 8,
            right: 8,
            fontSize: 20,
            background: "#FFFFFF",
            border: "1.5px solid rgba(249, 115, 22, 0.25)",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
          title={gestureName || "Gesture symbol"}
          >
            {emoji}
          </div>
        )}

        {/* High-Definition Vector Indicator Badge */}
        <div style={{
          position: "absolute",
          bottom: 6,
          left: 8,
          fontSize: 9.5,
          fontWeight: 800,
          background: "rgba(59, 24, 95, 0.75)",
          color: "#FFFFFF",
          padding: "2px 6px",
          borderRadius: 4,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          HD ISL Vector
        </div>
      </div>

      {/* 2. Structured Information Flow */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        width: "100%",
        textAlign: "center",
      }}>
        {/* Posture Name Badge */}
        <div style={{
          background: "var(--primary-50)",
          border: "1px solid var(--primary-200)",
          color: "var(--primary)",
          fontSize: 12,
          fontWeight: 700,
          padding: "4px 14px",
          borderRadius: "var(--radius-full)",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {gestureName || t("handPosture")}
        </div>

        {/* Target Sign Accent Pill */}
        {targetSign && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--peach-100)",
            border: "1.5px solid var(--accent)",
            color: "var(--accent-hover)",
            fontSize: 12.5,
            fontWeight: 800,
            padding: "3px 14px",
            borderRadius: "var(--radius-full)",
          }}>
            <span>{t("targetSign")}:</span>
            <span style={{ fontSize: 14, color: "var(--primary)", fontWeight: 800 }}>{targetSign}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Specialized SVG Graphic Renderers for Specific Hand Gestures
// ─────────────────────────────────────────────────────────────────────────────
function renderHandGraphic(type) {
  // 1. PRAYER / NAMASTE (નમસ્તે)
  if (type === "folded_hands" || type === "namaste") {
    return (
      <g>
        {/* Left forearm */}
        <path d="M 80 160 L 95 125 L 105 132 L 95 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Right forearm */}
        <path d="M 160 160 L 145 125 L 135 132 L 145 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Left Palm & Fingers */}
        <path
          d="M 98 128 C 98 90, 106 60, 118 36 C 119 33, 120 33, 120 36 C 120 60, 120 90, 120 135 Z"
          fill="url(#skinBase)"
          stroke="#9A3412"
          strokeWidth="1.8"
        />
        {/* Right Palm & Fingers */}
        <path
          d="M 142 128 C 142 90, 134 60, 122 36 C 121 33, 120 33, 120 36 C 120 60, 120 90, 120 135 Z"
          fill="url(#skinBase)"
          stroke="#9A3412"
          strokeWidth="1.8"
        />
        {/* Center line of contact */}
        <line x1="120" y1="36" x2="120" y2="135" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
        {/* Finger joints crease lines */}
        <line x1="110" y1="70" x2="119" y2="70" stroke="rgba(124, 45, 18, 0.45)" strokeWidth="1.5" />
        <line x1="121" y1="70" x2="130" y2="70" stroke="rgba(124, 45, 18, 0.45)" strokeWidth="1.5" />
        <line x1="112" y1="92" x2="119" y2="92" stroke="rgba(124, 45, 18, 0.45)" strokeWidth="1.5" />
        <line x1="121" y1="92" x2="128" y2="92" stroke="rgba(124, 45, 18, 0.45)" strokeWidth="1.5" />
        {/* Thumb contours */}
        <path d="M 104 125 C 108 112, 114 112, 120 120" fill="none" stroke="#9A3412" strokeWidth="1.5" />
        {/* Respectful Energy Radiance Aura */}
        <circle cx="120" cy="32" r="5" fill="#FBBF24" />
        <path d="M 105 22 Q 120 14 135 22" fill="none" stroke="url(#amberGrad)" strokeWidth="2" strokeLinecap="round" />
      </g>
    );
  }

  // 2. TIGHT FIST / KA (ક, 10)
  if (type === "fist" || type === "tight_fist") {
    return (
      <g>
        {/* Wrist */}
        <path d="M 100 160 L 102 120 L 138 120 L 140 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Clenched Finger Rows */}
        <rect x="94" y="66" width="52" height="54" rx="16" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* 4 Folded Finger Sections */}
        <line x1="94" y1="79" x2="146" y2="79" stroke="#7C2D12" strokeWidth="1.5" />
        <line x1="94" y1="93" x2="146" y2="93" stroke="#7C2D12" strokeWidth="1.5" />
        <line x1="94" y1="107" x2="146" y2="107" stroke="#7C2D12" strokeWidth="1.5" />
        {/* Thumb wrapped across fingers horizontally */}
        <path
          d="M 90 98 C 88 84, 102 78, 126 80 C 138 82, 144 88, 142 96 C 140 104, 128 106, 112 106 C 96 106, 92 104, 90 98 Z"
          fill="url(#skinBase)"
          stroke="#7C2D12"
          strokeWidth="2"
        />
        {/* Thumb nail detail */}
        <rect x="130" y="85" width="8" height="8" rx="3" fill="#FED7AA" stroke="#9A3412" strokeWidth="1" />
        {/* Motion emphasis arc */}
        <path d="M 66 85 Q 120 40 174 85" fill="none" stroke="url(#cyanGrad)" strokeWidth="2.5" strokeDasharray="4,4" strokeLinecap="round" />
        <polygon points="174,85 164,78 166,88" fill="#38BDF8" />
      </g>
    );
  }

  // 3. HOOK / TWO CURVED FINGERS (ખ)
  if (type === "hook" || type === "two_curved") {
    return (
      <g>
        {/* Wrist */}
        <path d="M 102 160 L 105 125 L 135 125 L 138 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Palm base with folded ring & pinky */}
        <rect x="96" y="90" width="48" height="40" rx="12" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* Index Hook Finger */}
        <path
          d="M 104 90 L 104 50 C 104 38, 120 38, 120 50 L 118 64"
          fill="none"
          stroke="url(#skinBase)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 104 90 L 104 50 C 104 38, 120 38, 120 50 L 118 64"
          fill="none"
          stroke="#9A3412"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Middle Hook Finger */}
        <path
          d="M 124 90 L 124 52 C 124 40, 140 40, 140 52 L 138 66"
          fill="none"
          stroke="url(#skinBase)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 124 90 L 124 52 C 124 40, 140 40, 140 52 L 138 66"
          fill="none"
          stroke="#9A3412"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Thumb tucked over folded fingers */}
        <path d="M 94 104 C 100 96, 122 96, 126 106" fill="none" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
        {/* Curved hook motion guide */}
        <path d="M 80 50 Q 94 30 114 34" fill="none" stroke="url(#cyanGrad)" strokeWidth="2" strokeDasharray="3,3" />
        <polygon points="114,34 106,28 108,37" fill="#38BDF8" />
      </g>
    );
  }

  // 4. L-SHAPE / GA (ગ, L)
  if (type === "l_shape" || type === "l") {
    return (
      <g>
        {/* Wrist */}
        <path d="M 112 160 L 114 125 L 144 125 L 146 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Palm */}
        <rect x="110" y="85" width="40" height="42" rx="10" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* Upright Index Finger */}
        <rect x="112" y="32" width="14" height="60" rx="7" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        <rect x="114" y="36" width="10" height="12" rx="4" fill="#FED7AA" stroke="#9A3412" strokeWidth="1" />
        <line x1="112" y1="58" x2="126" y2="58" stroke="#7C2D12" strokeWidth="1.5" />
        {/* Extended 90° Thumb */}
        <path
          d="M 112 108 C 104 108, 68 110, 68 98 C 68 92, 102 90, 112 90 Z"
          fill="url(#skinBase)"
          stroke="#9A3412"
          strokeWidth="2"
        />
        <rect x="72" y="93" width="10" height="8" rx="3" fill="#FED7AA" stroke="#9A3412" strokeWidth="1" />
        {/* Folded remaining 3 fingers */}
        <line x1="126" y1="96" x2="148" y2="96" stroke="#7C2D12" strokeWidth="1.5" />
        <line x1="126" y1="108" x2="148" y2="108" stroke="#7C2D12" strokeWidth="1.5" />
        {/* 90-degree Angle Indicator */}
        <path d="M 102 92 L 102 100 L 110 100" fill="none" stroke="#FBBF24" strokeWidth="2" />
        <text x="96" y="84" fill="#FBBF24" fontSize="11" fontWeight="800">90°</text>
      </g>
    );
  }

  // 5. POINTING INDEX / NUMBER 1 (૧, 1)
  if (type === "pointing_index" || type === "one" || type === "index") {
    return (
      <g>
        {/* Wrist */}
        <path d="M 104 160 L 106 125 L 134 125 L 136 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Clenched Palm */}
        <rect x="96" y="82" width="48" height="46" rx="14" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* Single Raised Index Finger */}
        <rect x="110" y="26" width="16" height="66" rx="8" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        <rect x="113" y="30" width="10" height="12" rx="4" fill="#FED7AA" stroke="#9A3412" strokeWidth="1" />
        <line x1="110" y1="54" x2="126" y2="54" stroke="#7C2D12" strokeWidth="1.5" />
        <line x1="110" y1="72" x2="126" y2="72" stroke="#7C2D12" strokeWidth="1.5" />
        {/* Thumb wrapped over middle/ring fingers */}
        <path
          d="M 96 100 C 94 90, 114 90, 130 96 C 132 104, 118 108, 102 108 Z"
          fill="url(#skinBase)"
          stroke="#7C2D12"
          strokeWidth="1.8"
        />
        {/* Upward Energy Beam */}
        <line x1="118" y1="20" x2="118" y2="8" stroke="url(#cyanGrad)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="118" cy="6" r="3" fill="#38BDF8" />
      </g>
    );
  }

  // 6. V-SIGN / NUMBER 2 (૨, 2)
  if (type === "v_sign" || type === "two" || type === "peace") {
    return (
      <g>
        {/* Wrist */}
        <path d="M 104 160 L 106 125 L 134 125 L 136 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Clenched Palm */}
        <rect x="96" y="86" width="48" height="42" rx="14" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* Index Finger (Angled Left) */}
        <rect
          x="100"
          y="28"
          width="14"
          height="66"
          rx="7"
          transform="rotate(-14 107 61)"
          fill="url(#skinBase)"
          stroke="#9A3412"
          strokeWidth="2"
        />
        {/* Middle Finger (Angled Right) */}
        <rect
          x="126"
          y="28"
          width="14"
          height="66"
          rx="7"
          transform="rotate(14 133 61)"
          fill="url(#skinBase)"
          stroke="#9A3412"
          strokeWidth="2"
        />
        {/* Thumb wrapped over folded ring & pinky */}
        <path
          d="M 96 102 C 94 92, 118 92, 134 98 C 134 106, 120 110, 102 108 Z"
          fill="url(#skinBase)"
          stroke="#7C2D12"
          strokeWidth="1.8"
        />
        {/* 'V' Spread Angle Guide */}
        <path d="M 98 22 L 120 40 L 142 22" fill="none" stroke="url(#cyanGrad)" strokeWidth="2" strokeDasharray="3,3" />
      </g>
    );
  }

  // 7. THREE FINGERS / GH (ઘ, 3)
  if (type === "three" || type === "three_fingers") {
    return (
      <g>
        {/* Wrist */}
        <path d="M 104 160 L 106 125 L 134 125 L 136 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Clenched Palm */}
        <rect x="94" y="86" width="52" height="42" rx="14" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* 3 Upright Fingers (Index, Middle, Ring) */}
        <rect x="96" y="32" width="13" height="62" rx="6.5" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        <rect x="113.5" y="26" width="13" height="68" rx="6.5" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        <rect x="131" y="34" width="13" height="60" rx="6.5" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* Thumb over folded pinky */}
        <path
          d="M 96 106 C 96 96, 128 96, 142 106"
          fill="none"
          stroke="#7C2D12"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    );
  }

  // 8. ZERO / PINCH / O-RING (૦, 0)
  if (type === "circle_zero" || type === "zero" || type === "pinch" || type === "o_ring" || type === "circle") {
    return (
      <g>
        {/* Wrist */}
        <path d="M 104 160 L 106 125 L 134 125 L 136 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Hand Base */}
        <rect x="100" y="90" width="42" height="40" rx="12" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* Other 3 fingers slightly curved back */}
        <path d="M 134 90 C 146 76, 152 50, 144 38 C 138 38, 134 50, 134 68" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Curved Thumb & Index meeting to form perfect 'O' ring */}
        <circle cx="112" cy="62" r="28" fill="none" stroke="url(#skinBase)" strokeWidth="16" />
        <circle cx="112" cy="62" r="28" fill="none" stroke="#9A3412" strokeWidth="2" />
        {/* Contact point highlight */}
        <circle cx="106" cy="38" r="4" fill="#FBBF24" />
        {/* Target 'O' Label */}
        <circle cx="112" cy="62" r="16" fill="rgba(34, 211, 238, 0.15)" stroke="url(#cyanGrad)" strokeWidth="1.5" strokeDasharray="3,3" />
      </g>
    );
  }

  // 9. FLAT OPEN PALM / FIVE (૫, 5, ચ)
  if (type === "flat_palm" || type === "palm" || type === "open_hand" || type === "five" || type === "outward_palm") {
    return (
      <g>
        {/* Wrist */}
        <path d="M 102 160 L 105 125 L 135 125 L 138 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Palm Center */}
        <rect x="94" y="80" width="52" height="48" rx="14" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* Palm life lines */}
        <path d="M 102 96 Q 118 106 136 94" fill="none" stroke="rgba(124, 45, 18, 0.4)" strokeWidth="1.5" />
        <path d="M 106 112 Q 120 114 130 110" fill="none" stroke="rgba(124, 45, 18, 0.4)" strokeWidth="1.5" />
        {/* 4 Extended Upright Fingers */}
        <rect x="95" y="32" width="11" height="54" rx="5.5" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="1.8" />
        <rect x="108" y="24" width="11" height="62" rx="5.5" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="1.8" />
        <rect x="121" y="26" width="11" height="60" rx="5.5" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="1.8" />
        <rect x="134" y="36" width="11" height="50" rx="5.5" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="1.8" />
        {/* Thumb spread out to the left */}
        <path
          d="M 94 98 C 84 94, 68 84, 72 74 C 76 68, 88 80, 96 86 Z"
          fill="url(#skinBase)"
          stroke="#9A3412"
          strokeWidth="1.8"
        />
        {/* Gentle outward motion indicator */}
        <path d="M 70 45 Q 120 20 170 45" fill="none" stroke="url(#cyanGrad)" strokeWidth="2" strokeDasharray="4,4" />
      </g>
    );
  }

  // 10. SHAKA / J-SHAPE (જ, ૬, Shaka)
  if (type === "shaka" || type === "j_shape" || type === "six") {
    return (
      <g>
        {/* Wrist */}
        <path d="M 104 160 L 106 125 L 134 125 L 136 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Center Clenched Palm */}
        <rect x="98" y="80" width="44" height="46" rx="14" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* Folded Center 3 fingers */}
        <line x1="104" y1="92" x2="136" y2="92" stroke="#7C2D12" strokeWidth="1.5" />
        <line x1="104" y1="104" x2="136" y2="104" stroke="#7C2D12" strokeWidth="1.5" />
        {/* Extended Thumb (Left) */}
        <path
          d="M 100 102 C 86 98, 64 86, 68 76 C 72 70, 88 82, 102 90 Z"
          fill="url(#skinBase)"
          stroke="#9A3412"
          strokeWidth="2"
        />
        {/* Extended Pinky (Right) */}
        <path
          d="M 140 102 C 154 96, 172 82, 168 72 C 164 68, 150 82, 138 90 Z"
          fill="url(#skinBase)"
          stroke="#9A3412"
          strokeWidth="2"
        />
        {/* Trajectory Guide for J motion */}
        <path d="M 148 40 Q 148 80 118 80 Q 94 80 94 65" fill="none" stroke="url(#cyanGrad)" strokeWidth="2.5" strokeDasharray="4,3" strokeLinecap="round" />
        <polygon points="94,65 88,72 98,72" fill="#38BDF8" />
      </g>
    );
  }

  // 11. THUMBS UP / SARU / MADAD (સારું, મદદ, 👍)
  if (type === "thumbs_up" || type === "good" || type === "help") {
    return (
      <g>
        {/* Wrist */}
        <path d="M 104 160 L 106 125 L 134 125 L 136 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Clenched Fist Base */}
        <rect x="94" y="80" width="52" height="48" rx="14" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* Folded fingers creases */}
        <line x1="94" y1="94" x2="142" y2="94" stroke="#7C2D12" strokeWidth="1.5" />
        <line x1="94" y1="108" x2="142" y2="108" stroke="#7C2D12" strokeWidth="1.5" />
        {/* Upright Proud Thumb */}
        <path
          d="M 94 88 C 94 80, 102 36, 114 36 C 124 36, 126 78, 124 88 Z"
          fill="url(#skinBase)"
          stroke="#9A3412"
          strokeWidth="2"
        />
        <rect x="105" y="40" width="8" height="10" rx="3" fill="#FED7AA" stroke="#9A3412" strokeWidth="1" />
        {/* Approval sparkles */}
        <path d="M 80 45 L 86 45 M 83 40 L 83 50" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <path d="M 140 45 L 146 45 M 143 40 L 143 50" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      </g>
    );
  }

  // 12. I LOVE YOU / PREM (પ્રેમ, 🤟)
  if (type === "love_sign" || type === "ily" || type === "love") {
    return (
      <g>
        {/* Wrist */}
        <path d="M 104 160 L 106 125 L 134 125 L 136 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Palm Base */}
        <rect x="98" y="82" width="44" height="44" rx="14" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* Upright Index Finger */}
        <rect x="102" y="28" width="12" height="62" rx="6" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* Upright Pinky Finger */}
        <rect x="128" y="36" width="11" height="54" rx="5.5" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* Folded Middle & Ring Fingers */}
        <path d="M 114 84 C 114 100, 128 100, 128 84" fill="url(#skinShadow)" stroke="#7C2D12" strokeWidth="1.8" />
        {/* Extended Thumb */}
        <path
          d="M 100 102 C 86 98, 64 86, 68 76 C 72 70, 88 82, 102 90 Z"
          fill="url(#skinBase)"
          stroke="#9A3412"
          strokeWidth="2"
        />
        {/* Heart Glow */}
        <path d="M 120 22 C 114 16, 108 20, 112 26 L 120 32 L 128 26 C 132 20, 126 16, 120 22 Z" fill="#EF4444" />
      </g>
    );
  }

  // 13. FOUR FINGERS (૪, 4)
  if (type === "four" || type === "four_fingers" || type === "forty") {
    return (
      <g>
        {/* Wrist */}
        <path d="M 104 160 L 106 125 L 134 125 L 136 160 Z" fill="url(#skinShadow)" stroke="#9A3412" strokeWidth="1.5" />
        {/* Palm */}
        <rect x="92" y="84" width="56" height="44" rx="14" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* 4 Upright Fingers */}
        <rect x="94" y="32" width="11" height="58" rx="5.5" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="1.8" />
        <rect x="107" y="24" width="11" height="66" rx="5.5" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="1.8" />
        <rect x="120" y="26" width="11" height="64" rx="5.5" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="1.8" />
        <rect x="133" y="34" width="11" height="56" rx="5.5" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="1.8" />
        {/* Thumb tucked inside palm */}
        <path d="M 94 104 C 104 98, 124 98, 134 104" fill="none" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    );
  }

  // 14. UMBRELLA (છત્રી, છ)
  if (type === "umbrella") {
    return (
      <g>
        {/* Stem / Handle fist */}
        <rect x="114" y="90" width="12" height="60" rx="4" fill="#94A3B8" stroke="#334155" strokeWidth="2" />
        {/* Canopy arc */}
        <path d="M 70 88 Q 120 30 170 88 Z" fill="url(#cyanGrad)" stroke="#0284C7" strokeWidth="2" />
        <path d="M 70 88 Q 120 70 170 88" fill="none" stroke="#0284C7" strokeWidth="1.5" />
        <circle cx="120" cy="30" r="4" fill="#FBBF24" />
      </g>
    );
  }

  // 15. FLAG / WAVE (ઝંડો)
  if (type === "wave" || type === "flag") {
    return (
      <g>
        {/* Flagpole */}
        <line x1="85" y1="30" x2="85" y2="155" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
        {/* Fluttering Flag */}
        <path
          d="M 87 35 Q 125 20 155 35 Q 185 50 175 75 Q 145 60 115 75 Q 95 85 87 75 Z"
          fill="url(#amberGrad)"
          stroke="#EA580C"
          strokeWidth="2"
        />
        {/* Motion Wave Arrows */}
        <path d="M 120 100 Q 145 90 170 100" fill="none" stroke="url(#cyanGrad)" strokeWidth="2" strokeDasharray="3,3" />
        <polygon points="170,100 162,94 164,104" fill="#38BDF8" />
      </g>
    );
  }

  // 16. CIRCLE CHEST / PLEASE (કૃપા કરીને)
  if (type === "circle_chest") {
    return (
      <g>
        {/* Chest outline */}
        <path d="M 60 150 Q 120 110 180 150" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        {/* Palm on chest */}
        <ellipse cx="120" cy="85" rx="34" ry="24" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        {/* Circular rubbing path */}
        <circle cx="120" cy="85" r="48" fill="none" stroke="url(#cyanGrad)" strokeWidth="2.5" strokeDasharray="6,4" />
        <polygon points="168,85 160,78 162,88" fill="#38BDF8" />
      </g>
    );
  }

  // 17. COMPOSITE / TENS NUMBERS (૨૫, ૩૦, ૪૦, etc.)
  if (type === "composite" || type === "tens") {
    return (
      <g>
        {/* First Hand (Left) */}
        <g transform="translate(-25, 10) scale(0.75)">
          <rect x="94" y="80" width="52" height="48" rx="14" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
          <rect x="100" y="28" width="14" height="66" rx="7" transform="rotate(-14 107 61)" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
          <rect x="126" y="28" width="14" height="66" rx="7" transform="rotate(14 133 61)" fill="url(#skinBase)" stroke="#9A3412" strokeWidth="2" />
        </g>
        {/* Arrow between */}
        <path d="M 105 85 L 135 85" stroke="url(#cyanGrad)" strokeWidth="3" strokeLinecap="round" />
        <polygon points="135,85 127,80 129,90" fill="#38BDF8" />
        {/* Second Hand (Right) */}
        <g transform="translate(45, 10) scale(0.75)">
          <circle cx="112" cy="62" r="28" fill="none" stroke="url(#skinBase)" strokeWidth="16" />
          <circle cx="112" cy="62" r="28" fill="none" stroke="#9A3412" strokeWidth="2" />
        </g>
      </g>
    );
  }

  // 18. DEFAULT DIRECTIONAL MOTION & SHAPE VISUALIZER
  return (
    <g>
      {/* Anatomical Hand Base */}
      <path
        d="M 95 155 C 95 125, 100 110, 105 95 C 108 85, 112 70, 120 48 C 128 70, 132 85, 135 95 C 140 110, 145 125, 145 155 Z"
        fill="url(#skinBase)"
        stroke="#9A3412"
        strokeWidth="2"
      />
      {/* Wrist cuff */}
      <path d="M 95 155 L 145 155" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />
      {/* Dynamic Motion Arc with Arrowhead */}
      <path
        d="M 65 85 Q 120 30 175 85"
        fill="none"
        stroke="url(#cyanGrad)"
        strokeWidth="3"
        strokeDasharray="6,4"
        strokeLinecap="round"
      />
      <polygon points="175,85 164,76 166,88" fill="#38BDF8" />
      {/* Motion Focal Beads */}
      <circle cx="75" cy="82" r="5" fill="#F59E0B" />
      <circle cx="120" cy="57" r="4" fill="#22D3EE" />
      <circle cx="165" cy="82" r="5" fill="#38BDF8" />
    </g>
  );
}
