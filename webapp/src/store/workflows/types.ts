import { CardStatus } from "../../components/Card";
import { ICard } from "../../core/card";

export type IWorkflow = {
  kind: "workflow";
  projectId: string;
  status: CardStatus;
} & ICard;
