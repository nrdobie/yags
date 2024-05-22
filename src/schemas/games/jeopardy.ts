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
    dailyDoubleQuestions: z.array(z.string()).optional(),
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
        dailyDoubleQuestions: [],
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
        dailyDoubleQuestions: [],
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
