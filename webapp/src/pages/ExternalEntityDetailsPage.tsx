import { connect } from "react-redux";
import type { RouteComponentProps } from "react-router";
import EntityDetailsModal from "../components/EntityDetailsModal";
import { useProjectsData } from "../components/ProjectsContext";
import { AppState } from "../store";
import { application } from "../store/application/selectors";
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

type PropsFromState = {
  application: Application;
  milestones: IMilestone[];
  subWorkflows: ISubWorkflow[];
  workflows: IWorkflow[];
  features: IFeature[];
  featureComments: IFeatureComment[];
};

type RouterProps = RouteComponentProps<{
  projectId2: string;
  milestoneId: string;
  subWorkflowId: string;
  workflowId: string;
  featureId: string;
  key: string;
}>;

type Props = RouterProps & PropsFromState;

const ExternalEntityDetailsPage: React.FunctionComponent<Readonly<Props>> = (
  props
) => {
  const close = () => {
    props.history.push("/link/" + props.match.params.key);
  };
  const { projects } = useProjectsData();

  if (props.match.params.milestoneId) {
    const ms = getMilestone(props.milestones, props.match.params.milestoneId);
    return (
      <EntityDetailsModal
        viewOnly
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
        viewOnly
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
        viewOnly
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
        viewOnly
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
        viewOnly
        entity={p}
        url={props.match.url}
        close={close}
        comments={[]}
      />
    );
  }
  return null;
};

export default connect(mapStateToProps)(ExternalEntityDetailsPage);
