import { createElement } from "react";
import { WithHTMLProps } from "../types";

type HeadlineProps = React.PropsWithChildren<
  WithHTMLProps<"h1", { level: 1 | 2 | 3 | 4 | 5 | 6 }>
>;

export const Headline: React.FunctionComponent<Readonly<HeadlineProps>> = (
  props
) => {
  const { level, children, ...rest } = props;
  return createElement(
    "h" + level,
    { ...rest, className: "text-2xl font-medium" },
    children
  );
};
