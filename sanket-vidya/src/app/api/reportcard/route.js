import { NextResponse } from "next/server";
import { MOCK_USERS } from "@/lib/mockData";

// Compute report card from mock seed data (supplemented by localStorage on client)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json({ error: "studentId query param required" }, { status: 400 });
  }

  const student = MOCK_USERS.find((u) => u.uid === studentId);
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  // Return empty template — actual scores come from localStorage on the client
  return NextResponse.json({
    reportCard: {
      studentId,
      studentName: student.name,
      moduleScores: { alphabets: 0, numbers: 0, words: 0, math: 0, science: 0 },
      totalAttempts: 0,
      lastActive: null,
    },
  });
}
