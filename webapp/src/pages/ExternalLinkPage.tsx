import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import type { RouteComponentProps } from "react-router";
import { Link, Route, Switch } from "react-router-dom";
import { API_GET_EXTERNAL_LINK, API_GET_PROJECT_RESP } from "../api";
import Board from "../components/Board";
import { Button } from "../components/elements";
import { ProjectsDataProvider } from "../components/ProjectsContext";
import { AppState } from "../store";
import { Application } from "../store/application/types";
import { loadFeatureCommentsAction } from "../store/featurecomments/actions";
import {
  featureComments,
  filterFeatureCommentsOnProject,
} from "../store/featurecomments/selectors";
import { IFeatureComment } from "../store/featurecomments/types";
import { loadFeaturesAction } from "../store/features/actions";
import { features } from "../store/features/selectors";
import { IFeature } from "../store/features/types";
import { loadMilestonesAction } from "../store/milestones/actions";
import {
  filterMilestonesOnProject,
  milestones,
} from "../store/milestones/selectors";
import { IMilestone } from "../store/milestones/types";
import { loadPersonasAction } from "../store/personas/actions";
import { filterPersonasOnProject, personas } from "../store/personas/selectors";
import { IPersona } from "../store/personas/types";
import { Project } from "../store/projects/types";
import { loadSubWorkflowsAction } from "../store/subworkflows/actions";
import { subWorkflows } from "../store/subworkflows/selectors";
import { ISubWorkflow } from "../store/subworkflows/types";
import { loadWorkflowPersonasAction } from "../store/workflowpersonas/actions";
import {
  filterWorkflowPersonasOnProject,
  workflowPersonas,
} from "../store/workflowpersonas/selectors";
import { IWorkflowPersona } from "../store/workflowpersonas/types";
import { loadWorkflowsAction } from "../store/workflows/actions";
import {
  filterWorkflowsOnProject,
  workflows,
} from "../store/workflows/selectors";
import { IWorkflow } from "../store/workflows/types";
import ExternalEntityDetailsPage from "./ExternalEntityDetailsPage";

const mapDispatchToProps = {
  loadMilestones: loadMilestonesAction,
  loadWorkflows: loadWorkflowsAction,
  loadSubWorkflows: loadSubWorkflowsAction,
  loadFeatures: loadFeaturesAction,
  loadFeatureComments: loadFeatureCommentsAction,
  loadPersonas: loadPersonasAction,
  loadWorkflowPersonas: loadWorkflowPersonasAction,
};

const mapStateToProps = (state: AppState) => ({
  application: state.application.application,
  features: features(state),
  featureComments: featureComments(state),
  milestones: milestones(state),
  workflows: workflows(state),
  subWorkflows: subWorkflows(state),
  personas: personas(state),
  workflowPersonas: workflowPersonas(state),
});

type PropsFromState = {
  application: Application;
  features: IFeature[];
  featureComments: IFeatureComment[];
  milestones: IMilestone[];
  workflows: IWorkflow[];
  subWorkflows: ISubWorkflow[];
  personas: IPersona[];
  workflowPersonas: IWorkflowPersona[];
};
type RouterProps = RouteComponentProps<{
  key: string;
}>;
type PropsFromDispatch = {
  loadMilestones: typeof loadMilestonesAction;
  loadWorkflows: typeof loadWorkflowsAction;
  loadSubWorkflows: typeof loadSubWorkflowsAction;
  loadFeatures: typeof loadFeaturesAction;
  loadFeatureComments: typeof loadFeatureCommentsAction;
  loadPersonas: typeof loadPersonasAction;
  loadWorkflowPersonas: typeof loadWorkflowPersonasAction;
};
type SelfProps = Record<string, never>;
type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  loading: boolean;
  projectId?: string;
  showClosedMilestones: boolean;
  showPersonas: boolean;
};

const ExternalLinkPage: React.FunctionComponent<Readonly<Props>> = (props) => {
  const [projectsData, setProjectsData] = useState<Array<Project>>([]);
  const [state, setState] = useState<State>({
    loading: true,
    projectId: undefined,
    showClosedMilestones: false,
    showPersonas: false,
  });

  useEffect(() => {
    API_GET_EXTERNAL_LINK(props.match.params.key).then((response) => {
      if (!response.ok) {
        setState((prevState) => ({ ...prevState, loading: false }));
      } else {
        response.json().then((data: API_GET_PROJECT_RESP) => {
          setProjectsData([data.project]);
          props.loadFeatures(data.features);
          props.loadFeatureComments(data.featureComments);
          props.loadMilestones(data.milestones);
          props.loadWorkflows(data.workflows);
          props.loadSubWorkflows(data.subWorkflows);
          props.loadPersonas(data.personas);
          props.loadWorkflowPersonas(data.workflowPersonas);

          setState((prevState) => ({
            ...prevState,
            loading: false,
            projectId: data.project?.id,
          }));
        });
      }
    });
  }, []);

  const projectsProviderValue = useMemo(() => {
    return {
      projects: projectsData,
      setProjects: setProjectsData,
    };
  }, [projectsData]);

  if (state.loading) {
    return <div className="p-2">Loading data...</div>;
  } else if (state.projectId) {
    const project: Project | undefined = projectsData.find(
      (project) => project.id === state.projectId
    );

    return (
      <ProjectsDataProvider value={projectsProviderValue}>
        <div>
          <header className="text-black">
            <div className="flex items-center bg-gray-200 p-1">
              <div className="m-1 my-2 flex w-24   text-lg">
                <b>
                  <Link to="/">Featmap</Link>
                </b>
              </div>
            </div>
          </header>
          <div className="">
            <div className="flex flex-row p-2 ">
              <div className="m-1 flex grow items-center text-xl">
                <div className="flex">
                  <span className="font-semibold">{project?.title} </span>
                </div>
                <div className="ml-2 flex">
                  <span className="bg-gray-200 p-1 text-xs font-semibold ">
                    {" "}
                    VIEW ONLY{" "}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <div className=" flex items-center  text-sm">
                  <div>
                    <Button
                      title="Personas"
                      icon="person_outline"
                      noborder
                      handleOnClick={() =>
                        setState((prevState) => ({
                          ...prevState,
                          showPersonas: true,
                        }))
                      }
                    />
                  </div>
                  <div>
                    {state.showClosedMilestones ? (
                      <Button
                        noborder
                        iconColor="text-green-500"
                        icon="toggle_on"
                        title="Show closed"
                        handleOnClick={() =>
                          setState((prevState) => ({
                            ...prevState,
                            showClosedMilestones: false,
                          }))
                        }
                      />
                    ) : (
                      <Button
                        noborder
                        icon="toggle_off "
                        title="Show closed"
                        handleOnClick={() =>
                          setState((prevState) => ({
                            ...prevState,
                            showClosedMilestones: true,
                          }))
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <Link to={props.match.url + "/p/" + state.projectId}>
                    <i className="material-icons text-gray-600">settings</i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <Board
                showClosed={state.showClosedMilestones}
                viewOnly={true}
                url={props.match.url}
                features={props.features}
                workflows={filterWorkflowsOnProject(
                  props.workflows,
                  project?.id
                )}
                subWorkflows={props.subWorkflows}
                milestones={filterMilestonesOnProject(
                  props.milestones,
                  project?.id
                )}
                projectId={project?.id}
                workspaceId={project?.workspaceId}
                comments={filterFeatureCommentsOnProject(
                  props.featureComments,
                  project?.id
                )}
                personas={filterPersonasOnProject(props.personas, project?.id)}
                workflowPersonas={filterWorkflowPersonasOnProject(
                  props.workflowPersonas,
                  project?.id
                )}
                showPersonas={state.showPersonas}
                closePersonas={() =>
                  setState((prevState) => ({
                    ...prevState,
                    showPersonas: false,
                  }))
                }
                openPersonas={() =>
                  setState((prevState) => ({
                    ...prevState,
                    showPersonas: true,
                  }))
                }
              />
            </div>
          </div>

          <Switch>
            <Route exact path="/" component={() => null} />
            <Route
              exact
              path={props.match.path + "/m/:milestoneId"}
              component={ExternalEntityDetailsPage}
            />
            <Route
              exact
              path={props.match.path + "/sw/:subWorkflowId"}
              component={ExternalEntityDetailsPage}
            />
            <Route
              exact
              path={props.match.path + "/f/:featureId"}
              component={ExternalEntityDetailsPage}
            />
            <Route
              exact
              path={props.match.path + "/w/:workflowId"}
              component={ExternalEntityDetailsPage}
            />
            <Route
              exact
              path={props.match.path + "/p/:projectId2"}
              component={ExternalEntityDetailsPage}
            />
          </Switch>
        </div>
      </ProjectsDataProvider>
    );
  } else {
    return <div className="p-2">Project not found. </div>;
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ExternalLinkPage);
