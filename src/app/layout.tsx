import type { Metadata } from "next";
import { Comic_Neue, Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const commic_neue = Comic_Neue({ subsets: ["latin"], weight: ["700"] });

export const metadata: Metadata = {
  title: "Kwartz",
  description: "Crystallography messurement metadata manager",
  icons: {
    icon: "favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={commic_neue.className}>{children}</body>
    </html>
  );
}
