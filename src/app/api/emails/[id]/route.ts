import { NextResponse } from "next/server";
import { clientFromRequest, errorResponse } from "@/app/api/_lib";

/** GET /api/emails/[id] — Retrieve a single sent email (with html/text). */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientFromRequest(req);
    const data = await client.emails.get(params.id);
    return NextResponse.json(data);
  } catch (err) {
    return errorResponse(err);
  }
}
