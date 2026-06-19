"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/lib/api";
import { useSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";
import type { SendEmailParams } from "@/lib/resend/types";

type SendState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; id: string; scheduled?: string }
  | { kind: "error"; message: string };

/** Compose form — POST /api/emails/send. Supports schedule (scheduled_at). */
export function ComposeForm() {
  const router = useRouter();
  const params = useSearchParams();
  const api = useApi();
  const { settings, isConfigured } = useSettings();

  const [to, setTo] = useState(params.get("to") ?? "");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState(params.get("subject") ?? "");
  const [body, setBody] = useState("");
  const [from, setFrom] = useState(settings.fromAddress);
  const [scheduleAt, setScheduleAt] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [state, setState] = useState<SendState>({ kind: "idle" });
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => setFrom(settings.fromAddress), [settings.fromAddress]);

  // Lightweight local "draft" autosave indicator.
  useEffect(() => {
    if (!to && !subject && !body) return;
    const t = setTimeout(() => setSavedAt(new Date()), 1500);
    return () => clearTimeout(t);
  }, [to, subject, body]);

  const payload = useMemo<SendEmailParams | null>(() => buildPayload({
    from,
    to,
    cc,
    bcc,
    subject,
    body,
    scheduleAt,
  }), [from, to, cc, bcc, subject, body, scheduleAt]);

  async function send(schedule = false) {
    if (!payload) return;
    if (schedule && !scheduleAt) {
      setShowSchedule(true);
      return;
    }
    setState({ kind: "sending" });
    try {
      const finalPayload: SendEmailParams = schedule
        ? { ...payload, scheduled_at: scheduleAt }
        : payload;
      const res = await api.post<{ id: string }>("/api/emails/send", finalPayload);
      setState({
        kind: "success",
        id: res.id,
        scheduled: schedule ? scheduleAt : undefined,
      });
      setTimeout(() => router.push("/sent"), 1400);
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Send failed" });
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Atmospheric header */}
      <div className="mb-stack-lg flex items-end justify-between">
        <div>
          <h2 className="font-display text-headline-lg text-on-surface">New Message</h2>
          <p className="text-body-md font-light text-secondary-fixed-dim">
            Drafting from your Resend account
          </p>
        </div>
        <div className="flex gap-stack-sm">
          <button
            onClick={() => setShowSchedule((s) => !s)}
            className={cn(
              "rounded-lg p-2 transition-colors",
              showSchedule ? "text-primary" : "text-secondary hover:text-primary",
            )}
            title="Schedule send"
          >
            <Icon name="schedule_send" />
          </button>
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 text-secondary transition-colors hover:text-error"
            title="Discard"
          >
            <Icon name="close" />
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low shadow-2xl">
        {!isConfigured && (
          <div className="flex items-center gap-2 border-b border-error/20 bg-error-container/10 p-3 text-label-sm text-error">
            <Icon name="info" className="text-[18px]" />
            Add your Resend API key in Settings before sending.
          </div>
        )}

        {/* Schedule bar */}
        {showSchedule && (
          <div className="relative flex items-center gap-3 bg-surface-container-highest/30 p-stack-md">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-outline-variant/30 to-transparent" />
            <Icon name="schedule" className="text-primary" />
            <label className="text-label-sm text-secondary">Send at</label>
            <input
              type="datetime-local"
              value={toLocalInput(scheduleAt)}
              onChange={(e) => setScheduleAt(fromLocalInput(e.target.value))}
              className="rounded-lg border border-outline-variant bg-surface-container px-3 py-1 text-body-md text-on-surface focus:border-primary focus:outline-none"
            />
            <button onClick={() => { setScheduleAt(""); }} className="text-label-sm text-secondary hover:text-error">
              Clear
            </button>
          </div>
        )}

        {/* Header inputs */}
        <div className="divide-y divide-outline-variant/30">
          <FieldRow label="From">
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Name <you@yourdomain.com>"
              className="w-full bg-transparent text-body-lg text-on-surface placeholder:text-outline/40 focus:outline-none"
            />
          </FieldRow>
          <FieldRow label="To" onAction={() => setShowCc((s) => !s)} actionLabel={showCc ? "Hide Cc/Bcc" : "Cc/Bcc"}>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full bg-transparent text-body-lg text-on-surface placeholder:text-outline/40 focus:outline-none"
            />
          </FieldRow>
          {showCc && (
            <>
              <FieldRow label="Cc">
                <input value={cc} onChange={(e) => setCc(e.target.value)} placeholder="cc@example.com" className="w-full bg-transparent text-body-lg text-on-surface placeholder:text-outline/40 focus:outline-none" />
              </FieldRow>
              <FieldRow label="Bcc">
                <input value={bcc} onChange={(e) => setBcc(e.target.value)} placeholder="bcc@example.com" className="w-full bg-transparent text-body-lg text-on-surface placeholder:text-outline/40 focus:outline-none" />
              </FieldRow>
            </>
          )}
          <FieldRow label="Subject">
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Quarterly Growth Strategic Overview"
              className="w-full bg-transparent text-body-lg font-medium text-on-surface placeholder:text-outline/40 focus:outline-none"
            />
          </FieldRow>
        </div>

        {/* Toolbar (decorative formatting affordances) */}
        <div className="relative flex items-center gap-gutter bg-surface-container-highest/30 px-container-padding py-2">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-outline-variant/30 to-transparent" />
          {["format_bold", "format_italic", "format_underlined"].map((i) => (
            <button key={i} className="rounded p-1.5 text-on-surface-variant hover:bg-surface-variant hover:text-primary">
              <Icon name={i} className="text-[20px]" />
            </button>
          ))}
          <div className="h-5 w-px bg-outline-variant/50" />
          {["link", "attach_file", "image"].map((i) => (
            <button key={i} className="rounded p-1.5 text-on-surface-variant hover:bg-surface-variant hover:text-primary">
              <Icon name={i} className="text-[20px]" />
            </button>
          ))}
          <div className="ml-auto text-label-xs italic text-outline">
            HTML composer · plain text sent by default
          </div>
        </div>

        {/* Body */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type your executive summary here…"
          className="custom-scrollbar min-h-[40vh] flex-1 resize-none bg-transparent p-container-padding font-light leading-relaxed text-on-surface placeholder:text-outline/20 focus:outline-none"
        />

        {/* Footer */}
        <div className="relative flex items-center justify-between bg-surface-container-low p-container-padding">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-outline-variant/30 to-transparent" />
          <div className="flex items-center gap-gutter">
            <button
              onClick={() => send(false)}
              disabled={state.kind === "sending" || !payload}
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-bold text-on-primary shadow-lg shadow-primary/10 transition-all hover:bg-surface-tint active:scale-95 disabled:opacity-50"
            >
              <Icon name="send" filled />
              {state.kind === "sending" ? "Sending…" : "Send Message"}
            </button>
            <button
              onClick={() => send(true)}
              disabled={state.kind === "sending" || !payload}
              className="rounded-lg p-2 text-secondary transition-colors hover:text-primary disabled:opacity-50"
              title="Schedule send"
            >
              <Icon name="schedule_send" />
            </button>
          </div>
          <div className="flex items-center gap-stack-md">
            {state.kind === "error" && (
              <span className="text-label-xs text-error">{state.message}</span>
            )}
            {state.kind === "success" && (
              <span className="flex items-center gap-1 text-label-xs text-primary">
                <Icon name="check_circle" className="text-[14px]" filled />
                {state.scheduled ? "Scheduled" : "Sent"}
              </span>
            )}
            {savedAt && state.kind === "idle" && (
              <>
                <span className="text-label-xs italic text-outline">
                  Draft saved {formatRelative(savedAt)}
                </span>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/40" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldRow({
  label,
  children,
  actionLabel,
  onAction,
}: {
  label: string;
  children: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="group flex items-center px-container-padding py-stack-md">
      <label className="w-20 text-label-sm font-bold uppercase tracking-widest text-secondary opacity-60">
        {label}
      </label>
      <div className="flex flex-1 items-center">{children}</div>
      {actionLabel && (
        <button onClick={onAction} className="ml-2 text-label-sm text-primary opacity-0 transition-opacity hover:underline group-hover:opacity-100">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/** Build a SendEmailParams from raw strings, or null when invalid. */
function buildPayload(input: {
  from: string;
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  scheduleAt: string;
}): SendEmailParams | null {
  const from = input.from.trim();
  const toList = splitEmails(input.to);
  if (!from || toList.length === 0) return null;
  return {
    from,
    to: toList,
    subject: input.subject.trim() || "(no subject)",
    html: input.body ? `<div style="font-family:Inter,Arial,sans-serif;line-height:1.6;">${escapeHtml(input.body).replace(/\n/g, "<br/>")}</div>` : "<p></p>",
    text: input.body,
    cc: splitEmails(input.cc),
    bcc: splitEmails(input.bcc),
  };
}

function splitEmails(input: string): string[] {
  return input
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toLocalInput(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d.toISOString();
}

function formatRelative(d: Date): string {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  return `${Math.floor(s / 60)}m ago`;
}
