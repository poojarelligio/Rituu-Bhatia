"use client";

import { useEffect, useState, useCallback } from "react";

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
  apiBase: string; // e.g. "/api/admin/services"
  title: string;
  fields: FieldSchema[];
  listColumns: { key: string; label: string }[];
  titleField?: string; // field used as the row heading in the list, default 'title'
}

type Row = Record<string, unknown>;

export default function EntityManager({ apiBase, title, fields, listColumns, }: EntityManagerProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null); // null = list view, {} = new, {...} = editing
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
              {rows.map((row) => (
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
        </div>
      )}
    </div>
  );
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean" || value === 0 || value === 1) {
    if (typeof value === "number") return value === 1 ? "Yes" : "No";
  }
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
  const [values, setValues] = useState<Row>(initial);

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
          <input
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-line rounded-sm px-3 py-2 focus-visible:outline-burgundy"
          />
        </div>
      );
    case "number":
      return (
        <div>
          {label}
          <input
            type="number"
            value={(value as number) ?? ""}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full border border-line rounded-sm px-3 py-2 focus-visible:outline-burgundy"
          />
        </div>
      );
    case "date":
      return (
        <div>
          {label}
          <input
            type="date"
            value={(value as string)?.slice(0, 10) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-line rounded-sm px-3 py-2 focus-visible:outline-burgundy"
          />
        </div>
      );
    case "textarea":
      return (
        <div>
          {label}
          <textarea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            className="w-full border border-line rounded-sm px-3 py-2 focus-visible:outline-burgundy"
          />
        </div>
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={value === 1 || value === true}
            onChange={(e) => onChange(e.target.checked ? 1 : 0)}
          />
          {field.label}
        </label>
      );
    case "select":
      return (
        <div>
          {label}
          <select
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-line rounded-sm px-3 py-2 focus-visible:outline-burgundy"
          >
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
          <textarea
            value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
            onChange={(e) => onChange(e.target.value.split("\n").map((l) => l.trim()).filter(Boolean))}
            rows={4}
            placeholder="One per line"
            className="w-full border border-line rounded-sm px-3 py-2 focus-visible:outline-burgundy"
          />
        </div>
      );
    case "stat-list":
      return (
        <div>
          {label}
          <textarea
            value={Array.isArray(value) ? (value as { value: string; label: string }[]).map((s) => `${s.value} | ${s.label}`).join("\n") : ""}
            onChange={(e) => {
              const parsed = e.target.value.split("\n").filter(Boolean).map((line) => {
                const [v, l] = line.split("|").map((s) => s.trim());
                return { value: v || "", label: l || "" };
              });
              onChange(parsed);
            }}
            rows={4}
            placeholder='One per line: "500+ | Consultations Held"'
            className="w-full border border-line rounded-sm px-3 py-2 focus-visible:outline-burgundy"
          />
        </div>
      );
    case "process-list":
      return (
        <div>
          {label}
          <textarea
            value={Array.isArray(value) ? (value as { title: string; description: string }[]).map((s) => `${s.title} | ${s.description}`).join("\n") : ""}
            onChange={(e) => {
              const parsed = e.target.value.split("\n").filter(Boolean).map((line) => {
                const [t, d] = line.split("|").map((s) => s.trim());
                return { title: t || "", description: d || "" };
              });
              onChange(parsed);
            }}
            rows={5}
            placeholder='One step per line: "Step title | Step description"'
            className="w-full border border-line rounded-sm px-3 py-2 focus-visible:outline-burgundy"
          />
        </div>
      );
    case "curriculum":
      return (
        <div>
          {label}
          <textarea
            value={
              Array.isArray(value)
                ? (value as { module: string; lessons: string[] }[])
                    .map((m) => `${m.module}\n${(m.lessons || []).join("\n")}`)
                    .join("\n\n")
                : ""
            }
            onChange={(e) => {
              const blocks = e.target.value.split(/\n\s*\n/);
              const parsed = blocks
                .map((block) => {
                  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
                  if (!lines.length) return null;
                  const [module, ...lessons] = lines;
                  return { module, lessons };
                })
                .filter(Boolean);
              onChange(parsed);
            }}
            rows={8}
            placeholder={"Module title\nLesson 1\nLesson 2\n\n(blank line between modules)"}
            className="w-full border border-line rounded-sm px-3 py-2 focus-visible:outline-burgundy font-mono text-xs"
          />
        </div>
      );
    case "image":
      return <ImageField label={field.label} value={value as string} onChange={onChange} />;
    default:
      return null;
  }
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
