"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode, useMemo } from "react";
import { Toaster } from "sonner";

import { UserProvider } from "@/context/UserContext";

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
