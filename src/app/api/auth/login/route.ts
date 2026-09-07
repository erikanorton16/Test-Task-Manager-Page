import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS, signSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const passcode = typeof body?.passcode === "string" ? body.passcode : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  const expectedPasscode = process.env.APP_PASSCODE;
  if (!expectedPasscode) {
    return NextResponse.json(
      { error: "Server is not configured with an APP_PASSCODE." },
      { status: 500 }
    );
  }

  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }

  if (passcode !== expectedPasscode) {
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }

  const token = await signSession(name);
  const res = NextResponse.json({ ok: true, name });
  res.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return res;
}
