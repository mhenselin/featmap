import { connect } from "react-redux";
import type { RouteComponentProps } from "react-router";
import EntityDetailsModal from "../components/EntityDetailsModal";
import { useProjectsData } from "../components/ProjectsContext";
import { useWorkspaceName } from "../components/WorkspaceContext";
import { isEditor } from "../core/misc";
import { AppState } from "../store";
import {
  application,
  getMembership,
  getWorkspaceByName,
} from "../store/application/selectors";
import { Application } from "../store/application/types";
import {
  featureComments,
  filterFeatureCommentsOnFeature,
} from "../store/featurecomments/selectors";
import { IFeatureComment } from "../store/featurecomments/types";
import { features, getFeature } from "../store/features/selectors";
import { IFeature } from "../store/features/types";
import { getMilestone, milestones } from "../store/milestones/selectors";
import { IMilestone } from "../store/milestones/types";
import { getSubWorkflow, subWorkflows } from "../store/subworkflows/selectors";
import { ISubWorkflow } from "../store/subworkflows/types";
import { getWorkflow, workflows } from "../store/workflows/selectors";
import { IWorkflow } from "../store/workflows/types";

const mapStateToProps = (state: AppState) => ({
  application: application(state),
  milestones: milestones(state),
  subWorkflows: subWorkflows(state),
  workflows: workflows(state),
  features: features(state),
  featureComments: featureComments(state),
});

const mapDispatchToProps = {};

type PropsFromState = {
  application: Application;
  milestones: IMilestone[];
  subWorkflows: ISubWorkflow[];
  workflows: IWorkflow[];
  features: IFeature[];
  featureComments: IFeatureComment[];
};

type PropsFromDispatch = Record<string, never>;

type RouterProps = RouteComponentProps<{
  projectId: string;
  projectId2: string;
  milestoneId: string;
  subWorkflowId: string;
  workflowId: string;
  featureId: string;
  workspaceName: string;
}>;

type SelfProps = Record<string, never>;

type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;

const EntityDetailsPage: React.FunctionComponent<Readonly<Props>> = (props) => {
  const workspaceName = useWorkspaceName();

  const close = () => {
    props.history.push(
      "/" + workspaceName + "/projects/" + props.match.params.projectId
    );
  };

  const { projects } = useProjectsData();

  const ws = getWorkspaceByName(props.application, workspaceName);
  const member = getMembership(props.application, ws?.id);
  const viewOnly = !isEditor(member?.level);

  if (props.match.params.milestoneId) {
    const ms = getMilestone(props.milestones, props.match.params.milestoneId);
    return (
      <EntityDetailsModal
        viewOnly={viewOnly}
        entity={ms}
        url={props.match.url}
        close={close}
        comments={[]}
      />
    );
  } else if (props.match.params.subWorkflowId) {
    const ms = getSubWorkflow(
      props.subWorkflows,
      props.match.params.subWorkflowId
    );
    return (
      <EntityDetailsModal
        viewOnly={viewOnly}
        entity={ms}
        url={props.match.url}
        close={close}
        comments={[]}
      />
    );
  } else if (props.match.params.workflowId) {
    const ms = getWorkflow(props.workflows, props.match.params.workflowId);
    return (
      <EntityDetailsModal
        viewOnly={viewOnly}
        entity={ms}
        url={props.match.url}
        close={close}
        comments={[]}
      />
    );
  } else if (props.match.params.featureId) {
    const p = getFeature(props.features, props.match.params.featureId);
    const c = filterFeatureCommentsOnFeature(
      props.featureComments,
      props.match.params.featureId
    );

    return (
      <EntityDetailsModal
        viewOnly={viewOnly}
        entity={p}
        url={props.match.url}
        close={close}
        comments={c}
      />
    );
  } else if (props.match.params.projectId2) {
    const p = projects.find(
      (project) => project.id === props.match.params.projectId2
    );
    return (
      <EntityDetailsModal
        viewOnly={viewOnly}
        entity={p}
        url={props.match.url}
        close={close}
        comments={[]}
      />
    );
  }
  return null;
};

export default connect(mapStateToProps, mapDispatchToProps)(EntityDetailsPage);
