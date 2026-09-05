import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./artwork.css";
import "./expedition.css";
import "./arrival.css";
import "./print.css";
import { JourneyMotion } from "./JourneyMotion";
import { ARRIVAL_BOOTSTRAP } from "@/lib/arrival";

export const metadata: Metadata = {
  metadataBase: new URL("https://functiondotexe.github.io"),
  title: "Ruben Maxwell | Software Engineering, AI & Robotics",
  description:
    "I'm Ruben, a software engineer studying Mathematics & Computer Science at the University of Toronto. See my projects in backend engineering, machine learning, and robotics.",
  openGraph: {
    title: "Ruben Maxwell | Software Engineering, AI & Robotics",
    description:
      "I'm Ruben, a software engineer studying Mathematics & Computer Science at the University of Toronto. See my projects in backend engineering, machine learning, and robotics.",
    type: "website",
    url: "https://functiondotexe.github.io",
    images: [{ url: "/media/summit-parallax-master-v2.webp", width: 1536, height: 1024, alt: "Ruben Maxwell — an illustrated journey from the summit to the core" }],
  },
  alternates: { canonical: "/" },
  twitter: { card: "summary_large_image" },
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
      <head>
        <link rel="preload" href="/fonts/bodoni-moda.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/dm-sans-regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: ARRIVAL_BOOTSTRAP }} />
      </head>
      <body>
        <div className="scroll-progress" aria-hidden="true" />
        <JourneyMotion />
        {children}
      </body>
    </html>
  );
}
