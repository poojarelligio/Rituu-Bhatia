import type { Metadata } from "next";
import { PenTool, Fingerprint, Sparkles, Repeat2 } from "lucide-react";
import CustomServicePage, { type CustomService } from "@/components/services/CustomServicePage";

export const metadata: Metadata = {
  title: "Signature Customisation",
  description:
    "Vaastu Inspired Corporate Signature. Get a customised signature guided by your name, your goals and the energy you want to carry — with Rituu Bhatia.",
};

/* DRAFT COPY — please read it through and edit anything that doesn't match how Rituu works. */
const service: CustomService = {
  slug: "signature",
  code: "SG",
  eyebrow: "SIGNATURE CUSTOMISATION",
  heroImage: "/images/services/signature.jpg",
  heroAlt: "A pen signing a document with a flowing signature",
  introImage: "/images/services/signature-detail.jpg",
  introAlt: "Signature practice on paper",
  headlineStart: "VAASTU-INSPIRED",
  headlineHighlight: "CORPORATE SIGNATURE.",
  sub: "A signature appears on every document, cheque and agreement you sign. Rituu guides you toward one that reflects your name, your goals and the energy you wish to carry.",
  introLabel: "ABOUT THE SERVICE",
  introHeading: "A small detail you repeat",
  introHighlight: "thousands of times.",
  introParagraphs: [
    "Most people never think about how they sign. Over the years it becomes a habit — sometimes rushed, sometimes unclear, and not always in tune with who they are becoming.",
    "In a personal consultation, Rituu looks at your current signature along with your name and your goals, and guides you toward a customised signature you can adopt with confidence.",
  ],
  exploreTitle: "What We Explore",
  explore: [
    { icon: PenTool, title: "Your Current Signature", text: "A review of how you sign today — its clarity, flow and the impression it creates." },
    { icon: Fingerprint, title: "Name & Intent", text: "Connecting your name with the direction you want your life or work to take." },
    { icon: Sparkles, title: "Customised Design", text: "A refined signature tailored to you, guided by traditional principles." },
    { icon: Repeat2, title: "Practice & Adoption", text: "Simple guidance on practising your new signature until it feels natural." },
  ],
  stepsTitle: "How It Works",
  steps: [
    { title: "Share", text: "Your name, your current signature and what you would like to move toward." },
    { title: "Review", text: "Rituu studies your signature and the details you have shared." },
    { title: "Customise", text: "You receive a signature guided by your name and intent." },
    { title: "Practise", text: "Learn how to adopt it with confidence in everyday use." },
  ],
  ctaStart: "Ready to sign",
  ctaHighlight: "with intention?",
  ctaButton: "Talk to Rituu",
};

export default function SignaturePage() {
  return <CustomServicePage service={service} />;
}