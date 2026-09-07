"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      try {
        localStorage.setItem("atlas_display_name", name.trim());
      } catch {
        // ignore
      }
      router.push(params.get("next") || "/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-display text-gold-300 text-sm tracking-[0.3em] uppercase mb-3">
            Aloft
          </p>
          <h1 className="font-display text-3xl text-linen">Passenger Atlas</h1>
          <p className="mt-3 text-navy-200 text-sm">
            Shared access for the cabin crew.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-navy-800/60 border border-navy-700 rounded-xl2 p-8 shadow-lift backdrop-blur"
        >
          <label className="block mb-5">
            <span className="block text-xs uppercase tracking-wide text-navy-200 mb-2">
              Your name
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jana"
              className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-4 py-3 text-linen placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </label>

          <label className="block mb-6">
            <span className="block text-xs uppercase tracking-wide text-navy-200 mb-2">
              Shared passcode
            </span>
            <input
              required
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-4 py-3 text-linen placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </label>

          {error && (
            <p className="mb-4 text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold-400 hover:bg-gold-300 transition-colors text-navy-900 font-medium py-3 disabled:opacity-60"
          >
            {loading ? "Entering…" : "Enter"}
          </button>
        </form>

        <p className="text-center text-navy-400 text-xs mt-6">
          One shared list, kept in sync for both of you.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
