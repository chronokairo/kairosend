import { NextResponse } from "next/server";
import { clientFromRequest, errorResponse } from "@/app/api/_lib";
import type { ReceivedEmail } from "@/lib/resend/types";

/** GET /api/receiving/[id] — Retrieve a single received email (Inbox preview). */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientFromRequest(req);
    const url = new URL(req.url);
    const htmlFormat = url.searchParams.get("html_format");
    // Inline images can be returned as data URIs (default) or as cid refs.
    const data = htmlFormat
      ? await client.raw<ReceivedEmail>("GET", `/emails/receiving/${params.id}`, {
          query: { html_format: htmlFormat },
        })
      : await client.receiving.get(params.id);
    return NextResponse.json(data);
  } catch (err) {
    return errorResponse(err);
  }
}
