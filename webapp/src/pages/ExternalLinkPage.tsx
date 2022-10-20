import queryString from "query-string";
import { Component } from "react";
import { connect } from "react-redux";
import type { RouteComponentProps } from "react-router";
import { Link, Route, Switch } from "react-router-dom";
import { API_GET_EXTERNAL_LINK, API_GET_PROJECT_RESP } from "../api";
import Board from "../components/Board";
import { Button } from "../components/elements";
import { AppState } from "../store";
import { IApplication } from "../store/application/types";
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
import { loadProjectsAction } from "../store/projects/actions";
import { getProjectById, projects } from "../store/projects/selectors";
import { IProject } from "../store/projects/types";
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
  loadProjects: loadProjectsAction,
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
  projects: projects(state),
  milestones: milestones(state),
  workflows: workflows(state),
  subWorkflows: subWorkflows(state),
  personas: personas(state),
  workflowPersonas: workflowPersonas(state),
});

type PropsFromState = {
  application: IApplication;
  features: IFeature[];
  featureComments: IFeatureComment[];
  projects: IProject[];
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
  loadProjects: typeof loadProjectsAction;
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
  demo: boolean;
  showPersonas: boolean;
};

class ExternalLinkPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      projectId: undefined,
      showClosedMilestones: false,
      demo: false,
      showPersonas: false,
    };
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    const demo = values.demo as string;
    if (demo === "1") this.setState({ demo: true });

    API_GET_EXTERNAL_LINK(this.props.match.params.key).then((response) => {
      if (!response.ok) {
        this.setState({ loading: false });
      } else {
        response.json().then((data: API_GET_PROJECT_RESP) => {
          this.props.loadProjects([data.project]);
          this.props.loadFeatures(data.features);
          this.props.loadFeatureComments(data.featureComments);
          this.props.loadMilestones(data.milestones);
          this.props.loadWorkflows(data.workflows);
          this.props.loadSubWorkflows(data.subWorkflows);
          this.props.loadPersonas(data.personas);
          this.props.loadWorkflowPersonas(data.workflowPersonas);

          this.setState({ projectId: data.project.id });
          this.setState({ loading: false });
        });
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <div className="p-2">Loading data...</div>;
    } else if (this.state.projectId) {
      const project = getProjectById(
        this.props.projects,
        this.state.projectId
      )!;

      return (
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
                  <span className="font-semibold">{project.title} </span>
                </div>
                <div className="ml-2 flex">
                  <span className="bg-gray-200 p-1 text-xs font-semibold ">
                    {" "}
                    VIEW ONLY{" "}
                  </span>
                </div>
                {this.state.demo && (
                  <div className="ml-2 flex">
                    <span className="bg-pink-400 p-1 text-xs font-semibold text-white ">
                      {" "}
                      DEMO MODE{" "}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <div className=" flex items-center  text-sm">
                  <div>
                    <Button
                      title="Personas"
                      icon="person_outline"
                      noborder
                      handleOnClick={() =>
                        this.setState({ showPersonas: true })
                      }
                    />
                  </div>
                  <div>
                    {this.state.showClosedMilestones ? (
                      <Button
                        noborder
                        iconColor="text-green-500"
                        icon="toggle_on"
                        title="Show closed"
                        handleOnClick={() =>
                          this.setState({ showClosedMilestones: false })
                        }
                      />
                    ) : (
                      <Button
                        noborder
                        icon="toggle_off "
                        title="Show closed"
                        handleOnClick={() =>
                          this.setState({ showClosedMilestones: true })
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <Link
                    to={this.props.match.url + "/p/" + this.state.projectId}
                  >
                    <i className="material-icons text-gray-600">settings</i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <Board
                showClosed={this.state.showClosedMilestones}
                viewOnly={true}
                url={this.props.match.url}
                features={this.props.features}
                workflows={filterWorkflowsOnProject(
                  this.props.workflows,
                  project.id
                )}
                subWorkflows={this.props.subWorkflows}
                milestones={filterMilestonesOnProject(
                  this.props.milestones,
                  project.id
                )}
                projectId={project.id}
                workspaceId={project.workspaceId}
                demo={this.state.demo}
                comments={filterFeatureCommentsOnProject(
                  this.props.featureComments,
                  project.id
                )}
                personas={filterPersonasOnProject(
                  this.props.personas,
                  project.id
                )}
                workflowPersonas={filterWorkflowPersonasOnProject(
                  this.props.workflowPersonas,
                  project.id
                )}
                showPersonas={this.state.showPersonas}
                closePersonas={() => this.setState({ showPersonas: false })}
                openPersonas={() => this.setState({ showPersonas: true })}
              />
            </div>
          </div>

          <Switch>
            <Route exact path="/" component={() => null} />
            <Route
              exact
              path={this.props.match.path + "/m/:milestoneId"}
              render={(props: any) => (
                <ExternalEntityDetailsPage {...props} demo={this.state.demo} />
              )}
            />
            <Route
              exact
              path={this.props.match.path + "/sw/:subWorkflowId"}
              render={(props: any) => (
                <ExternalEntityDetailsPage {...props} demo={this.state.demo} />
              )}
            />
            <Route
              exact
              path={this.props.match.path + "/f/:featureId"}
              render={(props: any) => (
                <ExternalEntityDetailsPage {...props} demo={this.state.demo} />
              )}
            />
            <Route
              exact
              path={this.props.match.path + "/w/:workflowId"}
              render={(props: any) => (
                <ExternalEntityDetailsPage {...props} demo={this.state.demo} />
              )}
            />
            <Route
              exact
              path={this.props.match.path + "/p/:projectId2"}
              render={(props: any) => (
                <ExternalEntityDetailsPage {...props} demo={this.state.demo} />
              )}
            />
          </Switch>
        </div>
      );
    } else {
      return <div className="p-2">Project not found. </div>;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExternalLinkPage);
