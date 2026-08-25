import { NextResponse } from "next/server";
import { getExercisesByLessonId } from "@/lib/mockData";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get("lessonId");

  if (!lessonId) {
    return NextResponse.json({ error: "lessonId query param required" }, { status: 400 });
  }

  const exercises = getExercisesByLessonId(lessonId);
  return NextResponse.json({ exercises });
}
