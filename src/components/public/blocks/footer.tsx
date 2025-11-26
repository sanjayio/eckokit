import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/public/ui/button";

export function Footer() {
  const navigation = [
    { name: "Why Eckokit?", href: "/#why-eckokit" },
    { name: "About Us", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const social = [
    { name: "Xwitter", href: "https://x.com/ausrobdev" },
    { name: "LinkedIn", href: "#" },
  ];

  const legal = [{ name: "Privacy Policy", href: "/privacy" }];

  return (
    <footer className="flex flex-col items-center gap-14 pt-28 lg:pt-32">
      <div className="container space-y-3 text-center">
        <h2 className="font-light text-2xl tracking-tight md:text-4xl lg:text-5xl">
          Book a demo today
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">
          We are here to help you on your agentic transformation. Book a demo
          today to see how we can help you.
        </p>
        <div>
          <Button size="lg" className="mt-4" asChild>
            <Link href="/book-a-demo">Book a demo</Link>
          </Button>
        </div>
      </div>

      <nav className="container flex flex-col items-center gap-4">
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="font-medium transition-opacity hover:opacity-75"
              >
                {item.name}
              </Link>
            </li>
          ))}
          {social.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center gap-0.5 font-medium transition-opacity hover:opacity-75"
              >
                {item.name} <ArrowUpRight className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {legal.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="text-muted-foreground text-sm transition-opacity hover:opacity-75"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="text-primary mt-10 w-full md:mt-14 lg:mt-20">
        <svg
          width="400"
          height="180"
          viewBox="0 0 400 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <text
            x="50%"
            y="70%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Inter, system-ui, Arial, sans-serif"
            fontSize="180"
            fontWeight="bold"
            fill="url(#eckokitGradient)"
          >
            ecko
          </text>
          <defs>
            <linearGradient
              id="eckokitGradient"
              x1="0"
              y1="90"
              x2="0"
              y2="180"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="currentColor" />
              <stop offset="1" stopColor="#F8F8F8" stopOpacity="0.41" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
}
