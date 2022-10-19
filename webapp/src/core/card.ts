import { IMilestone } from "../store/milestones/types";
import { ISubWorkflow } from "../store/subworkflows/types";
import { IFeature } from "../store/features/types";
import { IWorkflow } from "../store/workflows/types";
import { IProject } from "../store/projects/types";
import { Color } from "./misc";

export type ICard = {
  workspaceId: string;
  id: string;
  title: string;
  description: string;
  rank: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  lastModified: string;
  lastModifiedByName: string;
  color: Color;
  annotations: string;
};

export type EntityTypes =
  | IMilestone
  | ISubWorkflow
  | IFeature
  | IWorkflow
  | IProject;
