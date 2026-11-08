
import type { ReactNode, CSSProperties } from "react";

export type ServiceKey =
  | "vaastu"
  | "tarot"
  | "astrology"
  | "reiki"
  | "signature"
  | "logo";

interface ServiceThemeProps {
  service: ServiceKey;
  children: ReactNode;
}

export default function ServiceTheme({
  service,
  children,
}: ServiceThemeProps) {
  const style: CSSProperties = {
    ["--color-accent" as string]: `var(--color-${service})`,
    ["--color-accent-deep" as string]: `var(--color-${service}-deep)`,
  };

  return <div style={style}>{children}</div>;
}
