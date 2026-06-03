import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { Navbar } from "@/components/navbar/navbar";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import "./globals.css";

const pressStart = Press_Start_2P({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const vt323 = VT323({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-retro",
});

export const metadata: Metadata = {
  title: "OhMyBuild - Retro PC Builder",
  description:
    "Build your ultimate gaming PC! Compatibility verified, FPS benchmarked, best prices. Level up your rig!",
  keywords: "PC configurator, gaming PC, PC build, PC components, retro gaming",
};

export const viewport: Viewport = {
  themeColor: "#0d0d1a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${pressStart.variable} ${vt323.variable} bg-[#0d0d1a]`}>
      <body className={`${vt323.className} antialiased`}>
        <AuthSessionProvider>
          <Navbar />
          {children}
        </AuthSessionProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
