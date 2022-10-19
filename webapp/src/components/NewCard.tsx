import { FunctionComponent, PropsWithChildren } from "react";

const NewCard: FunctionComponent<PropsWithChildren> = (props) => {
  return (
    <div className="h-24 w-36 items-center  justify-center rounded-sm border border-dashed border-gray-300 p-1 ">
      <div className="flex h-full">{props.children}</div>
    </div>
  );
};

export default NewCard;
