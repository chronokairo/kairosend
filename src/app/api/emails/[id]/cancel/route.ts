import { NextResponse } from "next/server";
import { clientFromRequest, errorResponse } from "@/app/api/_lib";

/** POST /api/emails/[id]/cancel — Cancel a scheduled email. */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientFromRequest(req);
    const data = await client.emails.cancel(params.id);
    return NextResponse.json(data);
  } catch (err) {
    return errorResponse(err);
  }
}
