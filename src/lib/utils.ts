import { clsx, type ClassValue } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateMeta({
  title,
  description,
  canonical,
}: {
  title: string;
  description: string;
  canonical: string;
}): Metadata {
  return {
    title: `${title} - ZenvoFlow`,
    description: description,
    metadataBase: new URL(`https://zenvoflow.com`),
    alternates: {
      canonical: `/${canonical}`,
    },
    openGraph: {
      images: [`https://zenvoflow.com/seo.png`],
    },
  };
}

export const supportedLLMAgents = z.enum([
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4.1-mini",
  "gpt-4.1",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
]);

export function formatDatetimeToAus(date: Date) {
  return new Date(date).toLocaleString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
