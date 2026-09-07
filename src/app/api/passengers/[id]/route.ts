import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAttribution } from "@/lib/auth";

const EDITABLE_FIELDS = [
  "name",
  "photoUrl",
  "relationship",
  "dietaryPreferences",
  "allergies",
  "seatingPreference",
  "temperaturePreference",
  "favoriteSnack",
  "drinkOfChoice",
  "blanketPillowPreference",
  "notes",
] as const;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const passenger = await prisma.passenger.findUnique({
    where: { id: params.id },
    include: {
      tags: true,
      mealLogs: { orderBy: { date: "desc" } },
      flightLogs: { orderBy: { date: "desc" } },
    },
  });

  if (!passenger) {
    return NextResponse.json({ error: "Passenger not found." }, { status: 404 });
  }

  return NextResponse.json({ passenger });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const attribution = await requireAttribution();
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] = typeof value === "string" ? (value.trim() ? value.trim() : null) : value;
    }
  }

  if ("name" in data && !data.name) {
    return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
  }

  if (Array.isArray(body.tags)) {
    const tagNames: string[] = body.tags.filter((t: unknown) => typeof t === "string" && t.trim());
    data.tags = {
      set: [],
      connectOrCreate: tagNames.map((name) => ({ where: { name }, create: { name } })),
    };
  }

  data.updatedBy = attribution;

  try {
    const passenger = await prisma.passenger.update({
      where: { id: params.id },
      data,
      include: { tags: true, mealLogs: { orderBy: { date: "desc" } }, flightLogs: { orderBy: { date: "desc" } } },
    });
    return NextResponse.json({ passenger });
  } catch {
    return NextResponse.json({ error: "Passenger not found." }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await requireAttribution();
  try {
    await prisma.passenger.update({ where: { id: params.id }, data: { archived: true } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Passenger not found." }, { status: 404 });
  }
}
