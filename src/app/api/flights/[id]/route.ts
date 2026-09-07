import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAttribution } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await requireAttribution();
  try {
    await prisma.flightLog.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }
}
