"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  Download,
  FileText,
  ListChecks,
  Lock,
  Play,
  Presentation,
  X,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import {
  Marquee,
  Sparkle,
  Sparkles,
  dly,
  goldBtn,
  idx,
  inkBtn,
  pill,
  pillDark,
  shine,
} from "@/components/ui/Decor";

/* Place in: the same folder as your current ResourcesPageClient.tsx (replace it).
   Behaviour is unchanged: GET /api/resources, POST /api/resources/:id/unlock,
   gated resources open the unlock modal, ungated ones download directly. */

interface Resource {
  id: number;
  title: string;
  excerpt: string;
  resource_type: string;
  gated: number;
  download_url: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  ebook: "E-book",
  guide: "Guide",
  checklist: "Checklist",
  report: "Report",
  webinar: "Webinar",
  video: "Video",
};

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  ebook: BookOpen,
  guide: FileText,
  checklist: ListChecks,
  report: BarChart3,
  webinar: Presentation,
  video: Play,
};

const MARQUEE_WORDS = Object.values(TYPE_LABELS);

const typeLabel = (t: string) => TYPE_LABELS[t] || "Resource";

/* ------------------------------------------------------------------ */
/* Unlock modal                                                         */
/* ------------------------------------------------------------------ */
function UnlockModal({ resource, onClose }: { resource: Resource; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const Icon = TYPE_ICONS[resource.resource_type] || FileText;

  // close on Escape, lock page scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(`/api/resources/${resource.id}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setDownloadUrl(data.download_url);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const input =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 transition-colors focus-visible:border-gold focus-visible:outline-2 focus-visible:outline-gold";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-title"
    >
      <div
        className="relative isolate w-full max-w-md overflow-hidden rounded-3xl border border-gold/40 bg-ivory p-8 shadow-[0_40px_100px_-30px_var(--color-ink)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-gold/25 blur-3xl" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-line text-charcoal/60 transition-colors hover:border-gold hover:text-gold-deep"
        >
          <X size={16} />
        </button>

        <span className="mb-5 grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-deep">
          <Icon size={22} strokeWidth={1.5} />
        </span>
        <p className="index-tab mb-2 text-xs uppercase text-gold-deep">{typeLabel(resource.resource_type)}</p>
        <h3 id="unlock-title" className="mb-6 pr-8 font-display text-2xl font-light leading-snug text-charcoal">
          {resource.title}
        </h3>

        {status === "done" && downloadUrl ? (
          <div>
            <p className="mb-5 flex items-start gap-3 text-sm leading-relaxed text-charcoal/70">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-ink">
                <Check size={14} strokeWidth={3} />
              </span>
              You&apos;re all set — your download is ready.
            </p>
            <a href={downloadUrl} className={`${goldBtn} w-full justify-center`}>
              <span className={shine} />
              <Download size={16} className="relative" />
              <span className="relative">Download Now</span>
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              autoFocus
              placeholder="Full name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={input}
            />
            <input
              required
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={input}
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className={`${goldBtn} w-full justify-center disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <span className={shine} />
              <span className="relative">{status === "submitting" ? "Unlocking…" : "Get Free Access"}</span>
            </button>
            {status === "error" && (
              <p role="alert" className="text-xs text-gold-deep">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 text-xs text-charcoal/50 underline decoration-gold underline-offset-4 transition-colors hover:text-charcoal"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* One resource card                                                    */
/* ------------------------------------------------------------------ */
function ResourceCard({
  r,
  i,
  featured,
  onUnlock,
}: {
  r: Resource;
  i: number;
  featured: boolean;
  onUnlock: (r: Resource) => void;
}) {
  const Icon = TYPE_ICONS[r.resource_type] || FileText;
  const gated = !!r.gated;
  const label = typeLabel(r.resource_type);
  const num = String(i + 1).padStart(2, "0");

  const cta = gated ? (
    <button
      type="button"
      onClick={() => onUnlock(r)}
      className={`${featured ? goldBtn : inkBtn} self-start`}
    >
      <span className={shine} />
      <Lock size={15} className="relative" />
      <span className="relative">Get Free Access</span>
      <span aria-hidden className={`relative transition-transform group-hover/btn:translate-x-1 ${featured ? "" : "text-gold"}`}>→</span>
    </button>
  ) : (
    <a href={r.download_url || "#"} className={`${featured ? goldBtn : inkBtn} self-start`}>
      <span className={shine} />
      <Download size={15} className="relative" />
      <span className="relative">Download</span>
      <span aria-hidden className={`relative transition-transform group-hover/btn:translate-x-1 ${featured ? "" : "text-gold"}`}>→</span>
    </a>
  );

  if (featured) {
    return (
      <article
        style={idx(0)}
        className="v-left group relative isolate flex min-h-[380px] flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink p-8 text-ivory shadow-[0_30px_70px_-30px_var(--color-ink)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_44px_100px_-30px_var(--color-violet)] sm:col-span-2 lg:p-12"
      >
        <div aria-hidden className="v-float pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-violet/30 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute -bottom-24 -left-16 -z-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" style={dly(3)} />
        <Sparkles />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-6 right-4 select-none font-display text-[9rem] font-light leading-none text-transparent transition-transform duration-700 group-hover:-translate-y-2 lg:text-[12rem]"
          style={{ WebkitTextStroke: "1.5px rgba(237, 178, 78, 0.28)" }}
        >
          {num}
        </span>

        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/50 bg-gold/10 text-gold">
            <Icon size={22} strokeWidth={1.5} />
          </span>
          <span className="index-tab rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] uppercase text-gold-soft backdrop-blur-md">
            {label}
          </span>
          <span className="index-tab text-[11px] uppercase text-ivory/50">{gated ? "Free access" : "Free download"}</span>
        </div>

        <h3 className="mb-4 max-w-xl font-display text-3xl font-light leading-tight sm:text-4xl lg:text-5xl">
          <span className="v-grad-gold">{r.title}</span>
        </h3>
        <p className="mb-8 max-w-md flex-1 leading-relaxed text-ivory/75">{r.excerpt}</p>
        {cta}
      </article>
    );
  }

  return (
    <article
      style={idx(i % 3)}
      className="v-reveal group relative isolate flex flex-col overflow-hidden rounded-2xl border border-line bg-white/80 p-7 shadow-[0_18px_40px_-28px_var(--color-ink)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_32px_70px_-28px_var(--color-gold)]"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold-soft via-gold to-violet transition-transform duration-700 group-hover:scale-x-100" />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-4 select-none font-display text-[6rem] font-light leading-none text-transparent transition-all duration-500 group-hover:-translate-y-1"
        style={{ WebkitTextStroke: "1px rgba(190, 132, 32, 0.28)" }}
      >
        {num}
      </span>

      <div className="relative mb-6 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-deep transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-ink">
          <Icon size={22} strokeWidth={1.5} />
        </span>
        <span className="index-tab rounded-full bg-gold/15 px-3 py-1 text-[11px] uppercase text-gold-deep">{label}</span>
      </div>

      <h3 className="relative mb-2 font-display text-xl leading-snug text-charcoal transition-colors group-hover:text-gold-deep">
        {r.title}
      </h3>
      <p className="relative mb-6 flex-1 text-sm leading-relaxed text-charcoal/65">{r.excerpt}</p>
      {cta}
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-line bg-white/60 p-7">
      <div className="mb-6 h-12 w-12 rounded-full bg-gold/15" />
      <div className="mb-3 h-5 w-3/4 rounded bg-charcoal/10" />
      <div className="mb-2 h-3 w-full rounded bg-charcoal/5" />
      <div className="mb-8 h-3 w-2/3 rounded bg-charcoal/5" />
      <div className="h-11 w-36 rounded-full bg-charcoal/10" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function ResourcesPageClient() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Resource | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/resources")
      .then((r) => r.json())
      .then((data) => setResources(Array.isArray(data) ? data : []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, []);

  const types = useMemo(() => Array.from(new Set(resources.map((r) => r.resource_type))), [resources]);
  const visible = useMemo(
    () => (filter === "all" ? resources : resources.filter((r) => r.resource_type === filter)),
    [resources, filter]
  );
  const showFeatured = filter === "all" && visible.length >= 3;

  return (
    <>
      <PageHeader
        eyebrow="FREE RESOURCES"
        title="Guides, checklists & tools"
        description="No-cost resources to get started before — or instead of — booking a session."
      />

      <Marquee words={MARQUEE_WORDS} />

      {/* ───────────── Library ───────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory-deep to-ivory py-20 lg:py-28">
        <div aria-hidden className="v-drift pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="v-drift pointer-events-none absolute -right-32 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet/20 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute right-[10%] top-24 -z-10 h-3 w-3 rounded-full bg-gold/70 blur-[1px]" />
        <div aria-hidden className="v-float pointer-events-none absolute left-[6%] top-[60%] -z-10 h-2 w-2 rounded-full bg-violet/60" style={dly(2)} />

        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          {/* filter chips */}
          {types.length > 1 && (
            <div className="v-blur mb-12 flex flex-wrap items-center justify-center gap-3" role="tablist" aria-label="Filter resources">
              {["all", ...types].map((t) => {
                const on = filter === t;
                return (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setFilter(t)}
                    className={`index-tab rounded-full border px-5 py-2 text-xs uppercase transition-all duration-300 ${
                      on
                        ? "border-gold bg-gradient-to-br from-gold-soft to-gold text-ink shadow-[0_10px_30px_-10px_var(--color-gold)]"
                        : "border-gold/40 bg-white/70 text-gold-deep backdrop-blur hover:-translate-y-0.5 hover:border-gold"
                    }`}
                  >
                    {t === "all" ? "All" : typeLabel(t)}
                  </button>
                );
              })}
            </div>
          )}

          {/* grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="mx-auto max-w-md rounded-3xl border border-line bg-white/80 p-10 text-center backdrop-blur">
              <Sparkle className="v-twinkle mx-auto mb-4 h-6 w-6 text-gold" />
              <p className="font-display text-xl text-charcoal">New resources coming soon.</p>
            </div>
          ) : (
            <div key={filter} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((r, i) => (
                <ResourceCard key={r.id} r={r} i={i} featured={showFeatured && i === 0} onUnlock={setActive} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───────────── Free assessment ───────────── */}
      <section className="relative isolate overflow-hidden border-y border-line py-28 lg:py-32">
        <Image
          src="/images/bg/pageheader.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-30 object-cover"
        />
        <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-br from-ink/85 via-ink-mid/70 to-ink/85" />
        <div aria-hidden className="v-float pointer-events-none absolute -left-20 top-0 -z-10 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute -right-20 bottom-0 -z-10 h-96 w-96 rounded-full bg-violet/35 blur-3xl" style={dly(2.5)} />
        <Sparkles />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

        <div className="v-blur relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className={pillDark}>
            <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
            FREE ENERGY ASSESSMENT
          </p>
          <h2 className="mb-6 font-display text-3xl font-light leading-tight text-ivory sm:text-5xl">
            Discover what may be blocking your <br />
            <span className="v-grad-gold">energy, prosperity &amp; growth.</span>
          </h2>
          <p className="mx-auto mb-10 max-w-md leading-relaxed text-ivory/70">
            A short, honest assessment to help you identify the root cause of stagnation — and a
            clear next step to move forward.
          </p>

          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link href="/assessment" className={`${goldBtn} v-ring min-w-[220px] justify-center`}>
              <span className={shine} />
              <span className="relative">Take the Assessment</span>
              <ArrowUpRight size={16} className="relative transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
            <span className="flex items-center gap-2 text-xs text-ivory/60">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Takes under 2 minutes
            </span>
          </div>

          <div className="index-tab mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase text-ivory/50">
            <span className="flex items-center gap-2">
              <Sparkle className="h-3 w-3 text-gold" /> Instant result
            </span>
            <span className="flex items-center gap-2">
              <Sparkle className="h-3 w-3 text-gold" /> 100% free
            </span>
          </div>
        </div>
      </section>

      {active && <UnlockModal resource={active} onClose={() => setActive(null)} />}
    </>
  );
}