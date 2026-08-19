import { NextRequest, NextResponse } from "next/server";
import { pool, query } from "@/lib/db";

export async function GET() {
  const questions = await query("SELECT * FROM assessment_questions ORDER BY sort_order ASC, id ASC");
  const results = await query("SELECT * FROM assessment_results ORDER BY min_score ASC");
  return NextResponse.json({ questions, results });
}

/**
 * Full replace, wrapped in a transaction: the admin edits the whole quiz as
 * one form, so this deletes and re-inserts both tables together rather than
 * diffing individual rows — simpler and safe since this endpoint has no
 * concurrent multi-admin editing concern for a single-owner site.
 */
export async function PUT(request: NextRequest) {
  const { questions, results } = await request.json();

  if (!Array.isArray(questions) || !Array.isArray(results)) {
    return NextResponse.json({ error: "questions and results must be arrays." }, { status: 400 });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query("DELETE FROM assessment_questions");
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await connection.query(
        "INSERT INTO assessment_questions (question, options, sort_order) VALUES (?, ?, ?)",
        [q.question, JSON.stringify(q.options), i]
      );
    }

    await connection.query("DELETE FROM assessment_results");
    for (const r of results) {
      await connection.query(
        "INSERT INTO assessment_results (min_score, max_score, title, description) VALUES (?, ?, ?, ?)",
        [r.min_score, r.max_score, r.title, r.description]
      );
    }

    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    return NextResponse.json({ error: "Failed to save assessment." }, { status: 500 });
  } finally {
    connection.release();
  }
}
