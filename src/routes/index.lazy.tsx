import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { lastModified, allGames } = Route.useLoaderData();

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Recent
      </h2>
      <ul>
        {lastModified.map((game) => (
          <li key={game.id}>
            <Button $variant="link" asChild>
              <Link to="/games/$gameId" params={{ gameId: game.id }}>
                {game.name}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        All Games
      </h2>
      <ul>
        {allGames.map((game) => (
          <li key={game.id}>
            <Button $variant="link" asChild>
              <Link to="/games/$gameId" params={{ gameId: game.id }}>
                {game.name}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
