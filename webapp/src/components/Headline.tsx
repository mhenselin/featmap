import { createElement } from "react";
import { WithHTMLProps } from "../types";

type HeadlineProps = React.PropsWithChildren<
  WithHTMLProps<"h1", { level: 1 | 2 | 3 | 4 | 5 | 6 }>
>;

const headlineSize = {
  1: "text-3xl",
  2: "text-2xl",
  3: "text-xl",
  4: "text-xl",
  5: "text-xl",
  6: "text-xl",
};

export const Headline: React.FunctionComponent<Readonly<HeadlineProps>> = (
  props
) => {
  const { level, children, ...rest } = props;
  return createElement(
    "h" + level,
    { ...rest, className: `${headlineSize[level]} font-medium` },
    children
  );
};
