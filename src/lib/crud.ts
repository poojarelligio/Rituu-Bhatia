// import { NextRequest, NextResponse } from "next/server";
// import { query } from "./db";

/**
 * These builders generate the actual Next.js route handlers (GET/POST/PUT/
 * DELETE) for a given MySQL table. Every content type (services, courses,
 * testimonials, ...) follows the same shape — list, get-one, create,
 * update, delete — so this avoids re-writing near-identical SQL and
 * validation in ten separate route files. Each entity's route file stays
 * tiny: it just declares which table and which fields are writable.
 *
 * Auth note: admin routes are already gated by src/middleware.ts (which
 * checks the session cookie for every /api/admin/* request) before these
 * handlers ever run, so they don't re-check auth themselves.
 */

import { NextRequest, NextResponse } from "next/server";
import { query } from "./db";

export interface CrudFieldConfig {
  table: string;
  writableFields: string[];
  slugField?: string;
  defaultOrderBy?: string;
}

// ✅ FIXED: Handles JSON fields properly
function pickWritable(body: Record<string, unknown>, fields: string[]) {
  const out: Record<string, unknown> = {};
  
  // Fields that should be stored as JSON in the database
  const jsonFields = [
    'curriculum',    // for courses
    'modules',       // for courses
    'lessons',       // for courses
    'benefits',      // for services
    'stats',         // for services
    'process_steps', // for services
    'gallery',       // for events
    'tags',          // for blog posts
  ];
  
  for (const field of fields) {
    if (field in body) {
      let value = body[field];
      
      // Convert empty string to null for ENUM fields
      if (value === '') {
        value = null;
      }
      
      // Convert undefined to null
      if (value === undefined) {
        value = null;
      }
      
      // Stringify JSON fields
      if (jsonFields.includes(field) && value !== null && value !== undefined) {
        // If it's already a string, keep it
        if (typeof value === 'string') {
          // Keep as is
        } else {
          try {
            value = JSON.stringify(value);
          } catch (e) {
            console.error(`Failed to stringify field ${field}:`, e);
            value = null;
          }
        }
      }
      
      out[field] = value;
    }
  }
  return out;
}

export function adminListAndCreate(config: CrudFieldConfig) {
  const orderBy = config.defaultOrderBy || "id DESC";

  async function GET() {
    const rows = await query(`SELECT * FROM \`${config.table}\` ORDER BY ${orderBy}`);
    return NextResponse.json(rows);
  }

  async function POST(request: NextRequest) {
    const body = await request.json();
    const data = pickWritable(body, config.writableFields);

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields provided." }, { status: 400 });
    }

    const columns = Object.keys(data);
    const placeholders = columns.map(() => "?").join(", ");
    const values = columns.map((c) => data[c]);

    try {
      const result = await query<{ insertId: number }>(
        `INSERT INTO \`${config.table}\` (${columns.map((c) => `\`${c}\``).join(", ")}) VALUES (${placeholders})`,
        values
      );
      return NextResponse.json({ id: result.insertId }, { status: 201 });
    } catch (err) {
      return handleDbError(err);
    }
  }

  return { GET, POST };
}

export function adminGetUpdateDelete(config: CrudFieldConfig) {
  async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const rows = await query<Record<string, unknown>[]>(`SELECT * FROM \`${config.table}\` WHERE id = ?`, [id]);
    if (!rows.length) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  }

  async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const data = pickWritable(body, config.writableFields);

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields provided." }, { status: 400 });
    }

    const setClause = Object.keys(data).map((c) => `\`${c}\` = ?`).join(", ");
    const values = [...Object.values(data), id];

    try {
      await query(`UPDATE \`${config.table}\` SET ${setClause} WHERE id = ?`, values);
      return NextResponse.json({ success: true });
    } catch (err) {
      return handleDbError(err);
    }
  }

  async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await query(`DELETE FROM \`${config.table}\` WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });
  }

  return { GET, PUT, DELETE };
}

export function publicList(config: CrudFieldConfig & { columns?: string }) {
  async function GET() {
    const orderBy = config.defaultOrderBy || "id DESC";
    const cols = config.columns || "*";
    const rows = await query(
      `SELECT ${cols} FROM \`${config.table}\` WHERE status = 'published' ORDER BY ${orderBy}`
    );
    return NextResponse.json(rows);
  }
  return { GET };
}

export function publicGetBySlug(config: CrudFieldConfig & { columns?: string }) {
  const slugField = config.slugField || "slug";

  async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const cols = config.columns || "*";
    const rows = await query<Record<string, unknown>[]>(
      `SELECT ${cols} FROM \`${config.table}\` WHERE \`${slugField}\` = ? AND status = 'published' LIMIT 1`,
      [slug]
    );
    if (!rows.length) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  }
  return { GET };
}

function handleDbError(err: unknown) {
  const message = err instanceof Error ? err.message : "Database error.";
  if (message.includes("Duplicate entry")) {
    return NextResponse.json({ error: "That slug is already in use — please choose another." }, { status: 409 });
  }
  console.error(err);
  return NextResponse.json({ error: "Something went wrong saving this." }, { status: 500 });
}