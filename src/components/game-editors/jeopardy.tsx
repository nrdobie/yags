import { zodResolver } from "@hookform/resolvers/zod";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
  useFormContext,
  useFieldArray,
} from "react-hook-form";
import { type Jeopardy, jeopardySchema } from "~/schemas/games/jeopardy";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useCallback, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { createId } from "@paralleldrive/cuid2";
import { Input } from "../ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { Textarea } from "../ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { db } from "~/libs/db";
import { JeopardyClue } from "../game-runner/jeopardy/clue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { JeopardyCategory } from "../game-runner/jeopardy/category";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface JeopardyGameEditorProps {
  gameId: string;
  data: Jeopardy;
}

function JeopardyGameEditor(props: JeopardyGameEditorProps) {
  const form = useForm<Jeopardy>({
    resolver: zodResolver(jeopardySchema),
    defaultValues: props.data,
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
        <JeopardyTableOfContents gameId={props.gameId} />
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

interface JeopardyTableOfContentsProps {
  gameId: string;
}

function JeopardyTableOfContents(props: JeopardyTableOfContentsProps) {
  const { watch, getValues } = useFormContext<Jeopardy>();

  const onSave = useCallback(async () => {
    const data = getValues();

    await db.games.update(props.gameId, {
      data,
      lastModified: new Date(),
    });
  }, [props.gameId, getValues]);

  const roundOne = watch("roundOne.categories");
  const roundTwo = watch("roundTwo.categories");

  return (
    <div>
      <div className="space-y-4 sticky top-8">
        <div className="border border-border p-4 rounded">
          <Button type="button" onClick={onSave}>
            Save
          </Button>
        </div>

        <ul className="border border-border p-4 rounded">
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
    </div>
  );
}

interface JeopardyRoundEditorProps {
  round: "roundOne" | "roundTwo";
}

function JeopardyRoundEditor(props: JeopardyRoundEditorProps) {
  const { control, watch, setValue } = useFormContext<Jeopardy>();

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

  const dailyDoubleQuestionsIds =
    watch(`${props.round}.settings.dailyDoubleQuestions`) ?? [];
  const categories = fieldArray.fields;

  const [showDailyDouble, setShowDailyDouble] = useState(false);

  const dailyDoubleQuestions = useMemo(() => {
    return dailyDoubleQuestionsIds.map((id) => {
      for (const categoryIndex in categories) {
        const category = categories[categoryIndex];

        const questionIndex = category.questions.findIndex(
          (question) => question.id === id,
        );

        if (questionIndex === -1) {
          continue;
        }

        const question = category.questions[questionIndex];

        if (!question) {
          continue;
        }

        console.log(question);

        return {
          categoryName: category.title
            ? category.title
            : `Category #${+categoryIndex + 1}`,
          questionName: `${getPrizeAmount(
            props.round,
            questionIndex,
          )} Question`,
          question,
        };
      }
    });
  }, [props.round, categories, dailyDoubleQuestionsIds]);

  const removeDailyDoubleQuestion = useCallback(
    (questionId: string) => {
      setValue(
        `${props.round}.settings.dailyDoubleQuestions`,
        dailyDoubleQuestionsIds.filter((id) => id !== questionId),
      );
    },
    [props.round, dailyDoubleQuestionsIds, setValue],
  );

  const addDailyDoubleQuestion = useCallback(
    (questionId: string) => {
      if (dailyDoubleQuestionsIds.includes(questionId)) {
        return;
      }

      setValue(`${props.round}.settings.dailyDoubleQuestions`, [
        ...dailyDoubleQuestionsIds,
        questionId,
      ]);
    },
    [props.round, dailyDoubleQuestionsIds, setValue],
  );

  console.log(dailyDoubleQuestions);

  return (
    <>
      <div className="flex items-center gap-2">
        <h2 id={props.round} className="text-2xl font-bold flex-1">
          {props.round === "roundOne"
            ? "Round One (Jeopardy)"
            : "Round Two (Double Jeopardy)"}
        </h2>
        <Button $variant="outline" onClick={addCategory} type="button">
          Add Category
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button $variant="outline" type="button">
              <FontAwesomeIcon icon={faEllipsisV} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setShowDailyDouble(true)}>
              View Daily Double Questions
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={showDailyDouble} onOpenChange={setShowDailyDouble}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Daily Double Questions</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {dailyDoubleQuestions.length === 0 ? (
              "No daily double questions"
            ) : (
              <ul>
                {dailyDoubleQuestions.map((ddq) => {
                  if (!ddq) return null;
                  return (
                    <li key={ddq.question.id}>
                      <div className="flex justify-between items-center">
                        <Label>
                          {ddq.categoryName} - {ddq.questionName}
                        </Label>
                        <button
                          type="button"
                          className="text-destructive hover:underline focus:underline"
                          onClick={() =>
                            removeDailyDoubleQuestion(ddq.question.id)
                          }
                        >
                          Remove Question
                        </button>
                      </div>
                      <span>{ddq.question.clue}</span>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="flex flex-col gap-2 mt-4">
              <Label>Add Question</Label>
              <Select
                value=""
                onValueChange={(value) => addDailyDoubleQuestion(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Question" />
                </SelectTrigger>
                <SelectContent>
                  {fieldArray.fields.map((field, categoryIndex) => (
                    <SelectGroup key={field.id}>
                      <SelectLabel>
                        {field.title === ""
                          ? `Category #${categoryIndex + 1}`
                          : field.title}
                      </SelectLabel>
                      {field.questions.map((question, questionIndex) => {
                        if (dailyDoubleQuestionsIds.includes(question.id)) {
                          return null;
                        }

                        return (
                          <SelectItem key={question.id} value={question.id}>
                            {field.title === ""
                              ? `Category #${categoryIndex + 1}`
                              : field.title}{" "}
                            {getPrizeAmount(props.round, questionIndex)}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
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

  const fieldArray = useFieldArray({
    control,
    name: `${props.name}.questions`,
    keyName: "_id",
  });

  const id = watch(`${props.name}.id`);

  const [previewOpen, setPreviewOpen] = useState(false);

  const addQuestion = useCallback(
    () =>
      fieldArray.append({
        id: createId(),
        clue: "",
        answer: "",
      }),
    [fieldArray.append],
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const activeIndex = fieldArray.fields.findIndex(
          (field) => field.id === active.id,
        );
        const overIndex = fieldArray.fields.findIndex(
          (field) => field.id === over.id,
        );

        if (activeIndex === -1 || overIndex === -1) {
          return;
        }

        fieldArray.move(activeIndex, overIndex);
      }
    },
    [fieldArray.fields, fieldArray.move],
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
                  autoComplete="off"
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
            <DropdownMenuItem onClick={() => setPreviewOpen(true)}>
              Preview Title Card
            </DropdownMenuItem>
            <DropdownMenuItem onClick={props.onDeleteCategory}>
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </legend>
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[95vmin] aspect-video">
          <DialogDescription>
            <JeopardyCategory category={watch(`${props.name}.title`)} />
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={fieldArray.fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          {fieldArray.fields.map((field, index) => (
            <JeopardyCategoryQuestionEditor
              key={field.id}
              id={field.id}
              sortIndex={index}
              name={`${props.name}.questions.${index}`}
              onDeleteQuestion={fieldArray.remove.bind(fieldArray, index)}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button $variant="outline" onClick={addQuestion} type="button">
        Add Question
      </Button>
    </fieldset>
  );
}

interface JeopardyCategoryQuestionEditorProps {
  id: string;
  sortIndex: number;
  name: `${"roundOne" | "roundTwo"}.categories.${number}.questions.${number}`;
  onDeleteQuestion: () => void;
}

const BASE_PRIZE_AMOUNTS = [200, 400, 600, 800, 1000] as const;

function getRound(name: `${"roundOne" | "roundTwo"}.${string}`) {
  return name.split(".")[0] as "roundOne" | "roundTwo";
}

function getPrizeAmount(round: "roundOne" | "roundTwo", sortIndex: number) {
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
  const { watch, getValues, setValue } = useFormContext<Jeopardy>();

  const prizeAmount = useMemo(
    () => getPrizeAmount(getRound(props.name), props.sortIndex),
    [props.name, props.sortIndex],
  );

  const round = useMemo(
    () => props.name.split(".")[0] as "roundOne" | "roundTwo",
    [props.name],
  );

  const [previewOpen, setPreviewOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  } satisfies React.CSSProperties;

  const isDailyDouble =
    watch(`${round}.settings.dailyDoubleQuestions`)?.includes(props.id) ??
    false;

  const toggleDailyDouble = useCallback(() => {
    const dailyDoubleQuestions =
      getValues(`${round}.settings.dailyDoubleQuestions`) ?? [];

    if (dailyDoubleQuestions?.includes(props.id)) {
      setValue(
        `${round}.settings.dailyDoubleQuestions`,
        dailyDoubleQuestions.filter((id) => id !== props.id),
      );
    } else {
      setValue(`${round}.settings.dailyDoubleQuestions`, [
        ...dailyDoubleQuestions,
        props.id,
      ]);
    }
  }, [round, props.id, getValues, setValue]);

  return (
    <fieldset
      ref={setNodeRef}
      className="border border-border p-4 pt-0 rounded-lg space-y-4 relative bg-background"
      {...attributes}
      style={style}
    >
      <legend className="flex items-stretch bg-background h-10">
        <Button
          type="button"
          ref={setActivatorNodeRef}
          $variant="secondary"
          className="rounded-r-none cursor-grab active:cursor-grabbing"
          {...listeners}
        >
          <FontAwesomeIcon icon={faGripVertical} />
        </Button>
        <span className="px-4 border border-l-0 border-border grid place-content-center">
          <span className="flex items-center gap-2">
            {prizeAmount} Question
            {isDailyDouble ? (
              <span className="bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wide rounded-full px-2">
                Daily Double
              </span>
            ) : null}
          </span>
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
            <DropdownMenuItem onClick={toggleDailyDouble}>
              Toggle Daily Daily Double
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPreviewOpen(true)}>
              Preview Question Clue Card
            </DropdownMenuItem>
            <DropdownMenuItem onClick={props.onDeleteQuestion}>
              Delete Question
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </legend>
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[95vmin] aspect-video">
          <DialogDescription>
            <JeopardyClue clue={watch(`${props.name}.clue`)} />
          </DialogDescription>
        </DialogContent>
      </Dialog>
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
              <Input {...field} autoComplete="off" />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

export { JeopardyGameEditor };

export type { JeopardyGameEditorProps };
