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
          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone size={18} className="text-burgundy mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-charcoal">Phone</p>
              <a 
                href="tel:+917021063008" 
                className="text-sm text-charcoal/60 hover:text-burgundy transition-colors"
              >
                +91 70210 63008
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-burgundy mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-charcoal">Email</p>
              <div className="space-y-0.5">
                <a 
                  href="mailto:info@rituubhatia.in" 
                  className="block text-sm text-charcoal/60 hover:text-burgundy transition-colors"
                >
                  info@rituubhatia.in
                </a>
                <a 
                  href="mailto:rituubhatiasocial@gmail.com" 
                  className="block text-sm text-charcoal/60 hover:text-burgundy transition-colors"
                >
                  rituubhatiasocial@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-burgundy mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-charcoal">Studio</p>
              <address className="not-italic text-sm text-charcoal/60 leading-relaxed">
                Office No: 8, 8th Floor, Arunachal Bhavan,<br />
                Plot No. 19, Sector 30A, Vashi,<br />
                Navi Mumbai, Maharashtra 400703
              </address>
            </div>
          </div>
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
