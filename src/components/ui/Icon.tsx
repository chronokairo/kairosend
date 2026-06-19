import { cn } from "@/lib/utils";

export type IconName = string;

/** Material Symbols wrapper (matches the icon font used in the mockups). */
export function Icon({
  name,
  className,
  filled,
  style,
}: {
  name: IconName;
  className?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn("material-symbols-outlined select-none", filled && "filled", className)}
      aria-hidden="true"
      style={style}
    >
      {name}
    </span>
  );
}
