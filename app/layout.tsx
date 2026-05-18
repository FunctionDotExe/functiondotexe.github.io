import type { Metadata } from "next";
import "./globals.css";
import { LenisWrapper } from "./LenisWrapper";
import { Noise } from "@/components/Noise";
import { ScrollProgress } from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "Ruben Maxwell | Software Engineer & Builder",
  description:
    "Portfolio of Ruben Maxwell, a software engineer and builder exploring web development, AI systems, and quantum computing. University of Toronto Computer Science.",
  openGraph: {
    title: "Ruben Maxwell | Software Engineer & Builder",
    description:
      "Interactive portfolio showcasing projects in web development, AI, and quantum computing.",
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
