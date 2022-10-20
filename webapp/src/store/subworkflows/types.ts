import { ICard } from "../../core/card";
import { CardStatus } from "../../core/misc";

export type ISubWorkflow = {
  kind: "subworkflow";
  workflowId: string;
  status: CardStatus;
} & ICard;
