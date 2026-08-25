import { NextResponse } from "next/server";
import { getLessonsByModule } from "@/lib/mockData";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const moduleParam = searchParams.get("module");

  if (!moduleParam) {
    return NextResponse.json({ error: "module query param required" }, { status: 400 });
  }

  const lessons = getLessonsByModule(moduleParam);
  return NextResponse.json({ lessons });
}
