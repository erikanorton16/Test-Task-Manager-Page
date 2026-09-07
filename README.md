# Aloft — Passenger Atlas

A shared, always-in-sync passenger profile database for two flight attendants. Either of you can look up or update a passenger's preferences before or during a flight, and see exactly what the other person entered — including who changed it last, and when.

## What's inside

- **Passenger Directory** — a searchable, card-based home view with photos, tags, and quick allergy flags.
- **Passenger Profile** — a detail page with independently-editable sections: basic info & photo, preferences, dietary/allergies, freeform notes, meal & beverage history, and flight history.
- **Add New Passenger** — a dedicated intake flow for onboarding a prospective or confirmed guest.
- **Flights** — a cross-passenger feed of upcoming and recent flights.
- **Shared access, not separate accounts** — both attendants unlock the app with one shared passcode and identify themselves by name (remembered on their device), so every edit is attributed ("Last updated by Jana, Sept 5") without the overhead of real user accounts.
- **Central database** — everything is stored server-side via Prisma/SQLite (or Postgres, see below), never in browser storage, so it stays in sync across devices and sessions. The directory and profile pages poll every few seconds so an edit made on one device shows up on the other automatically.
- **Conflict-friendly editing** — each profile section (basic info, preferences, dietary/allergies, notes) saves independently, and meal/flight history is an append-only log, so the two of you can edit different parts of a profile at the same time without clobbering each other.

## Getting started

```bash
npm install
cp .env.example .env      # then set APP_PASSCODE and SESSION_SECRET
npm run db:push           # create the SQLite database from the schema
npm run db:seed           # optional: load a few example passengers
npm run dev
```

Open http://localhost:3000, enter your name and the shared passcode, and you're in.

## Deploying so both of you can reach it

This app needs a **persistent** place to run and a persistent disk for its SQLite file (or a managed Postgres database). Good fits: a small VPS, Fly.io, Railway, or Render with a persistent volume.

- Set `DATABASE_URL`, `APP_PASSCODE`, and `SESSION_SECRET` as environment variables on the host.
- Run `npm run build` (this runs `prisma migrate deploy` and `next build`) then `npm start`.
- To use Postgres instead of SQLite (recommended on platforms with an ephemeral filesystem, like Vercel): change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`, point `DATABASE_URL` at your Postgres instance, and run `npx prisma migrate dev` once to create the initial migration.

### First migration

The `db:push` command above is the fastest way to get a schema onto a fresh database during setup. For a tracked migration history (recommended once you're running this for real), use:

```bash
npx prisma migrate dev --name init
```

## How the two of you share one login

There are no per-user accounts — just one shared passcode gate. The first time you open the app on a device, you enter your name and the passcode; your name is remembered on that device and sent along with every change you make, which is how the app knows to show "Last updated by Priya" vs. "Last updated by Jana." Anyone who knows the passcode has full read/write access to the same passenger list.

## Tech stack

Next.js (App Router) + TypeScript, Tailwind CSS, Prisma (SQLite by default), SWR for client-side data fetching and polling.
