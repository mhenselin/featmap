import { action } from "typesafe-actions";
import { Project } from "./types";

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
