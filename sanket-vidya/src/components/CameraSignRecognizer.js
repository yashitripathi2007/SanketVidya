"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";

// Standard hand landmark connections for skeleton rendering
const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm across
  [5, 9], [9, 13], [13, 17]
];

// Target practice sign list for challenge mode
const PRACTICE_TARGETS = [
  { char: "૧", label: "૧ (One / એક)", emoji: "☝️", hint: "Raise only your index finger vertically." },
  { char: "૨", label: "૨ (Two / બે)", emoji: "✌️", hint: "Raise index and middle fingers in a V-shape." },
  { char: "૩", label: "૩ (Three / ત્રણ)", emoji: "🤟", hint: "Raise index, middle, and ring fingers." },
  { char: "૫", label: "૫ (Five / પાંચ)", emoji: "🖐️", hint: "Open your palm with all 5 fingers spread." },
  { char: "૦", label: "૦ (Zero / શૂન્ય)", emoji: "⭕", hint: "Touch thumb and index tips together in an 'O' ring." },
  { char: "ક", label: "ક (Ka / કમળ)", emoji: "✊", hint: "Clench a fist with thumb wrapped across." },
  { char: "ગ", label: "ગ (Ga / ગાય)", emoji: "👆", hint: "Make an L-shape with thumb and index finger." },
  { char: "નમસ્તે", label: "નમસ્તે (Hello)", emoji: "🙏", hint: "Open hand greeting or press both palms together." },
  { char: "સારું", label: "સારું (Good / 👍)", emoji: "👍", hint: "Thumbs up with all other fingers curled." },
  { char: "પ્રેમ", label: "પ્રેમ (I Love You)", emoji: "🤟", hint: "Extend thumb, index, and pinky (🤟)." },
];

export default function CameraSignRecognizer({ initialTarget = null }) {
  const t = useTranslations("camera");
  const tCommon = useTranslations("common");

  // DOM Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const recognizerRef = useRef(null);
  const streamRef = useRef(null);

  // State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [detectedSign, setDetectedSign] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [mode, setMode] = useState(() => {
    if (initialTarget) {
      const idx = PRACTICE_TARGETS.findIndex((p) => p.char === initialTarget || initialTarget.includes(p.char));
      if (idx !== -1) return "challenge";
    }
    return "free";
  });

  const [challengeIdx, setChallengeIdx] = useState(() => {
    if (initialTarget) {
      const idx = PRACTICE_TARGETS.findIndex((p) => p.char === initialTarget || initialTarget.includes(p.char));
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const [score, setScore] = useState(0);
  const [challengeSuccess, setChallengeSuccess] = useState(false);
  const [sentence, setSentence] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'numbers' | 'alphabets' | 'words'

  // Hold timer for challenge / sentence accumulation
  const holdCountRef = useRef(0);
  const lastRecognizedRef = useRef(null);
  const challengeIdxRef = useRef(challengeIdx);

  useEffect(() => {
    challengeIdxRef.current = challengeIdx;
  }, [challengeIdx]);

  // 1. Speech Synthesis helper
  const speakText = useCallback((textToSpeak) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "gu-IN";
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setIsSpeaking(false);
    }
  }, []);

  // 2. Trigger Challenge Success
  const triggerChallengeSuccess = useCallback(() => {
    setChallengeSuccess(true);
    setScore((s) => s + 10);

    // Audio cue
    const target = PRACTICE_TARGETS[challengeIdxRef.current];
    speakText(target?.char || "બરાબર");

    setTimeout(() => {
      setChallengeSuccess(false);
      setChallengeIdx((prev) => (prev + 1) % PRACTICE_TARGETS.length);
      holdCountRef.current = 0;
    }, 1600);
  }, [speakText]);

  // 3. Landmark Classifier for Indian Sign Language & Gujarati Signs
  const classifyGesture = useCallback((landmarksList, gesturesList) => {
    if (!landmarksList || landmarksList.length === 0) return null;

    const landmarks = landmarksList[0]; // Primary hand
    const defaultGesture = gesturesList && gesturesList.length > 0 && gesturesList[0].length > 0
      ? gesturesList[0][0]
      : null;

    const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const indexTip = landmarks[8];
    const indexPIP = landmarks[6];
    const middleTip = landmarks[12];
    const middlePIP = landmarks[10];
    const ringTip = landmarks[16];
    const ringPIP = landmarks[14];
    const pinkyTip = landmarks[20];
    const pinkyPIP = landmarks[18];

    const indexExtended = indexTip.y < indexPIP.y;
    const middleExtended = middleTip.y < middlePIP.y;
    const ringExtended = ringTip.y < ringPIP.y;
    const pinkyExtended = pinkyTip.y < pinkyPIP.y;
    const thumbExtended = dist(thumbTip, wrist) > dist(thumbIP, wrist) * 1.15;

    const extendedCount = (indexExtended ? 1 : 0) +
                          (middleExtended ? 1 : 0) +
                          (ringExtended ? 1 : 0) +
                          (pinkyExtended ? 1 : 0);

    const thumbIndexDist = dist(thumbTip, indexTip);

    // Two hands detected? Check for Namaste / Home
    if (landmarksList.length >= 2) {
      const hand1 = landmarksList[0];
      const hand2 = landmarksList[1];
      const wristDist = dist(hand1[0], hand2[0]);
      const fingertipsDist = dist(hand1[8], hand2[8]);

      if (wristDist < 0.25 && fingertipsDist < 0.15) {
        return {
          sign: "નમસ્તે",
          label: "નમસ્તે (Namaste / Hello)",
          emoji: "🙏",
          category: "word",
          confidence: 0.95,
        };
      }
      if (fingertipsDist < 0.12 && wristDist > 0.3) {
        return {
          sign: "ઘર",
          label: "ઘર (Home / House)",
          emoji: "🏠",
          category: "word",
          confidence: 0.92,
        };
      }
    }

    // 1. ILoveYou Gesture (🤟)
    if (indexExtended && pinkyExtended && !middleExtended && !ringExtended && thumbExtended) {
      return {
        sign: "પ્રેમ",
        label: "પ્રેમ (I Love You / સંકેત)",
        emoji: "🤟",
        category: "word",
        confidence: 0.96,
      };
    }

    // 2. Thumbs Up / Good (👍)
    if (thumbTip.y < wrist.y && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      return {
        sign: "સારું",
        label: "સારું (Good / 👍)",
        emoji: "👍",
        category: "word",
        confidence: defaultGesture?.categoryName === "Thumb_Up" ? 0.98 : 0.91,
      };
    }

    // 3. Victory / Number 2 (✌️ / ૨)
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
      return {
        sign: "૨",
        label: "૨ (Two / બે)",
        emoji: "✌️",
        category: "number",
        confidence: 0.95,
      };
    }

    // 4. Number 1 (☝️ / ૧)
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      if (thumbExtended && Math.abs(thumbTip.x - indexTip.x) > 0.15) {
        return {
          sign: "ગ",
          label: "ગ (Ga / ગાય)",
          emoji: "👆",
          category: "alphabet",
          confidence: 0.92,
        };
      }
      return {
        sign: "૧",
        label: "૧ (One / એક)",
        emoji: "☝️",
        category: "number",
        confidence: 0.96,
      };
    }

    // 5. Water (💧 / પાણી)
    if (indexExtended && middleExtended && ringExtended && !pinkyExtended) {
      return {
        sign: "પાણી",
        label: "પાણી (Water / ૩)",
        emoji: "💧",
        category: "word",
        confidence: 0.93,
      };
    }

    // 6. Number 3 (૩)
    if (indexExtended && middleExtended && ringExtended && !pinkyExtended && !thumbExtended) {
      return {
        sign: "૩",
        label: "૩ (Three / ત્રણ)",
        emoji: "🤟",
        category: "number",
        confidence: 0.91,
      };
    }

    // 7. Number 4 (૪)
    if (indexExtended && middleExtended && ringExtended && pinkyExtended && !thumbExtended) {
      return {
        sign: "૪",
        label: "૪ (Four / ચાર)",
        emoji: "✋",
        category: "number",
        confidence: 0.94,
      };
    }

    // 8. Number 5 / Open Palm (🖐️ / ૫)
    if (extendedCount >= 4 && thumbExtended) {
      return {
        sign: "૫",
        label: "૫ (Five / પાંચ / ખુલ્લી હથેળી)",
        emoji: "🖐️",
        category: "number",
        confidence: 0.97,
      };
    }

    // 9. Zero / 'O' shape (⭕ / ૦)
    if (thumbIndexDist < 0.06 && !middleExtended && !ringExtended) {
      return {
        sign: "૦",
        label: "૦ (Zero / શૂન્ય)",
        emoji: "⭕",
        category: "number",
        confidence: 0.94,
      };
    }

    // 10. Closed Fist / Ka (✊ / ક)
    if (extendedCount === 0) {
      return {
        sign: "ક",
        label: "ક (Ka / કમળ / મુઠ્ઠી)",
        emoji: "✊",
        category: "alphabet",
        confidence: 0.93,
      };
    }

    // Fallback: If MediaPipe provided a recognized gesture label
    if (defaultGesture && defaultGesture.score > 0.6) {
      const gName = defaultGesture.categoryName;
      if (gName === "Pointing_Up") return { sign: "૧", label: "૧ (One / એક)", emoji: "☝️", category: "number", confidence: defaultGesture.score };
      if (gName === "Victory") return { sign: "૨", label: "૨ (Two / બે)", emoji: "✌️", category: "number", confidence: defaultGesture.score };
      if (gName === "Open_Palm") return { sign: "૫", label: "૫ (Five / પાંચ)", emoji: "🖐️", category: "number", confidence: defaultGesture.score };
      if (gName === "Closed_Fist") return { sign: "ક", label: "ક (Ka / મુઠ્ઠી)", emoji: "✊", category: "alphabet", confidence: defaultGesture.score };
      if (gName === "Thumb_Up") return { sign: "સારું", label: "સારું (Good / 👍)", emoji: "👍", category: "word", confidence: defaultGesture.score };
      if (gName === "ILoveYou") return { sign: "પ્રેમ", label: "પ્રેમ (I Love You)", emoji: "🤟", category: "word", confidence: defaultGesture.score };
    }

    return null;
  }, []);

  // 4. Drawing hand landmarks on canvas
  const drawHandSkeleton = useCallback((ctx, landmarksList, width, height) => {
    ctx.clearRect(0, 0, width, height);

    if (!landmarksList || landmarksList.length === 0) return;

    for (const landmarks of landmarksList) {
      // 1. Connection lines (glowing cyan)
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#22D3EE";
      ctx.shadowColor = "#06B6D4";
      ctx.shadowBlur = 8;

      for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
        const p1 = landmarks[startIdx];
        const p2 = landmarks[endIdx];

        const x1 = (1 - p1.x) * width;
        const y1 = p1.y * height;
        const x2 = (1 - p2.x) * width;
        const y2 = p2.y * height;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // 2. Joints
      for (let i = 0; i < landmarks.length; i++) {
        const pt = landmarks[i];
        const x = (1 - pt.x) * width;
        const y = pt.y * height;

        ctx.beginPath();
        const isFingertip = [4, 8, 12, 16, 20].includes(i);
        ctx.arc(x, y, isFingertip ? 8 : 5, 0, 2 * Math.PI);
        ctx.fillStyle = isFingertip ? "#F2994A" : "#FFFFFF";
        ctx.shadowColor = isFingertip ? "#F2994A" : "#22D3EE";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#1B2A6B";
        ctx.stroke();
      }
    }
  }, []);

  // 5. Continuous Detection Loop
  const startDetectionLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");

    const processFrame = () => {
      if (!video || video.paused || video.ended) {
        animFrameIdRef.current = requestAnimationFrame(processFrame);
        return;
      }

      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 480;

      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width = vw;
        canvas.height = vh;
      }

      if (recognizerRef.current) {
        try {
          const now = performance.now();
          const results = recognizerRef.current.recognizeForVideo(video, now);

          // Draw skeleton
          drawHandSkeleton(ctx, results.landmarks, vw, vh);

          // Classify gesture
          const recognized = classifyGesture(results.landmarks, results.gestures);

          if (recognized) {
            setDetectedSign(recognized);
            setConfidence(Math.round((recognized.confidence || 0.9) * 100));

            // Hold detection logic for challenges / sentence building
            if (lastRecognizedRef.current === recognized.sign) {
              holdCountRef.current += 1;

              // Challenge mode success check
              if (holdCountRef.current >= 15) { // ~0.5s stable hold
                const target = PRACTICE_TARGETS[challengeIdxRef.current];
                if (target && recognized.sign === target.char) {
                  triggerChallengeSuccess();
                }
              }

              // Sentence building
              if (holdCountRef.current === 35) { // ~1.2s stable hold
                setSentence((prev) => {
                  if (prev[prev.length - 1] === recognized.sign) return prev;
                  return [...prev, recognized.sign];
                });
              }
            } else {
              lastRecognizedRef.current = recognized.sign;
              holdCountRef.current = 1;
            }
          } else {
            setDetectedSign(null);
            setConfidence(0);
            holdCountRef.current = 0;
            lastRecognizedRef.current = null;
          }
        } catch (e) {
          console.warn("Inference frame error:", e);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(processFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(processFrame);
  }, [classifyGesture, drawHandSkeleton, triggerChallengeSuccess]);

  // 6. Stop Camera
  const stopCamera = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // 7. Start Camera
  const startCamera = useCallback(async () => {
    try {
      setCameraLoading(true);
      setCameraError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraActive(true);
          setCameraLoading(false);
          startDetectionLoop();
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraLoading(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError(t("permissionDenied"));
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError(t("noCameraFound"));
      } else {
        setCameraError(t("cameraErrorGeneric"));
      }
    }
  }, [t, startDetectionLoop]);

  // 8. Initialize MediaPipe
  useEffect(() => {
    let isMounted = true;

    async function initMediaPipe() {
      try {
        setModelLoading(true);
        const { FilesetResolver, GestureRecognizer } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );

        if (!isMounted) return;

        const recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });

        if (isMounted) {
          recognizerRef.current = recognizer;
          setModelLoading(false);
        }
      } catch (err) {
        console.warn("MediaPipe model load fallback:", err);
        if (isMounted) {
          setModelLoading(false);
        }
      }
    }

    initMediaPipe();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [stopCamera]);

  // 9. Simulator Test Trigger (allows instant testing without physical webcam)
  const simulateGesture = (targetItem) => {
    const item = typeof targetItem === "string"
      ? PRACTICE_TARGETS.find((p) => p.char === targetItem) || PRACTICE_TARGETS[0]
      : targetItem;

    const mockResult = {
      sign: item.char,
      label: item.label,
      emoji: item.emoji,
      category: "simulator",
      confidence: 0.98,
    };

    setDetectedSign(mockResult);
    setConfidence(98);

    if (mode === "challenge" && item.char === PRACTICE_TARGETS[challengeIdx]?.char) {
      triggerChallengeSuccess();
    } else {
      speakText(item.char);
      setSentence((prev) => [...prev, item.char]);
    }
  };

  const currentChallenge = PRACTICE_TARGETS[challengeIdx];

  const filteredTargets = PRACTICE_TARGETS.filter((tg) => {
    if (activeTab === "all") return true;
    if (activeTab === "numbers") return ["૦", "૧", "૨", "૩", "૫"].includes(tg.char);
    if (activeTab === "alphabets") return ["ક", "ગ"].includes(tg.char);
    if (activeTab === "words") return ["નમસ્તે", "સારું", "પાણી", "પ્રેમ"].includes(tg.char);
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        background: "#FFFFFF",
        padding: "16px 20px",
        borderRadius: "var(--radius-lg)",
        border: "1.5px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--primary-50)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            border: "2px solid var(--primary-100)",
          }}>
            📷
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: "var(--primary)", margin: 0 }}>
              {t("title")}
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, marginTop: 2 }}>
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            display: "inline-flex",
            background: "var(--bg-elevated)",
            padding: 4,
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border)",
          }}>
            <button
              onClick={() => setMode("free")}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: mode === "free" ? "var(--primary)" : "transparent",
                color: mode === "free" ? "#FFFFFF" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              ✨ {t("freeMode")}
            </button>
            <button
              onClick={() => setMode("challenge")}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: mode === "challenge" ? "var(--primary)" : "transparent",
                color: mode === "challenge" ? "#FFFFFF" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              🎯 {t("challengeMode")}
            </button>
          </div>

          <button
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            className="btn btn-secondary"
            style={{
              padding: "8px 14px",
              fontSize: 13,
              borderRadius: "var(--radius-full)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>📖</span>
            <span>{t("guideBook")}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Camera Viewport + Detection HUD */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Left Column: Live Camera Box */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/3",
            background: "#0F172A",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "var(--shadow-lg)",
            border: "4px solid #FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* Native Video Feed (Mirrored) */}
            <video
              ref={videoRef}
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scaleX(-1)",
                display: cameraActive ? "block" : "none",
              }}
            />

            {/* Canvas Overlay for Hand Landmark Skeleton */}
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                display: cameraActive ? "block" : "none",
              }}
            />

            {/* Camera Inactive State / Start CTA */}
            {!cameraActive && !cameraLoading && (
              <div style={{
                textAlign: "center",
                padding: 24,
                color: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}>
                <div style={{
                  fontSize: 64,
                  animation: "float 2s ease-in-out infinite",
                }}>
                  🤟
                </div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: "#FFFFFF" }}>
                    {cameraError ? t("cameraBlocked") : t("cameraReadyTitle")}
                  </h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0, marginTop: 6, maxWidth: 360 }}>
                    {cameraError || t("cameraReadyDesc")}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                  <button
                    onClick={startCamera}
                    className="btn btn-primary"
                    style={{
                      background: "var(--accent)",
                      border: "none",
                      padding: "12px 24px",
                      fontSize: 15,
                      borderRadius: "var(--radius-full)",
                      fontWeight: 800,
                      boxShadow: "0 4px 14px rgba(242, 153, 74, 0.4)",
                    }}
                  >
                    🎥 {t("startCameraBtn")}
                  </button>
                  <button
                    onClick={() => simulateGesture(PRACTICE_TARGETS[0])}
                    className="btn"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "#FFFFFF",
                      border: "1px solid rgba(255,255,255,0.3)",
                      padding: "12px 20px",
                      fontSize: 14,
                      borderRadius: "var(--radius-full)",
                      fontWeight: 700,
                    }}
                  >
                    ⚡ {t("simulatorModeBtn")}
                  </button>
                </div>
              </div>
            )}

            {/* Camera Loading Spinner */}
            {cameraLoading && (
              <div style={{ textAlign: "center", color: "#FFFFFF" }}>
                <div style={{
                  width: 48,
                  height: 48,
                  border: "4px solid rgba(255,255,255,0.2)",
                  borderTopColor: "var(--accent)",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 14px",
                }} />
                <p style={{ fontSize: 15, fontWeight: 700 }}>{t("loadingCamera")}</p>
              </div>
            )}

            {/* Active HUD Overlay Pill */}
            {cameraActive && (
              <div style={{
                position: "absolute",
                top: 14,
                left: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(15, 23, 42, 0.75)",
                backdropFilter: "blur(8px)",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 700,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", animation: "pulse 1.5s infinite" }} />
                <span>AI Live Tracking</span>
              </div>
            )}

            {/* Challenge Success Overlay Celebration */}
            {challengeSuccess && (
              <div style={{
                position: "absolute",
                inset: 0,
                background: "rgba(47, 158, 104, 0.85)",
                backdropFilter: "blur(6px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                animation: "popIn 0.3s ease",
                zIndex: 10,
              }}>
                <div style={{ fontSize: 72 }}>🎉</div>
                <div style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>ખૂબ સરસ! (Perfect!)</div>
                <div style={{ fontSize: 16, marginTop: 4, opacity: 0.9 }}>+10 Points Added</div>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          {cameraActive && (
            <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={stopCamera}
                className="btn btn-secondary"
                style={{
                  padding: "8px 16px",
                  fontSize: 13,
                  borderRadius: "var(--radius-full)",
                  color: "var(--error-dark)",
                  borderColor: "var(--error)",
                }}
              >
                ⏹️ {t("stopCameraBtn")}
              </button>
              <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>
                {modelLoading ? t("loadingModel") : "⚡ AI Vision Active"}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Recognition Output & Mode Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Challenge Mode Target Banner */}
          {mode === "challenge" && currentChallenge && (
            <div style={{
              background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
              color: "#FFFFFF",
              borderRadius: "var(--radius-lg)",
              padding: "18px 20px",
              boxShadow: "var(--shadow-md)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", opacity: 0.85, textTransform: "uppercase" }}>
                  🎯 {t("targetGoal")} ({challengeIdx + 1}/{PRACTICE_TARGETS.length})
                </span>
                <span style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 13,
                  fontWeight: 800,
                }}>
                  ⭐ {score} Pts
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 48, lineHeight: 1 }}>{currentChallenge.emoji}</span>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{currentChallenge.label}</div>
                  <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>{currentChallenge.hint}</div>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Recognition HUD Card */}
          <div className="card" style={{ padding: 22, background: "#FFFFFF", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {t("detectionTitle")}
              </div>
              {detectedSign && (
                <span style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: confidence > 85 ? "var(--success)" : "var(--accent)",
                  background: confidence > 85 ? "var(--success-light)" : "var(--accent-light)",
                  padding: "3px 10px",
                  borderRadius: "var(--radius-full)",
                }}>
                  {confidence}% Match
                </span>
              )}
            </div>

            {detectedSign ? (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  fontSize: 48,
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "var(--primary-50)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid var(--primary-100)",
                  flexShrink: 0,
                  boxShadow: "var(--shadow-sm)",
                }}>
                  {detectedSign.emoji || "🤟"}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)", lineHeight: 1.2 }}>
                    {detectedSign.sign}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 600, marginTop: 4 }}>
                    {detectedSign.label}
                  </div>
                </div>
                <button
                  onClick={() => speakText(detectedSign.sign)}
                  className="btn btn-secondary"
                  disabled={isSpeaking}
                  style={{
                    padding: 10,
                    borderRadius: "50%",
                    fontSize: 20,
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Speak Sign"
                  aria-label="Speak recognized sign"
                >
                  🔊
                </button>
              </div>
            ) : (
              <div style={{
                textAlign: "center",
                padding: "24px 16px",
                color: "var(--text-muted)",
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🖐️</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-secondary)" }}>
                  {cameraActive ? t("waitingGesture") : t("turnOnCameraHint")}
                </div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  {t("handPositionGuide")}
                </div>
              </div>
            )}
          </div>

          {/* Sentence Builder Strip (Free Mode) */}
          {mode === "free" && (
            <div className="card" style={{ padding: 18, background: "#FFFFFF" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-secondary)" }}>
                  💬 {t("sentenceStrip")}
                </div>
                {sentence.length > 0 && (
                  <button
                    onClick={() => setSentence([])}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--error)",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {tCommon("clear")}
                  </button>
                )}
              </div>
              <div style={{
                minHeight: 48,
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}>
                {sentence.length === 0 ? (
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {t("sentencePlaceholder")}
                  </span>
                ) : (
                  sentence.map((word, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: "#FFFFFF",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-full)",
                        border: "1px solid var(--border)",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--primary)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {word}
                    </span>
                  ))
                )}
              </div>
              {sentence.length > 0 && (
                <button
                  onClick={() => speakText(sentence.join(" "))}
                  className="btn btn-primary"
                  style={{
                    marginTop: 12,
                    width: "100%",
                    padding: "8px 16px",
                    fontSize: 13,
                    borderRadius: "var(--radius-full)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <span>🔊</span>
                  <span>{t("speakSentence")}</span>
                </button>
              )}
            </div>
          )}

          {/* Quick 1-Click Interactive Sign Practice Buttons */}
          <div className="card" style={{ padding: 18, background: "#FFFFFF" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-secondary)", marginBottom: 12 }}>
              ⚡ {t("quickSimulateTitle")}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PRACTICE_TARGETS.map((item) => (
                <button
                  key={item.char}
                  onClick={() => simulateGesture(item)}
                  className="btn btn-secondary"
                  style={{
                    padding: "6px 12px",
                    fontSize: 13,
                    borderRadius: "var(--radius-full)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    borderColor: detectedSign?.sign === item.char ? "var(--primary)" : "var(--border)",
                    background: detectedSign?.sign === item.char ? "var(--primary-50)" : "#FFFFFF",
                  }}
                >
                  <span>{item.emoji}</span>
                  <span>{item.char}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out or Collapsible Cheat Sheet Modal / Drawer */}
      {showCheatSheet && (
        <div className="card" style={{
          padding: 24,
          background: "#FFFFFF",
          border: "2px solid var(--primary-100)",
          animation: "fadeIn 0.3s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "var(--primary)", margin: 0 }}>
                📖 {t("guideBookTitle")}
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, marginTop: 2 }}>
                {t("guideBookSubtitle")}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { key: "all", labelKey: "tabAll" },
                { key: "numbers", labelKey: "tabNumbers" },
                { key: "alphabets", labelKey: "tabAlphabets" },
                { key: "words", labelKey: "tabWords" },
              ].map(({ key, labelKey }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "var(--radius-full)",
                    border: "none",
                    background: activeTab === key ? "var(--primary)" : "var(--bg-elevated)",
                    color: activeTab === key ? "#FFFFFF" : "var(--text-secondary)",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {t(labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {filteredTargets.map((item) => (
              <div
                key={item.char}
                onClick={() => simulateGesture(item)}
                style={{
                  padding: 14,
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  cursor: "pointer",
                  transition: "all var(--transition)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--primary)" }}>{item.label}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  {item.hint}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
