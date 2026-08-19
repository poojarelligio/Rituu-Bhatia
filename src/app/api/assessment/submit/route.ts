import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { rateLimitOrError } from "@/lib/rateLimit";

interface ResultTier {
  min_score: number;
  max_score: number;
  title: string;
  description: string;
}

export async function POST(request: NextRequest) {
  const limited = rateLimitOrError(request);
  if (limited) return limited;

  try {
    const { name, email, answers } = await request.json();

    if (!name || !email || !/^\S+@\S+\.\S+$/.test(email) || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Name, a valid email, and answers are required." },
        { status: 400 }
      );
    }

    // ✅ Calculate score
    const score = answers.reduce((sum: number, n: number) => sum + (Number(n) || 0), 0);

    // ✅ Fetch result tiers
    const tiers = await query<ResultTier[]>(
      "SELECT min_score, max_score, title, description FROM assessment_results ORDER BY min_score ASC"
    );

    // ✅ Find matching tier
    const result = tiers.find((t) => score >= t.min_score && score <= t.max_score) || tiers[tiers.length - 1];

    // ✅ Save lead
    await query(
      "INSERT INTO leads (name, email, message, source) VALUES (?, ?, ?, 'energy_assessment')",
      [name, email, `Completed Free Energy Assessment. Score: ${score}. Result: ${result?.title ?? "n/a"}`]
    );

    return NextResponse.json({
      score,
      result: {
        title: result?.title || "No result found",
        description: result?.description || "",
      },
    });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}