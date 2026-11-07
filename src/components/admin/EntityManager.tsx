"use client";

import { useEffect, useState, useCallback } from "react";
import Pagination from "@/components/admin/Pagination";

export type FieldType =
  | "text" | "textarea" | "number" | "checkbox" | "date" | "select"
  | "string-list" | "stat-list" | "process-list" | "curriculum" | "image";

export interface FieldSchema {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  help?: string;
}

interface EntityManagerProps {
  apiBase: string;
  title: string;
  fields: FieldSchema[];
  listColumns: { key: string; label: string }[];
  titleField?: string;
}

type Row = Record<string, unknown>;

// ---------------------------------------------------------------------
// Helpers: DB columns often come back as JSON *strings*, not arrays.
// ---------------------------------------------------------------------

function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
      // handle double-encoded JSON
      if (typeof parsed === "string") {
        const again = JSON.parse(parsed);
        if (Array.isArray(again)) return again;
      }
    } catch {
      /* not JSON */
    }
  }
  return [];
}

type Module = { module: string; lessons: string[] };

function normalizeCurriculum(value: unknown): Module[] {
  return toArray(value).map((item) => {
    if (typeof item === "string") return { module: item, lessons: [] };
    const m = (item || {}) as Record<string, unknown>;
    const name = (m.module ?? m.title ?? m.name ?? "") as string;
    const rawLessons = toArray(m.lessons);
    const lessons = rawLessons.map((l) =>
      typeof l === "string" ? l : String((l as Record<string, unknown>)?.title ?? (l as Record<string, unknown>)?.name ?? "")
    );
    return { module: String(name), lessons };
  });
}

const LIST_TYPES: FieldType[] = ["string-list", "stat-list", "process-list", "curriculum"];

function normalizeInitial(initial: Row, fields: FieldSchema[]): Row {
  const out: Row = { ...initial };
  for (const f of fields) {
    if (!LIST_TYPES.includes(f.type)) continue;
    out[f.name] = f.type === "curriculum" ? normalizeCurriculum(initial[f.name]) : toArray(initial[f.name]);
  }
  return out;
}

export default function EntityManager({ apiBase, title, fields, listColumns }: EntityManagerProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ---------- Pagination ----------
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const paginatedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(apiBase);
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [apiBase]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this permanently? This can't be undone.")) return;
    await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    load();
  }

  async function handleSave(data: Row) {
    setSaving(true);
    setError("");
    const isNew = !editing?.id;
    const url = isNew ? apiBase : `${apiBase}/${editing!.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Failed to save.");
      setSaving(false);
      return;
    }
    setSaving(false);
    setEditing(null);
    load();
  }

  if (editing !== null) {
    return (
      <EntityForm
        title={title}
        fields={fields}
        initial={editing}
        saving={saving}
        error={error}
        onCancel={() => setEditing(null)}
        onSave={handleSave}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-charcoal">{title}</h1>
        <button
          onClick={() => setEditing({})}
          className="bg-burgundy text-ivory rounded-sm px-4 py-2 text-sm font-medium hover:bg-burgundy-deep transition-colors"
        >
          + Add New
        </button>
      </div>

      {loading ? (
        <p className="text-charcoal/50 text-sm">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-charcoal/50 text-sm">Nothing here yet — click &quot;Add New&quot; to create the first one.</p>
      ) : (
        <div className="bg-white border border-line rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ivory-deep text-left text-xs uppercase tracking-wide text-charcoal/50">
              <tr>
                {listColumns.map((col) => (
                  <th key={col.key} className="px-4 py-3 font-medium">{col.label}</th>
                ))}
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row) => (
                <tr key={String(row.id)} className="border-t border-line hover:bg-ivory-deep/40">
                  {listColumns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-charcoal/80 max-w-xs truncate">
                      {formatCell(row[col.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => setEditing(row)} className="text-burgundy hover:underline text-xs mr-4">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(row.id as number)} className="text-charcoal/40 hover:text-burgundy text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number" && (value === 0 || value === 1)) return value === 1 ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value).slice(0, 60);
  return String(value);
}

// ---------------------------------------------------------------------
// Form
// ---------------------------------------------------------------------

function EntityForm({
  title, fields, initial, saving, error, onCancel, onSave,
}: {
  title: string;
  fields: FieldSchema[];
  initial: Row;
  saving: boolean;
  error: string;
  onCancel: () => void;
  onSave: (data: Row) => void;
}) {
  // Parse JSON-string columns into real arrays once, when the form opens
  const [values, setValues] = useState<Row>(() => normalizeInitial(initial, fields));

  function setField(name: string, value: unknown) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-charcoal">{initial.id ? `Edit ${title}` : `New ${title}`}</h1>
        <button onClick={onCancel} className="text-sm text-charcoal/50 hover:text-charcoal">← Back to list</button>
      </div>

      <div className="bg-white border border-line rounded-sm p-8 space-y-5 max-w-3xl">
        {fields.map((field) => (
          <FieldInput key={field.name} field={field} value={values[field.name]} onChange={(v) => setField(field.name, v)} />
        ))}

        {error && <p className="text-sm text-burgundy">{error}</p>}

        <div className="flex gap-3 pt-4 border-t border-line">
          <button
            onClick={() => onSave(values)}
            disabled={saving}
            className="bg-burgundy text-ivory rounded-sm px-5 py-2.5 text-sm font-medium hover:bg-burgundy-deep transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button onClick={onCancel} className="text-sm text-charcoal/60 px-5 py-2.5">Cancel</button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full border border-line rounded-sm px-3 py-2 focus-visible:outline-burgundy";

function FieldInput({ field, value, onChange }: { field: FieldSchema; value: unknown; onChange: (v: unknown) => void }) {
  const label = (
    <label className="text-xs text-charcoal/60 uppercase tracking-wide block mb-1">
      {field.label}
      {field.help && <span className="normal-case text-charcoal/40 font-normal ml-2 lowercase">{field.help}</span>}
    </label>
  );

  switch (field.type) {
    case "text":
      return (
        <div>
          {label}
          <input type="text" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls} />
        </div>
      );
    case "number":
      return (
        <div>
          {label}
          <input type="number" value={(value as number) ?? ""} onChange={(e) => onChange(Number(e.target.value))} className={inputCls} />
        </div>
      );
    case "date":
      return (
        <div>
          {label}
          <input type="date" value={(value as string)?.slice(0, 10) ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls} />
        </div>
      );
    case "textarea":
      return (
        <div>
          {label}
          <textarea value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} rows={5} className={inputCls} />
        </div>
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={value === 1 || value === true} onChange={(e) => onChange(e.target.checked ? 1 : 0)} />
          {field.label}
        </label>
      );
    case "select":
      return (
        <div>
          {label}
          <select value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls}>
            <option value="">—</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );
    case "string-list":
      return (
        <div>
          {label}
          <LineListField
            value={value}
            toText={(arr) => (arr as string[]).join("\n")}
            fromText={(text) => text.split("\n").map((l) => l.trim()).filter(Boolean)}
            rows={4}
            placeholder="One per line"
            onChange={onChange}
          />
        </div>
      );
    case "stat-list":
      return (
        <div>
          {label}
          <LineListField
            value={value}
            toText={(arr) => (arr as { value: string; label: string }[]).map((s) => `${s.value} | ${s.label}`).join("\n")}
            fromText={(text) =>
              text.split("\n").filter((l) => l.trim()).map((line) => {
                const [v, l] = line.split("|").map((s) => s.trim());
                return { value: v || "", label: l || "" };
              })
            }
            rows={4}
            placeholder='One per line: "500+ | Consultations Held"'
            onChange={onChange}
          />
        </div>
      );
    case "process-list":
      return (
        <div>
          {label}
          <LineListField
            value={value}
            toText={(arr) => (arr as { title: string; description: string }[]).map((s) => `${s.title} | ${s.description}`).join("\n")}
            fromText={(text) =>
              text.split("\n").filter((l) => l.trim()).map((line) => {
                const [t, ...rest] = line.split("|");
                return { title: (t || "").trim(), description: rest.join("|").trim() };
              })
            }
            rows={5}
            placeholder='One step per line: "Step title | Step description"'
            onChange={onChange}
          />
        </div>
      );
    case "curriculum":
      return (
        <div>
          {label}
          <CurriculumField value={value} onChange={onChange} />
        </div>
      );
    case "image":
      return <ImageField label={field.label} value={value as string} onChange={onChange} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------
// Line-based list editor.
// Keeps the RAW text in local state so Enter / trailing newlines / blank
// lines work while typing. Only the parsed result goes up to the form.
// ---------------------------------------------------------------------

function LineListField({
  value, toText, fromText, rows, placeholder, onChange,
}: {
  value: unknown;
  toText: (arr: unknown[]) => string;
  fromText: (text: string) => unknown[];
  rows: number;
  placeholder: string;
  onChange: (v: unknown) => void;
}) {
  const [text, setText] = useState(() => toText(toArray(value)));

  return (
    <textarea
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(fromText(e.target.value));
      }}
      rows={rows}
      placeholder={placeholder}
      className={inputCls}
    />
  );
}

// ---------------------------------------------------------------------
// Curriculum editor: clear Module -> Lessons structure.
// ---------------------------------------------------------------------

function CurriculumField({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) {
  const modules = normalizeCurriculum(value);

  function update(next: Module[]) {
    onChange(next);
  }

  function setModuleName(mi: number, name: string) {
    update(modules.map((m, i) => (i === mi ? { ...m, module: name } : m)));
  }

  function setLesson(mi: number, li: number, text: string) {
    update(
      modules.map((m, i) =>
        i === mi ? { ...m, lessons: m.lessons.map((l, j) => (j === li ? text : l)) } : m
      )
    );
  }

  function addLesson(mi: number) {
    update(modules.map((m, i) => (i === mi ? { ...m, lessons: [...m.lessons, ""] } : m)));
  }

  function removeLesson(mi: number, li: number) {
    update(
      modules.map((m, i) =>
        i === mi ? { ...m, lessons: m.lessons.filter((_, j) => j !== li) } : m
      )
    );
  }

  function addModule() {
    update([...modules, { module: "", lessons: [""] }]);
  }

  function removeModule(mi: number) {
    if (!confirm("Remove this module and all its lessons?")) return;
    update(modules.filter((_, i) => i !== mi));
  }

  function moveModule(mi: number, dir: -1 | 1) {
    const to = mi + dir;
    if (to < 0 || to >= modules.length) return;
    const next = [...modules];
    [next[mi], next[to]] = [next[to], next[mi]];
    update(next);
  }

  return (
    <div className="space-y-4">
      {modules.length === 0 && (
        <p className="text-sm text-charcoal/50">No modules yet. Click &quot;+ Add Module&quot; to start.</p>
      )}

      {modules.map((m, mi) => (
        <div key={mi} className="border border-line rounded-sm p-4 bg-ivory-deep/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-burgundy uppercase tracking-wide whitespace-nowrap">
              Module {mi + 1}
            </span>
            <input
              type="text"
              value={m.module}
              onChange={(e) => setModuleName(mi, e.target.value)}
              placeholder="Module title"
              className={inputCls + " font-medium"}
            />
            <button type="button" onClick={() => moveModule(mi, -1)} disabled={mi === 0} className="text-charcoal/50 hover:text-charcoal disabled:opacity-30 px-1" title="Move up">↑</button>
            <button type="button" onClick={() => moveModule(mi, 1)} disabled={mi === modules.length - 1} className="text-charcoal/50 hover:text-charcoal disabled:opacity-30 px-1" title="Move down">↓</button>
            <button type="button" onClick={() => removeModule(mi)} className="text-xs text-charcoal/40 hover:text-burgundy whitespace-nowrap">Remove</button>
          </div>

          <div className="space-y-2 pl-4 border-l-2 border-line">
            {m.lessons.map((lesson, li) => (
              <div key={li} className="flex items-center gap-2">
                <span className="text-xs text-charcoal/40 w-6 text-right">{li + 1}.</span>
                <input
                  type="text"
                  value={lesson}
                  onChange={(e) => setLesson(mi, li, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLesson(mi);
                    }
                  }}
                  placeholder="Lesson title"
                  className={inputCls}
                />
                <button type="button" onClick={() => removeLesson(mi, li)} className="text-charcoal/40 hover:text-burgundy text-sm px-1" title="Remove lesson">✕</button>
              </div>
            ))}
            <button type="button" onClick={() => addLesson(mi)} className="text-xs text-burgundy hover:underline">
              + Add Lesson
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addModule}
        className="border border-burgundy text-burgundy rounded-sm px-4 py-2 text-sm font-medium hover:bg-burgundy hover:text-ivory transition-colors"
      >
        + Add Module
      </button>
    </div>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) onChange(data.url);
    setUploading(false);
  }

  return (
    <div>
      <label className="text-xs text-charcoal/60 uppercase tracking-wide block mb-1">{label}</label>
      {/* eslint-disable-next-line @next/next/no-img-element -- small admin-only preview thumbnail, next/image's optimization pipeline isn't worth the setup here */}
      {value && <img src={value} alt="" className="w-32 h-32 object-cover rounded-sm border border-line mb-2" />}
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="text-sm"
      />
      {uploading && <p className="text-xs text-charcoal/50 mt-1">Uploading…</p>}
    </div>
  );
}