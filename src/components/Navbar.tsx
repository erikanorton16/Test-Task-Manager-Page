"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cx } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Directory" },
  { href: "/flights", label: "Flights" },
  { href: "/passengers/new", label: "Add New Passenger" },
];

export default function Navbar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 bg-navy-900/95 backdrop-blur border-b border-navy-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-gold-300 text-xs tracking-[0.3em] uppercase">
              Aloft
            </span>
            <span className="font-display text-linen text-lg">Passenger Atlas</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cx(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-navy-700 text-linen"
                      : "text-navy-200 hover:text-linen hover:bg-navy-800"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-navy-200">{userName}</span>
            <button
              onClick={handleLogout}
              className="text-xs uppercase tracking-wide text-navy-300 hover:text-gold-300 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        <nav className="flex sm:hidden items-center gap-1 pb-3 -mt-1 overflow-x-auto">
          {LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cx(
                  "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  active ? "bg-navy-700 text-linen" : "text-navy-200 hover:text-linen"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
