import { createContext, useContext } from "react";
import { Application } from "../store/application/types";

const applicationContext = createContext<Application>({
  memberships: [],
  messages: [],
  subscriptions: [],
  workspaces: [],
});

export const ApplicationDataProvider = applicationContext.Provider;

export const useApplicationData = () => {
  return useContext(applicationContext);
};
