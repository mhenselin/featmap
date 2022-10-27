import type { FieldProps, FormikProps, FormikHelpers } from "formik";
import { Field, Form, Formik } from "formik";
import { Component } from "react";
import OnClickOut from "react-onclickoutside";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";
import * as Yup from "yup";
import {
  API_CREATE_FEATURE,
  API_CREATE_MILESTONE,
  API_CREATE_SUBWORKFLOW,
  API_CREATE_WORKFLOW,
} from "../api";
import { Color } from "../core/misc";
import { AppState } from "../store";
import { application } from "../store/application/selectors";
import { Application } from "../store/application/types";
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
import { CardStatus } from "./Card";
import { Button } from "./elements";

export enum Types {
  MILESTONE = "MILESTONE",
  WORKFLOW = "WORKFLOW",
  SUBWORKFLOW = "SUBWORKFLOW",
  FEATURE = "FEATURE",
}

export type newMilestone = {
  type: Types.MILESTONE;
  payload: Record<string, never>;
};
export type newWorkflow = {
  type: Types.WORKFLOW;
  payload: Record<string, never>;
};
export type newSubWorkflow = {
  type: Types.SUBWORKFLOW;
  payload: { workflowId: string };
};
export type newFeature = {
  type: Types.FEATURE;
  payload: { subWorkflowId: string; milestoneId: string };
};

export type Actions = newMilestone | newWorkflow | newSubWorkflow | newFeature;

const mapStateToProps = (state: AppState) => ({
  application: application(state),
});

const mapDispatchToProps = {
  createWorkflow: createWorkflowAction,
  updateWorkflow: updateWorkflowAction,
  deleteWorkflow: deleteWorkflowAction,
  createMilestone: createMilestoneAction,
  updateMilestone: updateMilestoneAction,
  deleteMilestone: deleteMilestoneAction,
  createSubWorkflow: createSubWorkflowAction,
  updateSubWorkflow: updateSubWorkflowAction,
  deleteSubWorkflow: deleteSubWorkflowAction,
  createFeature: createFeatureAction,
  updateFeature: updateFeatureAction,
  deleteFeature: deleteFeatureAction,
};

type PropsFromState = {
  application: Application;
};

type PropsFromDispatch = {
  createWorkflow: typeof createWorkflowAction;
  updateWorkflow: typeof updateWorkflowAction;
  deleteWorkflow: typeof deleteWorkflowAction;
  createMilestone: typeof createMilestoneAction;
  updateMilestone: typeof updateMilestoneAction;
  deleteMilestone: typeof deleteMilestoneAction;
  createSubWorkflow: typeof createSubWorkflowAction;
  updateSubWorkflow: typeof updateSubWorkflowAction;
  deleteSubWorkflow: typeof deleteSubWorkflowAction;
  createFeature: typeof createFeatureAction;
  updateFeature: typeof updateFeatureAction;
  deleteFeature: typeof deleteFeatureAction;
};
type SelfProps = {
  action: Actions;
  workspaceId: string;
  projectId: string;
  close: () => void;
  demo: boolean;
};
type Props = PropsFromState & PropsFromDispatch & SelfProps;

type State = Record<string, never>;

const Schema = Yup.object().shape({
  title: Yup.string()
    .min(1, "Minimum 1 characters.")
    .max(200, "Maximum 200 characters.")
    .required("Required."),
});

type formValues = {
  title: string;
};

class CreateCardModal extends Component<Props, State> {
  keydownHandler = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      this.props.close();
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.keydownHandler, false);
  }

  render() {
    const parentProps = this.props;

    const Dialog = class Dialog extends Component<{ close: () => void }> {
      handleClickOutside = () => {
        this.props.close();
      };

      render() {
        return (
          <div className="w-full max-w-xs bg-white  p-3">
            <Formik
              initialValues={{ title: "" }}
              validationSchema={Schema}
              onSubmit={(
                values: formValues,
                actions: FormikHelpers<formValues>
              ) => {
                const t = new Date().toISOString();

                switch (parentProps.action.type) {
                  case Types.WORKFLOW: {
                    const id = uuid();
                    const optimisticWorkflow: IWorkflow = {
                      kind: "workflow",
                      id: id,
                      workspaceId: parentProps.workspaceId,
                      projectId: parentProps.projectId,
                      rank: "",
                      title: values.title,
                      description: "",
                      createdAt: t,
                      createdBy:
                        parentProps.application.account === undefined
                          ? ""
                          : parentProps.application.account.id,
                      createdByName:
                        parentProps.application.account === undefined
                          ? "demo"
                          : parentProps.application.account.name,
                      lastModified: t,
                      lastModifiedByName:
                        parentProps.application.account === undefined
                          ? "demo"
                          : parentProps.application.account.name,
                      color: Color.WHITE,
                      status: CardStatus.OPEN,
                      annotations: "",
                    };
                    parentProps.createWorkflow(optimisticWorkflow);

                    if (!parentProps.demo) {
                      API_CREATE_WORKFLOW(
                        parentProps.workspaceId,
                        parentProps.projectId,
                        id,
                        values.title
                      ).then((response) => {
                        if (response.ok) {
                          response.json().then((data: IWorkflow) => {
                            parentProps.updateWorkflow(data);
                          });
                        } else {
                          parentProps.deleteWorkflow(id);
                        }
                      });
                    }

                    this.props.close();
                    actions.setSubmitting(false);
                    break;
                  }
                  case Types.MILESTONE: {
                    const id = uuid();

                    const optimisticMilestone: IMilestone = {
                      kind: "milestone",
                      id: id,
                      workspaceId: parentProps.workspaceId,
                      projectId: parentProps.projectId,
                      rank: "",
                      title: values.title,
                      description: "",
                      status: CardStatus.OPEN,
                      createdAt: t,
                      createdBy:
                        parentProps.application.account === undefined
                          ? ""
                          : parentProps.application.account.id,
                      createdByName:
                        parentProps.application.account === undefined
                          ? "demo"
                          : parentProps.application.account.name,
                      lastModified: t,
                      lastModifiedByName:
                        parentProps.application.account === undefined
                          ? "demo"
                          : parentProps.application.account.name,
                      color: Color.NONE,
                      annotations: "",
                    };
                    parentProps.createMilestone(optimisticMilestone);

                    if (!parentProps.demo) {
                      API_CREATE_MILESTONE(
                        parentProps.workspaceId,
                        parentProps.projectId,
                        id,
                        values.title
                      ).then((response) => {
                        if (response.ok) {
                          response.json().then((data: IMilestone) => {
                            parentProps.updateMilestone(data);
                          });
                        } else {
                          parentProps.deleteMilestone(id);
                        }
                      });
                    }

                    this.props.close();
                    actions.setSubmitting(false);
                    break;
                  }
                  case Types.SUBWORKFLOW: {
                    const id = uuid();

                    const { workflowId } = parentProps.action.payload;

                    const optimisticSubMilestone: ISubWorkflow = {
                      kind: "subworkflow",
                      id: id,
                      workspaceId: parentProps.workspaceId,
                      workflowId: workflowId,
                      rank: "",
                      title: values.title,
                      description: "",
                      createdAt: t,
                      createdBy:
                        parentProps.application.account === undefined
                          ? ""
                          : parentProps.application.account.id,
                      createdByName:
                        parentProps.application.account === undefined
                          ? "demo"
                          : parentProps.application.account.name,
                      lastModified: t,
                      lastModifiedByName:
                        parentProps.application.account === undefined
                          ? "demo"
                          : parentProps.application.account.name,
                      color: Color.NONE,
                      status: CardStatus.OPEN,
                      annotations: "",
                    };
                    parentProps.createSubWorkflow(optimisticSubMilestone);

                    if (!parentProps.demo) {
                      API_CREATE_SUBWORKFLOW(
                        parentProps.workspaceId,
                        workflowId,
                        id,
                        values.title
                      ).then((response) => {
                        if (response.ok) {
                          response.json().then((data: ISubWorkflow) => {
                            parentProps.updateSubWorkflow(data);
                          });
                        } else {
                          parentProps.deleteSubWorkflow(id);
                        }
                      });
                    }
                    this.props.close();
                    actions.setSubmitting(false);
                    break;
                  }
                  case Types.FEATURE: {
                    const id = uuid();
                    const { subWorkflowId, milestoneId } =
                      parentProps.action.payload;
                    const optimisticFeature: IFeature = {
                      kind: "feature",
                      id: id,
                      workspaceId: parentProps.workspaceId,
                      subWorkflowId: subWorkflowId,
                      milestoneId: milestoneId,
                      rank: "",
                      title: values.title,
                      description: "",
                      status: CardStatus.OPEN,
                      createdAt: t,
                      createdBy:
                        parentProps.application.account === undefined
                          ? ""
                          : parentProps.application.account.id,
                      createdByName:
                        parentProps.application.account === undefined
                          ? "demo"
                          : parentProps.application.account.name,
                      lastModified: t,
                      lastModifiedByName:
                        parentProps.application.account === undefined
                          ? "demo"
                          : parentProps.application.account.name,
                      color: Color.NONE,
                      annotations: "",
                      estimate: 0,
                    };
                    parentProps.createFeature(optimisticFeature);

                    if (!parentProps.demo) {
                      API_CREATE_FEATURE(
                        parentProps.workspaceId,
                        milestoneId,
                        subWorkflowId,
                        id,
                        values.title
                      ).then((response) => {
                        if (response.ok) {
                          response.json().then((data: IFeature) => {
                            parentProps.updateFeature(data);
                          });
                        } else {
                          parentProps.deleteFeature(id);
                        }
                      });
                    }
                    this.props.close();
                    actions.setSubmitting(false);
                    break;
                  }
                  default:
                }
              }}
            >
              {(formikBag: FormikProps<formValues>) => (
                <Form>
                  {formikBag.status && formikBag.status.msg && (
                    <div>{formikBag.status.msg}</div>
                  )}

                  <div className="flex flex-col ">
                    <div className="mb-2"> New card </div>

                    <div>
                      <Field name="title">
                        {({ form }: FieldProps<formValues>) => (
                          <div className="flex flex-col">
                            <div>
                              <input
                                type="text"
                                value={form.values.title}
                                onChange={form.handleChange}
                                placeholder="Title"
                                id="title"
                                className="w-full rounded border p-2	"
                              />
                            </div>
                            <div className="p-1 text-xs font-bold text-red-500">
                              {form.touched.title &&
                                form.errors.title &&
                                form.errors.title.toString()}
                            </div>
                          </div>
                        )}
                      </Field>
                    </div>

                    <div className="flex justify-end">
                      <div className="flex flex-row">
                        <div className="mr-1">
                          <Button primary submit title="Create" />
                        </div>
                        <div>
                          <Button
                            title="Cancel"
                            handleOnClick={this.props.close}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        );
      }
    };

    const DialogWithClickOutside = OnClickOut(Dialog);

    return (
      <div
        style={{ background: " rgba(0,0,0,.75)" }}
        className="fixed top-0 left-0 z-10 flex h-full w-full items-start justify-center bg-gray-100 p-10 text-sm"
      >
        <DialogWithClickOutside close={this.props.close} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCardModal);
