"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import IndexTab from "@/components/ui/IndexTab";
import PageHeader from "@/components/ui/PageHeader";

interface Resource {
  id: number;
  title: string;
  excerpt: string;
  resource_type: string;
  gated: number;
  download_url: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  ebook: "E-book", guide: "Guide", checklist: "Checklist", report: "Report", webinar: "Webinar", video: "Video",
};

function UnlockModal({ resource, onClose }: { resource: Resource; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

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

  return (
    <div className="fixed inset-0 bg-charcoal/60 flex items-center justify-center z-50 px-6" onClick={onClose}>
      <div className="bg-ivory rounded-sm p-8 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <p className="index-tab text-xs text-gold mb-3">{TYPE_LABELS[resource.resource_type] || "RESOURCE"}</p>
        <h3 className="font-display text-xl text-charcoal mb-4">{resource.title}</h3>

        {status === "done" && downloadUrl ? (
          <div>
            <p className="text-sm text-charcoal/70 mb-4">You&apos;re all set — your download is ready.</p>
            <Button href={downloadUrl} variant="primary" className="w-full">Download Now</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-line rounded-sm px-4 py-2.5 bg-ivory focus-visible:outline-burgundy" />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-line rounded-sm px-4 py-2.5 bg-ivory focus-visible:outline-burgundy" />
            <Button type="submit" variant="primary" className="w-full" disabled={status === "submitting"}>
              {status === "submitting" ? "Unlocking…" : "Get Free Access"}
            </Button>
            {status === "error" && <p className="text-xs text-burgundy">Something went wrong. Please try again.</p>}
          </form>
        )}
        <button onClick={onClose} className="text-xs text-charcoal/40 mt-4 underline">Close</button>
      </div>
    </div>
  );
}

export default function ResourcesPageClient() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [active, setActive] = useState<Resource | null>(null);

  useEffect(() => {
    fetch("/api/resources").then((r) => r.json()).then(setResources);
  }, []);

  return (
    <>
      <PageHeader eyebrow="FREE RESOURCES" title="Guides, checklists & tools" description="No-cost resources to get started before — or instead of — booking a session." />
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((r, i) => (
          <div key={r.id} className="border border-line rounded-sm p-7 flex flex-col">
            <IndexTab code={(TYPE_LABELS[r.resource_type] || "RS").slice(0, 2).toUpperCase()} index={i} className="self-start mb-5" />
            <p className="font-display text-lg text-charcoal mb-2">{r.title}</p>
            <p className="text-sm text-charcoal/60 mb-6 flex-1">{r.excerpt}</p>
            {r.gated ? (
              <Button variant="secondary" onClick={() => setActive(r)}>Get Free Access</Button>
            ) : (
              <Button href={r.download_url || "#"} variant="secondary">Download</Button>
            )}
          </div>
        ))}
      </section>
      {active && <UnlockModal resource={active} onClose={() => setActive(null)} />}
    </>
  );
}
