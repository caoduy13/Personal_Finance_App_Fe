import { Toaster } from "sonner";
import { QueryProvider, RouterProvider } from "@/app/providers";

export function App() {
  return (
    <QueryProvider>
      <RouterProvider />
      <Toaster richColors position="top-right" closeButton />
    </QueryProvider>
  );
}
