import type { WithHTMLProps } from "../types";
import { Spinner } from "./Spinner";

type ButtonProps = WithHTMLProps<
  "button",
  React.PropsWithChildren<{
    isLoading?: boolean;
    small?: boolean;
    fill?: boolean;
    ghost?: boolean;
  }>
>;

export const Button: React.FunctionComponent<Readonly<ButtonProps>> = (
  props
) => {
  const {
    children,
    isLoading,
    type = "button",
    disabled,
    small,
    fill,
    ghost,
    ...rest
  } = props;

  const smallStyles = small
    ? "gap-2 py-0.5 px-2 text-sm font-semibold"
    : "gap-2 px-3 py-2 font-medium border border-indigo-900";

  const fillStyles = fill ? "w-full h-full" : "";

  const ghostStyles = ghost ? "border-0 hover:bg-indigo-200 active:bg-indigo-200" : "bg-indigo-700 text-white";

  return (
    <button
      {...rest}
      disabled={isLoading || disabled}
      className={`focus flex items-center justify-center rounded disabled:cursor-not-allowed disabled:opacity-75 ${smallStyles} ${fillStyles} ${ghostStyles}`}
      type={type}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};
