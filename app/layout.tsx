import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/navbar/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OhMyBuild — Configurateur PC",
  description:
    "Configurez votre PC gaming sur mesure. Compatibilité vérifiée, FPS benchmarkés, meilleurs prix Idealo.",
  keywords: "configurateur PC, PC gaming, build PC, composants PC, compatibilité",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Navbar />
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
