"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/primitives";
import { eventBadge, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MailRow } from "./types";

/** Single row in the inbox/sent list. Adapts to received vs sent context. */
export function MailListItem({
  row,
  href,
  active,
  variant,
}: {
  row: MailRow;
  href: string;
  active?: boolean;
  variant: "received" | "sent";
}) {
  const isReceived = variant === "received";
  const peer = isReceived ? row.from : row.toLabel;
  const badge = eventBadge(row.last_event);

  return (
    <Link
      href={href}
      className={cn(
        "group relative block cursor-pointer p-container-padding transition-all hover:bg-surface-container-highest",
        active && "email-item-active",
      )}
    >
      {!active && <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-outline-variant/30 to-transparent" />}
      <div className="mb-1 flex items-start justify-between">
        <h3
          className={cn(
            "truncate text-body-lg",
            active ? "font-bold text-on-surface" : "font-semibold text-on-surface",
          )}
        >
          {peer || "—"}
        </h3>
        <span
          className={cn(
            "shrink-0 text-label-xs",
            active ? "font-bold text-primary" : "text-secondary",
          )}
        >
          {formatTime(row.created_at)}
        </span>
      </div>

      <p
        className={cn(
          "mb-1 truncate text-body-md",
          active ? "font-semibold text-primary" : "font-medium text-on-surface",
        )}
      >
        {row.subject || "(no subject)"}
      </p>

      {row.preview && (
        <p className="line-clamp-2 text-body-md leading-relaxed text-secondary">{row.preview}</p>
      )}

      <div className="mt-stack-sm flex items-center gap-2">
        {isReceived ? (
          <Badge tone="primary">Inbound</Badge>
        ) : (
          <Badge tone={badge.tone === "error" ? "error" : "secondary"}>
            <StatusIcon event={row.last_event} /> {badge.label}
          </Badge>
        )}
        {row.scheduled_at && (
          <Badge tone="primary">
            <ScheduleIcon /> {formatTime(row.scheduled_at)}
          </Badge>
        )}
        {row.tag && <Badge tone="secondary">{row.tag}</Badge>}
      </div>
    </Link>
  );
}

function StatusIcon({ event }: { event?: string | null }) {
  const filled = event === "delivered" || event === "opened" || event === "clicked";
  return <span className="material-symbols-outlined filled text-[14px]">{filled ? "done_all" : "done"}</span>;
}

function ScheduleIcon() {
  return <span className="material-symbols-outlined filled text-[14px]">schedule</span>;
}
