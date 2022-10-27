import { createContext, useContext } from "react";
import { Project } from "../store/projects/types";

const projectsContext = createContext<Array<Project>>([]);

export const ProjectsDataProvider = projectsContext.Provider;

export const useProjectsData = () => {
  return useContext(projectsContext);
};
