import { CardStatus } from "../../components/Card";
import { ICard } from "../../core/card";

export type IMilestone = {
  kind: "milestone";
  projectId: string;
  status: CardStatus;
} & ICard;
