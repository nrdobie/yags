import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/games/$gameId")({
  component: GamePage,
});

function GamePage() {
  const game = Route.useLoaderData();

  return <div>Hello {game.name}!</div>;
}
