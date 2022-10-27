import { createContext, useContext } from "react";

const workspaceContext = createContext<string>("");

export const WorkspaceNameProvider = workspaceContext.Provider;

export const useWorkspaceName = () => {
  return useContext(workspaceContext);
};
