import queryString from "query-string";
import { Component, createRef } from "react";
import { connect } from "react-redux";
import type { RouteComponentProps } from "react-router";
import { Link, Route, Switch } from "react-router-dom";
import { API_GET_PROJECT, API_GET_PROJECT_RESP } from "../api";
import Board from "../components/Board";
import ContextMenu from "../components/ContextMenu";
import { Button } from "../components/elements";
import {
  isEditor,
  subIsBasicOrAbove,
  subIsInactive,
  subIsTrial,
} from "../core/misc";
import { AppState } from "../store";
import {
  application,
  getMembership,
  getSubscription,
  getWorkspaceByName,
} from "../store/application/selectors";
import { IApplication } from "../store/application/types";
import { loadFeatureCommentsAction } from "../store/featurecomments/actions";
import {
  featureComments,
  filterFeatureCommentsOnProject,
} from "../store/featurecomments/selectors";
import { IFeatureComment } from "../store/featurecomments/types";
import { loadFeaturesAction } from "../store/features/actions";
import {
  features,
  filterFeaturesOnMilestoneAndSubWorkflow,
} from "../store/features/selectors";
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
import { getProjectById, projects } from "../store/projects/selectors";
import { IProject } from "../store/projects/types";
import { loadSubWorkflowsAction } from "../store/subworkflows/actions";
import {
  getSubWorkflowByWorkflow,
  subWorkflows,
} from "../store/subworkflows/selectors";
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
import EntityDetailsPage from "./EntityDetailsPage";

const mapStateToProps = (state: AppState) => ({
  application: application(state),
  projects: projects(state),
  milestones: milestones(state),
  subWorkflows: subWorkflows(state),
  workflows: workflows(state),
  features: features(state),
  featureComments: featureComments(state),
  personas: personas(state),
  workflowPersonas: workflowPersonas(state),
});

const mapDispatchToProps = {
  loadMilestones: loadMilestonesAction,
  loadWorkflows: loadWorkflowsAction,
  loadSubWorkflows: loadSubWorkflowsAction,
  loadFeatures: loadFeaturesAction,
  loadFeatureComments: loadFeatureCommentsAction,
  loadPersonas: loadPersonasAction,
  loadWorkflowPersonas: loadWorkflowPersonasAction,
};

type PropsFromState = {
  application: IApplication;
  projects: IProject[];
  milestones: IMilestone[];
  subWorkflows: ISubWorkflow[];
  workflows: IWorkflow[];
  features: IFeature[];
  featureComments: IFeatureComment[];
  personas: IPersona[];
  workflowPersonas: IWorkflowPersona[];
};
type RouterProps = RouteComponentProps<{
  workspaceName: string;
  projectId: string;
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
  projectFound: boolean;
  loading: boolean;
  showClosedMilstones: boolean;
  copySuccess: boolean;
  demo: boolean;
  showPersonas: boolean;
};

class ProjectPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      projectFound: false,
      loading: true,
      showClosedMilstones: false,
      copySuccess: false,
      demo: false,
      showPersonas: false,
    };
  }

  componentDidMount() {
    const { projectId, workspaceName } = this.props.match.params;
    const p = getProjectById(this.props.projects, projectId);
    const ws = getWorkspaceByName(this.props.application, workspaceName)!;

    if (p) {
      API_GET_PROJECT(ws.id, p.id).then((response) => {
        if (response.ok) {
          response.json().then((data: API_GET_PROJECT_RESP) => {
            this.props.loadMilestones(data.milestones);
            this.props.loadWorkflows(data.workflows);
            this.props.loadSubWorkflows(data.subWorkflows);
            this.props.loadFeatures(data.features);
            this.props.loadFeatureComments(data.featureComments);
            this.props.loadPersonas(data.personas);
            this.props.loadWorkflowPersonas(data.workflowPersonas);
            this.setState({ loading: false });
          });
        }
      });
    }
    if (p) this.setState({ projectFound: true });
  }

  componentDidUpdate() {
    const { projectId } = this.props.match.params;
    const proj = getProjectById(this.props.projects, projectId)!;

    if (!proj) {
      this.props.history.push("/" + this.props.match.params.workspaceName);
    }

    const values = queryString.parse(this.props.location.search);
    const demo = values.demo as string;
    if (demo === "1") this.setState({ demo: true });
  }

  download = (filename: string, text: string) => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  projectCSV = (): string => {
    let csv = `release_title,goal_title,activity_title,feature_title,feature_description,feature_status,feature_color,feature_annotations,feature_size\n`;

    this.props.milestones.forEach((m) =>
      this.props.workflows.forEach((w) => {
        getSubWorkflowByWorkflow(this.props.subWorkflows, w.id).forEach(
          (sw) => {
            filterFeaturesOnMilestoneAndSubWorkflow(
              this.props.features,
              m.id,
              sw.id
            ).forEach((f) => {
              csv =
                csv +
                `"${m.title.replace(/"/g, '""')}","${w.title.replace(
                  /"/g,
                  '""'
                )}","${sw.title.replace(/"/g, '""')}","${f.title.replace(
                  /"/g,
                  '""'
                )}","${f.description.replace(/"/g, '""')}","${f.status.replace(
                  /"/g,
                  '""'
                )}","${f.color.replace(/"/g, '""')}","${f.annotations.replace(
                  /"/g,
                  '""'
                )}","${f.estimate.toString()}"\n`;
            });
          }
        );
      })
    );
    return csv;
  };

  copyToClipboard = (url: string) => {
    const listener = (e: ClipboardEvent) => {
      e.clipboardData!.setData("text/plain", url);
      e.preventDefault();
    };

    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
    this.setState({ copySuccess: true });
  };

  urlRef = createRef<HTMLInputElement>();

  render() {
    const { projectId, workspaceName } = this.props.match.params;
    const ws = getWorkspaceByName(this.props.application, workspaceName)!;
    const proj = getProjectById(this.props.projects, projectId)!;
    const member = getMembership(this.props.application, ws.id);
    const s = getSubscription(this.props.application, ws.id);

    const viewOnly = !isEditor(member.level) || subIsInactive(s);
    const showPrivateLink =
      !subIsInactive(s) &&
      (subIsTrial(s) || subIsBasicOrAbove(s)) &&
      ws.allowExternalSharing;

    return proj ? (
      this.state.loading ? (
        <div className="p-2">Loading data...</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex flex-row p-2 ">
            <div className="m-1 flex grow items-center text-xl">
              <div className="flex">
                <span className="font-semibold">{proj.title} </span>
              </div>
              <ContextMenu icon="more_horiz">
                <div className="absolute top-0 right-0  mt-8 min-w-full rounded bg-white text-xs shadow-md">
                  <ul className="">
                    <li>
                      <Button
                        noborder
                        title="Export CSV"
                        handleOnClick={() =>
                          this.download("storymap.csv", this.projectCSV())
                        }
                      />
                    </li>
                  </ul>
                </div>
              </ContextMenu>
              {viewOnly && (
                <div className="ml-2 flex">
                  <span className="bg-gray-200 p-1 text-xs font-semibold ">
                    {" "}
                    VIEW ONLY{" "}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <div className=" flex items-center  text-sm">
                {showPrivateLink && (
                  <div>
                    <div className="flex grow items-center">
                      <div className="mr-1 flex grow ">
                        <Link
                          target="_blank"
                          className="link"
                          to={"/link/" + proj.externalLink}
                        >
                          Share link{" "}
                        </Link>
                      </div>
                      <div>
                        {document.queryCommandSupported("copy") && (
                          <button
                            onClick={() =>
                              this.copyToClipboard(
                                process.env.REACT_APP_BASE_URL +
                                  "/link/" +
                                  proj.externalLink
                              )
                            }
                          >
                            <i
                              style={{ fontSize: "16px" }}
                              className="material-icons text-gray-800"
                            >
                              file_copy
                            </i>
                          </button>
                        )}
                      </div>
                      <div>
                        <i
                          style={{ fontSize: "16px" }}
                          className={
                            "material-icons  text-green-500" +
                            (!this.state.copySuccess ? " invisible" : "")
                          }
                        >
                          check_circle
                        </i>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Button
                    title="Personas"
                    icon="person_outline"
                    noborder
                    handleOnClick={() => this.setState({ showPersonas: true })}
                  />
                </div>

                <div className="">
                  {this.state.showClosedMilstones ? (
                    <Button
                      iconColor="text-green-500"
                      noborder
                      icon="toggle_on"
                      title="Show closed"
                      handleOnClick={() =>
                        this.setState({ showClosedMilstones: false })
                      }
                    />
                  ) : (
                    <Button
                      icon="toggle_off "
                      noborder
                      title="Show closed"
                      handleOnClick={() =>
                        this.setState({ showClosedMilstones: true })
                      }
                    />
                  )}
                </div>
              </div>
              <div className="ml-4">
                <Link
                  to={
                    this.props.match.url +
                    "/p/" +
                    this.props.match.params.projectId
                  }
                >
                  <i className="material-icons text-gray-600">settings</i>
                </Link>
              </div>
            </div>
          </div>

          <Board
            showClosed={this.state.showClosedMilstones}
            viewOnly={viewOnly}
            url={this.props.match.url}
            features={this.props.features}
            workflows={filterWorkflowsOnProject(
              this.props.workflows,
              projectId
            )}
            subWorkflows={this.props.subWorkflows}
            milestones={filterMilestonesOnProject(
              this.props.milestones,
              projectId
            )}
            projectId={projectId}
            workspaceId={ws.id}
            demo={this.state.demo}
            comments={filterFeatureCommentsOnProject(
              this.props.featureComments,
              projectId
            )}
            personas={filterPersonasOnProject(this.props.personas, projectId)}
            workflowPersonas={filterWorkflowPersonasOnProject(
              this.props.workflowPersonas,
              projectId
            )}
            showPersonas={this.state.showPersonas}
            closePersonas={() => this.setState({ showPersonas: false })}
            openPersonas={() => this.setState({ showPersonas: true })}
          />

          <Switch>
            <Route exact path="/" component={() => null} />
            <Route
              exact
              path={this.props.match.path + "/m/:milestoneId"}
              component={EntityDetailsPage}
            />
            <Route
              exact
              path={this.props.match.path + "/sw/:subWorkflowId"}
              component={EntityDetailsPage}
            />
            <Route
              exact
              path={this.props.match.path + "/f/:featureId"}
              component={EntityDetailsPage}
            />
            <Route
              exact
              path={this.props.match.path + "/w/:workflowId"}
              component={EntityDetailsPage}
            />
            <Route
              exact
              path={this.props.match.path + "/p/:projectId2"}
              component={EntityDetailsPage}
            />
          </Switch>
        </div>
      )
    ) : (
      <div>Project not found</div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
