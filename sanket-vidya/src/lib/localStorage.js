// ─── localStorage helpers (client-side only) ──────────────────────────────────
// Always guard with typeof window checks for SSR safety.

const KEYS = {
  USER:     "sv_user",
  ATTEMPTS: "sv_attempts",
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.USER);
  }
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.USER);
}

// ── Attempts ──────────────────────────────────────────────────────────────────
export function getAttempts() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.ATTEMPTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt) {
  if (typeof window === "undefined") return;
  const attempts = getAttempts();
  attempts.push({
    ...attempt,
    id: `attempt-${Date.now()}`,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(attempts));
}

export function getAttemptsByStudent(studentId) {
  return getAttempts().filter((a) => a.studentId === studentId);
}

// ── Report Card (computed from attempts) ──────────────────────────────────────
export function getReportCard(studentId) {
  const attempts = getAttemptsByStudent(studentId);
  const modules = ["alphabets", "numbers", "words", "math", "science"];
  const moduleScores = {};

  for (const mod of modules) {
    const modAttempts = attempts.filter((a) => a.module === mod);
    if (modAttempts.length === 0) {
      moduleScores[mod] = 0;
    } else {
      const correct = modAttempts.filter((a) => a.isCorrect).length;
      moduleScores[mod] = Math.round((correct / modAttempts.length) * 100);
    }
  }

  const lastAttempt = attempts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

  return {
    studentId,
    moduleScores,
    totalAttempts: attempts.length,
    lastActive: lastAttempt?.timestamp || null,
  };
}

// ── Seed demo attempts so dashboards aren't empty ─────────────────────────────
export function seedDemoAttempts() {
  if (typeof window === "undefined") return;
  const existing = getAttempts();
  if (existing.length > 0) return; // already seeded

  const demoAttempts = [
    { studentId: "student-001", exerciseId: "ex-alpha-1", module: "alphabets", score: 1, isCorrect: true  },
    { studentId: "student-001", exerciseId: "ex-alpha-2", module: "alphabets", score: 1, isCorrect: true  },
    { studentId: "student-001", exerciseId: "ex-alpha-3", module: "alphabets", score: 0, isCorrect: false },
    { studentId: "student-001", exerciseId: "ex-num-1",   module: "numbers",   score: 1, isCorrect: true  },
    { studentId: "student-001", exerciseId: "ex-num-2",   module: "numbers",   score: 1, isCorrect: true  },
    { studentId: "student-001", exerciseId: "ex-math-1",  module: "math",      score: 1, isCorrect: true  },
    { studentId: "student-001", exerciseId: "ex-math-2",  module: "math",      score: 0, isCorrect: false },
    { studentId: "student-001", exerciseId: "ex-sci-1",   module: "science",   score: 1, isCorrect: true  },
    { studentId: "student-002", exerciseId: "ex-alpha-1", module: "alphabets", score: 1, isCorrect: true  },
    { studentId: "student-002", exerciseId: "ex-alpha-2", module: "alphabets", score: 1, isCorrect: true  },
    { studentId: "student-002", exerciseId: "ex-math-1",  module: "math",      score: 1, isCorrect: true  },
    { studentId: "student-002", exerciseId: "ex-math-3",  module: "math",      score: 1, isCorrect: true  },
    { studentId: "student-003", exerciseId: "ex-num-1",   module: "numbers",   score: 1, isCorrect: true  },
    { studentId: "student-003", exerciseId: "ex-sci-1",   module: "science",   score: 0, isCorrect: false },
  ].map((a, i) => ({
    ...a,
    id: `demo-attempt-${i}`,
    timestamp: new Date(Date.now() - (i * 3600000)).toISOString(),
  }));

  localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(demoAttempts));
}
