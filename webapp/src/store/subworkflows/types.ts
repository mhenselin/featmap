import { CardStatus } from "../../components/Card";
import { ICard } from "../../core/card";

export type ISubWorkflow = {
  kind: "subworkflow";
  workflowId: string;
  status: CardStatus;
} & ICard;
