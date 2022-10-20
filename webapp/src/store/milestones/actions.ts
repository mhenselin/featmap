import { IMilestone } from "./types";
import { action } from "typesafe-actions";

export enum ActionTypes {
  CREATE_MILESTONE = "CREATE_MILESTONE",
  LOAD_MILESTONES = "LOAD_MILESTONE",
  UPDATE_MILESTONE = "UPDATE_MILESTONE",
  DELETE_MILESTONE = "DELETE_MILESTONE",
  MOVE_MILESTONE = "MOVE_MILESTONE",
}

export type createMilestone = {
  type: ActionTypes.CREATE_MILESTONE;
  payload: IMilestone;
};
export const createMilestoneAction = (x: IMilestone) =>
  action(ActionTypes.CREATE_MILESTONE, x);

export type loadMilestones = {
  type: ActionTypes.LOAD_MILESTONES;
  payload: IMilestone[];
};
export const loadMilestonesAction = (x: IMilestone[]) =>
  action(ActionTypes.LOAD_MILESTONES, x);

export type updateMilestone = {
  type: ActionTypes.UPDATE_MILESTONE;
  payload: IMilestone;
};
export const updateMilestoneAction = (x: IMilestone) =>
  action(ActionTypes.UPDATE_MILESTONE, x);

export type deleteMilestone = {
  type: ActionTypes.DELETE_MILESTONE;
  payload: string;
};
export const deleteMilestoneAction = (x: string) =>
  action(ActionTypes.DELETE_MILESTONE, x);

type moveMilestonePayload = {
  id: string;
  index: number;
  ts: string;
  by: string;
};
export type moveMilestone = {
  type: ActionTypes.MOVE_MILESTONE;
  payload: moveMilestonePayload;
};
export const moveMilestoneAction = (x: moveMilestonePayload) =>
  action(ActionTypes.MOVE_MILESTONE, x);

export type Actions =
  | createMilestone
  | loadMilestones
  | updateMilestone
  | deleteMilestone
  | moveMilestone;
