import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import "./index.css";
import Main from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Main />
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
