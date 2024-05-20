import { z } from "zod";

const gameSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

type Game = z.infer<typeof gameSchema>;

export { gameSchema };

export type { Game };
