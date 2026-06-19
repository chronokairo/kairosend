/**
 * Typed Resend REST client.
 *
 * Implements the subset of the Resend API used by Kairosend, directly against
 * https://api.resend.com (REST). Mirrors the official SDK surface so it can be
 * swapped for `resend` later without churn.
 *
 * Reference: https://resend.com/docs/api-reference
 *  - POST   /emails                  Send Email
 *  - PATCH  /emails/:id              Update (reschedule)
 *  - POST   /emails/:id/cancel       Cancel (scheduled)
 *  - GET    /emails                  List Sent Emails
 *  - GET    /emails/:id              Retrieve Sent Email
 *  - GET    /emails/receiving        List Received Emails   (Inbox)
 *  - GET    /emails/receiving/:id    Retrieve Received Email
 */
import type {
  EmailEvent,
  ListParams,
  MutationResponse,
  PaginatedList,
  ReceivedEmail,
  ReceivedEmailListItem,
  ResendApiError,
  SendEmailParams,
  SendEmailResponse,
  SentEmail,
  UpdateEmailParams,
} from "./types";

const BASE_URL = "https://api.resend.com";

export class ResendError extends Error implements ResendApiError {
  name: string;
  statusCode: number;
  message: string;
  constructor(error: ResendApiError) {
    super(error.message);
    this.name = error.name;
    this.statusCode = error.statusCode;
    this.message = error.message;
  }
}

type FetchLike = typeof fetch;

export interface ResendClientOptions {
  apiKey: string;
  /** Override base URL (testing / proxies). */
  baseUrl?: string;
  /** Injectable fetch (works in Node 18+, browser, Electron). */
  fetch?: FetchLike;
}

export class Resend {
  readonly baseUrl: string;
  private apiKey: string;
  private fetchFn: FetchLike;

  constructor(opts: ResendClientOptions) {
    if (!opts?.apiKey) throw new ResendError(missingKeyError());
    this.apiKey = opts.apiKey;
    this.baseUrl = opts.baseUrl ?? BASE_URL;
    this.fetchFn = opts.fetch ?? fetch;
  }

  /** The Resend API requires a User-Agent header (otherwise 403 / error 1010). */
  private headers(extra: HeadersInit = {}, idempotencyKey?: string): HeadersInit {
    const h: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "kairosend/0.1",
      Accept: "application/json",
      ...((extra as Record<string, string>) ?? {}),
    };
    if (idempotencyKey) h["Idempotency-Key"] = idempotencyKey;
    return h;
  }

  private async request<T>(
    method: string,
    path: string,
    { body, query, headers, idempotencyKey }: {
      body?: unknown;
      query?: Record<string, string | number | undefined>;
      headers?: HeadersInit;
      idempotencyKey?: string;
    } = {},
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
      }
    }
    const res = await this.fetchFn(url.toString(), {
      method,
      headers: this.headers(headers, idempotencyKey),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    const json = text ? (JSON.parse(text) as unknown) : null;

    if (!res.ok) {
      const err = (json as ResendApiError | null) ?? {
        name: "request_failed",
        statusCode: res.status,
        message: res.statusText || `Request to ${path} failed`,
      };
      throw new ResendError(err);
    }
    return json as T;
  }

  readonly emails = {
    /** Send an email (or schedule it via `scheduled_at`). */
    send: (params: SendEmailParams): Promise<{ data: SendEmailResponse | null; error: ResendError | null }> =>
      this.request<{ id: string }>("POST", "/emails", {
        body: stripUndef({
          from: params.from,
          to: params.to,
          subject: params.subject,
          html: params.html,
          text: params.text,
          cc: params.cc,
          bcc: params.bcc,
          reply_to: params.reply_to,
          headers: params.headers,
          scheduled_at: params.scheduled_at,
          attachments: params.attachments,
          tags: params.tags,
        }),
        idempotencyKey: params.idempotencyKey,
      }).then(
        (data) => ({ data, error: null }),
        (error: ResendError) => ({ data: null, error }),
      ),

    /** Retrieve a single sent email (includes html/text). */
    get: (id: string): Promise<SentEmail> => this.request("GET", `/emails/${id}`),

    /** List emails sent by the team. */
    list: (params: ListParams = {}): Promise<PaginatedList<SentEmail>> =>
      this.request("GET", "/emails", {
        query: { limit: params.limit, after: params.after, before: params.before },
      }),

    /** Reschedule a scheduled email (ISO 8601 timestamp). */
    update: (params: UpdateEmailParams): Promise<MutationResponse> =>
      this.request("PATCH", `/emails/${params.id}`, { body: { scheduled_at: params.scheduled_at } }),

    /** Cancel a scheduled email. */
    cancel: (id: string): Promise<MutationResponse> =>
      this.request("POST", `/emails/${id}/cancel`, { body: {} }),
  };

  /** Inbound (received) email endpoints — the Inbox. */
  readonly receiving = {
    list: (params: ListParams = {}): Promise<PaginatedList<ReceivedEmailListItem>> =>
      this.request("GET", "/emails/receiving", {
        query: { limit: params.limit, after: params.after, before: params.before },
      }),
    get: (id: string): Promise<ReceivedEmail> => this.request("GET", `/emails/receiving/${id}`),
  };

  /** Expose the request primitive for attachment downloads, etc. */
  raw<T>(method: string, path: string, init?: { query?: Record<string, string | number | undefined>; headers?: HeadersInit }): Promise<T> {
    return this.request<T>(method, path, init);
  }
}

/** Re-export event helper for badge rendering. */
export function isDelivered(event?: EmailEvent | string | null) {
  return event === "delivered" || event === "opened" || event === "clicked";
}

function missingKeyError(): ResendApiError {
  return {
    name: "missing_api_key",
    statusCode: 401,
    message:
      "No Resend API key. Open Settings and paste your key from https://resend.com/api-keys",
  };
}

function stripUndef<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out as Partial<T>;
}
