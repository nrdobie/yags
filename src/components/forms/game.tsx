import defaultsDeep from "lodash/defaultsDeep";
import { useMemo } from "react";
import {
  type DeepPartial,
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { z } from "zod";
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

const schema = z.object({
  name: z.string().min(1),
});

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

        <Button type="submit">{isEditMode ? "Update" : "Create"}</Button>
      </form>
      {}
    </Form>
  );
}

export { GameForm };

export type { GameFormProps, GameFormOnSubmit, GameFormOnSubmitError };
