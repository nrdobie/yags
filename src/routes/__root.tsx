import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";
import { SelectColorTheme } from "~/components/common/select-color-theme";
import { Button } from "~/components/ui/button";
import { useColorScheme } from "~/hooks/use-color-scheme";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { isDarkMode } = useColorScheme();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-8">
      <header className="border-b border-b-border py-4">
        <div className="flex gap-2 items-center container">
          <Link to="/" className="text-xl font-bold">
            YAGS
          </Link>
          <Button asChild $variant="ghost" $size="sm">
            <Link
              to="/games/create"
              className="[&.active]:font-bold [&.active]:text-primary"
            >
              Create Game
            </Link>
          </Button>
          <Button asChild $variant="ghost" $size="sm">
            <Link
              to="/about"
              className="[&.active]:font-bold [&.active]:text-primary"
            >
              About
            </Link>
          </Button>
          <Button asChild $variant="ghost" $size="sm">
            <Link
              to="/settings"
              className="[&.active]:font-bold [&.active]:text-primary"
            >
              Settings
            </Link>
          </Button>
          <div className="flex-1" />
          <SelectColorTheme />
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  );
}
