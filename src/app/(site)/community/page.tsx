"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";

interface Settings {
  whatsapp_community_link: string | null;
  telegram_link: string | null;
  newsletter_embed_html: string | null;
}

export default function CommunityPage() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  return (
    <>
      <PageHeader eyebrow="STAY CONNECTED" title="Join the Community" description="Daily guidance, workshop announcements, and updates." />
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="border border-line rounded-sm p-7 text-center">
          <p className="font-display text-xl text-charcoal mb-2">WhatsApp Community</p>
          <p className="text-sm text-charcoal/60 mb-6">Daily guidance, updates, and special offers.</p>
          {settings?.whatsapp_community_link ? (
            <Button href={settings.whatsapp_community_link} variant="primary" className="w-full">Join on WhatsApp</Button>
          ) : (
            <Button variant="secondary" className="w-full" disabled>Coming soon</Button>
          )}
        </div>
        <div className="border border-line rounded-sm p-7 text-center">
          <p className="font-display text-xl text-charcoal mb-2">Telegram Group</p>
          <p className="text-sm text-charcoal/60 mb-6">Spiritual content, announcements, and event updates.</p>
          {settings?.telegram_link ? (
            <Button href={settings.telegram_link} variant="primary" className="w-full">Join on Telegram</Button>
          ) : (
            <Button variant="secondary" className="w-full" disabled>Coming soon</Button>
          )}
        </div>
      </section>
      <section className="max-w-lg mx-auto px-6 lg:px-10 pb-20">
        <div className="border-t border-line pt-10 text-center">
          <p className="font-display text-xl text-charcoal mb-2">Newsletter</p>
          <p className="text-sm text-charcoal/60 mb-6">Weekly guidance, articles, and upcoming events in your inbox.</p>
          {settings?.newsletter_embed_html ? (
            <div dangerouslySetInnerHTML={{ __html: settings.newsletter_embed_html }} />
          ) : (
            <p className="text-xs text-charcoal/40">Newsletter signup coming soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
