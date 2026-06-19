/**
 * Server-only settings resolution (no "use client", no JSX).
 *
 * This MUST live outside the "use client" settings module so that Next.js does
 * not turn these functions into non-callable client references when imported by
 * the API routes.
 */

/** Read the API key for a request: header (per-user) > env (hosted). */
export function resolveServerApiKey(headerKey?: string | null): string {
  return headerKey || process.env.RESEND_API_KEY || "";
}
