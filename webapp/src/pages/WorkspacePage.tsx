import { useEffect, useState } from "react";
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

export const WorkspacePage = () => {
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
        console.log(error);
        if (process.env.NODE_ENV === "production") {
          setApiErrorMessage(error.toString());
        } else {
          setProjectsData([
            {
              kind: "project",
              workspaceId: "123-uuid-123",
              id: "111-uuid-222",
              title: "My awesome project title",
              description: "Lorem, ipsum dolor sit aipsam voluptatum id quis?",
              createdAt: new Date("2022-10-27").toString(),
              createdBy: "333-uuid-333",
              createdByName: "Creators Name",
              lastModified: new Date(new Date().getTime() - 3600000).toString(),
              lastModifiedByName: "Editors Name",
              externalLink: "link_ok",
              annotations: "whatever",
            },
          ]);
        }
        setLoadingState(false);
      });
  }, [currentWorkspace?.id]);

  if (isLoading) {
    return (
      <OneColumnLayout>
        <Loading />
      </OneColumnLayout>
    );
  }

  return (
    <WorkspaceNameProvider value={params.workspaceName}>
      <ProjectsDataProvider value={projectsData}>
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
