import { Project } from "./types";
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
  payload: Project;
};
export const createProjectAction = (p: Project) =>
  action(ProjectsActions.CREATE_PROJECT, p);

export type loadProjects = {
  type: ProjectsActions.LOAD_PROJECTS;
  payload: Project[];
};
export const loadProjectsAction = (pp: Project[]) =>
  action(ProjectsActions.LOAD_PROJECTS, pp);

export type updateProject = {
  type: ProjectsActions.UPDATE_PROJECT;
  payload: Project;
};
export const updateProjectAction = (p: Project) =>
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
        response.json().then((data: Project[]) => {
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
          response.json().then((data: Project) => {
            dispatch(createProjectAction(data));
          });
        }
      }
    );
  };
};
