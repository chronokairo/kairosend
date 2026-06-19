import { NextResponse } from "next/server";
import { clientFromRequest, errorResponse } from "@/app/api/_lib";
import type { UpdateEmailParams } from "@/lib/resend/types";

/** PATCH /api/emails/[id]/update — Reschedule a scheduled email. */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientFromRequest(req);
    const body = (await req.json()) as { scheduled_at: string };
    const data = await client.emails.update({
      id: params.id,
      scheduled_at: body.scheduled_at,
    } satisfies UpdateEmailParams);
    return NextResponse.json(data);
  } catch (err) {
    return errorResponse(err);
  }
}
