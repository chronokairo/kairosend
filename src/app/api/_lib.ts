import { NextResponse } from "next/server";
import { Resend, ResendError } from "@/lib/resend/client";
import { resolveServerApiKey } from "@/lib/env";

/**
 * Resolve a Resend client for an incoming request.
 *
 * Kairosend is local-first: each user supplies their own API key in Settings
 * (stored in localStorage) and the browser sends it via the `x-resend-key`
 * header. Hosted deployments can instead set RESEND_API_KEY server-side.
 */
export async function clientFromRequest(req: Request): Promise<Resend> {
  const headerKey = req.headers.get("x-resend-key");
  const apiKey = resolveServerApiKey(headerKey);
  if (!apiKey) {
    throw new ResendError({
      name: "missing_api_key",
      statusCode: 401,
      message:
        "No Resend API key configured. Open Settings and paste your key from https://resend.com/api-keys",
    });
  }
  return new Resend({ apiKey });
}

/** Consistent JSON error envelope. */
export function errorResponse(error: unknown) {
  if (error instanceof ResendError) {
    return NextResponse.json(
      { name: error.name, message: error.message, statusCode: error.statusCode },
      { status: error.statusCode },
    );
  }
  const message = error instanceof Error ? error.message : "Unexpected error";
  return NextResponse.json({ name: "internal_error", message, statusCode: 500 }, { status: 500 });
}
