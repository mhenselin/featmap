import { Input } from "../Input";
import type { FormFieldComponent } from "./types";

export const NameField: FormFieldComponent = (props) => {
  const { errors, register } = props;

  return (
    <Input
      icon="person"
      label="Your Name"
      {...register("name", {
        required: "Your Name is a required field.",
        maxLength: {
          value: 200,
          message:
            "Your name exceeds the maximum length of 200 characters. Please shorten your name.",
        },
      })}
      placeholder="you@website.com"
      error={errors.name}
    />
  );
};
