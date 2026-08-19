import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="LEGAL" title="Terms & Conditions" />
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        <p className="text-charcoal/65 leading-relaxed">
          This page is a placeholder. Replace with your actual policy text — edit this
          file directly, or (recommended) move this content into a database table
          managed from the admin dashboard if you want it editable without a code change.
        </p>
      </section>
    </>
  );
}
