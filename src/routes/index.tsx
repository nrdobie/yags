import { createFileRoute } from "@tanstack/react-router";
import { db } from "~/libs/db";

export const Route = createFileRoute("/")({
  loader: async () => {
    const lastModified = await db.games
      .limit(5)
      .reverse()
      .sortBy("lastModified");

    const allGames = await db.games.orderBy("name").toArray();

    return { lastModified, allGames };
  },
});
