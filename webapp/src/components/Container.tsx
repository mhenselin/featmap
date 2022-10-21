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
      className: `container mx-auto p-4 md:p-6 lg:p-8 ${
        small ? "max-w-md" : ""
      } ${className ?? ""}`,
    },
    children
  );
};
