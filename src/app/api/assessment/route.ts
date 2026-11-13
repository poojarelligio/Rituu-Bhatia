
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

function parseOptions(value: unknown) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid assessment options format");
    }

    return parsed;
  }

  if (value && typeof value === "object") {
    // Handle JSON objects returned by the database driver
    return Object.values(value);
  }

  throw new Error("Assessment options are empty or invalid");
}

export async function GET() {
  try {
    const questions = await query<{
      id: number;
      question: string;
      options: unknown;
      sort_order: number;
    }[]>(`
      SELECT id, question, options, sort_order
      FROM assessment_questions
      ORDER BY sort_order ASC, id ASC
    `);

    const parsedQuestions = questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: parseOptions(q.options),
      sort_order: q.sort_order,
    }));

    const resultTiers = await query<{
      id: number;
      min_score: number;
      max_score: number;
      title: string;
      description: string;
    }[]>(`
      SELECT id, min_score, max_score, title, description
      FROM assessment_results
      ORDER BY min_score ASC
    `);

    return NextResponse.json({
      questions: parsedQuestions,
      resultTiers,
    });

  } catch (error) {
    console.error("Error fetching assessment:", error);

    return NextResponse.json(
      { error: "Failed to load assessment" },
      { status: 500 }
    );
  }
}
