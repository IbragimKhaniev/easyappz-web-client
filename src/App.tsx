
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { HomePage } from "./pages/Home";
import { ChatPage } from "./pages/Chat";
import { MarketplacePage } from "./pages/Marketplace";

import { ROUTES } from "./shared/config/routes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.CHAT} element={<ChatPage />} />
          <Route path={ROUTES.MARKETPLACE} element={<MarketplacePage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
