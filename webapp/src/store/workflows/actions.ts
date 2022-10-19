import { IWorkflow } from "./types";
import { action } from "typesafe-actions";

export enum ActionTypes {
  CREATE_WORKFLOW = "CREATE_WORKFLOW",
  LOAD_WORKFLOWS = "LOAD_WORKFLOWS",
  UPDATE_WORKFLOW = "UPDATE_WORKFLOW",
  DELETE_WORKFLOW = "DELETE_WORKFLOW",
  MOVE_WORKFLOW = "MOVE_WORKFLOW",
}

export type createWorkflow = {
  type: ActionTypes.CREATE_WORKFLOW;
  payload: IWorkflow;
};
export const createWorkflowAction = (x: IWorkflow) =>
  action(ActionTypes.CREATE_WORKFLOW, x);

export type loadWorkflows = {
  type: ActionTypes.LOAD_WORKFLOWS;
  payload: IWorkflow[];
};
export const loadWorkflowsAction = (x: IWorkflow[]) =>
  action(ActionTypes.LOAD_WORKFLOWS, x);

export type updateWorkflow = {
  type: ActionTypes.UPDATE_WORKFLOW;
  payload: IWorkflow;
};
export const updateWorkflowAction = (x: IWorkflow) =>
  action(ActionTypes.UPDATE_WORKFLOW, x);

export type deleteWorkflow = {
  type: ActionTypes.DELETE_WORKFLOW;
  payload: string;
};
export const deleteWorkflowAction = (x: string) =>
  action(ActionTypes.DELETE_WORKFLOW, x);

type moveWorkflowPayload = {
  id: string;
  index: number;
  ts: string;
  by: string;
};
export type moveWorkflow = {
  type: ActionTypes.MOVE_WORKFLOW;
  payload: moveWorkflowPayload;
};
export const moveWorkflowAction = (x: moveWorkflowPayload) =>
  action(ActionTypes.MOVE_WORKFLOW, x);

export type Actions =
  | createWorkflow
  | loadWorkflows
  | updateWorkflow
  | deleteWorkflow
  | moveWorkflow;
