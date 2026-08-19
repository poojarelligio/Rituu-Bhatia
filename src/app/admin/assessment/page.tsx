"use client";

import { useEffect, useState } from "react";

interface Option { label: string; points: number }
interface Question { question: string; options: Option[] }
interface ResultTier { min_score: number; max_score: number; title: string; description: string }

export default function AssessmentAdminPage() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [results, setResults] = useState<ResultTier[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/assessment").then((r) => r.json()).then((data) => {
      setQuestions(data.questions.map((q: { question: string; options: string | Option[] }) => ({
        ...q,
        options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
      })));
      setResults(data.results);
    });
  }, []);

  function questionsToText() {
    if (!questions) return "";
    return questions
      .map((q) => `Q: ${q.question}\n${q.options.map((o) => `O: ${o.label} | ${o.points}`).join("\n")}`)
      .join("\n\n");
  }

  function parseQuestionsText(text: string) {
    const blocks = text.split(/\n\s*\n/);
    return blocks
      .map((block) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (!lines.length) return null;
        const questionLine = lines.shift()!.replace(/^Q:\s*/i, "");
        const options = lines.map((line) => {
          const [label, points] = line.replace(/^O:\s*/i, "").split("|").map((s) => s.trim());
          return { label, points: Number(points) || 0 };
        });
        return { question: questionLine, options };
      })
      .filter(Boolean) as Question[];
  }

  function resultsToText() {
    if (!results) return "";
    return results.map((r) => `${r.min_score}-${r.max_score} | ${r.title} | ${r.description}`).join("\n");
  }

  function parseResultsText(text: string) {
    return text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [range, title, description] = line.split("|").map((s) => s.trim());
        const [min, max] = range.split("-").map((n) => Number(n.trim()));
        return { min_score: min || 0, max_score: max || 0, title, description };
      });
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/assessment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions, results }),
    });
    setSaving(false);
    setSaved(true);
  }

  if (!questions || !results) return <p className="text-charcoal/50 text-sm">Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal mb-8">Free Energy Assessment</h1>
      <div className="bg-white border border-line rounded-sm p-8 space-y-6 max-w-2xl">
        <div>
          <label className="text-xs text-charcoal/60 uppercase tracking-wide block mb-1">
            Questions <span className="normal-case font-normal lowercase text-charcoal/40">— &quot;Q: question&quot; then &quot;O: label | points&quot; per option, blank line between questions</span>
          </label>
          <textarea
            defaultValue={questionsToText()}
            onBlur={(e) => setQuestions(parseQuestionsText(e.target.value))}
            rows={16}
            className="w-full border border-line rounded-sm px-3 py-2 font-mono text-xs"
          />
        </div>
        <div>
          <label className="text-xs text-charcoal/60 uppercase tracking-wide block mb-1">
            Result Tiers <span className="normal-case font-normal lowercase text-charcoal/40">— &quot;min-max | Title | Description&quot; per line</span>
          </label>
          <textarea
            defaultValue={resultsToText()}
            onBlur={(e) => setResults(parseResultsText(e.target.value))}
            rows={6}
            className="w-full border border-line rounded-sm px-3 py-2 font-mono text-xs"
          />
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-line">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-burgundy text-ivory rounded-sm px-5 py-2.5 text-sm font-medium hover:bg-burgundy-deep transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {saved && <span className="text-sm text-charcoal/60">Saved.</span>}
        </div>
      </div>
    </div>
  );
}
