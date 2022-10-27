import { AppState } from "..";
import { createSelector } from "reselect";
import { Application } from "./types";

const getApplicationState = (state: AppState) => state.application;

export const application = createSelector([getApplicationState], (s) => {
  return s.application;
});

export const getWorkspaceByName = (s: Application, name: string) =>
  s.workspaces.find((x) => x.name === name);
export const getMembership = (s: Application, workspaceId: string) =>
  s.memberships.find((x) => x.workspaceId === workspaceId)!;
export const getSubscription = (s: Application, workspaceId: string) =>
  s.subscriptions.find((x) => x.workspaceId === workspaceId)!;
export const getAccount = (s: Application) => s.account!;
