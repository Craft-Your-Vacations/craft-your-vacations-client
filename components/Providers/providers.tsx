"use client";

import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthListener } from "@/hooks/useAuthListener";
import { useEmailVerifiedSync } from "@/hooks/useEmailVerifiedSync";
import ToastContainer from "@/components/Toast/ToastContainer";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

// Mounted inside QueryClientProvider so it can access the query client. Invalidates
// the profile query when another tab reports the email was verified/changed.
function EmailVerifiedSync() {
  useEmailVerifiedSync();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Per-instance, not module scope. A module-scope client is a single object
  // shared by every request the server handles, so hydrating server-fetched data
  // into it could serve one user's cache to another. useState keeps the same
  // client across re-renders on the browser, where that sharing is wanted.
  const [queryClient] = useState(makeQueryClient);

  // Keep the Zustand auth store in sync with Supabase for the app's lifetime.
  useAuthListener();

  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
    >
      <QueryClientProvider client={queryClient}>
        <EmailVerifiedSync />
        {children}
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
