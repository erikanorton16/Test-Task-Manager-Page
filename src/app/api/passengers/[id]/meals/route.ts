import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAttribution } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const attribution = await requireAttribution();
  const body = await req.json().catch(() => null);
  if (!body || typeof body.item !== "string" || !body.item.trim()) {
    return NextResponse.json({ error: "Meal/beverage item is required." }, { status: 400 });
  }

  const date = body.date ? new Date(body.date) : new Date();
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  const meal = await prisma.mealLog.create({
    data: {
      passengerId: params.id,
      date,
      item: body.item.trim(),
      notes: body.notes?.trim() || null,
      createdBy: attribution,
    },
  });

  await prisma.passenger.update({
    where: { id: params.id },
    data: { updatedBy: attribution, updatedAt: new Date() },
  });

  return NextResponse.json({ meal }, { status: 201 });
}
