import { createContext, useContext } from "react";
import { Project } from "../store/projects/types";

const projectsContext = createContext<{
  projects: Array<Project>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}>({ projects: [], setProjects: () => [] });

export const ProjectsDataProvider = projectsContext.Provider;

export const useProjectsData = () => {
  return useContext(projectsContext);
};
