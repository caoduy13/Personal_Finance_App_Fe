import { QueryProvider, RouterProvider } from "@/app/providers";

export function App() {
  return (
    <QueryProvider>
      <RouterProvider />
    </QueryProvider>
  );
}
