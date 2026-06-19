import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kairosend — Executive Mail for Resend",
  description:
    "An open-source desktop client for Resend. Aureate Obsidian design, for Windows & Linux.",
  applicationName: "Kairosend",
  authors: [{ name: "Kairosend contributors" }],
  keywords: ["resend", "email", "client", "desktop", "electron", "nextjs"],
};

export const viewport: Viewport = {
  themeColor: "#111415",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        {/* Material Symbols icon set, matching the mockups */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className="bg-background font-body-md text-on-surface antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
