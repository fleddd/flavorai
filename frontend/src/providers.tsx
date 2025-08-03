import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme/theme";

export function Providers({ children }: PropsWithChildren) {
    const [client] = useState(new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 0,
                staleTime: 1000 * 60 * 1, // 1 minute
            }

        }
    }))

    return (
        <BrowserRouter>
            <QueryClientProvider client={client}>
                <ThemeProvider theme={theme}>
                    {children}
                </ThemeProvider>
                <ToastContainer autoClose={2000} pauseOnFocusLoss={false} pauseOnHover={false} />
            </QueryClientProvider>
        </BrowserRouter>
    )
}