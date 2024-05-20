import defaultsDeep from "lodash/defaultsDeep";
import { useMemo } from "react";
import {
  type DeepPartial,
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { GameType, gameSchema } from "~/schemas/game";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { z } from "zod";

const schema = gameSchema.omit({ id: true });

type FormValues = z.infer<typeof schema>;

interface GameFormProps {
  initialValues?: DeepPartial<FormValues>;
  previousValues?: DeepPartial<FormValues>;
  onSubmit: SubmitHandler<FormValues>;
  onSubmitError?: SubmitErrorHandler<FormValues>;
}

type GameFormOnSubmit = GameFormProps["onSubmit"];
type GameFormOnSubmitError = GameFormProps["onSubmitError"];

function GameForm(props: GameFormProps) {
  const defaultValues: DeepPartial<FormValues> = useMemo(
    () =>
      defaultsDeep({}, props.previousValues, props.initialValues, { name: "" }),
    [props.previousValues, props.initialValues],
  );

  const isEditMode = !!props.previousValues;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(props.onSubmit, props.onSubmitError)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a game type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={GameType.Jeopardy}>Jeopardy!</SelectItem>
                    <SelectItem value={GameType.WheelOfFortune}>
                      Wheel Of Fortune
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type="submit">{isEditMode ? "Update" : "Create"}</Button>
      </form>
      {}
    </Form>
  );
}

export { GameForm };

export type { GameFormProps, GameFormOnSubmit, GameFormOnSubmitError };
