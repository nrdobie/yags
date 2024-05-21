import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";

const jeopardyQuestionSchema = z.object({
  id: z.string().default(() => createId()),
  clue: z.string(),
  answer: z.string(),
});

const jeopardyCategorySchema = z.object({
  id: z.string().default(() => createId()),
  title: z.string(),
  questions: z.array(jeopardyQuestionSchema).length(5),
});

const jeopardyRoundSchema = z.object({
  settings: z.object({
    dailyDoubleAnwsers: z
      .array(z.literal("random").or(z.string()))
      .optional()
      .default(["random", "random"]),
  }),
  categories: z.array(jeopardyCategorySchema).length(6),
});

const jeopardySchema = z.object({
  roundOne: jeopardyRoundSchema,
  roundTwo: jeopardyRoundSchema,
  finalJeopardy: jeopardyQuestionSchema,
});

type Jeopardy = z.infer<typeof jeopardySchema>;

function makeBlankJeopardyGame(): Jeopardy {
  return {
    roundOne: {
      categories: Array.from({ length: 6 }).map(() => ({
        id: createId(),
        title: "",
        questions: Array.from({ length: 5 }).map(() => ({
          id: createId(),
          clue: "",
          answer: "",
        })),
      })),
      settings: {
        dailyDoubleAnwsers: ["random", "random"],
      },
    },
    roundTwo: {
      categories: Array.from({ length: 6 }).map(() => ({
        id: createId(),
        title: "",
        questions: Array.from({ length: 5 }).map(() => ({
          id: createId(),
          clue: "",
          answer: "",
        })),
      })),
      settings: {
        dailyDoubleAnwsers: ["random", "random"],
      },
    },
    finalJeopardy: {
      id: createId(),
      clue: "",
      answer: "",
    },
  };
}

export { jeopardySchema, makeBlankJeopardyGame };

export type { Jeopardy };
