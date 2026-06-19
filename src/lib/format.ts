import type { EmailEvent } from "@/lib/resend/types";

/** Parse `"Name <email@domain>"` into { name, email }. */
export function parseAddress(input?: string | null): { name: string; email: string } {
  if (!input) return { name: "", email: "" };
  const m = input.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (m) return { name: m[1].trim(), email: m[2].trim() };
  return { name: "", email: input.trim() };
}

/** Compact label for a "from"/"to" field: prefer the display name. */
export function senderLabel(input?: string | null): string {
  const { name, email } = parseAddress(input);
  return name || email || "Unknown";
}

/** Initials for circular avatars (2 chars, uppercase). */
export function initials(input?: string | null): string {
  const { name, email } = parseAddress(input);
  const base = name || email || "?";
  const parts = base.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

/** Deterministic accent colour (within the Aureate palette) for an avatar. */
export function avatarTone(input?: string | null): string {
  const tones = ["#d4a017", "#4a4949", "#37393b", "#5c4300", "#795900"];
  let h = 0;
  for (const ch of input || "?") h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return tones[h % tones.length];
}

/** Human-friendly relative time, e.g. "10:42 AM", "Yesterday", "Oct 12". */
export function formatTime(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso.replace(" ", "T").endsWith("Z") ? iso : iso.replace(" ", "T"));
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yest = new Date(now);
  yest.setDate(now.getDate() - 1);
  const isYest = d.toDateString() === yest.toDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return time;
  if (isYest) return "Yesterday";
  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: sameYear ? undefined : "numeric" });
}

/** Absolute long date for the reading pane header. */
export function formatLongDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso.replace(" ", "T").endsWith("Z") ? iso : iso.replace(" ", "T"));
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatBytes(bytes?: number | null): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Map a Resend `last_event` to a { label, tone } badge. */
export function eventBadge(event?: EmailEvent | string | null): { label: string; tone: "primary" | "secondary" | "error" } {
  switch (event) {
    case "delivered":
    case "opened":
    case "clicked":
      return { label: String(event).charAt(0).toUpperCase() + String(event).slice(1), tone: "primary" };
    case "bounced":
    case "failed":
    case "complained":
    case "suppressed":
      return { label: String(event), tone: "error" };
    case "scheduled":
      return { label: "Scheduled", tone: "primary" };
    case "sent":
    case "queued":
    default:
      return { label: String(event ?? "sent"), tone: "secondary" };
  }
}

/** `cn` — tiny class joiner (no deps). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
