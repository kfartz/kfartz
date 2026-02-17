export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import type React from "react";
import "./globals.css";

const courier_prime = Courier_Prime({ subsets: ["latin"], weight: ["700"] });

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
      <body className={courier_prime.className}>{children}</body>
    </html>
  );
}
