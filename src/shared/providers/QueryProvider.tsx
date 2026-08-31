import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes — app shell data stays fresh, avoids re-call on tab re-enter
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    const handleAuthChange = () => {
      queryClient.clear();
    };

    window.addEventListener("celaest:auth-changed", handleAuthChange);
    window.addEventListener("celaest:unauthorized", handleAuthChange);
    return () => {
      window.removeEventListener("celaest:auth-changed", handleAuthChange);
      window.removeEventListener("celaest:unauthorized", handleAuthChange);
    };
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
