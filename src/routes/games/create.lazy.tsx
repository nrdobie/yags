import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { GameForm, type GameFormOnSubmit } from "~/components/forms/game";
import { createId } from "@paralleldrive/cuid2";
import type { Game } from "~/schemas/game";
import { db } from "~/libs/db";

export const Route = createLazyFileRoute("/games/create")({
  component: CreateGamePage,
});

function CreateGamePage() {
  const navigate = useNavigate();

  const onSubmit = useCallback<GameFormOnSubmit>(
    async (values) => {
      const data: Game = {
        id: createId(),
        ...values,
      };

      console.log(data);

      await db.games.add(data);

      navigate({
        to: "/games/$gameId",
        params: { gameId: data.id },
      });
    },
    [navigate],
  );

  return (
    <>
      <h1 className="text-3xl font-bold">Create A Game</h1>
      <div className="max-w-prose mt-8">
        <GameForm onSubmit={onSubmit} />
      </div>
    </>
  );
}
