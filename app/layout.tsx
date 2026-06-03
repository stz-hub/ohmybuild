import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { Navbar } from "@/components/navbar/navbar";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import "./globals.css";

const fredoka = Fredoka({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "OhMyBuild - PC Builder",
  description:
    "Build your ultimate gaming PC! Compatibility verified, FPS benchmarked, best prices. Level up your rig!",
  keywords: "PC configurator, gaming PC, PC build, PC components",
};

export const viewport: Viewport = {
  themeColor: "#4da6ff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fredoka.variable}`}>
      <body className={`${fredoka.className} antialiased`}>
        <AuthSessionProvider>
          <Navbar />
          {children}
        </AuthSessionProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
