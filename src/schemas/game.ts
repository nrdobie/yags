import { z } from "zod";

enum GameType {
  Jeopardy = "Jeopardy",
  WheelOfFortune = "WheelOfFortune",
}

const gameSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.nativeEnum(GameType),
  lastModified: z.date().optional().default(new Date()),
});

type Game = z.infer<typeof gameSchema>;

export { gameSchema, GameType };

export type { Game };
