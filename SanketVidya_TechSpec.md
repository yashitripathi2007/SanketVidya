# SanketVidya — Technical Specification
**Problem Statement ID:** SVH26012
**Title:** Learning App for Deaf & Mute with English/Gujarati Sign Language Converter
**Theme:** Smart Education | **Category:** Software

---

## 1. Product Overview

A Progressive Web App (PWA) that helps deaf/mute students in Gujarati-medium schools
practice Indian Sign Language (ISL) at home. Covers alphabets, numbers, words, math,
and science, plus a Gujarati text/speech-to-sign converter. Teachers and parents get
a report-card view of student progress.

**Phase 1 (this build, due Aug 23):**
- Alphabet & number learning with sign video + writing-pad practice
- Words & sentences module
- Math module with auto-graded exercises
- Science module with sign-video tutorials + writing exercises
- Text/speech → sign video converter (Gujarati)
- Progress tracking + teacher/parent report-card view
- Role-based auth (student / teacher / parent)

**Explicitly out of scope for Phase 1 (do not build):**
- Camera-based sign-to-text recognition (MediaPipe gesture classification) — future phase
- Any deployment/hosting step — this build runs and is demoed locally only

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router), functions as an installable PWA |
| Auth | Firebase Authentication (email/password or phone OTP) |
| Database | Firebase Firestore |
| File storage | Firebase Storage (sign-language video clips) |
| Speech input | Web Speech API (browser-native) for MVP |
| Styling | Tailwind CSS |
| Hosting | None required for this build — run locally via `npm run dev` |

---

## 3. Architecture

```
[Student / Teacher / Parent — Next.js PWA]
              |
        Firebase Auth (role-based login)
              |
   ---------------------------------------
   |                |                    |
Content API    Converter API        Progress API
(Next.js API   (Next.js API         (Next.js API
 routes)        routes)              routes)
   |                |                    |
Firestore:      Firestore:           Firestore:
 lessons,        signLibrary          attempts,
 exercises                            reportCards
              |
        Firebase Storage
        (sign video clips)
```

**Flow — Text/Speech-to-Sign Converter:**
1. User types or speaks a Gujarati sentence (Web Speech API converts speech → text)
2. Text is split into individual words
3. Each word is looked up in the `signLibrary` collection for a matching video clip
4. Matching clips are queued and played in sequence in the UI
5. Words with no match fall back to spelling out each letter via the alphabet video set

**Flow — Lesson & Exercise:**
1. Student selects a module (alphabets/numbers/words/math/science)
2. Content API fetches ordered lessons from Firestore + signed video URLs from Storage
3. Student completes writing-pad practice or answers exercises
4. Attempt is written to `attempts`; teacher/parent dashboards read aggregated data from there

---

## 4. Firestore Schema

### `users/{uid}`
```
{
  role: "student" | "teacher" | "parent",
  name: string,
  classId: string | null,        // for students & teachers
  linkedStudentIds: string[],    // for parents only
  createdAt: timestamp
}
```

### `classes/{classId}`
```
{
  name: string,
  teacherId: string,
  studentIds: string[]
}
```

### `lessons/{lessonId}`
```
{
  module: "alphabets" | "numbers" | "words" | "math" | "science",
  title: string,
  order: number,
  signVideoUrl: string,          // Firebase Storage URL
  writingPracticeTarget: string | null,  // Gujarati character/word to trace
  textContent: string | null     // for math/science explanation
}
```

### `exercises/{exerciseId}`
```
{
  lessonId: string,
  module: string,
  question: string,
  type: "mcq" | "writing" | "calculation",
  options: string[] | null,      // for mcq
  correctAnswer: string,
  difficulty: "easy" | "medium" | "hard"
}
```

### `signLibrary/{wordId}`
```
{
  gujaratiWord: string,
  glossOrder: number | null,     // for future gloss-reordering logic
  videoUrl: string,
  category: "alphabet" | "number" | "word"
}
```

### `attempts/{attemptId}`
```
{
  studentId: string,
  exerciseId: string,
  module: string,
  score: number,
  isCorrect: boolean,
  timestamp: timestamp
}
```

### `reportCards/{studentId}` (aggregated, updated on each attempt write)
```
{
  studentId: string,
  moduleScores: { alphabets: number, numbers: number, math: number, science: number },
  lastActive: timestamp
}
```

---

## 5. Security Requirements

- All access via Firebase Auth — no anonymous writes.
- Firestore security rules enforced by role:
  - Students can only read/write their own `attempts` and read lessons/exercises.
  - Teachers can read all `attempts`/`reportCards` for students in their `classId`.
  - Parents can only read `reportCards` for `studentId`s in their own `linkedStudentIds`.
  - No user can write to `lessons`, `exercises`, or `signLibrary` (admin-only, seeded manually).
- No open sign-up for students — student accounts are created by a teacher/admin and linked, not self-registered, given the users are minors.
- All environment variables (Firebase config keys) in `.env.local`, never committed to the repo.
- Input validation on all exercise/writing-pad submissions before writing to Firestore.
- No third-party analytics or ad SDKs.

---

## 6. Required Next.js API Routes

- `GET /api/lessons?module=` — fetch lessons for a module
- `GET /api/exercises?lessonId=` — fetch exercises for a lesson
- `POST /api/attempts` — submit a student's exercise attempt
- `GET /api/reportcard?studentId=` — fetch aggregated progress (role-checked)
- `POST /api/convert` — accepts Gujarati text, returns ordered array of sign video URLs

---

## 7. Deliverable for Aug 23

A working local build (`npm run dev`) demonstrating: student login, all five learning
modules with at least a handful of seeded lessons/videos, the text-to-sign converter,
and a teacher/parent report-card view — plus a short demo video and this repo.
