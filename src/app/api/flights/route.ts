import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Cross-passenger chronological feed for the Flights view.
export async function GET() {
  const flights = await prisma.flightLog.findMany({
    include: { passenger: { select: { id: true, name: true, photoUrl: true } } },
    orderBy: { date: "desc" },
    take: 200,
  });

  return NextResponse.json({ flights });
}
