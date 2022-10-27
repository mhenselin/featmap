import type { WithHTMLProps } from "../types";
import { Spinner } from "./Spinner";

type ButtonProps = WithHTMLProps<
  "button",
  React.PropsWithChildren<{
    isLoading?: boolean;
  }>
>;

export const Button: React.FunctionComponent<Readonly<ButtonProps>> = (
  props
) => {
  const { children, isLoading, type = "button", disabled, ...rest } = props;
  return (
    <button
      {...rest}
      disabled={isLoading || disabled}
      className="focus flex items-center justify-center gap-2 rounded border border-indigo-900 bg-indigo-700 px-3 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-75"
      type={type}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};
