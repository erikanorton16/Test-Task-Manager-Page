// Lightweight signed-cookie session, built on Web Crypto so it runs
// identically in middleware (Edge runtime) and route handlers (Node
// runtime). There are no per-user accounts: the two flight attendants share
// one passcode-gated session, and each device remembers "your name" so
// edits can be attributed (e.g. "Last updated by Jana").

export const SESSION_COOKIE = "atlas_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

export type SessionPayload = {
  name: string;
  iat: number;
};

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set.");
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return new Uint8Array(signature);
}

export async function signSession(name: string): Promise<string> {
  const payload: SessionPayload = { name, iat: Date.now() };
  const payloadEncoded = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = toBase64Url(await hmac(payloadEncoded));
  return `${payloadEncoded}.${signature}`;
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) return null;

  const expectedSignature = toBase64Url(await hmac(payloadEncoded));
  if (expectedSignature !== signature) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadEncoded))) as SessionPayload;
    const ageSeconds = (Date.now() - payload.iat) / 1000;
    if (ageSeconds > SESSION_MAX_AGE_SECONDS) return null;
    if (!payload.name || typeof payload.name !== "string") return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};
