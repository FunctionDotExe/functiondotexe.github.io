import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JourneyMotion } from "./JourneyMotion";
import { RevealObserver } from "./RevealObserver";

export const metadata: Metadata = {
  title: "Ruben Maxwell — The Summit",
  description:
    "A digital expedition through selected systems, experiments, and work by Ruben Maxwell.",
  openGraph: {
    title: "Ruben Maxwell — The Summit",
    description:
      "A digital expedition through selected systems, experiments, and work by Ruben Maxwell.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171139",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="scroll-progress" aria-hidden="true" />
        <JourneyMotion />
        <RevealObserver />
        {children}
      </body>
    </html>
  );
}
