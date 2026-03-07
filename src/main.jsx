import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import { RouterProvider } from "react-router";
import { Router } from "./Routing/AppRouter";
import { Toaster } from "react-hot-toast";
import AuthUserProvider from "./Contexts/AutUserContext/AuthUserProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient()
createRoot(document.getElementById("root")).render(
   <StrictMode>
  <QueryClientProvider client={queryClient}> 
    <AuthUserProvider>
      <HeroUIProvider>
        <RouterProvider router={Router} />
        <Toaster />
      </HeroUIProvider>
    </AuthUserProvider>
  </QueryClientProvider>,
  </StrictMode>,
);
