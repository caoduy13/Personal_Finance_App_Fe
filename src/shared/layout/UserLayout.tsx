import { Outlet } from "react-router-dom";
import { Topbar } from "@/shared/components/common/Topbar";

export function UserLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Topbar />
      <main className="mx-auto w-full max-w-6xl p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
