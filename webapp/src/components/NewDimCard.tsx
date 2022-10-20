import { PropsWithChildren, FunctionComponent } from "react";

const NewDimCard: FunctionComponent<PropsWithChildren> = (props) => {
  return (
    <div className="flex h-24 w-36 items-center  justify-center rounded border border-dashed border-gray-200 p-1 ">
      <div className="flex">{props.children}</div>
    </div>
  );
};

export default NewDimCard;
