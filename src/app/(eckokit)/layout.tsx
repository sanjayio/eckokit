/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Metadata } from "next";
import "@/app/(eckokit)/globals.css";
import Providers from "@/components/eckokit/providers";
import { DEFAULT_THEME } from "@/lib/themes";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Eckokit - AI Voice Agents",
  description:
    "Eckokit is a platform for building and automating your telephony workflows with AI Voice Agents.",
  keywords: [
    "AI Voice Agents",
    "Telephony Workflows",
    "Automation Platforms",
    "Call Center Automation",
    "Call Center Management",
    "Call Center Software",
    "AI Automation",
    "AI Voice Automation",
    "AI Voice Management",
    "AI Voice Software",
    "AI Voice Platforms",
    "AI Voice Automation",
    "AI Voice Management",
  ],
  authors: [{ name: "Eckokit" }],
  creator: "Eckokit",
  publisher: "Eckokit",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon.ico" },
    ],
  },
  openGraph: {
    title: "Eckokit - AI Voice Agents",
    description:
      "Eckokit is a platform for building and automating your telephony workflows with AI Voice Agents.",
    siteName: "Eckokit",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Eckokit - AI Voice Agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eckokit - AI Voice Agents",
    description:
      "Eckokit is a platform for building and automating your telephony workflows with AI Voice Agents.",
    images: ["/og-image.jpg"],
    creator: "@iamsanjayofficl",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeSettings = {
    preset: (cookieStore.get("theme_preset")?.value ??
      DEFAULT_THEME.preset) as any,
    scale: (cookieStore.get("theme_scale")?.value ??
      DEFAULT_THEME.scale) as any,
    radius: (cookieStore.get("theme_radius")?.value ??
      DEFAULT_THEME.radius) as any,
  };

  const bodyAttributes = Object.fromEntries(
    Object.entries(themeSettings)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value)
      .map(([key, value]) => [
        `data-theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        value,
      ])
  );

  return (
    <body
      suppressHydrationWarning
      className={cn(
        "bg-background group/layout font-sans antialiased",
        fontVariables
      )}
      {...bodyAttributes}
    >
      <Providers themeSettings={themeSettings}>
        <div className="relative flex min-h-screen flex-col">{children}</div>
      </Providers>
    </body>
  );
}
