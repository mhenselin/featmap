import { Project } from "./types";
import { AppState } from "..";
import { createSelector } from "reselect";

const getProjectsState = (state: AppState) => state.projects;

export const projects = createSelector([getProjectsState], (s) => {
  return sortProjectsByCreateDate(s.items);
});

const sortProjectsByCreateDate = (pp: Project[]): Project[] => {
  return pp.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getProjectById = (pp: Project[], id: string) =>
  pp.find((x) => x.id === id);
