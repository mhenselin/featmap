import { ISubWorkflow } from "./types";
import { action } from "typesafe-actions";

export enum ActionTypes {
  CREATE_SUBWORKFLOW = "CREATE_SUBWORKFLOW",
  LOAD_SUBWORKFLOWS = "LOAD_SUBWORKFLOWS",
  UPDATE_SUBWORKFLOW = "UPDATE_SUBWORKFLOW",
  DELETE_SUBWORKFLOW = "DELETE_SUBWORKFLOW",
  MOVE_SUBWORKFLOW = "MOVE_SUBWORKFLOW",
}

export type createSubWorkflow = {
  type: ActionTypes.CREATE_SUBWORKFLOW;
  payload: ISubWorkflow;
};
export const createSubWorkflowAction = (x: ISubWorkflow) =>
  action(ActionTypes.CREATE_SUBWORKFLOW, x);

export type loadSubWorkflows = {
  type: ActionTypes.LOAD_SUBWORKFLOWS;
  payload: ISubWorkflow[];
};
export const loadSubWorkflowsAction = (x: ISubWorkflow[]) =>
  action(ActionTypes.LOAD_SUBWORKFLOWS, x);

export type updateSubWorkflow = {
  type: ActionTypes.UPDATE_SUBWORKFLOW;
  payload: ISubWorkflow;
};
export const updateSubWorkflowAction = (x: ISubWorkflow) =>
  action(ActionTypes.UPDATE_SUBWORKFLOW, x);

export type deleteSubWorkflow = {
  type: ActionTypes.DELETE_SUBWORKFLOW;
  payload: string;
};
export const deleteSubWorkflowAction = (x: string) =>
  action(ActionTypes.DELETE_SUBWORKFLOW, x);

type moveSubWorkflowPayload = {
  id: string;
  toWorkflowId: string;
  index: number;
  ts: string;
  by: string;
};
export type moveSubWorkflow = {
  type: ActionTypes.MOVE_SUBWORKFLOW;
  payload: moveSubWorkflowPayload;
};
export const moveSubWorkflowAction = (x: moveSubWorkflowPayload) =>
  action(ActionTypes.MOVE_SUBWORKFLOW, x);

export type Actions =
  | createSubWorkflow
  | loadSubWorkflows
  | updateSubWorkflow
  | deleteSubWorkflow
  | moveSubWorkflow;
