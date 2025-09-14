import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DMFL - Dallas Muslim Flag Football League",
  description: "Official stats hub for Dallas Muslim Flag Football League Season 4 - scores, schedules, standings, and player statistics.",
  keywords: ["flag football", "Dallas", "Muslim", "sports", "league", "statistics"],
  authors: [{ name: "DMFL" }],
  openGraph: {
    title: "DMFL - Dallas Muslim Flag Football League",
    description: "Official stats hub for Dallas Muslim Flag Football League Season 4",
    url: "https://dmfl.vercel.app",
    siteName: "DMFL",
    images: [
      {
        url: "/brand/dmfl-logo.png",
        width: 1200,
        height: 630,
        alt: "DMFL Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DMFL - Dallas Muslim Flag Football League",
    description: "Official stats hub for Dallas Muslim Flag Football League Season 4",
    images: ["/brand/dmfl-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
