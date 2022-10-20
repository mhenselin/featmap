import { CardStatus } from "../../components/Card";
import { ICard } from "../../core/card";

export type IFeature = {
  kind: "feature";
  milestoneId: string;
  subWorkflowId: string;
  status: CardStatus;
  estimate: number;
} & ICard;
