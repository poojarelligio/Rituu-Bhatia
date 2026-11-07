"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, ChevronDown, MessageCircle, Lock, Navigation } from "lucide-react";
import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaWhatsapp } from "react-icons/fa";
import PageHeader from "@/components/ui/PageHeader";
import { Sparkle, Sparkles, dly, idx, inkBtn, pill, pillDark, shine } from "@/components/ui/Decor";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  context: string;
  sort_order: number;
}

/* Studio address, used for both the map pin and the directions link */
const STUDIO_ADDRESS =
  "Office No: 8, 8th Floor, Arunachal Bhavan, Plot No. 19, Sector 30A, Vashi, Navi Mumbai, Maharashtra 400703";
const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(STUDIO_ADDRESS)}&z=16&output=embed`;
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(STUDIO_ADDRESS)}`;

/* Add this photo to /public/images/contact/faq.jpg (portrait, 4:5) */
const FAQ_IMAGE = "/images/contact.jpg";

export default function ContactPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingFaqs, setLoadingFaqs] = useState(true);

  // Fetch FAQs from the public endpoint
  useEffect(() => {
    fetch("/api/faqs")
      .then((res) => res.json())
      .then((data) => {
        setFaqs(Array.isArray(data) ? data : []);
        setLoadingFaqs(false);
      })
      .catch(() => setLoadingFaqs(false));
  }, []);

  const socialLinks = [
    { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/rituu_bhatia/", color: "hover:text-[#E4405F]" },
    { name: "Facebook", icon: FaFacebook, href: "https://www.facebook.com/RituuBhatia33/", color: "hover:text-[#1877F2]" },
    { name: "LinkedIn", icon: FaLinkedin, href: "https://www.linkedin.com/in/rituu-bhatia-7472501a9", color: "hover:text-[#0A66C2]" },
    { name: "YouTube", icon: FaYoutube, href: "https://www.youtube.com/channel/UCY2_TVQc0aMYpf4c_V7OJIw", color: "hover:text-[#FF0000]" },
    { name: "WhatsApp", icon: FaWhatsapp, href: "https://wa.me/+917021063008", color: "hover:text-[#25D366]" },
  ];

  const rowCard =
    "group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md transition-all duration-300 hover:translate-x-1.5 hover:border-gold/50 hover:bg-white/10";
  const iconCircle =
    "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold transition-all duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-ink";

  return (
    <>
      <PageHeader
        eyebrow="GET IN TOUCH"
        title="Contact"
        description="Questions before booking? Send a note and we'll get back within a day."
      />

      {/* ───────────── Details + map ───────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory-deep to-ivory py-20 lg:py-28">
        <div aria-hidden className="v-drift pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="v-drift pointer-events-none absolute -right-32 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet/20 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute right-[12%] top-20 -z-10 h-3 w-3 rounded-full bg-gold/70 blur-[1px]" />
        <div aria-hidden className="v-float pointer-events-none absolute left-[8%] top-[60%] -z-10 h-2 w-2 rounded-full bg-violet/60" style={dly(2)} />

        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-12 lg:px-10">
          {/* Contact details: dark glass card */}
          <aside className="v-left relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink p-8 text-ivory shadow-[0_30px_70px_-30px_var(--color-ink)] lg:col-span-5 lg:p-10">
            <div aria-hidden className="v-float pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-violet/30 blur-3xl" />
            <div aria-hidden className="v-float pointer-events-none absolute -bottom-24 -left-16 -z-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" style={dly(3)} />
            <Sparkles />
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <h2 className="mb-3 font-display text-3xl font-light text-ivory lg:text-4xl">
              <span className="v-grad-gold">Get in touch</span>
            </h2>
            <div className="v-draw mb-8 h-[3px] w-20 rounded-full bg-gradient-to-r from-gold-soft to-gold" />

            <div className="space-y-4">
              <div className={rowCard}>
                <span className={iconCircle}><Phone size={18} strokeWidth={1.5} /></span>
                <div>
                  <p className="text-sm font-medium text-ivory">Phone</p>
                  <a href="tel:+917021063008" className="text-sm text-ivory/70 transition-colors hover:text-gold-soft">
                    +91 70210 63008
                  </a>
                </div>
              </div>

              <div className={rowCard}>
                <span className={iconCircle}><Mail size={18} strokeWidth={1.5} /></span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ivory">Email</p>
                  <div className="space-y-0.5">
                    <a href="mailto:info@rituubhatia.in" className="block break-all text-sm text-ivory/70 transition-colors hover:text-gold-soft">
                      info@rituubhatia.in
                    </a>
                    <a href="mailto:rituubhatiasocial@gmail.com" className="block break-all text-sm text-ivory/70 transition-colors hover:text-gold-soft">
                      rituubhatiasocial@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className={rowCard}>
                <span className={iconCircle}><MapPin size={18} strokeWidth={1.5} /></span>
                <div>
                  <p className="text-sm font-medium text-ivory">Studio</p>
                  <address className="not-italic text-sm leading-relaxed text-ivory/70">
                    Office No: 8, 8th Floor, Arunachal Bhavan,<br />
                    Plot No. 19, Sector 30A, Vashi,<br />
                    Navi Mumbai, Maharashtra 400703
                  </address>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="mb-4 text-sm font-medium text-ivory">Connect with Rituu Bhatia</p>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className={`grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 text-ivory/70 transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:shadow-[0_12px_30px_-10px_var(--color-gold)] ${social.color}`}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Map: framed, with floating address chip + directions button */}
          <div className="v-right relative lg:col-span-7">
            <div
              aria-hidden
              className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border border-gold/60 lg:translate-x-5 lg:translate-y-5"
            />
            <div className="group relative isolate h-full min-h-[420px] overflow-hidden rounded-3xl bg-ivory-deep shadow-[0_36px_80px_-30px_var(--color-ink)]">
              <iframe
                title="Rituu Bhatia studio location on Google Maps"
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0 grayscale-[0.35] contrast-[1.05] transition-all duration-700 group-hover:grayscale-0"
              />
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/30" />
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

              {/* floating chip */}
              <div className="pointer-events-none absolute left-4 top-4 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border border-white/30 bg-ink/80 px-4 py-3 text-ivory shadow-xl backdrop-blur-md">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/50 bg-gold/15 text-gold">
                  <MapPin size={16} strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="index-tab text-[10px] uppercase text-gold-soft">Studio</p>
                  <p className="truncate text-sm">Arunachal Bhavan, Vashi, Navi Mumbai</p>
                </div>
              </div>

              {/* directions button */}
              <a
                href={MAP_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className={`${inkBtn} absolute bottom-4 right-4 shadow-xl`}
              >
                <span className={shine} />
                <Navigation size={15} className="relative text-gold" />
                <span className="relative">Get Directions</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── FAQ (dynamic) with image ───────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-ink via-ink-mid to-ink py-24 text-ivory lg:py-28">
        <div aria-hidden className="v-float pointer-events-none absolute -left-24 top-0 -z-10 h-80 w-80 rounded-full bg-violet/30 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-gold/20 blur-3xl" style={dly(3)} />
        <Sparkles />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

        <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 lg:grid-cols-12 lg:gap-14 lg:px-10">
          {/* Image (left) */}
          <div className="v-left lg:sticky lg:top-24 lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div
                aria-hidden
                className="absolute inset-0 -translate-x-4 translate-y-4 rounded-t-[10rem] rounded-b-3xl border border-gold/60 lg:-translate-x-6 lg:translate-y-6"
              />
              <div className="relative isolate aspect-[4/5] overflow-hidden rounded-t-[10rem] rounded-b-3xl bg-gradient-to-br from-ink-mid via-violet/60 to-ink shadow-[0_36px_80px_-30px_#000]">
                <div className="absolute inset-0 -z-20 flex items-center justify-center">
                  <Sparkle className="v-twinkle h-10 w-10 text-gold/60" />
                </div>
                <Image
                  src={FAQ_IMAGE}
                  alt="Rituu Bhatia in a calm consultation space"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="-z-10 object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <div aria-hidden className="absolute inset-0 rounded-t-[10rem] rounded-b-3xl ring-1 ring-inset ring-white/20" />
              </div>

              {/* floating chip */}
              <div className="v-float absolute -bottom-5 -right-2 flex items-center gap-3 rounded-2xl border border-gold/40 bg-ink/85 px-4 py-3 shadow-2xl backdrop-blur-md sm:-right-6">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/50 bg-gold/15 text-gold">
                  <MessageCircle size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="index-tab text-[10px] uppercase text-gold-soft">Response</p>
                  <p className="text-sm text-ivory">within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs (right) */}
          <div className="lg:col-span-7">
            <div className="v-blur mb-10">
              <p className={pillDark}>
                <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
                FAQ
              </p>
              <h2 className="mb-5 font-display text-3xl font-light leading-tight sm:text-5xl">
                Frequently Asked <span className="v-grad-gold">Questions</span>
              </h2>
              <div className="v-draw h-[3px] w-24 rounded-full bg-gradient-to-r from-gold-soft to-gold" />
            </div>

            {loadingFaqs ? (
              <div className="space-y-3" aria-busy="true">
                {[0, 1, 2].map((n) => (
                  <div key={n} className="h-16 animate-pulse rounded-2xl border border-white/10 bg-white/[0.05]" />
                ))}
                <p className="py-2 text-ivory/60">Loading FAQs…</p>
              </div>
            ) : faqs.length === 0 ? (
              <p className="text-ivory/60">No FAQs yet.</p>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq, i) => {
                  const open = openFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      style={idx(i)}
                      className={`v-reveal overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-500 ${
                        open
                          ? "border-gold/60 bg-white/10 shadow-[0_20px_50px_-24px_var(--color-gold)]"
                          : "border-white/15 bg-white/[0.05] hover:border-gold/40"
                      }`}
                    >
                      <button
                        id={`faq-q-${faq.id}`}
                        aria-expanded={open}
                        aria-controls={`faq-a-${faq.id}`}
                        onClick={() => setOpenFaq(open ? null : faq.id)}
                        className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                      >
                        <span className="index-tab text-xs text-gold-soft">{String(i + 1).padStart(2, "0")}</span>
                        <span className={`flex-1 font-display text-base transition-colors sm:text-lg ${open ? "text-gold-soft" : "text-ivory"}`}>
                          {faq.question}
                        </span>
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                            open ? "rotate-180 border-gold bg-gold text-ink" : "border-white/25 text-ivory/70"
                          }`}
                        >
                          <ChevronDown size={18} />
                        </span>
                      </button>
                      <div
                        id={`faq-a-${faq.id}`}
                        role="region"
                        aria-labelledby={`faq-q-${faq.id}`}
                        aria-hidden={!open}
                        className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <div className="overflow-hidden">
                          <p className="border-t border-white/10 px-5 py-5 leading-relaxed text-ivory/75 sm:px-6 sm:pl-[4.25rem]">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Trust bar */}
            <div className="v-reveal mt-10 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs text-ivory/80 backdrop-blur-md">
                <MessageCircle size={14} className="text-gold" />
                Response within 24 hours
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs text-ivory/80 backdrop-blur-md">
                <Lock size={14} className="text-gold" />
                Your information is private
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}