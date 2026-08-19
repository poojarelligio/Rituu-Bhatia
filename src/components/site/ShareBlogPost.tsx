"use client";

import { useState } from "react";
import { MessageCircle, Link2, Check } from "lucide-react";

interface ShareBlogPostProps {
  title: string;
  url: string; // absolute URL of the post
}

const XIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
  </svg>
);

const LinkedinIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56z" />
  </svg>
);

interface ShareLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function ShareBlogPost({ title, url }: ShareBlogPostProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API can fail in some contexts (e.g. non-HTTPS) — fail quietly
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links: ShareLink[] = [
    { label: "Share on WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, icon: <MessageCircle size={15} /> },
    { label: "Share on X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, icon: <XIcon /> },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: <FacebookIcon /> },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: <LinkedinIcon /> },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-charcoal/40 uppercase tracking-wide mr-1">Share</span>
      {links.map((link) => (
  <a
    key={link.label}
    href={link.href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={link.label}
    className="w-9 h-9 flex items-center justify-center rounded-full border border-line text-charcoal/60 hover:text-burgundy hover:border-burgundy transition-colors"
  >
    {link.icon}
  </a>
))}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="w-9 h-9 flex items-center justify-center rounded-full border border-line text-charcoal/60 hover:text-burgundy hover:border-burgundy transition-colors"
      >
        {copied ? <Check size={15} className="text-burgundy" /> : <Link2 size={15} />}
      </button>
      {copied && <span className="text-xs text-burgundy ml-1">Link copied</span>}
    </div>
  );
}