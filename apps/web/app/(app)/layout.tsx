import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import type { ReactNode } from "react";

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
          <main className="min-w-0 px-6 py-8">{children}</main>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
