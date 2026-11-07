import { forwardRef } from "react";
import Link from "next/link";

const variants = {
  primary: "bg-burgundy text-ivory hover:bg-burgundy-deep",
  secondary: "bg-transparent text-charcoal border border-charcoal/30 hover:border-charcoal",
  onDark: "bg-ivory text-charcoal hover:bg-gold-soft",
  ghost: "bg-transparent text-burgundy hover:text-burgundy-deep underline-offset-4 hover:underline",
};

type Variant = keyof typeof variants;

interface ButtonBaseProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

/** Use `href` for internal links (renders a Next.js Link), or omit it for a <button>. */
type ButtonProps = ButtonBaseProps &
  (
    | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
  );

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { variant = "primary", className = "", children, href, ...props },
  ref
) {
  const classes = `inline-flex items-center justify-center gap-2 px-6 py-3 text-sm tracking-wide transition-colors duration-200 rounded-full font-medium ${variants[variant]} ${className}`;

  if (href) {
    const isExternal = /^(https?:|mailto:|tel:)/.test(href);
    if (isExternal) {
      return (
        <a href={href} className={classes} ref={ref as React.Ref<HTMLAnchorElement>} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} ref={ref as React.Ref<HTMLAnchorElement>} {...(props as Omit<React.ComponentProps<typeof Link>, "href">)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} ref={ref as React.Ref<HTMLButtonElement>} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
});

export default Button;
