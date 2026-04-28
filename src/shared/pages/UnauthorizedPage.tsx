import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";

export function UnauthorizedPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold">Unauthorized</h1>
      <p className="text-muted-foreground">You do not have permission to access this page.</p>
      <Button asChild>
        <Link to={ROUTES.LOGIN}>Back to Login</Link>
      </Button>
    </main>
  );
}
