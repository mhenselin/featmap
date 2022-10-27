import { Input } from "../Input";
import type { FormFieldComponent } from "./types";

export const EmailField: FormFieldComponent = (props) => {
  const { errors, register } = props;

  return (
    <Input
      icon="email"
      label="Email Address"
      {...register("email", {
        required: "Email Address is a required field.",
      })}
      placeholder="you@website.com"
      error={errors.email}
    />
  );
};
