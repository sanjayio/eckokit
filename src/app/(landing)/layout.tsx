import { Footer } from "@/components/public/blocks/footer";
import { Navbar } from "@/components/public/blocks/navbar";
import { StyleGlideProvider } from "@/components/public/styleglide-provider";
import { ThemeProvider } from "@/components/public/theme-provider";
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
        {/* <zenvo-convai agent-id="agent_0501ka8hmh5senmb4mn18gfhd60a" />
        <script
          src="https://zenvoflow.com/dist/zenvo-widget.min.js"
          async
          type="text/javascript"
        ></script> */}
      </ThemeProvider>
    </body>
  );
}
