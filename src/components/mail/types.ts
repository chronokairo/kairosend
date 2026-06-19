/** Display-normalised row shared by inbox & sent lists. */
export interface MailRow {
  id: string;
  /** Sender "From" string (received) — undefined for sent. */
  from?: string;
  /** Recipient label (sent). */
  toLabel?: string;
  to?: string[] | null;
  subject: string | null;
  preview?: string;
  created_at: string;
  last_event?: string | null;
  scheduled_at?: string | null;
  tag?: string | null;
}

/** Convert a received-email list item into a MailRow. */
export function toReceivedRow(item: {
  id: string;
  from: string;
  to?: string[] | null;
  subject?: string | null;
  created_at: string;
}): MailRow {
  return {
    id: item.id,
    from: item.from,
    to: item.to ?? [],
    toLabel: item.to?.[0],
    subject: item.subject ?? null,
    created_at: item.created_at,
    last_event: "received",
  };
}

/** Convert a sent-email list item into a MailRow. */
export function toSentRow(item: {
  id: string;
  from: string;
  to?: string[] | null;
  subject?: string | null;
  created_at: string;
  last_event?: string | null;
  scheduled_at?: string | null;
  tags?: { name: string; value: string }[] | null;
}): MailRow {
  return {
    id: item.id,
    from: item.from,
    to: item.to ?? [],
    toLabel: `To: ${item.to?.[0] ?? "—"}`,
    subject: item.subject ?? null,
    created_at: item.created_at,
    last_event: item.last_event ?? "sent",
    scheduled_at: item.scheduled_at ?? null,
    tag: item.tags?.[0]?.value ?? null,
  };
}
