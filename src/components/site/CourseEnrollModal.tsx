
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Check, Loader2, Phone, X } from "lucide-react";

const BEST_TIMES = [
  "Anytime",
  "Morning (9am – 12pm)",
  "Afternoon (12pm – 4pm)",
  "Evening (4pm – 8pm)",
];

const inputCls =
  "w-full rounded-xl border border-[#E6DFD2] bg-white px-4 py-3 text-[#302B25] outline-none transition-colors placeholder:text-[#302B25]/40 focus:border-[#C9932E] focus:ring-2 focus:ring-[#C9932E]/20";

export default function CourseEnrollModal({
  courseId,
  courseTitle,
  priceDisplay,
  onClose,
}: {
  courseId: number;
  courseTitle: string;
  priceDisplay?: string;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    best_time: BEST_TIMES[0],
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Mount modal and prevent background scrolling
  useEffect(() => {
    setMounted(true);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/course-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: courseId,
          course_title: courseTitle,
          name: form.name,
          email: form.email,
          phone: form.phone,
          best_time: form.best_time,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error || "Something went wrong. Please try again."
        );
        return;
      }

      setDone(true);
    } catch (err) {
      console.error("Course enquiry error:", err);
      setError("Unable to submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#17130F]/70 p-3 sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Enquire about ${courseTitle}`}
        className="relative flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#C9932E]/40 bg-[#FAF9F6] shadow-2xl sm:rounded-3xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="relative flex shrink-0 items-start justify-between border-b border-[#E8E0D3] bg-[#FAF9F6] px-5 py-5 sm:px-8 sm:py-6">
          <div className="min-w-0 pr-3">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A77B27]">
              <Phone size={14} />
              Request a Call
            </p>

            <h3 className="font-display text-xl leading-snug text-[#302B25] sm:text-2xl">
              {courseTitle}
            </h3>

            {priceDisplay && (
              <p className="mt-2 text-sm text-[#302B25]/60">
                Course fee:{" "}
                <span className="font-semibold text-[#A77B27]">
                  {priceDisplay}
                </span>
              </p>
            )}
          </div>

          {/* Always visible close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close enquiry form"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E6DFD2] bg-white text-[#302B25] transition-all hover:border-[#C9932E] hover:bg-[#C9932E] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#C9932E]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8">

          {done ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#C9932E]/15 text-[#A77B27]">
                <Check size={32} />
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#A77B27]">
                Request Received
              </p>

              <h3 className="mb-3 font-display text-2xl text-[#302B25]">
                Thank you, {form.name.split(" ")[0]}!
              </h3>

              <p className="mb-7 text-sm leading-relaxed text-[#302B25]/65">
                Rituu&apos;s team will call you soon
                {form.best_time !== "Anytime"
                  ? ` (${form.best_time})`
                  : ""}{" "}
                to share the details of{" "}
                <strong>{courseTitle}</strong> and answer your questions.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-[#0B3B54] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#164D67]"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm leading-relaxed text-[#302B25]/65">
                Leave your details and Rituu&apos;s team will call you
                to explain the course and help you enrol.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#302B25]/75">
                    Full Name *
                  </span>
                  <input
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className={inputCls}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#302B25]/75">
                    Email Address *
                  </span>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputCls}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#302B25]/75">
                    Phone Number *
                  </span>
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className={inputCls}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#302B25]/75">
                    Best Time to Call
                  </span>
                  <select
                    value={form.best_time}
                    onChange={(e) =>
                      setForm({ ...form, best_time: e.target.value })
                    }
                    className={inputCls}
                  >
                    {BEST_TIMES.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-[#302B25]/75">
                    Your Questions (Optional)
                  </span>
                  <textarea
                    rows={3}
                    placeholder="Anything you would like to ask?"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className={`${inputCls} resize-none`}
                  />
                </label>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C9932E] px-7 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#AD7922] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      Request a Call Back
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <p className="pb-2 text-center text-[11px] leading-relaxed text-[#302B25]/45">
                  By submitting, you agree to be contacted about this course.
                </p>

              </form>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
