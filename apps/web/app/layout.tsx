import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

import { Providers } from "../components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "DevFlow",
  description: "VoiceLog and DevPlay in one focused developer workspace."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.variable}>
          <a
            href="#main-content"
            className="sr-only z-[60] rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to main content
          </a>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
