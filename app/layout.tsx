import type { Metadata, Viewport } from "next";
import "./portfolio.css";

const siteUrl = new URL(process.env.SITE_URL ?? "https://aurel.rubenm.me");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Ruben Maxwell | Software Engineering, AI & Robotics",
  description:
    "I'm Ruben, a software engineer studying Mathematics & Computer Science at the University of Toronto. See my projects in backend engineering, machine learning, and robotics.",
  openGraph: {
    title: "Ruben Maxwell | Software Engineering, AI & Robotics",
    description:
      "I'm Ruben, a software engineer studying Mathematics & Computer Science at the University of Toronto. See my projects in backend engineering, machine learning, and robotics.",
    type: "website",
    url: siteUrl,
    images: [{ url: "/media/summit-parallax-master-v2.webp", width: 1536, height: 1024, alt: "Ruben Maxwell — software engineering, AI, and robotics" }],
  },
  alternates: { canonical: "/" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f2ec",
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
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
