import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Aloft — Passenger Atlas",
  description: "A shared passenger profile database for the cabin crew.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${sansFont.variable} font-sans`}>
        {user && <Navbar userName={user.name} />}
        <main className={user ? "min-h-screen pb-16" : "min-h-screen"}>{children}</main>
      </body>
    </html>
  );
}
