import { ICard } from "../../core/card";
import { CardStatus } from "../../core/misc";

export type IFeature = {
  kind: "feature";
  milestoneId: string;
  subWorkflowId: string;
  status: CardStatus;
  estimate: number;
} & ICard;
