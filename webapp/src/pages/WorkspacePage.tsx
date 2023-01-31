import React, { useEffect, useMemo, useState } from "react";
import { useRouteMatch } from "react-router";
import { Route, Switch } from "react-router-dom";
import { API_GET_PROJECTS } from "../api";
import { useApplicationData } from "../components/ApplicationContext";
import { Error } from "../components/Error";
import { Loading } from "../components/Loading";
import { OneColumnLayout } from "../components/OneColumnLayout";
import { ProjectsDataProvider } from "../components/ProjectsContext";
import { WorkspaceNameProvider } from "../components/WorkspaceContext";
import { getWorkspaceByName } from "../store/application/selectors";
import { Project } from "../store/projects/types";
import NotFound from "./NotFound";
import ProjectPage from "./ProjectPage";
import { Projects } from "./Projects";
import WorkspaceSettingsPage from "./WorkspaceSettingsPage";

export const WorkspacePage: React.FunctionComponent = () => {
  const [isLoading, setLoadingState] = useState(true);
  const [projectsData, setProjectsData] = useState<Array<Project>>([]);
  const { params } = useRouteMatch<{ workspaceName: string }>();
  const applicationData = useApplicationData();
  const [apiErrorMessage, setApiErrorMessage] = useState<null | string>(null);
  const currentWorkspace = getWorkspaceByName(
    applicationData,
    params.workspaceName
  );

  useEffect(() => {
    if (!currentWorkspace?.id) {
      // todo error handling
      return;
    }

    API_GET_PROJECTS(currentWorkspace.id)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data) => {
              setProjectsData(data);
              setLoadingState(false);
            })
            .catch((error) => {
              setApiErrorMessage(error.toString());
            });
        }
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          const data = [
            {
              kind: "project" as const,
              workspaceId: "workspaceid",
              id: "projectid",
              title: "My awesome project title",
              description: "Lorem, ipsum dolor sit aipsam voluptatum id quis?",
              createdAt: new Date("2022-10-27").toString(),
              createdBy: "333-uuid-333",
              createdByName: "Creators Name",
              lastModified: new Date(
                new Date().getTime() - 3_600_000
              ).toString(),
              lastModifiedByName: "Editors Name",
              externalLink: "link_ok",
              annotations: "whatever",
            },
          ];
          console.log("reset");
          setProjectsData(() => data);
        } else {
          setApiErrorMessage(error.toString());
        }
        setLoadingState(false);
      });
  }, [currentWorkspace?.id]);

  const projectsProviderValue = useMemo(() => {
    return {
      projects: projectsData,
      setProjects: setProjectsData,
    };
  }, [projectsData]);

  if (isLoading) {
    return (
      <OneColumnLayout>
        <Loading label="available projects" />
      </OneColumnLayout>
    );
  }

  return (
    <WorkspaceNameProvider value={params.workspaceName}>
      <ProjectsDataProvider value={projectsProviderValue}>
        <OneColumnLayout workspaceName={params.workspaceName}>
          {apiErrorMessage && (
            <div className="mb-4">
              <Error message={apiErrorMessage} />
            </div>
          )}
          <Switch>
            <Route
              exact
              strict
              path={`/${params.workspaceName}`}
              component={Projects}
            />
            <Route
              exact
              strict
              path={`/${params.workspaceName}/settings`}
              component={WorkspaceSettingsPage}
            />
            <Route
              strict
              path={`/${params.workspaceName}/projects/:projectId`}
              component={ProjectPage}
            />
            <Route component={NotFound} />
          </Switch>
        </OneColumnLayout>
      </ProjectsDataProvider>
    </WorkspaceNameProvider>
  );
};
