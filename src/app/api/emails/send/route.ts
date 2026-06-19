import { NextResponse } from "next/server";
import { clientFromRequest, errorResponse } from "@/app/api/_lib";
import type { SendEmailParams } from "@/lib/resend/types";

/** POST /api/emails/send — Send (or schedule) an email. */
export async function POST(req: Request) {
  try {
    const client = await clientFromRequest(req);
    const body = (await req.json()) as SendEmailParams;
    const { data, error } = await client.emails.send(body);
    if (error) return errorResponse(error);
    return NextResponse.json(data);
  } catch (err) {
    return errorResponse(err);
  }
}
