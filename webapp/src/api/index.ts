import {
  IWorkspace,
  IMembership,
  IAccount,
  ISubscription,
} from "../store/application/types";
import { IProject } from "../store/projects/types";
import { IMilestone } from "../store/milestones/types";
import { IWorkflow } from "../store/workflows/types";
import { ISubWorkflow } from "../store/subworkflows/types";
import { IFeature } from "../store/features/types";
import { Color } from "../core/misc";
import { IFeatureComment } from "../store/featurecomments/types";
import { IPersona } from "../store/personas/types";
import { IWorkflowPersona } from "../store/workflowpersonas/types";
import type { MessageEntity } from "../components/Message";

const endpoint = process.env.REACT_APP_API_ENDPOINT
  ? process.env.REACT_APP_API_ENDPOINT
  : "/v1";

export const API_CHANGE_GENERAL_INFORMATION = async (
  workspaceId: string,
  euVat: string,
  externalBillingEmail: string
) => {
  return await fetch(endpoint + "/settings/general-info", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ euVat, externalBillingEmail }),
  });
};

export type API_SIGN_UP_REQ = {
  workspaceName: string;
  name: string;
  email: string;
  password: string;
};

export const API_CHANGE_ALLOW_EXTERNAL_SHARING = async (
  workspaceId: string,
  value: boolean
) => {
  return await fetch(endpoint + "/settings/allow-external-sharing", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ value }),
  });
};

export const API_GET_EXTERNAL_LINK = async (code: string) => {
  return await fetch(endpoint + "/link/" + code, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const API_ACCEPT_INVITE = async (code: string) => {
  return await fetch(endpoint + "/users/invite/" + code, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

export const API_GET_INVITE = async (code: string) => {
  return await fetch(endpoint + "/users/invite/" + code, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

export const API_SIGN_UP = async (data: API_SIGN_UP_REQ) => {
  return await fetch(endpoint + "/users/signup", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
};

export type API_LOG_IN_REQ = {
  email: string;
  password: string;
};

export const API_LOG_IN = async (data: API_LOG_IN_REQ) => {
  return await fetch(endpoint + "/users/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
};

export type API_CHANGE_EMAIL_REQ = {
  email: string;
};

export const API_CHANGE_EMAIL = async (data: API_CHANGE_EMAIL_REQ) => {
  return await fetch(endpoint + "/account/emailupdate/" + data.email, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

export type API_CHANGE_NAME_REQ = {
  name: string;
};

export const API_CHANGE_NAME = async (data: API_CHANGE_NAME_REQ) => {
  return await fetch(endpoint + "/account/nameupdate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
};

export const API_DELETE_ACCOUNT = async () => {
  return await fetch(endpoint + "/account/delete", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

export const API_LOG_OUT = async () => {
  return await fetch(endpoint + "/users/logout", {
    method: "POST",
    credentials: "include",
  });
};

export const API_CREATE_WORKSPACE = async (name: string) => {
  return await fetch(endpoint + "/account/workspaces", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  });
};

export const API_DELETE_WORKSPACE = async (id: string) => {
  return await fetch(endpoint + "/delete", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: id,
    },
    credentials: "include",
  });
};

export type API_FETCH_APP_RESP = {
  mode: string;
  workspaces: IWorkspace[];
  memberships: IMembership[];
  account: IAccount;
  messages: Array<MessageEntity>;
  subscriptions: ISubscription[];
};

export const API_FETCH_APP = async () => {
  return await fetch(endpoint + "/account/app", {
    method: "GET",
    credentials: "include",
  });
};

export const API_VERIFY_EMAIL = async (key: string) => {
  return await fetch(endpoint + "/users/verify/" + key, {
    method: "POST",
    credentials: "include",
  });
};

export const API_RESEND_EMAIL = async () => {
  return await fetch(endpoint + "/account/resend", {
    method: "POST",
    credentials: "include",
  });
};

export const API_PASSWORD_RESET = async (email: string) => {
  return await fetch(endpoint + "/users/reset/" + email, {
    method: "POST",
    credentials: "include",
  });
};

export type API_NEW_PASSWORD_REQ = {
  key: string;
  password: string;
};

export const API_SET_PASSWORD = async (data: API_NEW_PASSWORD_REQ) => {
  return await fetch(endpoint + "/users/setpassword", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
};

// MEMBERS MANAGEMENT

export const API_GET_MEMBERS = async (workspaceId: string) => {
  return await fetch(endpoint + "/members", {
    method: "GET",
    headers: {
      Workspace: workspaceId,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

export const API_LEAVE = async (workspaceId: string) => {
  return await fetch(endpoint + "/leave", {
    method: "POST",
    headers: {
      Workspace: workspaceId,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

export const API_UPDATE_MEMBER_LEVEL = async (
  workspaceId: string,
  memberId: string,
  level: string
) => {
  return await fetch(endpoint + "/members/" + memberId + "/level", {
    method: "POST",
    headers: {
      Workspace: workspaceId,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ level }),
  });
};

export const API_DELETE_MEMBER = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/members/" + id, {
    method: "DELETE",
    headers: {
      Workspace: workspaceId,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

// INVITES

export const API_GET_INVITES = async (workspaceId: string) => {
  return await fetch(endpoint + "/invites", {
    method: "GET",
    headers: {
      Workspace: workspaceId,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

export const API_CREATE_INVITE = async (
  workspaceId: string,
  email: string,
  level: string
) => {
  return await fetch(endpoint + "/invites", {
    method: "POST",
    headers: {
      Workspace: workspaceId,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, level }),
  });
};

export const API_DELETE_INVITE = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/invites/" + id, {
    method: "DELETE",
    headers: {
      Workspace: workspaceId,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

export const API_RESEND_INVITE = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/invites/" + id + "/resend", {
    method: "POST",
    headers: {
      Workspace: workspaceId,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

// PROJECTS

export type API_GET_PROJECTS_RESP = {
  projects: IProject[];
};

export const API_GET_PROJECTS = async (workspaceId: string) => {
  return await fetch(endpoint + "/projects", {
    method: "GET",
    headers: {
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export type API_GET_PROJECT_RESP = {
  project: IProject;
  milestones: IMilestone[];
  workflows: IWorkflow[];
  subWorkflows: ISubWorkflow[];
  features: IFeature[];
  featureComments: IFeatureComment[];
  personas: IPersona[];
  workflowPersonas: IWorkflowPersona[];
};

export const API_GET_PROJECT = async (
  workspaceId: string,
  projectId: string
) => {
  return await fetch(endpoint + "/projects/" + projectId, {
    method: "GET",
    headers: {
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_CREATE_PROJECT = async (
  workspaceId: string,
  projectId: string,
  title: string
) => {
  return await fetch(endpoint + "/projects/" + projectId, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ title }),
  });
};

export const API_RENAME_PROJECT = async (
  workspaceId: string,
  projectId: string,
  title: string
) => {
  return await fetch(endpoint + "/projects/" + projectId + "/rename", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ title }),
  });
};

export const API_DELETE_PROJECT = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/projects/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_UPDATE_PROJECT_DESCRIPTION = async (
  workspaceId: string,
  id: string,
  description: string
) => {
  return await fetch(endpoint + "/projects/" + id + "/description", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ description }),
  });
};

// Milestones

export const API_CREATE_MILESTONE = async (
  workspaceId: string,
  projectId: string,
  id: string,
  title: string
) => {
  return await fetch(endpoint + "/milestones/" + id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ projectId, title }),
  });
};

export const API_MOVE_MILESTONE = async (
  workspaceId: string,
  id: string,
  index: number
) => {
  return await fetch(endpoint + "/milestones/" + id + "/move", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ index }),
  });
};

export const API_DELETE_MILESTONE = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/milestones/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_RENAME_MILESTONE = async (
  workspaceId: string,
  id: string,
  title: string
) => {
  return await fetch(endpoint + "/milestones/" + id + "/rename", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ title }),
  });
};

export const API_UPDATE_MILESTONE_DESCRIPTION = async (
  workspaceId: string,
  id: string,
  description: string
) => {
  return await fetch(endpoint + "/milestones/" + id + "/description", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ description }),
  });
};

export const API_OPEN_MILESTONE = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/milestones/" + id + "/open", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_CLOSE_MILESTONE = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/milestones/" + id + "/close", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_CHANGE_MILESTONE_COLOR = async (
  workspaceId: string,
  id: string,
  color: Color
) => {
  return await fetch(endpoint + "/milestones/" + id + "/color", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ color }),
  });
};

export const API_CHANGE_MILESTONE_ANNOTATIONS = async (
  workspaceId: string,
  id: string,
  annotations: string
) => {
  return await fetch(endpoint + "/milestones/" + id + "/annotations", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ annotations }),
  });
};

// FEATURES

export const API_CREATE_FEATURE = async (
  workspaceId: string,
  milestoneId: string,
  subWorkflowId: string,
  id: string,
  title: string
) => {
  return await fetch(endpoint + "/features/" + id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ milestoneId, subWorkflowId, title }),
  });
};

export const API_MOVE_FEATURE = async (
  workspaceId: string,
  id: string,
  toSubWorkflowId: string,
  toMilestoneId: string,
  index: number
) => {
  return await fetch(endpoint + "/features/" + id + "/move", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ toSubWorkflowId, toMilestoneId, index }),
  });
};

export const API_OPEN_FEATURE = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/features/" + id + "/open", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_CLOSE_FEATURE = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/features/" + id + "/close", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_DELETE_FEATURE = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/features/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_RENAME_FEATURE = async (
  workspaceId: string,
  id: string,
  title: string
) => {
  return await fetch(endpoint + "/features/" + id + "/rename", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ title }),
  });
};

export const API_UPDATE_FEATURE_DESCRIPTION = async (
  workspaceId: string,
  id: string,
  description: string
) => {
  return await fetch(endpoint + "/features/" + id + "/description", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ description }),
  });
};

export const API_CHANGE_FEATURE_COLOR = async (
  workspaceId: string,
  id: string,
  color: Color
) => {
  return await fetch(endpoint + "/features/" + id + "/color", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ color }),
  });
};

export const API_CHANGE_FEATURE_ANNOTATIONS = async (
  workspaceId: string,
  id: string,
  annotations: string
) => {
  return await fetch(endpoint + "/features/" + id + "/annotations", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ annotations }),
  });
};

export const API_CHANGE_FEATURE_ESTIMATE = async (
  workspaceId: string,
  id: string,
  estimate: number
) => {
  return await fetch(endpoint + "/features/" + id + "/estimate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ estimate }),
  });
};

// FEATURE COMMENTS

export const API_CREATE_FEATURE_COMMENT = async (
  workspaceId: string,
  featureId: string,
  id: string,
  post: string
) => {
  return await fetch(endpoint + "/featurecomments/" + id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ featureId, post }),
  });
};

export const API_DELETE_FEATURE_COMMENT = async (
  workspaceId: string,
  id: string
) => {
  return await fetch(endpoint + "/featurecomments/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_UPDATE_FEATURE_COMMENT_POST = async (
  workspaceId: string,
  id: string,
  post: string
) => {
  return await fetch(endpoint + "/featurecomments/" + id + "/post", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ description: post }),
  });
};

// WORKFLOWS

export const API_CREATE_WORKFLOW = async (
  workspaceId: string,
  projectId: string,
  id: string,
  title: string
) => {
  return await fetch(endpoint + "/workflows/" + id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ projectId, title }),
  });
};

export const API_MOVE_WORKFLOW = async (
  workspaceId: string,
  id: string,
  index: number
) => {
  return await fetch(endpoint + "/workflows/" + id + "/move", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ index }),
  });
};

export const API_DELETE_WORKFLOW = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/workflows/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_RENAME_WORKFLOW = async (
  workspaceId: string,
  id: string,
  title: string
) => {
  return await fetch(endpoint + "/workflows/" + id + "/rename", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ title }),
  });
};

export const API_UPDATE_WORKFLOW_DESCRIPTION = async (
  workspaceId: string,
  id: string,
  description: string
) => {
  return await fetch(endpoint + "/workflows/" + id + "/description", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ description }),
  });
};

export const API_CHANGE_WORKFLOW_COLOR = async (
  workspaceId: string,
  id: string,
  color: Color
) => {
  return await fetch(endpoint + "/workflows/" + id + "/color", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ color }),
  });
};

export const API_OPEN_WORKFLOW = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/workflows/" + id + "/open", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_CLOSE_WORKFLOW = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/workflows/" + id + "/close", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_CHANGE_WORKFLOW_ANNOTATIONS = async (
  workspaceId: string,
  id: string,
  annotations: string
) => {
  return await fetch(endpoint + "/workflows/" + id + "/annotations", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ annotations }),
  });
};

// SUBWORKFLOWS

export const API_CREATE_SUBWORKFLOW = async (
  workspaceId: string,
  workflowId: string,
  id: string,
  title: string
) => {
  return await fetch(endpoint + "/subworkflows/" + id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ workflowId, title }),
  });
};

export const API_MOVE_SUBWORKFLOW = async (
  workspaceId: string,
  id: string,
  toWorkflowId: string,
  index: number
) => {
  return await fetch(endpoint + "/subworkflows/" + id + "/move", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ toWorkflowId, index }),
  });
};

export const API_DELETE_SUBWORKFLOW = async (
  workspaceId: string,
  id: string
) => {
  return await fetch(endpoint + "/subworkflows/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_RENAME_SUBWORKFLOW = async (
  workspaceId: string,
  id: string,
  title: string
) => {
  return await fetch(endpoint + "/subworkflows/" + id + "/rename", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ title }),
  });
};

export const API_UPDATE_SUBWORKFLOW_DESCRIPTION = async (
  workspaceId: string,
  id: string,
  description: string
) => {
  return await fetch(endpoint + "/subworkflows/" + id + "/description", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ description }),
  });
};

export const API_CHANGE_SUBWORKFLOW_COLOR = async (
  workspaceId: string,
  id: string,
  color: Color
) => {
  return await fetch(endpoint + "/subworkflows/" + id + "/color", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ color }),
  });
};

export const API_OPEN_SUBWORKFLOW = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/subworkflows/" + id + "/open", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_CLOSE_SUBWORKFLOW = async (
  workspaceId: string,
  id: string
) => {
  return await fetch(endpoint + "/subworkflows/" + id + "/close", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_CHANGE_SUBWORKFLOW_ANNOTATIONS = async (
  workspaceId: string,
  id: string,
  annotations: string
) => {
  return await fetch(endpoint + "/subworkflows/" + id + "/annotations", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ annotations }),
  });
};

export type API_CONTACT_INTERFACE = {
  topic: string;
  body: string;
  sender: string;
};
export const API_CONTACT = async (data: API_CONTACT_INTERFACE) => {
  return await fetch(endpoint + "/users/contact", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

// SUBSCRIPTIONS

export const API_GET_CHECKOUT_SESSION = async (
  workspaceId: string,
  plan: string,
  quantity: number
) => {
  return await fetch(endpoint + "/subscription/checkoutsession", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ plan, quantity }),
  });
};

export const API_CHANGE_SUBSCRIPTION = async (
  workspaceId: string,
  plan: string,
  quantity: number
) => {
  return await fetch(endpoint + "/subscription/change", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ plan, quantity }),
  });
};

// WORKFLOW PERSONAS

export const API_DELETE_WORKFLOWPERSONA = async (
  workspaceId: string,
  id: string
) => {
  return await fetch(endpoint + "/workflowpersonas/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_CREATE_WORKFLOWPERSONA = async (
  workspaceId: string,
  id: string,
  workflowId: string,
  personaId: string
) => {
  return await fetch(endpoint + "/workflowpersonas/" + id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ workflowId, personaId }),
  });
};

// PERSONAS

export const API_CREATE_PERSONA = async (
  workspaceId: string,
  projectId: string,
  id: string,
  avatar: string,
  name: string,
  role: string,
  description: string,
  workflowId: string,
  workflowPersonaId: string
) => {
  return await fetch(endpoint + "/personas/" + id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({
      projectId,
      avatar,
      name,
      role,
      description,
      workflowId,
      workflowPersonaId,
    }),
  });
};

export const API_DELTE_PERSONA = async (workspaceId: string, id: string) => {
  return await fetch(endpoint + "/personas/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
  });
};

export const API_UPDATE_PERSONA = async (
  workspaceId: string,
  id: string,
  avatar: string,
  name: string,
  role: string,
  description: string
) => {
  return await fetch(endpoint + "/personas/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Workspace: workspaceId,
    },
    credentials: "include",
    body: JSON.stringify({ avatar, name, role, description }),
  });
};
