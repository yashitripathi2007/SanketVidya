import { NextResponse } from "next/server";
import { MOCK_SIGN_LIBRARY } from "@/lib/mockData";

// Build a lookup map
const signMap = new Map(MOCK_SIGN_LIBRARY.map((s) => [s.gujaratiWord, s]));

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text field required" }, { status: 400 });
    }

    // Split on whitespace/punctuation
    const words = text.trim().split(/[\s,।.!?]+/).filter(Boolean);
    const result = [];

    for (const word of words) {
      const sign = signMap.get(word);
      if (sign) {
        result.push({ word, type: "direct", videoUrl: sign.videoUrl });
      } else {
        // Letter-by-letter fallback
        const letters = [...word]; // Unicode-safe split
        const letterVideos = letters.map((ch) => {
          const s = signMap.get(ch);
          return { char: ch, videoUrl: s?.videoUrl || null };
        });
        result.push({ word, type: "spelled", letters: letterVideos });
      }
    }

    return NextResponse.json({ words: result });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
