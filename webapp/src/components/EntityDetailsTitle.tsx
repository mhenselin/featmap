import type {
  FieldProps,
  FormikHelpers as FormikActions,
  FormikProps,
} from "formik";
import { Field, Form, Formik } from "formik";
import { Component, FocusEvent, MouseEventHandler } from "react";
import onClickOutside from "react-onclickoutside";
import { connect } from "react-redux";
import * as Yup from "yup";
import {
  API_RENAME_FEATURE,
  API_RENAME_MILESTONE,
  API_RENAME_PROJECT,
  API_RENAME_SUBWORKFLOW,
  API_RENAME_WORKFLOW,
} from "../api";
import { EntityTypes } from "../core/card";
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
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "../store/projects/actions";
import { Project } from "../store/projects/types";
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
  application: Application;
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
  app: Application;
  url: string;
  close: () => void;
  viewOnly: boolean;
  demo: boolean;
};
type Props = PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  edit: boolean;
};

class EntityDetailsTitle extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { edit: false };
  }

  handleClickOutside: MouseEventHandler<void> = () => {
    if (this.state.edit) {
      this.setState({ edit: false });
      this.submitForm();
    }
  };

  submitForm!: FormikProps<{ title: string }>["submitForm"];

  submit = (
    values: { title: string },
    actions: FormikActions<{ title: string }>
  ) => {
    switch (this.props.card.kind) {
      case "project": {
        const optimistic = this.props.card;
        optimistic.title = values.title;
        optimistic.lastModified = new Date().toISOString();
        optimistic.lastModifiedByName =
          this.props.app.account === undefined
            ? "demo"
            : this.props.app.account!.name;

        this.props.updateProject(optimistic);

        if (!this.props.demo) {
          API_RENAME_PROJECT(
            this.props.card.workspaceId,
            this.props.card.id,
            values.title
          ).then((response) => {
            if (response.ok) {
              response.json().then((data: Project) => {
                this.props.updateProject(data);
              });
            } else {
              alert("Something went wrong when trying to rename.");
            }
          });
        }
        break;
      }

      case "milestone": {
        const optimistic = this.props.card;
        optimistic.title = values.title;
        optimistic.lastModified = new Date().toISOString();
        optimistic.lastModifiedByName =
          this.props.app.account === undefined
            ? "demo"
            : this.props.app.account!.name;

        this.props.updateMilestone(optimistic);

        if (!this.props.demo) {
          API_RENAME_MILESTONE(
            this.props.card.workspaceId,
            this.props.card.id,
            values.title
          ).then((response) => {
            if (response.ok) {
              response.json().then((data: IMilestone) => {
                this.props.updateMilestone(data);
              });
            } else {
              alert("Something went wrong when trying to rename.");
            }
          });
        }
        break;
      }

      case "subworkflow": {
        const optimistic = this.props.card;
        optimistic.title = values.title;
        optimistic.lastModified = new Date().toISOString();
        optimistic.lastModifiedByName =
          this.props.app.account === undefined
            ? "demo"
            : this.props.app.account!.name;

        this.props.updateSubWorkflow(optimistic);

        if (!this.props.demo) {
          API_RENAME_SUBWORKFLOW(
            this.props.card.workspaceId,
            this.props.card.id,
            values.title
          ).then((response) => {
            if (response.ok) {
              response.json().then((data: ISubWorkflow) => {
                this.props.updateSubWorkflow(data);
              });
            } else {
              alert("Something went wrong when trying to rename.");
            }
          });
        }
        break;
      }

      case "workflow": {
        const optimistic = this.props.card;
        optimistic.title = values.title;
        optimistic.lastModified = new Date().toISOString();
        optimistic.lastModifiedByName =
          this.props.app.account === undefined
            ? "demo"
            : this.props.app.account!.name;

        this.props.updateWorkflow(optimistic);

        if (!this.props.demo) {
          API_RENAME_WORKFLOW(
            this.props.card.workspaceId,
            this.props.card.id,
            values.title
          ).then((response) => {
            if (response.ok) {
              response.json().then((data: IWorkflow) => {
                this.props.updateWorkflow(data);
              });
            } else {
              alert("Something went wrong when trying to rename.");
            }
          });
        }
        break;
      }

      case "feature": {
        const optimistic = this.props.card;
        optimistic.title = values.title;
        optimistic.lastModified = new Date().toISOString();
        optimistic.lastModifiedByName =
          this.props.app.account === undefined
            ? "demo"
            : this.props.app.account!.name;

        this.props.updateFeature(optimistic);

        if (!this.props.demo) {
          API_RENAME_FEATURE(
            this.props.card.workspaceId,
            this.props.card.id,
            values.title
          ).then((response) => {
            if (response.ok) {
              response.json().then((data: IFeature) => {
                this.props.updateFeature(data);
              });
            } else {
              alert("Something went wrong when trying to rename.");
            }
          });
        }
        break;
      }

      default:
        break;
    }

    this.setState({ edit: false });
    actions.setSubmitting(false);
  };

  render() {
    let closed = false;
    switch (this.props.card.kind) {
      case "milestone":
      case "subworkflow":
      case "workflow":
      case "feature": {
        closed = this.props.card.status === "CLOSED";
        break;
      }
      default:
        break;
    }

    return (
      <div className=" w-full self-start  ">
        <Formik
          initialValues={{ title: this.props.card.title }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .min(1, "Minimum 1 characters.")
              .max(200, "Maximum 200 characters.")
              .required("Title required."),
          })}
          onSubmit={this.submit}
        >
          {(formikBag: FormikProps<{ title: string }>) => {
            this.submitForm = formikBag.submitForm;

            const handleFocus = (ev: FocusEvent<HTMLInputElement>) => {
              ev.currentTarget.select();
            };

            return (
              <Form>
                {formikBag.status && formikBag.status.msg && (
                  <div>{formikBag.status.msg}</div>
                )}

                {this.state.edit ? (
                  <Field name="title">
                    {({ form }: FieldProps<{ title: string }>) => (
                      <div className="flex flex-col ">
                        <div>
                          <input
                            onFocus={handleFocus}
                            type="text"
                            value={form.values.title}
                            onChange={form.handleChange}
                            placeholder="Title"
                            id="title"
                            className="w-full rounded  border p-2  text-xl	"
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
                ) : (
                  <div className="mt-2 ml-2 border border-white text-xl">
                    {this.props.viewOnly || closed ? (
                      <span className={closed ? "line-through" : ""}>
                        {" "}
                        {this.props.card.title}
                      </span>
                    ) : (
                      <button
                        className="text-left"
                        onClick={() => this.setState({ edit: true })}
                      >
                        {this.props.card.title}
                      </button>
                    )}
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(onClickOutside(EntityDetailsTitle));
