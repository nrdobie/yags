import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { GameForm, type GameFormOnSubmit } from "~/components/forms/game";
import { createId } from "@paralleldrive/cuid2";
import { GameType, type Game } from "~/schemas/game";
import { db } from "~/libs/db";
import { makeBlankJeopardyGame } from "~/schemas/games/jeopardy";

export const Route = createLazyFileRoute("/games/create")({
  component: CreateGamePage,
});

function CreateGamePage() {
  const navigate = useNavigate();

  const onSubmit = useCallback<GameFormOnSubmit>(
    async (values) => {
      let blankGameData = {};
      switch (values.type) {
        case GameType.Jeopardy:
          blankGameData = makeBlankJeopardyGame();
          break;
      }

      const game: Game = {
        id: createId(),
        data: blankGameData,
        ...values,
      };

      console.log(game);

      await db.games.add(game);

      navigate({
        to: "/games/$gameId",
        params: { gameId: game.id },
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
