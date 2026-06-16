import type { Metadata } from "next";
import Script from "next/script";

import { bootstrapWorldality } from "worldality";
import {
  generateWorldalityScript,
  getWorldalityHtmlAttrs,
  loadSSRTranslations,
} from "worldality/server/nextjs";

import "./globals.css";

export const metadata: Metadata = {
  title: "Worldality - Next.js Example",
  description:
    "Interactive examples of Worldality internationalization with Next.js",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const worldalityData = await loadSSRTranslations();
  bootstrapWorldality(worldalityData);
  const worldalityScript = generateWorldalityScript(worldalityData);
  const htmlAttrs = getWorldalityHtmlAttrs(worldalityData);

  return (
    <html {...htmlAttrs}>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <Script
          id="worldality-ssr"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: worldalityScript,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
