import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { LenisWrapper } from "./LenisWrapper";
import { RevealObserver } from "./RevealObserver";

/* Body text uses the system font stack (see globals.css): the hero quote is
   the mobile LCP element, and any webfont dependency delays its first paint.
   Cormorant stays as the display face; "optional" avoids late-swap repaints. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-cormorant",
  display: "optional",
});

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
    <html
      lang="en"
      suppressHydrationWarning
      className={cormorant.variable}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Tag <html> before first paint so reveal-hidden styles only apply when JS runs */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <div className="scroll-progress" aria-hidden="true" />
        <RevealObserver />
        <LenisWrapper>{children}</LenisWrapper>
      </body>
    </html>
  );
}
