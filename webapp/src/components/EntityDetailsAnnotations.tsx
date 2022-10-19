import { Component } from "react";
import onClickOutside from "react-onclickoutside";
import { connect } from "react-redux";
import {
  API_CHANGE_FEATURE_ANNOTATIONS,
  API_CHANGE_MILESTONE_ANNOTATIONS,
  API_CHANGE_SUBWORKFLOW_ANNOTATIONS,
  API_CHANGE_WORKFLOW_ANNOTATIONS,
} from "../api";
import { EntityTypes } from "../core/card";
import { allAnnotations, dbAnnotationsFromNames } from "../core/misc";
import { AppState } from "../store";
import { application } from "../store/application/selectors";
import { IApplication } from "../store/application/types";
import {
  createFeatureAction,
  deleteFeatureAction,
  updateFeatureAction,
} from "../store/features/actions";
import { IFeature } from "../store/features/types";
import {
  createMilestoneAction,
  deleteMilestoneAction,
  updateMilestoneAction,
} from "../store/milestones/actions";
import { IMilestone } from "../store/milestones/types";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "../store/projects/actions";
import {
  createSubWorkflowAction,
  deleteSubWorkflowAction,
  updateSubWorkflowAction,
} from "../store/subworkflows/actions";
import { ISubWorkflow } from "../store/subworkflows/types";
import {
  createWorkflowAction,
  deleteWorkflowAction,
  updateWorkflowAction,
} from "../store/workflows/actions";
import { IWorkflow } from "../store/workflows/types";
import ContextMenu from "./ContextMenu";
import { Button } from "./elements";

const mapStateToProps = (state: AppState) => ({
  application: application(state),
});

const mapDispatchToProps = {
  updateMilestone: updateMilestoneAction,
  createMilestone: createMilestoneAction,
  deleteMilestone: deleteMilestoneAction,
  updateSubWorkflow: updateSubWorkflowAction,
  createSubWorkflow: createSubWorkflowAction,
  deleteSubWorkflow: deleteSubWorkflowAction,
  updateWorkflow: updateWorkflowAction,
  createWorkflow: createWorkflowAction,
  deleteWorkflow: deleteWorkflowAction,
  updateFeature: updateFeatureAction,
  createFeature: createFeatureAction,
  deleteFeature: deleteFeatureAction,
  updateProject: updateProjectAction,
  createProject: createProjectAction,
  deleteProject: deleteProjectAction,
};

type PropsFromState = {
  application: IApplication;
};

type PropsFromDispatch = {
  updateMilestone: typeof updateMilestoneAction;
  createMilestone: typeof createMilestoneAction;
  deleteMilestone: typeof deleteMilestoneAction;
  updateSubWorkflow: typeof updateSubWorkflowAction;
  createSubWorkflow: typeof createSubWorkflowAction;
  deleteSubWorkflow: typeof deleteSubWorkflowAction;
  updateWorkflow: typeof updateWorkflowAction;
  createWorkflow: typeof createWorkflowAction;
  deleteWorkflow: typeof deleteWorkflowAction;
  updateFeature: typeof updateFeatureAction;
  createFeature: typeof createFeatureAction;
  deleteFeature: typeof deleteFeatureAction;
  updateProject: typeof updateProjectAction;
  createProject: typeof createProjectAction;
  deleteProject: typeof deleteProjectAction;
};

type SelfProps = {
  card: EntityTypes;
  close: () => void;
  edit: boolean;
  demo: boolean;
  open: boolean;
  viewOnly: boolean;
};
type Props = PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  edit: boolean;
};

class EntityDetailsAnnotations extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { edit: this.props.edit };
  }

  handleAddAnnotation = (name: string) => {
    const currentAnnotations = dbAnnotationsFromNames(
      this.props.card.annotations
    );
    currentAnnotations.add(name);
    this.updateAnnotations(currentAnnotations.toString());
  };

  handleRemoveAnnotation = (name: string) => {
    const currentAnnotations = dbAnnotationsFromNames(
      this.props.card.annotations
    );
    currentAnnotations.remove([name]);
    this.updateAnnotations(currentAnnotations.toString());
  };

  updateAnnotations = (names: string) => {
    const card = this.props.card;
    switch (card.kind) {
      case "feature": {
        this.props.updateFeature({
          ...card,
          annotations: names,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_CHANGE_FEATURE_ANNOTATIONS(card.workspaceId, card.id, names).then(
            (response) => {
              if (response.ok) {
                response.json().then((data: IFeature) => {
                  this.props.updateFeature(data);
                });
              } else {
                alert("Something went wrong.");
              }
            }
          );
        }
        break;
      }

      case "workflow": {
        this.props.updateWorkflow({
          ...card,
          annotations: names,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_CHANGE_WORKFLOW_ANNOTATIONS(
            card.workspaceId,
            card.id,
            names
          ).then((response) => {
            if (response.ok) {
              response.json().then((data: IWorkflow) => {
                this.props.updateWorkflow(data);
              });
            } else {
              alert("Something went wrong.");
            }
          });
        }
        break;
      }

      case "subworkflow": {
        this.props.updateSubWorkflow({
          ...card,
          annotations: names,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_CHANGE_SUBWORKFLOW_ANNOTATIONS(
            card.workspaceId,
            card.id,
            names
          ).then((response) => {
            if (response.ok) {
              response.json().then((data: ISubWorkflow) => {
                this.props.updateSubWorkflow(data);
              });
            } else {
              alert("Something went wrong.");
            }
          });
        }
        break;
      }

      case "milestone": {
        this.props.updateMilestone({
          ...card,
          annotations: names,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_CHANGE_MILESTONE_ANNOTATIONS(
            card.workspaceId,
            card.id,
            names
          ).then((response) => {
            if (response.ok) {
              response.json().then((data: IMilestone) => {
                this.props.updateMilestone(data);
              });
            } else {
              alert("Something went wrong.");
            }
          });
        }
        break;
      }
    }
  };

  handleClickOutside = () => {
    if (this.state.edit) {
      this.setState({ edit: false });
    }
  };

  render() {
    const currentAnnotations = dbAnnotationsFromNames(
      this.props.card.annotations
    );
    const leftOverAnnotations = allAnnotations().remove(
      currentAnnotations.annotations.map((c) => c.name)
    );
    return (
      <div className="flex flex-wrap">
        {currentAnnotations.annotations.map((x, i) => {
          const tag = (name: string, text: string, icon = "error") => (
            <div
              key={i}
              className=" mb-1 mr-2 flex items-center whitespace-nowrap  rounded-full  bg-gray-200   py-1 px-2  text-xs font-medium "
            >
              <i
                style={{ fontSize: "18px" }}
                className="material-icons  mr-1  align-middle text-gray-700"
              >
                {icon}{" "}
              </i>
              <span className="mr-2">{text}</span>

              {this.props.open && !this.props.viewOnly && (
                <button onClick={() => this.handleRemoveAnnotation(name)}>
                  <i
                    style={{ fontSize: "14px" }}
                    className="material-icons align-middle text-gray-700"
                  >
                    clear
                  </i>
                </button>
              )}
            </div>
          );

          return tag(x.name, x.description, x.icon);
        })}

        {leftOverAnnotations.annotations.length &&
        this.props.open &&
        !this.props.viewOnly &&
        !(this.props.card.kind === "project") ? (
          <ContextMenu icon="add" text="Annotation" smallIcon>
            <div className="absolute top-0 left-0  mt-8 min-w-full rounded bg-white text-xs shadow-md">
              <ul className="">
                {leftOverAnnotations.annotations.map((an, i) => {
                  return (
                    <li key={i}>
                      <Button
                        noborder
                        title={an.description}
                        icon={an.icon}
                        handleOnClick={() => this.handleAddAnnotation(an.name)}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </ContextMenu>
        ) : null}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(onClickOutside(EntityDetailsAnnotations));
