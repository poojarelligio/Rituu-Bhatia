import type { Metadata } from "next";
import ResourcesPageClient from "@/components/site/ResourcesPageClient";

export const metadata: Metadata = { title: "Free Resources" };

export default function ResourcesPage() {
  return <ResourcesPageClient />;
}
