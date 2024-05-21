import {
  faEllipsisVertical,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createLazyFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useMemo } from "react";
import { JeopardyGameEditor } from "~/components/game-editors/jeopardy";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { GameType } from "~/schemas/game";

export const Route = createLazyFileRoute("/games/$gameId")({
  component: GamePage,
});

function GamePage() {
  const game = Route.useLoaderData();

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const GameEditor = useMemo<React.ComponentType<{ game: any }>>(() => {
    switch (game.type) {
      case GameType.Jeopardy:
        return JeopardyGameEditor;
      default:
        return () => (
          <Alert variant="destructive">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <AlertTitle>Game Type Not Ready</AlertTitle>
            <AlertDescription>
              Sorry but we are not yet ready for this game type.
            </AlertDescription>
          </Alert>
        );
    }
  }, [game.type]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{game.name}</h1>
        <div className="flex gap-2">
          <Button type="button">Run Game</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button $variant="outline" $size="icon" type="button">
                <span>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                  <span className="sr-only">Additional Options</span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit Game Details</DropdownMenuItem>
              <DropdownMenuItem>Delete Game</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <GameEditor game={game.data} />
    </>
  );
}
