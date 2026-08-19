import { faqConfig } from "@/lib/entityConfigs";

// FAQs have no `status` column (they're always live once created), so this
// bypasses the generic publicList (which filters WHERE status='published').
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query(`SELECT * FROM \`${faqConfig.table}\` ORDER BY sort_order ASC, id ASC`);
  return NextResponse.json(rows);
}
