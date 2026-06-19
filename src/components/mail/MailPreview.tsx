"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { Badge, IconButton } from "@/components/ui/primitives";
import { EmptyState, ErrorState, LoadingState } from "./EmptyState";
import { useGet } from "@/lib/hooks";
import { useSettings } from "@/lib/settings";
import { formatBytes, formatLongDate, formatTime, parseAddress, senderLabel } from "@/lib/format";
import type { ReceivedEmail, SentEmail } from "@/lib/resend/types";

/** Reading pane. Fetches either a sent or received email and renders it. */
export function MailPreview({
  id,
  variant,
}: {
  id: string;
  variant: "received" | "sent";
}) {
  const { settings, isConfigured } = useSettings();
  const path =
    isConfigured && id
      ? variant === "received"
        ? `/api/receiving/${id}`
        : `/api/emails/${id}`
      : null;

  const { data, loading, error } = useGet<SentEmail | ReceivedEmail>(path);

  if (!isConfigured) {
    return (
      <EmptyState
        icon="key"
        title="No API key"
        description="Add your Resend API key in Settings to read messages."
      />
    );
  }
  if (loading) return <LoadingState label="Opening message…" />;
  if (error) return <ErrorState message={error.message} />;
  if (!data) return <EmptyState icon="mail" title="Select a message" />;

  const isReceived = variant === "received";
  const from = data.from;
  const to = (data.to ?? []).filter(Boolean);
  const subject = data.subject || "(no subject)";
  const html = ("html" in data ? data.html : null) || null;
  const text = ("text" in data ? data.text : null) || null;
  const attachments =
    (data as { attachments?: { id: string; filename: string; size?: number; content_type?: string | null }[] }).attachments ?? [];
  const { name } = parseAddress(from);
  const replyBase = isReceived ? "/inbox" : "/sent";

  return (
    <section className="custom-scrollbar pane-rise flex flex-1 flex-col overflow-y-auto bg-background">
      {/* Atmosphere */}
      <div className="pointer-events-none fixed right-0 top-16 -z-0 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />

      {/* Toolbar */}
      <div className="glass-panel sticky top-0 z-10 flex h-14 items-center justify-between border-b border-outline-variant px-container-padding">
        <div className="flex items-center gap-stack-md">
          <Link href={replyBase} className="flex items-center gap-1 text-secondary hover:text-primary">
            <Icon name="arrow_back" className="text-[20px]" /> <span className="text-label-sm hidden sm:inline">Back</span>
          </Link>
          <div className="h-4 w-px bg-outline-variant" />
          <IconButton aria-label="Archive"><Icon name="archive" /></IconButton>
          <IconButton aria-label="Report"><Icon name="report" /></IconButton>
          {!isReceived && (data as SentEmail).scheduled_at && (
            <Badge tone="primary">
              <span className="material-symbols-outlined filled text-[14px]">schedule</span>
              {formatTime((data as SentEmail).scheduled_at)}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-stack-md">
          <IconButton aria-label="Reply"><Icon name="reply" /></IconButton>
          <IconButton aria-label="Reply all"><Icon name="reply_all" /></IconButton>
          <IconButton aria-label="Forward"><Icon name="forward" /></IconButton>
          <IconButton aria-label="More"><Icon name="more_vert" /></IconButton>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-4xl px-container-padding py-12">
        <div className="mb-stack-lg">
          <h1 className="mb-stack-md font-display text-display leading-tight text-on-surface">{subject}</h1>
          <div className="flex items-center justify-between gap-4 border-b border-outline-variant/30 py-stack-md">
            <div className="flex items-center gap-4">
              <Avatar label={from} size={48} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-on-surface">{name || senderLabel(from)}</span>
                  <span className="text-label-xs text-secondary">&lt;{parseAddress(from).email || from}&gt;</span>
                </div>
                <p className="text-label-sm text-secondary">
                  {isReceived ? "to" : "from"}{" "}
                  <span className="text-on-surface">
                    {isReceived ? (to[0] || settings.displayName) : settings.displayName}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-label-xs uppercase tracking-widest text-secondary">
                {formatLongDate(data.created_at)}
              </p>
              <p className="text-label-xs text-secondary">{formatTime(data.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        {html ? (
          <div className="mail-html space-y-4 text-body-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
        ) : text ? (
          <pre className="mail-html whitespace-pre-wrap font-sans text-body-lg leading-relaxed">{text}</pre>
        ) : (
          <p className="text-body-lg text-secondary">This message has no displayable body.</p>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="mt-12 border-t border-outline-variant/30 pt-stack-lg">
            <h3 className="mb-stack-md text-label-sm font-bold uppercase tracking-widest text-secondary">
              {attachments.length} Attachment{attachments.length > 1 ? "s" : ""}
            </h3>
            <div className="flex flex-wrap gap-stack-md">
              {attachments.map((a) => (
                <div
                  key={a.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-outline-variant bg-surface-container-high p-3 transition-all hover:border-primary"
                >
                  <Icon name="attach_file" className="text-primary" />
                  <div>
                    <p className="text-body-md font-bold">{a.filename}</p>
                    <p className="text-label-xs text-secondary">{formatBytes(a.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick reply box (compose deep-link) */}
        <Link
          href={`/compose?to=${encodeURIComponent(parseAddress(from).email || from)}&subject=${encodeURIComponent(
            subject.startsWith("Re:") ? subject : `Re: ${subject}`,
          )}`}
          className="mt-12 block rounded-xl border border-outline-variant bg-surface-container-low p-stack-md transition-all hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-stack-md">
              <Avatar label={settings.displayName} size={32} />
              <span className="text-body-md text-secondary">
                Reply to {name || senderLabel(from)}…
              </span>
            </div>
            <span className="flex items-center gap-1 text-label-sm font-bold text-primary">
              <Icon name="reply" className="text-[18px]" /> Reply
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
