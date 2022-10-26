import type {
  FieldErrorsImpl,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

export type FormFieldProps = {
  register: UseFormRegister<FieldValues>;
  errors: Partial<FieldErrorsImpl>;
};

export type FormFieldComponent = React.FunctionComponent<FormFieldProps>;
