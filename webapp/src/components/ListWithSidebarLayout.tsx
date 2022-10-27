import React from "react";
import { Headline } from "./Headline";

type ListWithSidebarLayoutProps = React.PropsWithChildren<{
  headline: string;
  sidebar: React.ReactNode;
}>;

export const ListWithSidebarLayout: React.FunctionComponent<
  ListWithSidebarLayoutProps
> = (props) => {
  const { headline, sidebar, children } = props;
  return (
    <div className="flex flex-col gap-6 lg:flex-row-reverse">
      <div className="shrink-0 lg:w-1/4">{sidebar}</div>
      <div className="border-r border-b border-gray-200"></div>
      <div className="grow">
        <div className="mb-4">
          <Headline level={1}>{headline}</Headline>
        </div>
        <div className="flex flex-wrap gap-4">{children}</div>
      </div>
    </div>
  );
};
