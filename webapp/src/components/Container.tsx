import { createElement } from "react";

type ContainerProps = React.PropsWithChildren<{
  as?: "main" | "div";
  small?: boolean;
  className?: string;
}>;

export const Container: React.FunctionComponent<Readonly<ContainerProps>> = (
  props
) => {
  const { small, as = "div", children, className } = props;
  return createElement(
    as,
    {
      className: `relative container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10${
        small ? " max-w-md" : ""
      } ${className ?? ""}`,
    },
    children
  );
};
