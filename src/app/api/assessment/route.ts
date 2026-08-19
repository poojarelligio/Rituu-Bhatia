import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // Fetch questions with options as JSON string
    const questions = await query<{
      id: number;
      question: string;
      options: string; // This is a JSON string from the database
      sort_order: number;
    }[]>(`
      SELECT id, question, options, sort_order 
      FROM assessment_questions 
      ORDER BY sort_order ASC, id ASC
    `);

    // ✅ Parse the JSON string to an array for each question
    const parsedQuestions = questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: JSON.parse(q.options), // Convert string to array
      sort_order: q.sort_order,
    }));

    // Fetch result tiers
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