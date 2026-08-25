import { NextResponse } from "next/server";

// In-memory store for SSR context (supplements localStorage on client)
const inMemoryAttempts = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const { studentId, exerciseId, module, score, isCorrect } = body;

    if (!studentId || !exerciseId || !module) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const attempt = {
      id: `attempt-${Date.now()}`,
      studentId,
      exerciseId,
      module,
      score: score ?? (isCorrect ? 1 : 0),
      isCorrect: Boolean(isCorrect),
      timestamp: new Date().toISOString(),
    };

    inMemoryAttempts.push(attempt);

    return NextResponse.json({ success: true, attempt }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  const filtered = studentId
    ? inMemoryAttempts.filter((a) => a.studentId === studentId)
    : inMemoryAttempts;
  return NextResponse.json({ attempts: filtered });
}
