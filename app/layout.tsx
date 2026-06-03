import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

import { Navbar } from "@/components/navbar/navbar";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "OhMyBuild - PC Configuration Wizard",
  description:
    "Build your ultimate gaming PC with the OhMyBuild Configuration Wizard! Compatibility verified, FPS benchmarked, best prices.",
  keywords: "PC configurator, gaming PC, PC build, PC components, Windows XP",
};

export const viewport: Viewport = {
  themeColor: "#0054E3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="bg-[#3A6EA5]">
      <body className="antialiased min-h-screen">
        <AuthSessionProvider>
          <Navbar />
          {children}
        </AuthSessionProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
