import { useEffect, useState } from "react";
import { connect } from "react-redux";
import type { RouteComponentProps } from "react-router";
import { useRouteMatch } from "react-router";
import { Link, Route, Switch } from "react-router-dom";
import { API_GET_PROJECT, API_GET_PROJECT_RESP } from "../api";
import Board from "../components/Board";
import { Button as NewButton } from "../components/Button";
import { CardStatus } from "../components/Card";
import { Headline } from "../components/Headline";
import { Icon } from "../components/Icon";
import { Loading } from "../components/Loading";
import { useProjectsData } from "../components/ProjectsContext";
import { Tag } from "../components/Tag";
import { useWorkspaceName } from "../components/WorkspaceContext";
import { Color, isEditor } from "../core/misc";
import { AppState } from "../store";
import {
  application,
  getMembership,
  getWorkspaceByName,
} from "../store/application/selectors";
import { Application } from "../store/application/types";
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
import NotFound from "./NotFound";

const mapStateToProps = (state: AppState) => ({
  application: application(state),
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
  application: Application;
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
  showPersonas: boolean;
};

const ProjectPage = (props: Props) => {
  const [state, setState] = useState<State>({
    projectFound: false,
    loading: true,
    showClosedMilstones: false,
    copySuccess: false,
    showPersonas: false,
  });

  const { params } = useRouteMatch<{ projectId: string }>();
  const workspaceName = useWorkspaceName();
  const { projects } = useProjectsData();

  useEffect(() => {
    const p = projects.find((project) => project.id === params.projectId);
    const ws = getWorkspaceByName(props.application, workspaceName);

    if (p) {
      if (ws?.id) {
        API_GET_PROJECT(ws.id, p.id)
          .then((response) => {
            if (response.ok) {
              response.json().then((data: API_GET_PROJECT_RESP) => {
                props.loadMilestones(data.milestones);
                props.loadWorkflows(data.workflows);
                props.loadSubWorkflows(data.subWorkflows);
                props.loadFeatures(data.features);
                props.loadFeatureComments(data.featureComments);
                props.loadPersonas(data.personas);
                props.loadWorkflowPersonas(data.workflowPersonas);
                setState((prevState) => ({ ...prevState, loading: false }));
              });
            }
          })
          .catch(() => {
            if (process.env.NODE_ENV !== "production") {
              props.loadMilestones([
                {
                  kind: "milestone" as const,
                  workspaceId: "workspaceid",
                  id: "milestonid",
                  title: "loremipsumetdolorsitametetdoloressitametvitasium",
                  description:
                    "Lorem, ipsum dolor sit aipsam voluptatum id quis?",
                  createdAt: new Date("2022-10-27").toString(),
                  createdBy: "333-uuid-333",
                  createdByName: "Eric",
                  lastModified: new Date(
                    new Date().getTime() - 3_600_000
                  ).toString(),
                  lastModifiedByName: "Eric",
                  annotations: "RISKY",
                  color: Color.WHITE,
                  projectId: "projectid",
                  rank: "",
                  status: CardStatus.OPEN,
                },
              ]);
              props.loadWorkflows([
                {
                  kind: "workflow" as const,
                  workspaceId: "workspaceid",
                  id: "workflow",
                  title: "My awesome project title",
                  description:
                    "Lorem, ipsum dolor sit aipsam voluptatum id quis?",
                  createdAt: new Date("2022-10-27").toString(),
                  createdBy: "333-uuid-333",
                  createdByName: "Eric",
                  lastModified: new Date(
                    new Date().getTime() - 3_600_000
                  ).toString(),
                  lastModifiedByName: "Eric",
                  annotations: "RISKY",
                  color: Color.WHITE,
                  projectId: "projectid",
                  rank: "",
                  status: CardStatus.OPEN,
                },
              ]);
              props.loadSubWorkflows([
                {
                  kind: "subworkflow" as const,
                  workspaceId: "workspaceid",
                  id: "subid",
                  title: "My awesome project title",
                  description:
                    "Lorem, ipsum dolor sit aipsam voluptatum id quis?",
                  createdAt: new Date("2022-10-27").toString(),
                  createdBy: "333-uuid-333",
                  createdByName: "Eric",
                  lastModified: new Date(
                    new Date().getTime() - 3_600_000
                  ).toString(),
                  lastModifiedByName: "Eric",
                  annotations: "RISKY",
                  color: Color.WHITE,
                  rank: "",
                  status: CardStatus.OPEN,
                  workflowId: "workflowid",
                },
              ]);
              props.loadFeatures([
                {
                  kind: "feature" as const,
                  workspaceId: "workspaceid",
                  id: "featureid",
                  title: "My awesome project title",
                  description:
                    "Lorem, ipsum dolor sit aipsam voluptatum id quis?",
                  createdAt: new Date("2022-10-27").toString(),
                  createdBy: "333-uuid-333",
                  createdByName: "Eric",
                  lastModified: new Date(
                    new Date().getTime() - 3_600_000
                  ).toString(),
                  lastModifiedByName: "Eric",
                  annotations: "RISKY",
                  color: Color.WHITE,
                  rank: "",
                  status: CardStatus.OPEN,
                  estimate: 0,
                  milestoneId: "milestonid",
                  subWorkflowId: "subid",
                },
              ]);
              props.loadFeatureComments([
                {
                  kind: "featureComment" as const,
                  workspaceId: "workspaceid",
                  id: "commentid",
                  createdByName: "Eric",
                  lastModified: new Date(
                    new Date().getTime() - 3_600_000
                  ).toString(),
                  projectId: "projectid",
                  createdAt: new Date(
                    new Date().getTime() - 5_600_000
                  ).toString(),
                  featureId: "featureid",
                  memberId: "memberid",
                  post: "",
                },
              ]);
              props.loadPersonas([]);
              props.loadWorkflowPersonas([]);
              setState((prevState) => ({ ...prevState, loading: false }));
            } else {
              // @todo error handline
            }
          });
      }
      setState((prevState) => ({ ...prevState, projectFound: true }));
    }
  }, [params.projectId, projects, workspaceName]); // @todo props should be listed but this breaks the app ............... meh!

  const download = (filename: string, text: string) => {
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

  const projectCSV = (): string => {
    let csv = `milestone_title,goal_title,activity_title,feature_title,feature_description,feature_status,feature_color,feature_annotations,feature_size\n`;

    props.milestones.forEach((m) =>
      props.workflows.forEach((w) => {
        getSubWorkflowByWorkflow(props.subWorkflows, w.id).forEach((sw) => {
          filterFeaturesOnMilestoneAndSubWorkflow(
            props.features,
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
        });
      })
    );
    return csv;
  };

  const { projectId } = props.match.params;
  const ws = getWorkspaceByName(props.application, workspaceName);
  const proj = projects.find((project) => project.id === projectId);
  const member = getMembership(props.application, ws?.id);
  const viewOnly = !isEditor(member?.level);
  const showPrivateLink = ws?.allowExternalSharing ?? false;

  if (!proj) {
    return <NotFound />;
  }

  if (state.loading) {
    return <Loading label="project data" />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Headline level={1}>{proj.title}</Headline>
          {viewOnly && <Tag type="danger">view only</Tag>}
        </div>

        <div className="flex items-center gap-1">
          {showPrivateLink && (
            <div>
              <div className="flex grow items-center">
                <div className="mr-1 flex grow ">
                  <Link
                    target="_blank"
                    className="link"
                    to={"/link/" + proj.externalLink}
                  >
                    Share link
                  </Link>
                </div>
                <div>
                  {navigator.clipboard && (
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
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
                      (!state.copySuccess ? " invisible" : "")
                    }
                  >
                    check_circle
                  </i>
                </div>
              </div>
            </div>
          )}

          <NewButton
            small
            onClick={() => download("storymap.csv", projectCSV())}
          >
            <Icon className="text-sm" type="download" />
            <span className="sr-only">export as</span>
            CSV
          </NewButton>

          <NewButton
            small
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                showPersonas: true,
              }))
            }
          >
            <Icon className="text-sm" type="person" />
            Personas
          </NewButton>

          <NewButton
            small
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                showClosedMilstones: !prevState.showClosedMilstones,
              }))
            }
          >
            <Icon
              className="text-sm"
              type={state.showClosedMilstones ? "toggle_on" : "toggle_off"}
            />
            closed milestones
          </NewButton>
          <Link
            className="focus mr-1 flex items-center gap-1 px-0.5 text-sm"
            to={props.match.url + "/p/" + props.match.params.projectId}
          >
            <Icon className="text-sm" type="settings" />
            settings
          </Link>
        </div>
      </div>

      <div className="my-4 overflow-x-auto">
        <Board
          showClosed={state.showClosedMilstones}
          viewOnly={viewOnly}
          url={props.match.url}
          features={props.features}
          workflows={filterWorkflowsOnProject(props.workflows, projectId)}
          subWorkflows={props.subWorkflows}
          milestones={filterMilestonesOnProject(props.milestones, projectId)}
          projectId={projectId}
          workspaceId={ws?.id}
          comments={filterFeatureCommentsOnProject(
            props.featureComments,
            projectId
          )}
          personas={filterPersonasOnProject(props.personas, projectId)}
          workflowPersonas={filterWorkflowPersonasOnProject(
            props.workflowPersonas,
            projectId
          )}
          showPersonas={state.showPersonas}
          closePersonas={() =>
            setState((prevState) => ({ ...prevState, showPersonas: false }))
          }
          openPersonas={() =>
            setState((prevState) => ({ ...prevState, showPersonas: true }))
          }
        />
      </div>

      <Switch>
        <Route
          exact
          path={props.match.path + "/m/:milestoneId"}
          component={EntityDetailsPage}
        />
        <Route
          exact
          path={props.match.path + "/sw/:subWorkflowId"}
          component={EntityDetailsPage}
        />
        <Route
          exact
          path={props.match.path + "/f/:featureId"}
          component={EntityDetailsPage}
        />
        <Route
          exact
          path={props.match.path + "/w/:workflowId"}
          component={EntityDetailsPage}
        />
        <Route
          exact
          path={props.match.path + "/p/:projectId2"}
          component={EntityDetailsPage}
        />
      </Switch>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
