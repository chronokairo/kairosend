/**
 * Resend API types — derived from the official API reference
 * (https://resend.com/docs/api-reference). Covers the endpoints Kairosend uses:
 *  - Send Email, Update (reschedule), Cancel
 *  - List/Retrieve Sent Emails
 *  - List/Retrieve Received Emails
 */

export type EmailAddress = string;

/** Email event lifecycle, surfaced as `last_event`. */
export type EmailEvent =
  | "queued"
  | "sent"
  | "delivered"
  | "delivery_delayed"
  | "opened"
  | "clicked"
  | "bounced"
  | "complained"
  | "failed"
  | "suppressed"
  | "scheduled"
  | "canceled";

export interface Attachment {
  id?: string;
  filename: string;
  content_type?: string | null;
  content_id?: string | null;
  content_disposition?: string | null;
  size?: number;
  /** Base64 string or Buffer when sending. */
  content?: string | Buffer;
  /** Hosted path alternative to content (when sending). */
  path?: string;
}

export interface Tag {
  name: string;
  value: string;
}

export interface EmailListItem {
  id: string;
  object?: "email";
  to: EmailAddress[];
  from: string;
  subject: string | null;
  created_at: string;
  bcc: EmailAddress[] | null;
  cc: EmailAddress[] | null;
  reply_to: EmailAddress[] | null;
  last_event?: EmailEvent | string | null;
  scheduled_at?: string | null;
}

export interface SentEmail extends EmailListItem {
  object: "email";
  html?: string | null;
  text?: string | null;
  tags?: Tag[] | null;
}

/** Attachment as it appears on a *received* email list/preview. */
export interface ReceivedAttachment {
  id: string;
  filename: string;
  content_type: string | null;
  content_id: string | null;
  content_disposition: string | null;
  size: number;
}

export interface ReceivedEmailListItem {
  id: string;
  to: EmailAddress[];
  from: string;
  subject: string | null;
  created_at: string;
  bcc: EmailAddress[];
  cc: EmailAddress[];
  reply_to: EmailAddress[];
  message_id?: string;
  attachments?: ReceivedAttachment[];
}

export interface ReceivedEmail extends ReceivedEmailListItem {
  object: "email";
  html?: string | null;
  html_format?: "data_uri" | "cid" | null;
  text?: string | null;
  headers?: Record<string, string>;
  raw?: { download_url: string; expires_at: string } | null;
  attachments?: ReceivedAttachment[];
}

export interface PaginatedList<T> {
  object: "list";
  has_more: boolean;
  data: T[];
}

export interface ListParams {
  /** 1–100. Default 20. */
  limit?: number;
  /** Cursor id — fetch the page *after* this item. */
  after?: string;
  /** Cursor id — fetch the page *before* this item. */
  before?: string;
}

export interface SendEmailParams {
  from: string;
  to: EmailAddress | EmailAddress[];
  subject: string;
  html?: string;
  text?: string;
  cc?: EmailAddress | EmailAddress[];
  bcc?: EmailAddress | EmailAddress[];
  reply_to?: EmailAddress | EmailAddress[];
  headers?: Record<string, string>;
  /** Natural language ("in 1 min") or ISO 8601 timestamp. */
  scheduled_at?: string;
  attachments?: Attachment[];
  tags?: Tag[];
  /** Idempotency key to prevent duplicate sends. */
  idempotencyKey?: string;
}

export interface SendEmailResponse {
  id: string;
}

export interface UpdateEmailParams {
  id: string;
  /** ISO 8601 timestamp to reschedule (only scheduled emails can be updated). */
  scheduled_at: string;
}

export interface MutationResponse {
  object: "email";
  id: string;
}

/** Normalised Resend API error. */
export interface ResendApiError {
  name: string;
  statusCode: number;
  message: string;
}
