import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "./session";

export async function getCurrentUser(): Promise<{ name: string } | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) return null;
  return { name: session.name };
}

/** Resolve the attributed display name for a mutation, falling back to "Unknown". */
export async function requireAttribution(): Promise<string> {
  const user = await getCurrentUser();
  return user?.name ?? "Unknown";
}
