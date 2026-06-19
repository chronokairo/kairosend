import { NextResponse } from "next/server";
import { clientFromRequest, errorResponse } from "@/app/api/_lib";

/** GET /api/emails — List Sent Emails (Sent folder). */
export async function GET(req: Request) {
  try {
    const client = await clientFromRequest(req);
    const url = new URL(req.url);
    const limit = url.searchParams.get("limit") ?? undefined;
    const after = url.searchParams.get("after") ?? undefined;
    const before = url.searchParams.get("before") ?? undefined;
    const data = await client.emails.list({
      limit: limit ? Number(limit) : undefined,
      after: after || undefined,
      before: before || undefined,
    });
    return NextResponse.json(data);
  } catch (err) {
    return errorResponse(err);
  }
}
