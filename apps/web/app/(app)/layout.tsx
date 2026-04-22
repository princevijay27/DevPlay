import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import type { ReactNode } from "react";

import { MobileNav } from "../../components/app/mobile-nav";
import { Sidebar } from "../../components/app/sidebar";

export default function AppLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <SignedIn>
        <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
          <Sidebar />
          <div className="min-w-0">
            <header className="border-b border-[var(--color-border)] bg-[color:color-mix(in_oklab,var(--color-surface)_90%,transparent)] px-4 py-3 backdrop-blur md:hidden">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]">DevFlow</p>
              <p className="mt-1 text-lg font-semibold">Mobile workspace</p>
            </header>
            <main id="main-content" className="min-w-0 px-4 pb-24 pt-6 sm:px-6 md:px-6 md:py-8">
              {children}
            </main>
          </div>
          <MobileNav />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
