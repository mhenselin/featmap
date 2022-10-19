import { ICard } from "../../core/card";
import { CardStatus } from "../../core/misc";

export type IWorkflow = {
  kind: "workflow";
  projectId: string;
  status: CardStatus;
} & ICard;
