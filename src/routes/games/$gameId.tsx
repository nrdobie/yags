import { createFileRoute, notFound } from "@tanstack/react-router";
import { db } from "~/libs/db";

export const Route = createFileRoute("/games/$gameId")({
  loader: async ({ params: { gameId } }) => {
    const game = await db.games.get(gameId);

    if (!game) {
      throw notFound();
    }

    return game;
  },
});
