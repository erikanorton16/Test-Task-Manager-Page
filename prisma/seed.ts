import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.passenger.count();
  if (count > 0) {
    console.log("Database already has passengers — skipping seed.");
    return;
  }

  const vip = await prisma.tag.create({ data: { name: "VIP" } });
  const firstTime = await prisma.tag.create({ data: { name: "First-time flyer" } });
  const child = await prisma.tag.create({ data: { name: "Child" } });

  await prisma.passenger.create({
    data: {
      name: "Margaret Whitfield",
      relationship: "Primary Family Member",
      dietaryPreferences: "Pescatarian",
      allergies: "Tree nuts",
      seatingPreference: "Window, forward cabin",
      temperaturePreference: "Slightly warm",
      favoriteSnack: "Marcona almonds substitute: dried apricots",
      drinkOfChoice: "Sparkling water with lime, dry Riesling with dinner",
      blanketPillowPreference: "Cashmere throw, firm pillow",
      notes: "Prefers quiet during takeoff and landing. Always asks for extra napkins.",
      createdBy: "Jana",
      updatedBy: "Jana",
      tags: { connect: [{ id: vip.id }] },
      mealLogs: {
        create: [
          {
            date: new Date("2025-08-14"),
            item: "Grilled salmon, steamed vegetables",
            notes: "Asked for sauce on the side.",
            createdBy: "Jana",
          },
        ],
      },
      flightLogs: {
        create: [
          {
            date: new Date("2025-08-14"),
            flightInfo: "KTEB → KPBI",
            notes: "Smooth flight, watched a documentary.",
            createdBy: "Jana",
          },
        ],
      },
    },
  });

  await prisma.passenger.create({
    data: {
      name: "Oliver Whitfield",
      relationship: "Child",
      dietaryPreferences: "No restrictions",
      allergies: "None known",
      seatingPreference: "Aisle, near parents",
      temperaturePreference: "Cool",
      favoriteSnack: "Cheddar crackers",
      drinkOfChoice: "Apple juice",
      blanketPillowPreference: "Small pillow, dinosaur blanket if available",
      notes: "Gets restless after 2 hours — bring coloring book.",
      createdBy: "Priya",
      updatedBy: "Priya",
      tags: { connect: [{ id: child.id }] },
      mealLogs: {
        create: [
          {
            date: new Date("2025-08-14"),
            item: "Mac and cheese, apple slices",
            createdBy: "Priya",
          },
        ],
      },
      flightLogs: {
        create: [
          {
            date: new Date("2025-08-14"),
            flightInfo: "KTEB → KPBI",
            createdBy: "Priya",
          },
        ],
      },
    },
  });

  await prisma.passenger.create({
    data: {
      name: "Daniel Cho",
      relationship: "Guest",
      dietaryPreferences: "Vegetarian",
      allergies: "Shellfish",
      seatingPreference: "No preference",
      temperaturePreference: "No preference",
      favoriteSnack: "Mixed nuts (no shellfish cross-contact)",
      drinkOfChoice: "Black coffee",
      notes: "First time flying with the family — a bit nervous about turbulence.",
      createdBy: "Jana",
      updatedBy: "Jana",
      tags: { connect: [{ id: firstTime.id }] },
      flightLogs: {
        create: [
          {
            date: new Date("2025-09-20"),
            flightInfo: "KPBI → KTEB",
            notes: "Upcoming — confirm seat preference before departure.",
            createdBy: "Jana",
          },
        ],
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
