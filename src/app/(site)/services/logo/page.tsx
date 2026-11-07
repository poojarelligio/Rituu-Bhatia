import type { Metadata } from "next";
import { Palette, Shapes, Briefcase, Compass } from "lucide-react";
import CustomServicePage, { type CustomService } from "@/components/services/CustomServicePage";

export const metadata: Metadata = {
  title: "Logo Customisation",
  description:
    "Your logo is your brand's first impression. Get guidance on the shapes, colours and symbols that align with your name, your work and your vision — with Rituu Bhatia.",
};

/* DRAFT COPY — please read it through and edit anything that doesn't match how Rituu works. */
const service: CustomService = {
  slug: "logo",
  code: "LG",
  eyebrow: "LOGO CUSTOMISATION",
  heroImage: "/images/services/logo.jpg",
  heroAlt: "A golden logo emblem sketched on a designer's desk",
  introImage: "/images/services/logo-detail.jpg",
  introAlt: "Logo concepts and colour swatches",
  headlineStart: "Your logo is your brand's first impression.",
  headlineHighlight: "Let's make it meaningful.",
  sub: "Whether you are starting a business or refreshing one, Rituu guides you on the shapes, colours and symbols that align with your name, your work and your vision.",
  introLabel: "ABOUT THE SERVICE",
  introHeading: "More than design —",
  introHighlight: "a brand with intention.",
  introParagraphs: [
    "A logo and its colours carry meaning. They shape how people first see and feel your business, long before they speak to you.",
    "Rituu looks at your business name, your goals and the energy you want your brand to reflect, and guides you toward options that feel right and look professional. You can take her guidance to your own designer as a clear brief.",
  ],
  exploreTitle: "What We Explore",
  explore: [
    { icon: Briefcase, title: "Brand Name & Intent", text: "What your business stands for, and how its name and purpose come together." },
    { icon: Palette, title: "Colours", text: "Colours that fit your name, your work and the feeling you want to create." },
    { icon: Shapes, title: "Shapes & Symbols", text: "Forms and symbols that support your brand's message." },
    { icon: Compass, title: "Using Your Logo", text: "Guidance on where and how to use your logo across your business." },
  ],
  stepsTitle: "How It Works",
  steps: [
    { title: "Share", text: "Your business name, what you do and where you want it to go." },
    { title: "Explore", text: "Rituu reviews your details and explores colour, shape and symbol options." },
    { title: "Refine", text: "Narrow the options down together until they feel right." },
    { title: "Take It Forward", text: "Leave with clear guidance you can hand to your designer." },
  ],
  ctaStart: "Ready to give your brand",
  ctaHighlight: "a meaningful identity?",
  ctaButton: "Talk to Rituu",
};

export default function LogoPage() {
  return <CustomServicePage service={service} />;
}