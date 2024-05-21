import { zodResolver } from "@hookform/resolvers/zod";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
  type FieldName,
  useFormContext,
  useFieldArray,
} from "react-hook-form";
import { type Jeopardy, jeopardySchema } from "~/schemas/games/jeopardy";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useCallback, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { createId } from "@paralleldrive/cuid2";
import { getNextSortIndex } from "~/libs/get-next-sort-index";
import { Input } from "../ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faEllipsisV,
  faEye,
  faEyeSlash,
  faGripVertical,
  faShuffle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Textarea } from "../ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface JeopardyGameEditorProps {
  game: Jeopardy;
}

function JeopardyGameEditor(props: JeopardyGameEditorProps) {
  const form = useForm<Jeopardy>({
    resolver: zodResolver(jeopardySchema),
    defaultValues: props.game,
    mode: "onBlur",
  });

  const onSubmit = useCallback<SubmitHandler<Jeopardy>>((data) => {
    console.log(data);
  }, []);

  const onSubmitError = useCallback<SubmitErrorHandler<Jeopardy>>((errors) => {
    console.log(errors);
  }, []);

  const onLogValues = () => console.log(form.getValues());

  return (
    <Form {...form}>
      <div className="grid grid-cols-[280px_1fr] gap-8">
        <JeopardyTableOfContents />
        <form
          onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
          className="space-y-8"
        >
          <JeopardyRoundEditor round="roundOne" />
          <JeopardyRoundEditor round="roundTwo" />
          <JeopardyFinalJeopardy />
          <Button type="button" onClick={onLogValues}>
            Log Values
          </Button>
        </form>
      </div>
    </Form>
  );
}

function JeopardyTableOfContents() {
  const { watch } = useFormContext<Jeopardy>();

  const roundOne = watch("roundOne.categories");
  const roundTwo = watch("roundTwo.categories");

  return (
    <div>
      <ul className="border border-border p-4 rounded sticky top-8">
        <li>
          <Button $variant="link" $size="sm" asChild>
            <a href="#navigation-top">Back to Top</a>
          </Button>
        </li>
        <li>
          <Button $variant="link" $size="sm" asChild>
            <a href="#roundOne">Round One</a>
          </Button>
          <ul className="pl-4">
            {roundOne.map((category, index) => (
              <li key={category.id}>
                <Button $variant="link" $size="sm" asChild>
                  <a href={`#${category.id}`}>
                    {category.title === ""
                      ? `Category #${index + 1}`
                      : category.title}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <Button $variant="link" $size="sm" asChild>
            <a href="#roundTwo">Round Two</a>
          </Button>
          <ul className="pl-4">
            {roundTwo.map((category, index) => (
              <li key={category.id}>
                <Button $variant="link" $size="sm" asChild>
                  <a href={`#${category.id}`}>
                    {category.title === ""
                      ? `Category #${index + 1}`
                      : category.title}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <Button type="button" $variant="link" $size="sm" asChild>
            <a href="#finalJeopardy">Final Jeopardy</a>
          </Button>
        </li>
      </ul>
    </div>
  );
}

interface JeopardyRoundEditorProps {
  round: "roundOne" | "roundTwo";
}

function JeopardyRoundEditor(props: JeopardyRoundEditorProps) {
  const { control } = useFormContext<Jeopardy>();

  const fieldArray = useFieldArray({
    control,
    name: `${props.round}.categories`,
  });

  const addCategory = useCallback(
    () =>
      fieldArray.append({
        id: createId(),
        title: "",
        questions: Array.from({ length: 5 }).map(() => ({
          id: createId(),
          clue: "",
          answer: "",
        })),
      }),
    [fieldArray.append],
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 id={props.round} className="text-2xl font-bold">
          {props.round === "roundOne"
            ? "Round One (Jeopardy)"
            : "Round Two (Double Jeopardy)"}
        </h2>
        <Button $variant="outline" onClick={addCategory} type="button">
          Add Category
        </Button>
      </div>
      {fieldArray.fields.map((field, index) => (
        <JeopardyCategoryEditor
          key={field.id}
          sortIndex={index}
          name={`${props.round}.categories.${index}`}
          onDeleteCategory={fieldArray.remove.bind(fieldArray, index)}
        />
      ))}
    </>
  );
}

interface JeopardyCategoryEditorProps {
  sortIndex: number;
  name: `${"roundOne" | "roundTwo"}.categories.${number}`;
  onDeleteCategory: () => void;
}

function JeopardyCategoryEditor(props: JeopardyCategoryEditorProps) {
  const { control, watch } = useFormContext<Jeopardy>();

  const [visibility, setVisibility] = useState<boolean>(true);

  const fieldArray = useFieldArray({
    control,
    name: `${props.name}.questions`,
  });

  const id = watch(`${props.name}.id`);

  const addQuestion = useCallback(
    () =>
      fieldArray.append({
        id: createId(),
        clue: "",
        answer: "",
      }),
    [fieldArray.append],
  );

  return (
    <fieldset
      className="border border-border p-4 pt-0 rounded-lg space-y-4 relative bg-background"
      id={id}
    >
      <legend className="min-w-56 w-1/2 flex items-stretch">
        <FormField
          control={control}
          name={`${props.name}.title`}
          render={({ field }) => (
            <FormItem className="space-y-0 flex-1">
              <FormLabel className="sr-only">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={`Category #${props.sortIndex + 1}`}
                  className="rounded-r-none"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              $variant="outline"
              type="button"
              className="border-l-0 rounded-l-none"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Preview Title Card</DropdownMenuItem>
            <DropdownMenuItem onClick={props.onDeleteCategory}>
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </legend>
      {visibility ? (
        <>
          {fieldArray.fields.map((field, index) => (
            <JeopardyCategoryQuestionEditor
              key={field.id}
              sortIndex={index}
              name={`${props.name}.questions.${index}`}
              onDeleteQuestion={fieldArray.remove.bind(fieldArray, index)}
            />
          ))}
          <Button $variant="outline" onClick={addQuestion} type="button">
            Add Question
          </Button>
        </>
      ) : null}
    </fieldset>
  );
}

interface JeopardyCategoryQuestionEditorProps {
  sortIndex: number;
  name: `${"roundOne" | "roundTwo"}.categories.${number}.questions.${number}`;
  onDeleteQuestion: () => void;
}

const BASE_PRIZE_AMOUNTS = [200, 400, 600, 800, 1000] as const;

function getPrizeAmount(
  name: `${"roundOne" | "roundTwo"}.categories.${number}.questions.${number}`,
  sortIndex: number,
) {
  const breakName = name.split(".");
  const round = breakName[0] as "roundOne" | "roundTwo";

  let prizeAmount: number | undefined = BASE_PRIZE_AMOUNTS[sortIndex];

  if (!prizeAmount) {
    return "Extra";
  }

  if (round === "roundTwo") {
    prizeAmount *= 2;
  }

  return `$${prizeAmount}`;
}

function JeopardyCategoryQuestionEditor(
  props: JeopardyCategoryQuestionEditorProps,
) {
  const prizeAmount = useMemo(
    () => getPrizeAmount(props.name, props.sortIndex),
    [props.name, props.sortIndex],
  );

  return (
    <fieldset className="border border-border p-4 pt-0 rounded-lg space-y-4 relative bg-background">
      <legend className="flex items-stretch bg-background h-10">
        <span className="bg-muted w-10 aspect-square grid place-content-center border border-border rounded-l text-muted-foreground cursor-grab active:cursor-grabbing">
          <FontAwesomeIcon icon={faGripVertical} />
        </span>
        <span className="px-4 border border-l-0 border-border grid place-content-center">
          {prizeAmount} Question
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              $variant="outline"
              type="button"
              className="border-l-0 rounded-l-none"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Preview Question Clue Card</DropdownMenuItem>
            <DropdownMenuItem onClick={props.onDeleteQuestion}>
              Delete Question
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </legend>
      <JeopardyQuestionEditor name={`${props.name}`} />
    </fieldset>
  );
}

function JeopardyFinalJeopardy() {
  return (
    <>
      <h2 id="finalJeopardy" className="text-2xl font-bold">
        Final Jeopardy
      </h2>
      <JeopardyQuestionEditor name="finalJeopardy" />
    </>
  );
}

interface JeopardyQuestionEditorProps {
  name:
    | `${"roundOne" | "roundTwo"}.categories.${number}.questions.${number}`
    | "finalJeopardy";
}

function JeopardyQuestionEditor(props: JeopardyQuestionEditorProps) {
  const { control } = useFormContext<Jeopardy>();

  return (
    <div className="space-y-2 max-w-prose">
      <FormField
        control={control}
        name={`${props.name}.clue`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Clue</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${props.name}.answer`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Answer</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

export { JeopardyGameEditor };

export type { JeopardyGameEditorProps };
