import { Link } from "react-router-dom";
import {
  Color,
  colorToBorderColorClass,
  dbAnnotationsFromNames,
} from "../core/misc";
import { CardFlag } from "./CardFlag";

export enum CardStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

type CardProps = {
  title: string;
  link: string;
  status?: CardStatus;
  color?: Color;
  bottomAction?: React.ReactElement;
  nbrOfItems?: number;
  nbrOfComments?: number;
  annotations: string;
  estimate?: number;
};

export const Card: React.FunctionComponent<Readonly<CardProps>> = (props) => {
  const {
    annotations,
    color = Color.WHITE,
    title,
    nbrOfItems = 0,
    nbrOfComments = 0,
    link,
    bottomAction,
    estimate = 0,
    status = CardStatus.OPEN,
  } = props;
  const filteredAnnotations = dbAnnotationsFromNames(annotations);

  return (
    <div>
      <div
        className={`flex w-36 shrink-0 flex-row overflow-hidden rounded-sm border border-l-4 bg-white text-xs ${colorToBorderColorClass(
          color
        )}`}
      >
        <Link className="flex grow flex-col" to={link}>
          <div
            className={`grow overflow-hidden p-2 font-normal ${
              status === "CLOSED" ? "line-through" : ""
            }`}
          >
            {title}
          </div>

          <div className="flex flex-row p-2">
            <CardFlag
              shouldRender={nbrOfItems > 0}
              text={`${nbrOfItems} items`}
            />
            <CardFlag
              shouldRender={nbrOfComments > 0}
              tooltip={`${nbrOfComments} comments`}
              icon="chat_bubble_outline"
              text={nbrOfComments}
            />
            <div className="flex grow"></div>
            {filteredAnnotations.annotations.map((annotation, index) => (
              <CardFlag
                key={index}
                tooltip={annotation.description}
                icon={annotation.icon}
              />
            ))}
            <CardFlag
              shouldRender={estimate > 0}
              tooltip={"Size is " + estimate}
              text={estimate}
            />
          </div>
        </Link>
      </div>
      {bottomAction && (
        <div className="-mt-1 -mb-2 flex h-6 w-36 shrink-0 justify-center">
          <div className="showme flex text-xl font-bold">{bottomAction}</div>
        </div>
      )}
    </div>
  );
};
