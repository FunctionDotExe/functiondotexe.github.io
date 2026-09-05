import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./artwork.css";
import "./arrival.css";
import { JourneyMotion } from "./JourneyMotion";
import { ARRIVAL_BOOTSTRAP } from "@/lib/arrival";

export const metadata: Metadata = {
  title: "Ruben Maxwell | Software Engineering, AI & Robotics",
  description:
    "I'm Ruben, a software engineer studying Mathematics & Computer Science at the University of Toronto. See my projects in backend engineering, machine learning, and robotics.",
  openGraph: {
    title: "Ruben Maxwell | Software Engineering, AI & Robotics",
    description:
      "I'm Ruben, a software engineer studying Mathematics & Computer Science at the University of Toronto. See my projects in backend engineering, machine learning, and robotics.",
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
      <head><script dangerouslySetInnerHTML={{ __html: ARRIVAL_BOOTSTRAP }} /></head>
      <body>
        <div className="scroll-progress" aria-hidden="true" />
        <JourneyMotion />
        {children}
      </body>
    </html>
  );
}
