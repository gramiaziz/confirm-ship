import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <AppProvider>
      <Outlet />
      <Toaster position="top-right" />
    </AppProvider>
  );
}
