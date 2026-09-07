import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAttribution } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const attribution = await requireAttribution();
  const body = await req.json().catch(() => null);
  if (!body || !body.date) {
    return NextResponse.json({ error: "Flight date is required." }, { status: 400 });
  }

  const date = new Date(body.date);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  const flight = await prisma.flightLog.create({
    data: {
      passengerId: params.id,
      date,
      flightInfo: body.flightInfo?.trim() || null,
      notes: body.notes?.trim() || null,
      createdBy: attribution,
    },
  });

  await prisma.passenger.update({
    where: { id: params.id },
    data: { updatedBy: attribution, updatedAt: new Date() },
  });

  return NextResponse.json({ flight }, { status: 201 });
}
