"use client";
import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact_form" }),
      });
      if (!res.ok) { setStatus("error"); return; }
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <PageHeader eyebrow="GET IN TOUCH" title="Contact" description="Questions before booking? Send a note and we'll get back within a day." />
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-start gap-3"><Phone size={18} className="text-burgundy mt-0.5" /><div><p className="text-sm font-medium text-charcoal">Phone</p></div></div>
          <div className="flex items-start gap-3"><Mail size={18} className="text-burgundy mt-0.5" /><div><p className="text-sm font-medium text-charcoal">Email</p></div></div>
          <div className="flex items-start gap-3"><MapPin size={18} className="text-burgundy mt-0.5" /><div><p className="text-sm font-medium text-charcoal">Studio</p><p className="text-sm text-charcoal/60">Vashi, Navi Mumbai</p></div></div>
        </div>
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
          <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-line rounded-sm px-4 py-3 bg-ivory focus-visible:outline-burgundy" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-line rounded-sm px-4 py-3 bg-ivory focus-visible:outline-burgundy" />
          <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-line rounded-sm px-4 py-3 bg-ivory focus-visible:outline-burgundy" />
          <textarea required placeholder="Your message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border border-line rounded-sm px-4 py-3 bg-ivory focus-visible:outline-burgundy" />
          <Button type="submit" variant="primary" disabled={status === "submitting"}>{status === "submitting" ? "Sending…" : "Send Message"}</Button>
          {status === "sent" && <p className="text-sm text-burgundy">Thanks — we&apos;ll be in touch shortly.</p>}
          {status === "error" && <p className="text-sm text-burgundy">Something went wrong. Please try again.</p>}
        </form>
      </section>
    </>
  );
}
