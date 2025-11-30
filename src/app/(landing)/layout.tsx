import { Footer } from "@/components/landing/blocks/footer";
import { Navbar } from "@/components/landing/blocks/navbar";
import { StyleGlideProvider } from "@/components/landing/styleglide-provider";
import { ThemeProvider } from "@/components/landing/theme-provider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <StyleGlideProvider />
        <Navbar />
        <main className="">{children}</main>
        <Footer />
        <eckokit-convai agent-id="agent_3401kb9bx0yyf4fracx1qdxqcs9q" />
        <script
          src="http://localhost:3000/dist/eckokit-widget.min.js"
          async
          type="text/javascript"
        ></script>
      </ThemeProvider>
    </body>
  );
}
