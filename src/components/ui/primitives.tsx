import Link from "next/link";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "primary",
  className,
}: {
  children: React.ReactNode;
  tone?: "primary" | "secondary" | "error" | "outline";
  className?: string;
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary-container text-secondary",
    error: "bg-error-container/30 text-error border-error/20",
    outline: "border border-outline-variant text-secondary",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-label-xs font-bold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function LinkButton({
  href,
  children,
  variant = "ghost",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
}) {
  const variants: Record<string, string> = {
    primary:
      "bg-primary text-on-primary hover:opacity-90 active:scale-95 shadow-lg shadow-primary/10",
    ghost: "text-secondary hover:text-primary hover:bg-surface-variant",
    outline: "border border-outline-variant hover:border-primary text-on-surface",
  };
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all active:scale-95",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function IconButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "flex items-center justify-center rounded-full p-2 text-secondary transition-all hover:bg-surface-variant hover:text-primary active:scale-95",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
