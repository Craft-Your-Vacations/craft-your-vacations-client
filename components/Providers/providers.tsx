"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthListener } from "@/hooks/useAuthListener";
import { useEmailVerifiedSync } from "@/hooks/useEmailVerifiedSync";
import ToastContainer from "@/components/Toast/ToastContainer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Mounted inside QueryClientProvider so it can access the query client. Invalidates
// the profile query when another tab reports the email was verified/changed.
function EmailVerifiedSync() {
  useEmailVerifiedSync();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
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
