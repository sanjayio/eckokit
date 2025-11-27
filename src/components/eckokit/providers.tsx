/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ActiveThemeProvider } from "@/components/eckokit/active-theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProvidersProps {
  themeSettings: {
    preset: any;
    scale: any;
    radius: any;
    contentLayout: any;
  };
  children: React.ReactNode;
}

const Providers = ({ children, themeSettings }: ProvidersProps) => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <ActiveThemeProvider initialTheme={themeSettings}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Toaster position="top-center" richColors />
        {/* Temporarily disabled NextTopLoader due to React 19 compatibility issues */}
        {/* <NextTopLoader color="var(--primary)" showSpinner={false} height={2} shadow="none" /> */}
      </ActiveThemeProvider>
    </ThemeProvider>
  );
};

export default Providers;
