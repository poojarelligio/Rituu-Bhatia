"use client";

import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [number, setNumber] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((s) => setNumber(s.whatsapp_number || null)).catch(() => {});
  }, []);

  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-burgundy text-ivory rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-burgundy-deep transition-colors"
    >
      <span className="index-tab text-[10px]">WA</span>
    </a>
  );
}
