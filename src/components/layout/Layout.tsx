"use cleint";

import { Navbar } from "@/components/shared/Navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4 md:px-6">{children}</main>
    </div>
  );
}
