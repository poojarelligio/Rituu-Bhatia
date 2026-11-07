export interface StaticService {
  slug: string;
  code: string;
  title: string;
  tagline: string;
  heroImage: string;
  description: string;
  stats: { value: string; label: string }[];
  audience: string[];
  benefits: string[];
  process: { title: string; description: string }[];
  duration: string;
  price_display: string;
  price_amount: number;
}

export const staticServices: StaticService[] = [
  {
    slug: "tarot-card-reading",
    code: "TR",
    title: "Tarot Card Reading",
    tagline: "Clarity on the decision in front of you, read card by card.",
    heroImage: "/images/services/tarotcards.jpg",
    description: "A tarot card session with Rituu isn't a performance — it's a focused conversation using the cards as a mirror. You bring the real question; she reads what's actually there and helps you see the path forward clearly.",
    duration: "30 minutes",
    price_display: "₹99",
    price_amount: 9900,
    stats: [
      { value: "1,200+", label: "Readings Given" },
      { value: "12+", label: "Years Reading" },
      // { value: "4.9/5", label: "Average Rating" },
    ],
    audience: [
      "Anyone facing a decision they keep going back and forth on",
      "People who want a second, non-judgmental perspective",
      "Those curious about tarot card who've never had a reading before",
    ],
    benefits: [
      "A clear read on the situation as it stands today",
      "Practical next steps, not vague reassurance",
      "Room for follow-up questions within the session",
    ],
    process: [
      { title: "Share the question", description: "Tell Rituu what's actually on your mind — the more specific, the more useful the reading." },
      { title: "The reading", description: "Cards are drawn and read live, with Rituu narrating what she sees as she goes." },
      { title: "Discuss & plan", description: "You leave with a clear takeaway, not just a description of the cards." },
    ],
  },
  {
    slug: "vaastu",
    code: "VA",
    title: "Vaastu Consultation",
    tagline: "Practical, non-disruptive changes to how your space supports you.",
    heroImage: "/images/services/vaastu.jpg",
    description: "Rituu's Vaastu consultations are grounded in how a space actually functions day to day — not superstition. Expect a room-by-room read of your home or office and a short list of changes you can realistically make.",
    duration: "30 minutes",
    price_display: "₹99",
    price_amount: 9900,
    stats: [
      { value: "600+", label: "Spaces Consulted" },
      { value: "12+", label: "Years of Practice" },
      { value: "95%", label: "Report Improved Energy" },
    ],
    audience: [
      "New homeowners moving into a space for the first time",
      "Business owners noticing friction in a new office",
      "Anyone renovating and wanting to get the layout right",
    ],
    benefits: [
      "A room-by-room read of energy flow in your home or office",
      "Fixes that don't require construction",
      "A written summary you can act on at your own pace",
    ],
    process: [
      { title: "Share your layout", description: "Send a floor plan or photos ahead of the session." },
      { title: "The consultation", description: "Rituu walks through each zone and explains what she'd adjust and why." },
      { title: "Your action list", description: "A short, prioritized list of changes — not a thirty-item to-do." },
    ],
  },
  {
    slug: "astrology",
    code: "AS",
    title: "Astrology Reading",
    tagline: "A grounded look at your chart and what it means for this season of life.",
    heroImage: "/images/services/astro.jpg",
    description: "No fear-based framing, no vague predictions — Rituu reads your chart against the actual questions you bring in, whether that's timing a decision, understanding a pattern, or just making sense of a hard year.",
    duration: "30 minutes",
    price_display: "₹99",
    price_amount: 9900,
    stats: [
      { value: "900+", label: "Charts Read" },
      { value: "12+", label: "Years of Practice" },
      // { value: "4.8/5", label: "Average Rating" },
    ],
    audience: [
      "Anyone at a career or relationship crossroads",
      "People wanting timing guidance on a major decision",
      "Those who want an honest read, not a fear-based one",
    ],
    benefits: [
      "A chart reading focused on your actual current questions",
      "Timing guidance for major decisions",
      "No fear-based framing — just what the chart shows",
    ],
    process: [
      { title: "Share your birth details", description: "Date, time, and place of birth for an accurate chart." },
      { title: "The reading", description: "Rituu walks you through the placements that matter most right now." },
      { title: "Your questions", description: "Time built in to ask about anything specific." },
    ],
  },
  {
    slug: "reiki-healing",
    code: "RE",
    title: "Reiki Healing",
    tagline: "A hands-on energy session for stress, fatigue, or feeling stuck.",
    heroImage: "/images/services/reiki.jpg",
    description: "A quiet, unhurried session designed to help your body and mind actually rest. Reiki with Rituu is offered as a complement to — never a replacement for — any medical or mental health care you're already receiving.",
    duration: "30 minutes",
    price_display: "₹99",
    price_amount: 9900,
    stats: [
      { value: "800+", label: "Sessions Held" },
      { value: "12+", label: "Years Practicing" },
      // { value: "4.9/5", label: "Average Rating" },
    ],
    audience: [
      "Anyone dealing with ongoing stress or fatigue",
      "People already in therapy looking for a complementary practice",
      "Those preparing for a high-stress period ahead",
    ],
    benefits: [
      "A genuinely restful 30 minutes",
      "Support alongside — not instead of — medical care",
      "Useful before high-stress periods",
    ],
    process: [
      { title: "Settle in", description: "A quiet space, no preparation needed on your part." },
      { title: "The session", description: "Rituu works through each energy point at a calm, unhurried pace." },
      { title: "Aftercare notes", description: "What to expect over the next day or two." },
    ],
  },
];

export function getStaticServiceBySlug(slug: string) {
  return staticServices.find((s) => s.slug === slug) || null;
}

/**
 * Parses the numeric minutes out of a duration string like "30 minutes · Free".
 * Used by the booking system to size time slots for a given service without
 * needing a database row — since services are static content now, this is
 * the only "duration source of truth" the booking flow needs.
 */
export function getStaticServiceDurationMinutes(slug: string, fallback = 30): number {
  const service = getStaticServiceBySlug(slug);
  if (!service) return fallback;
  const match = service.duration.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : fallback;
}