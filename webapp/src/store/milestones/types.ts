import { ICard } from "../../core/card";
import { CardStatus } from "../../core/misc";

export type IMilestone = {
  kind: "milestone";
  projectId: string;
  status: CardStatus;
} & ICard;
