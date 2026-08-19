"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";

interface Option { label: string; points: number }
interface Question { question: string; options: Option[] }
interface ResultTier { title: string; description: string }

export default function AssessmentPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [result, setResult] = useState<ResultTier | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assessment")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load assessment");
        return r.json();
      })
      .then((data) => {
        // ✅ Parse options if they're strings
        const questionsData = data?.questions || [];
        const parsedQuestions = questionsData.map((q: any) => ({
          question: q.question,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        }));
        
        if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
          setQuestions(parsedQuestions);
        } else {
          setError("No assessment questions available.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading assessment:", err);
        setError("Failed to load assessment. Please try again.");
        setLoading(false);
      });
  }, []);

  function selectAnswer(points: number) {
    const next = [...answers];
    next[step] = points;
    setAnswers(next);
    setStep(step + 1);
  }

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, answers }),
      });
      const data = await res.json();
      if (!res.ok) { 
        setError(data.error || "Something went wrong."); 
        setSubmitting(false); 
        return; 
      }
      setResult(data.result);
      setStep(questions.length + 1);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-8 h-8 border-2 border-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-charcoal/50">Loading assessment…</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="text-burgundy mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-burgundy text-ivory rounded-sm hover:bg-burgundy-deep transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No questions state
  if (!questions.length) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="text-charcoal/50">No assessment questions available.</p>
      </div>
    );
  }

  const isDetailsStep = step === questions.length;
  const isResultStep = step === questions.length + 1;
  const progress = Math.min(step, questions.length) / questions.length;

  // Safely get current question
  const currentQuestion = questions[step];
  const options = currentQuestion?.options || [];

  return (
    <>
      <PageHeader 
        eyebrow="FREE ENERGY ASSESSMENT" 
        title="What may be blocking your energy, prosperity & growth?" 
        description="Four quick questions. Takes under a minute." 
      />
      <section className="max-w-lg mx-auto px-6 lg:px-10 py-16">
        {!isResultStep && (
          <div className="h-1 bg-line rounded-full mb-10 overflow-hidden">
            <div className="h-full bg-burgundy transition-all duration-300" style={{ width: `${progress * 100}%` }} />
          </div>
        )}

        {!isDetailsStep && !isResultStep && (
          <div>
            <p className="index-tab text-xs text-gold mb-4">
              QUESTION {step + 1} OF {questions.length}
            </p>
            <h2 className="font-display text-2xl text-charcoal mb-8 leading-snug">
              {currentQuestion?.question || 'Loading question...'}
            </h2>
            <div className="space-y-3">
              {Array.isArray(options) && options.length > 0 ? (
                options.map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => selectAnswer(opt.points)} 
                    className="w-full text-left border border-line rounded-sm px-5 py-4 hover:border-burgundy hover:bg-ivory-deep transition-colors group"
                  >
                    <span className="text-charcoal/70 group-hover:text-charcoal transition-colors">
                      {opt.label}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-charcoal/50 text-center py-4">
                  No options available for this question.
                </p>
              )}
            </div>
          </div>
        )}

        {isDetailsStep && (
          <form onSubmit={handleDetailsSubmit}>
            <p className="index-tab text-xs text-gold mb-4">ALMOST THERE</p>
            <h2 className="font-display text-2xl text-charcoal mb-6 leading-snug">
              Where should we send your result?
            </h2>
            <div className="space-y-4">
              <input 
                required 
                placeholder="Full name" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                className="w-full border border-line rounded-sm px-4 py-3 bg-ivory focus-visible:outline-burgundy" 
              />
              <input 
                required 
                type="email" 
                placeholder="Email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                className="w-full border border-line rounded-sm px-4 py-3 bg-ivory focus-visible:outline-burgundy" 
              />
              {error && <p className="text-sm text-burgundy">{error}</p>}
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full" 
                disabled={submitting}
              >
                {submitting ? "Scoring…" : "See My Result"}
              </Button>
            </div>
          </form>
        )}

        {isResultStep && result && (
          <div className="text-center">
            <p className="index-tab text-xs text-gold mb-4">YOUR RESULT</p>
            <h2 className="font-display text-3xl text-charcoal mb-4 leading-snug">
              {result.title}
            </h2>
            <p className="text-charcoal/65 leading-relaxed mb-8">
              {result.description}
            </p>
            <Button href="/book" variant="primary">
              Book a Consultation
            </Button>
          </div>
        )}
      </section>
    </>
  );
}