import { Input } from "../Input";
import type { FormFieldComponent } from "./types";

export const PasswordField: FormFieldComponent = (props) => {
  const { errors, register } = props;

  return (
    <Input
      icon="vpn_key"
      label="Password"
      {...register("password", {
        required: "Password is a required field.",
        minLength: {
          value: 6,
          message: "Your password must at least consist of 6 characters.",
        },
        maxLength: {
          value: 200,
          message:
            "Your password exceeds the maximum length of 200 characters. Please shorten your password.",
        },
      })}
      type="password"
      error={errors.password}
    />
  );
};
