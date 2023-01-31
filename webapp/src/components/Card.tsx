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
    <div className="flex w-40 flex-col gap-2">
      <div
        className={`rounded border border-l-[6px] bg-white text-sm shadow ${colorToBorderColorClass(
          color
        )}`}
        style={{ minHeight: "6rem" }}
      >
        <Link to={link} className="flex h-full w-full flex-col gap-2 p-2">
          <div
            className={`break-words leading-4 ${
              status === CardStatus.CLOSED ? "line-through" : ""
            }`}
            title={title}
          >
            {title}
          </div>

          {(nbrOfItems > 0 ||
            nbrOfComments > 0 ||
            filteredAnnotations.annotations.length > 0 ||
            estimate > 0) && (
            <div className="flex flex-wrap gap-1">
              <CardFlag shouldRender={nbrOfItems > 0} text={`${nbrOfItems}`} />
              <CardFlag
                shouldRender={nbrOfComments > 0}
                tooltip={`${nbrOfComments} comments`}
                icon="chat_bubble_outline"
                text={nbrOfComments}
              />
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
          )}
        </Link>
      </div>
      {bottomAction && (
        <div className="flex h-6 w-40 shrink-0 justify-center">
          <div className="flex text-xl font-bold">{bottomAction}</div>
        </div>
      )}
    </div>
  );
};
