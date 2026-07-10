"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode, useMemo } from "react";
import { Toaster } from "sonner";

import { UserProvider } from "@/context/UserContext";

// Suppress the React 19 next-themes false-positive warning during client-side navigation
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" && 
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);
  
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Toaster closeButton richColors />
          {children}
        </UserProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
