import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
  ),
  title: {
    default: "Eckokit - AI Voice Agents",
    template: "%s | Eckokit",
  },
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
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon/favicon.ico" }],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {children}
    </html>
  );
}
