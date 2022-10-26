import { forwardRef, useId } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { WithHTMLProps } from "../types";
import { Error } from "./Error";

type FormError = FieldError | Merge<FieldError, FieldErrorsImpl>;

type InputProps = Omit<
  WithHTMLProps<
    "input",
    {
      type?: "password" | "text";
      label: string;
      error?: FormError;
      icon?: React.ReactElement;
    }
  >,
  "id" | "className"
>;
export const Input = forwardRef<HTMLInputElement, Readonly<InputProps>>(
  function ForwardedInput(props, ref) {
    const { label, error, type = "text", icon, ...rest } = props;
    const id = useId();

    return (
      <label htmlFor={id} className="flex flex-col gap-1">
        <div className="font-semibold">{label}</div>
        <div className="relative ">
          {icon && (
            <div
              className={`absolute top-px left-px flex h-10 w-10 items-center justify-center text-2xl ${
                error ? "text-red-500" : "text-gray-500"
              }`}
            >
              {icon}
            </div>
          )}
          <input
            {...rest}
            ref={ref}
            type={type}
            id={id}
            className={`focus w-full rounded border bg-white px-3 py-2 ${
              icon ? "pl-10" : ""
            } ${error ? "border-red-500" : "border-gray-400"}`}
          />
        </div>
        <Error message={error?.message as string} />
      </label>
    );
  }
);
