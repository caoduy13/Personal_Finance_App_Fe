import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-muted-foreground">
        The page you requested was not found.
      </p>
      <Button asChild>
        <Link to={ROUTES.ROOT}>Go Home</Link>
      </Button>
    </main>
  );
}
