import { IProject } from "./types";
import { action } from "typesafe-actions";
import { v4 as uuid } from "uuid";
import { Dispatch } from "react";
import { API_GET_PROJECTS, API_CREATE_PROJECT } from "../../api";
import { AllActions } from "..";

export enum ProjectsActions {
  CREATE_PROJECT = "CREATE_PROJECT",
  LOAD_PROJECTS = "LOAD_PROJECTS",
  UPDATE_PROJECT = "UPDATE_PROJECT",
  DELETE_PROJECT = "DELETE_PROJECT",
}

export type createProject = {
  type: ProjectsActions.CREATE_PROJECT;
  payload: IProject;
};
export const createProjectAction = (p: IProject) =>
  action(ProjectsActions.CREATE_PROJECT, p);

export type loadProjects = {
  type: ProjectsActions.LOAD_PROJECTS;
  payload: IProject[];
};
export const loadProjectsAction = (pp: IProject[]) =>
  action(ProjectsActions.LOAD_PROJECTS, pp);

export type updateProject = {
  type: ProjectsActions.UPDATE_PROJECT;
  payload: IProject;
};
export const updateProjectAction = (p: IProject) =>
  action(ProjectsActions.UPDATE_PROJECT, p);

export type deleteProject = {
  type: ProjectsActions.DELETE_PROJECT;
  payload: string;
};
export const deleteProjectAction = (id: string) =>
  action(ProjectsActions.DELETE_PROJECT, id);

export type Actions =
  | loadProjects
  | createProject
  | updateProject
  | deleteProject;

export const loadProjectsRequest = (dispatch: Dispatch<AllActions>) => {
  return (workspaceId: string) => {
    return API_GET_PROJECTS(workspaceId).then((response) => {
      if (response.ok) {
        response.json().then((data: IProject[]) => {
          dispatch(loadProjectsAction(data));
        });
      }
    });
  };
};

export const createProjectRequest = (dispatch: Dispatch<AllActions>) => {
  return (workspaceId: string, title: string) => {
    const projectId = uuid();

    return API_CREATE_PROJECT(workspaceId, projectId, title).then(
      (response) => {
        if (response.ok) {
          response.json().then((data: IProject) => {
            dispatch(createProjectAction(data));
          });
        }
      }
    );
  };
};
