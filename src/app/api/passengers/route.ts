import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAttribution } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const tag = searchParams.get("tag")?.trim();

  const passengers = await prisma.passenger.findMany({
    where: {
      archived: false,
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { relationship: { contains: q } },
              { notes: { contains: q } },
            ],
          }
        : {}),
      ...(tag ? { tags: { some: { name: tag } } } : {}),
    },
    include: { tags: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ passengers });
}

export async function POST(req: NextRequest) {
  const attribution = await requireAttribution();
  const body = await req.json().catch(() => null);
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const tagNames: string[] = Array.isArray(body.tags)
    ? body.tags.filter((t: unknown) => typeof t === "string" && t.trim())
    : [];

  const passenger = await prisma.passenger.create({
    data: {
      name: body.name.trim(),
      photoUrl: body.photoUrl || null,
      relationship: body.relationship || null,
      dietaryPreferences: body.dietaryPreferences || null,
      allergies: body.allergies || null,
      seatingPreference: body.seatingPreference || null,
      temperaturePreference: body.temperaturePreference || null,
      favoriteSnack: body.favoriteSnack || null,
      drinkOfChoice: body.drinkOfChoice || null,
      blanketPillowPreference: body.blanketPillowPreference || null,
      notes: body.notes || null,
      createdBy: attribution,
      updatedBy: attribution,
      tags: tagNames.length
        ? {
            connectOrCreate: tagNames.map((name) => ({
              where: { name },
              create: { name },
            })),
          }
        : undefined,
    },
    include: { tags: true },
  });

  return NextResponse.json({ passenger }, { status: 201 });
}
