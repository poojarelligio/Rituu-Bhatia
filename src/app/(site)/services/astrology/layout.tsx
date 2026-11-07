import type { ReactNode } from "react";
import ServiceTheme from "@/components/services/ServiceTheme";

export default function Layout({ children }: { children: ReactNode }) {
  return <ServiceTheme service="astrology">{children}</ServiceTheme>;
}