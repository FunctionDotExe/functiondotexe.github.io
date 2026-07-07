import type { Metadata } from "next";
import "./globals.css";
import { LenisWrapper } from "./LenisWrapper";
import { Noise } from "@/components/Noise";
import { ScrollProgress } from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "Ruben Maxwell | RenAIssance OS Portfolio",
  description:
    "A cinematic portfolio for Ruben Maxwell, a software engineer exploring crafted interfaces, AI systems, quantum computing, robotics, and production software.",
  openGraph: {
    title: "Ruben Maxwell | RenAIssance OS Portfolio",
    description:
      "Interactive portfolio showcasing projects in web development, AI systems, robotics, and quantum computing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Noise />
        <ScrollProgress />
        <LenisWrapper>{children}</LenisWrapper>
      </body>
    </html>
  );
}
