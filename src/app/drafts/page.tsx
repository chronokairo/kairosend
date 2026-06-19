"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/mail/EmptyState";
import { Badge } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { useApi } from "@/lib/api";
import { useList } from "@/lib/hooks";
import { useSettings } from "@/lib/settings";
import { formatTime } from "@/lib/format";
import type { SentEmail } from "@/lib/resend/types";

/**
 * Drafts — in Resend, "scheduled" emails (scheduled_at in the future) are the
 * closest analog to drafts: they can be rescheduled (Update Email) or canceled
 * (Cancel Email). We list sent emails and keep only scheduled ones.
 */
export default function DraftsPage() {
  const { isConfigured } = useSettings();
  const { data, loading, error, reload } = useList<SentEmail>(
    isConfigured ? "/api/emails?limit=100" : null,
  );
  const scheduled = data.filter((e) => Boolean(e.scheduled_at));

  return (
    <AppShell title="Drafts" searchPlaceholder="Search scheduled mail…">
      <section className="flex w-list-width flex-col border-r border-outline-variant bg-surface-container-lowest">
        <div className="border-b border-outline-variant p-container-padding">
          <h2 className="font-display text-title-md font-bold">Scheduled</h2>
          <p className="text-label-xs text-secondary">Resend · scheduled_at</p>
        </div>
        <div className="custom-scrollbar flex-1 overflow-y-auto">
          {!isConfigured ? (
            <EmptyState icon="key" title="Connect your account" description="Add your Resend API key in Settings." />
          ) : loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error.message} onRetry={reload} />
          ) : scheduled.length === 0 ? (
            <EmptyState
              icon="drafts"
              title="No scheduled drafts"
              description="Schedule an email from Compose and it will appear here."
            />
          ) : (
            scheduled.map((e) => <DraftRow key={e.id} email={e} onChanged={reload} />)
          )}
        </div>
      </section>
      <section className="flex flex-1 flex-col bg-background">
        <EmptyState
          icon="schedule_send"
          title="Manage scheduled sends"
          description="Reschedule or cancel a pending email from the list."
        />
      </section>
    </AppShell>
  );
}

function DraftRow({ email, onChanged }: { email: SentEmail; onChanged: () => void }) {
  const api = useApi();
  const [busy, setBusy] = useState(false);
  const [when, setWhen] = useState(email.scheduled_at ?? "");

  async function reschedule() {
    setBusy(true);
    try {
      await api.patch(`/api/emails/${email.id}/update`, { scheduled_at: when });
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    setBusy(true);
    try {
      await api.post(`/api/emails/${email.id}/cancel`);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border-b border-outline-variant p-container-padding transition-colors hover:bg-surface-container-highest">
      <div className="mb-1 flex items-center justify-between">
        <span className="truncate text-body-lg font-semibold text-on-surface">
          {email.to?.[0] ?? "—"}
        </span>
        <Badge tone="primary">
          <span className="material-symbols-outlined filled text-[14px]">schedule</span>
          {formatTime(email.scheduled_at)}
        </Badge>
      </div>
      <p className="mb-2 truncate text-body-md font-medium text-primary">
        {email.subject || "(no subject)"}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="datetime-local"
          value={toLocal(when)}
          onChange={(e) => setWhen(fromLocal(e.target.value))}
          className="rounded-lg border border-outline-variant bg-surface-container px-2 py-1 text-label-sm text-on-surface focus:border-primary focus:outline-none"
        />
        <button
          onClick={reschedule}
          disabled={busy}
          className="flex items-center gap-1 rounded-lg border border-outline-variant px-3 py-1 text-label-sm font-bold hover:border-primary disabled:opacity-50"
        >
          <Icon name="update" className="text-[16px]" /> Update
        </button>
        <button
          onClick={cancel}
          disabled={busy}
          className="flex items-center gap-1 rounded-lg px-3 py-1 text-label-sm font-bold text-error hover:bg-error-container/20 disabled:opacity-50"
        >
          <Icon name="delete" className="text-[16px]" /> Cancel
        </button>
      </div>
    </div>
  );
}

function toLocal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso.replace(" ", "T").endsWith("Z") ? iso : iso.replace(" ", "T"));
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocal(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d.toISOString();
}
