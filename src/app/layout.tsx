import type { Metadata } from "next";
import { Inter } from "next/font/google";

import ClerkProvider from "@/components/providers/clerk-provider";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocsLoom - Home",
  description:
    "In this page you can see all of your documents and create new ones",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn("antialiased", inter.className)}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
