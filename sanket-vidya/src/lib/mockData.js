// ─── Mock Seed Data ───────────────────────────────────────────────────────────
// All YouTube links are publicly available ISL / educational videos.
// Replace videoUrl values with Firebase Storage URLs in production.

export const MOCK_USERS = [
  {
    uid: "student-001",
    role: "student",
    name: "Arjun Patel",
    email: "student@demo.com",
    password: "demo123",
    classId: "class-1a",
    linkedStudentIds: [],
    createdAt: "2024-01-15",
  },
  {
    uid: "teacher-001",
    role: "teacher",
    name: "Priya Shah",
    email: "teacher@demo.com",
    password: "demo123",
    classId: "class-1a",
    linkedStudentIds: [],
    createdAt: "2024-01-10",
  },
  {
    uid: "parent-001",
    role: "parent",
    name: "Ramesh Patel",
    email: "parent@demo.com",
    password: "demo123",
    classId: null,
    linkedStudentIds: ["student-001", "student-002"],
    createdAt: "2024-01-12",
  },
  {
    uid: "student-002",
    role: "student",
    name: "Meera Shah",
    email: "meera@demo.com",
    password: "demo123",
    classId: "class-1a",
    linkedStudentIds: [],
    createdAt: "2024-01-15",
  },
  {
    uid: "student-003",
    role: "student",
    name: "Ravi Joshi",
    email: "ravi@demo.com",
    password: "demo123",
    classId: "class-1a",
    linkedStudentIds: [],
    createdAt: "2024-01-16",
  },
];

// ─── LESSONS ─────────────────────────────────────────────────────────────────
// videoUrl: YouTube embed URL (public ISL / alphabet videos)
export const MOCK_LESSONS = [
  // ── Alphabets ──────────────────────────────────────────────────────────────
  {
    id: "lesson-alpha-1",
    module: "alphabets",
    title: "ક (Ka) — Sign Language",
    order: 1,
    gujaratiChar: "ક",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "ક",
    textContent: "ક as in 'કમળ' (lotus). This is the first consonant of the Gujarati alphabet.",
  },
  {
    id: "lesson-alpha-2",
    module: "alphabets",
    title: "ખ (Kha) — Sign Language",
    order: 2,
    gujaratiChar: "ખ",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "ખ",
    textContent: "ખ as in 'ખભો' (shoulder). Second consonant of the Gujarati alphabet.",
  },
  {
    id: "lesson-alpha-3",
    module: "alphabets",
    title: "ગ (Ga) — Sign Language",
    order: 3,
    gujaratiChar: "ગ",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "ગ",
    textContent: "ગ as in 'ગાય' (cow). Third consonant.",
  },
  {
    id: "lesson-alpha-4",
    module: "alphabets",
    title: "ઘ (Gha) — Sign Language",
    order: 4,
    gujaratiChar: "ઘ",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "ઘ",
    textContent: "ઘ as in 'ઘર' (house). Learn to sign and write ઘ.",
  },
  {
    id: "lesson-alpha-5",
    module: "alphabets",
    title: "ચ (Cha) — Sign Language",
    order: 5,
    gujaratiChar: "ચ",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "ચ",
    textContent: "ચ as in 'ચા' (tea). Learn to sign and write ચ.",
  },

  // ── Numbers ───────────────────────────────────────────────────────────────
  {
    id: "lesson-num-1",
    module: "numbers",
    title: "૦ (Zero) — Sign Language",
    order: 1,
    gujaratiChar: "૦",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "૦",
    textContent: "The number zero (૦) in Indian Sign Language is shown with an open hand.",
  },
  {
    id: "lesson-num-2",
    module: "numbers",
    title: "૧ (One) — Sign Language",
    order: 2,
    gujaratiChar: "૧",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "૧",
    textContent: "One (૧) is shown with a single raised index finger.",
  },
  {
    id: "lesson-num-3",
    module: "numbers",
    title: "૨ (Two) — Sign Language",
    order: 3,
    gujaratiChar: "૨",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "૨",
    textContent: "Two (૨) is shown with two raised fingers.",
  },
  {
    id: "lesson-num-4",
    module: "numbers",
    title: "૩ (Three) — Sign Language",
    order: 4,
    gujaratiChar: "૩",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "૩",
    textContent: "Three (૩) is shown with three raised fingers.",
  },
  {
    id: "lesson-num-5",
    module: "numbers",
    title: "૫ (Five) — Sign Language",
    order: 5,
    gujaratiChar: "૫",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "૫",
    textContent: "Five (૫) is shown with all five fingers spread open.",
  },

  // ── Words ─────────────────────────────────────────────────────────────────
  {
    id: "lesson-word-1",
    module: "words",
    title: "નમસ્તે — Hello",
    order: 1,
    gujaratiChar: "નમસ્તે",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "નમસ્તે",
    textContent: "Namaste (નમસ્તે) is a common greeting. The sign involves bringing both hands together near the chest.",
  },
  {
    id: "lesson-word-2",
    module: "words",
    title: "પાણી — Water",
    order: 2,
    gujaratiChar: "પાણી",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "પાણી",
    textContent: "Water (પાણી). The sign for water involves the letter W tapped on the chin.",
  },
  {
    id: "lesson-word-3",
    module: "words",
    title: "ભોજન — Food",
    order: 3,
    gujaratiChar: "ભોજન",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "ભોજન",
    textContent: "Food (ભોજન). The sign for food involves a flat hand moving to the mouth.",
  },
  {
    id: "lesson-word-4",
    module: "words",
    title: "ઘર — Home",
    order: 4,
    gujaratiChar: "ઘર",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "ઘર",
    textContent: "Home (ઘર). The sign for home uses a flat hand near the cheek.",
  },
  {
    id: "lesson-word-5",
    module: "words",
    title: "શાળા — School",
    order: 5,
    gujaratiChar: "શાળા",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "શાળા",
    textContent: "School (શાળા). The ISL sign for school uses clapping hands.",
  },

  // ── Math ──────────────────────────────────────────────────────────────────
  {
    id: "lesson-math-1",
    module: "math",
    title: "સરવાળો — Addition",
    order: 1,
    gujaratiChar: null,
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: null,
    textContent: "Addition (સરવાળો): Learn to sign + (plus). Example: ૨ + ૩ = ૫. The sign for addition uses two flat hands brought together.",
  },
  {
    id: "lesson-math-2",
    module: "math",
    title: "બાદબાકી — Subtraction",
    order: 2,
    gujaratiChar: null,
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: null,
    textContent: "Subtraction (બાદબાકી): The sign for minus. Example: ૫ - ૨ = ૩. One hand sweeps under the other.",
  },
  {
    id: "lesson-math-3",
    module: "math",
    title: "ગુણાકાર — Multiplication",
    order: 3,
    gujaratiChar: null,
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: null,
    textContent: "Multiplication (ગુણાકાર): Example ૩ × ૨ = ૬. The ISL sign uses crossed index fingers.",
  },

  // ── Science ───────────────────────────────────────────────────────────────
  {
    id: "lesson-sci-1",
    module: "science",
    title: "સૂર્ય — Sun",
    order: 1,
    gujaratiChar: "સૂર્ય",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "સૂર્ય",
    textContent: "Sun (સૂર્ય): The sign for sun uses a circular motion above the head.",
  },
  {
    id: "lesson-sci-2",
    module: "science",
    title: "પાણી — Water",
    order: 2,
    gujaratiChar: "પાણી",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: "પાણી",
    textContent: "Water cycle: Learn about rain (વરસાદ), river (નદી), and ocean (સમુદ્ર) in sign language.",
  },
  {
    id: "lesson-sci-3",
    module: "science",
    title: "પ્રાણી — Animals",
    order: 3,
    gujaratiChar: "પ્રાણી",
    signVideoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU",
    writingPracticeTarget: null,
    textContent: "Animals (પ્રાણી): Signs for dog (કૂતરો), cat (બિલાડી), cow (ગાય).",
  },
];

// ─── EXERCISES ───────────────────────────────────────────────────────────────
export const MOCK_EXERCISES = [
  // Alphabet exercises
  {
    id: "ex-alpha-1",
    lessonId: "lesson-alpha-1",
    module: "alphabets",
    question: "Which letter is shown in the sign video?",
    type: "mcq",
    options: ["ક", "ખ", "ગ", "ઘ"],
    correctAnswer: "ક",
    difficulty: "easy",
  },
  {
    id: "ex-alpha-2",
    lessonId: "lesson-alpha-2",
    module: "alphabets",
    question: "ખ ни sign image recognizing करना — ખ as in which word?",
    type: "mcq",
    options: ["ખભો", "કમળ", "ઘર", "ગાય"],
    correctAnswer: "ખભો",
    difficulty: "easy",
  },
  {
    id: "ex-alpha-3",
    lessonId: "lesson-alpha-3",
    module: "alphabets",
    question: "ગ as in which animal?",
    type: "mcq",
    options: ["ગાય", "ખભો", "ફૂલ", "ઘર"],
    correctAnswer: "ગાય",
    difficulty: "easy",
  },
  {
    id: "ex-alpha-4",
    lessonId: "lesson-alpha-4",
    module: "alphabets",
    question: "ઘ as in which word?",
    type: "mcq",
    options: ["ઘર", "ગાય", "ક", "ચા"],
    correctAnswer: "ઘર",
    difficulty: "easy",
  },
  {
    id: "ex-alpha-5",
    lessonId: "lesson-alpha-5",
    module: "alphabets",
    question: "ચ as in which word?",
    type: "mcq",
    options: ["ચા", "ઘર", "ગાય", "ફૂલ"],
    correctAnswer: "ચા",
    difficulty: "easy",
  },
  // Number exercises
  {
    id: "ex-num-1",
    lessonId: "lesson-num-1",
    module: "numbers",
    question: "How many fingers are used to sign Zero (૦)?",
    type: "mcq",
    options: ["Open hand (5 fingers curved)", "1 finger", "2 fingers", "Closed fist"],
    correctAnswer: "Open hand (5 fingers curved)",
    difficulty: "easy",
  },
  {
    id: "ex-num-2",
    lessonId: "lesson-num-2",
    module: "numbers",
    question: "How do you sign One (૧)?",
    type: "mcq",
    options: ["1 raised index finger", "2 fingers", "Open palm", "Closed fist"],
    correctAnswer: "1 raised index finger",
    difficulty: "easy",
  },
  {
    id: "ex-num-3",
    lessonId: "lesson-num-3",
    module: "numbers",
    question: "Sign for Two (૨) shows how many fingers?",
    type: "mcq",
    options: ["2", "1", "3", "5"],
    correctAnswer: "2",
    difficulty: "easy",
  },
  // Math exercises
  {
    id: "ex-math-1",
    lessonId: "lesson-math-1",
    module: "math",
    question: "૩ + ૪ = ?",
    type: "mcq",
    options: ["૭", "૬", "૮", "૫"],
    correctAnswer: "૭",
    difficulty: "easy",
  },
  {
    id: "ex-math-2",
    lessonId: "lesson-math-1",
    module: "math",
    question: "૫ + ૨ = ?",
    type: "mcq",
    options: ["૭", "૮", "૬", "૯"],
    correctAnswer: "૭",
    difficulty: "easy",
  },
  {
    id: "ex-math-3",
    lessonId: "lesson-math-2",
    module: "math",
    question: "૮ - ૩ = ?",
    type: "mcq",
    options: ["૫", "૪", "૬", "૩"],
    correctAnswer: "૫",
    difficulty: "medium",
  },
  {
    id: "ex-math-4",
    lessonId: "lesson-math-3",
    module: "math",
    question: "૩ × ૩ = ?",
    type: "mcq",
    options: ["૯", "૬", "૮", "૧૨"],
    correctAnswer: "૯",
    difficulty: "medium",
  },
  // Science exercises
  {
    id: "ex-sci-1",
    lessonId: "lesson-sci-1",
    module: "science",
    question: "The ISL sign for Sun (સૂર્ય) uses what motion?",
    type: "mcq",
    options: ["Circular above head", "Wave side to side", "Point up", "Clap hands"],
    correctAnswer: "Circular above head",
    difficulty: "easy",
  },
  {
    id: "ex-sci-2",
    lessonId: "lesson-sci-3",
    module: "science",
    question: "How do you sign Dog (કૂતરો) in ISL?",
    type: "mcq",
    options: ["Snap fingers then pat thigh", "Wave hand", "Point to ground", "Cup hands"],
    correctAnswer: "Snap fingers then pat thigh",
    difficulty: "easy",
  },
  // Words exercises
  {
    id: "ex-word-1",
    lessonId: "lesson-word-1",
    module: "words",
    question: "The greeting નમસ્તે sign involves:",
    type: "mcq",
    options: ["Both hands together near chest", "Wave one hand", "Tap chin", "Point forward"],
    correctAnswer: "Both hands together near chest",
    difficulty: "easy",
  },
  {
    id: "ex-word-2",
    lessonId: "lesson-word-2",
    module: "words",
    question: "The sign for Water (પાણી) is made near which body part?",
    type: "mcq",
    options: ["Chin", "Forehead", "Chest", "Ear"],
    correctAnswer: "Chin",
    difficulty: "easy",
  },
];

// ─── SIGN LIBRARY (for converter) ────────────────────────────────────────────
export const MOCK_SIGN_LIBRARY = [
  { id: "sign-1",  gujaratiWord: "નમસ્તે", category: "word",     videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-2",  gujaratiWord: "પાણી",   category: "word",     videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-3",  gujaratiWord: "ભોજન",   category: "word",     videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-4",  gujaratiWord: "ઘર",     category: "word",     videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-5",  gujaratiWord: "શાળા",   category: "word",     videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-6",  gujaratiWord: "ગાય",    category: "word",     videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-7",  gujaratiWord: "સૂર્ય",   category: "word",     videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-8",  gujaratiWord: "ક",      category: "alphabet", videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-9",  gujaratiWord: "ખ",      category: "alphabet", videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-10", gujaratiWord: "ગ",      category: "alphabet", videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-11", gujaratiWord: "ઘ",      category: "alphabet", videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-12", gujaratiWord: "ચ",      category: "alphabet", videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-13", gujaratiWord: "૦",      category: "number",   videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-14", gujaratiWord: "૧",      category: "number",   videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-15", gujaratiWord: "૨",      category: "number",   videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-16", gujaratiWord: "મારું",   category: "word",     videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-17", gujaratiWord: "નામ",    category: "word",     videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-18", gujaratiWord: "હું",    category: "word",     videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-19", gujaratiWord: "તમે",    category: "word",     videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
  { id: "sign-20", gujaratiWord: "આભાર",   category: "word",     videoUrl: "https://www.youtube.com/embed/nxvWn4uTQBU" },
];

// ─── CLASSES ──────────────────────────────────────────────────────────────────
export const MOCK_CLASSES = [
  {
    id: "class-1a",
    name: "ધોરણ 1-A",
    teacherId: "teacher-001",
    studentIds: ["student-001", "student-002", "student-003"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getLessonsByModule(module) {
  return MOCK_LESSONS.filter((l) => l.module === module).sort((a, b) => a.order - b.order);
}

export function getExercisesByLessonId(lessonId) {
  return MOCK_EXERCISES.filter((e) => e.lessonId === lessonId);
}

export function getLessonById(id) {
  return MOCK_LESSONS.find((l) => l.id === id) || null;
}

export function findSignByWord(word) {
  return MOCK_SIGN_LIBRARY.find((s) => s.gujaratiWord === word) || null;
}

export function getUserByEmail(email) {
  return MOCK_USERS.find((u) => u.email === email) || null;
}

export const MODULES = [
  { key: "alphabets", label: "મૂળાક્ષર",   labelEn: "Alphabets", emoji: "🔤", color: "#6366f1" },
  { key: "numbers",   label: "આંકડા",      labelEn: "Numbers",   emoji: "🔢", color: "#f59e0b" },
  { key: "words",     label: "શબ્દો",       labelEn: "Words",     emoji: "💬", color: "#22c55e" },
  { key: "math",      label: "ગણિત",        labelEn: "Math",      emoji: "➕", color: "#ec4899" },
  { key: "science",   label: "વિજ્ઞાન",     labelEn: "Science",   emoji: "🔬", color: "#06b6d4" },
];
