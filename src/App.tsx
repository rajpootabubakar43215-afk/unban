import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteNav } from "@/components/SiteNav";
import Index from "./pages/Index.tsx";
import Bans from "./pages/Bans.tsx";
import Reports from "./pages/Reports.tsx";
import Appeal from "./pages/Appeal.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SiteNav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bans" element={<Bans />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/appeal" element={<Appeal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
