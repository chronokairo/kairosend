import { avatarTone, initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Circular avatar. Uses deterministic Aureate tones when there is no photo. */
export function Avatar({
  label,
  src,
  size = 40,
  className,
}: {
  label?: string | null;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const tone = avatarTone(label);
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full border border-outline-variant font-bold", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: src ? "transparent" : tone,
        color: "#111415",
        fontSize: size * 0.38,
      }}
      aria-hidden="true"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full rounded-full object-cover" />
      ) : (
        initials(label)
      )}
    </div>
  );
}
