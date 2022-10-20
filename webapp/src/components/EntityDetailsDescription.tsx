import type {
  FieldProps,
  FormikHelpers as FormikActions,
  FormikProps,
} from "formik";
import { Field, Form, Formik } from "formik";
import { Component } from "react";
import ReactMarkdown from "react-markdown";
import type { HandleClickOutside } from "react-onclickoutside";
import onClickOutside from "react-onclickoutside";
import { connect } from "react-redux";
import * as Yup from "yup";
import {
  API_UPDATE_FEATURE_DESCRIPTION,
  API_UPDATE_MILESTONE_DESCRIPTION,
  API_UPDATE_PROJECT_DESCRIPTION,
  API_UPDATE_SUBWORKFLOW_DESCRIPTION,
  API_UPDATE_WORKFLOW_DESCRIPTION,
} from "../api";
import { EntityTypes } from "../core/card";
import { AppState } from "../store";
import { application } from "../store/application/selectors";
import { IApplication } from "../store/application/types";
import { updateFeatureAction } from "../store/features/actions";
import { IFeature } from "../store/features/types";
import { updateMilestoneAction } from "../store/milestones/actions";
import { IMilestone } from "../store/milestones/types";
import { updateProjectAction } from "../store/projects/actions";
import { IProject } from "../store/projects/types";
import { updateSubWorkflowAction } from "../store/subworkflows/actions";
import { ISubWorkflow } from "../store/subworkflows/types";
import { updateWorkflowAction } from "../store/workflows/actions";
import { IWorkflow } from "../store/workflows/types";
import { Button } from "./elements";

const mapStateToProps = (state: AppState) => ({
  application: application(state),
});

const mapDispatchToProps = {
  updateMilestone: updateMilestoneAction,
  updateSubWorkflow: updateSubWorkflowAction,
  updateWorkflow: updateWorkflowAction,
  updateFeature: updateFeatureAction,
  updateProject: updateProjectAction,
};

type PropsFromState = {
  application: IApplication;
};

type PropsFromDispatch = {
  updateMilestone: typeof updateMilestoneAction;
  updateSubWorkflow: typeof updateSubWorkflowAction;
  updateWorkflow: typeof updateWorkflowAction;
  updateFeature: typeof updateFeatureAction;
  updateProject: typeof updateProjectAction;
};

type SelfProps = {
  entity: EntityTypes;
  app: IApplication;
  url: string;
  close: () => void;
  viewOnly: boolean;
  demo: boolean;
};
type Props = PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  edit: boolean;
};

class EntityDetailsDescription
  extends Component<Props, State>
  implements HandleClickOutside<void>
{
  constructor(props: Props) {
    super(props);
    this.state = { edit: false };
  }

  handleClickOutside = () => {
    if (this.state.edit) {
      this.setState({ edit: false });
      this.submitForm();
    }
  };

  submitForm!: FormikProps<{ description: string }>["submitForm"];

  render() {
    let closed = false;
    switch (this.props.entity.kind) {
      case "milestone":
      case "subworkflow":
      case "workflow":
      case "feature": {
        closed = this.props.entity.status === "CLOSED";
        break;
      }
      default:
        break;
    }

    return (
      <div className=" mb-4 w-full self-start ">
        <Formik
          initialValues={{ description: this.props.entity.description }}
          validationSchema={Yup.object().shape({
            description: Yup.string().max(10000, "Maximum 10000 characters."),
          })}
          onSubmit={(
            values: { description: string },
            actions: FormikActions<{ description: string }>
          ) => {
            switch (this.props.entity.kind) {
              case "project": {
                const optimistic = this.props.entity;
                optimistic.description = values.description;
                optimistic.lastModified = new Date().toISOString();
                optimistic.lastModifiedByName =
                  this.props.app.account === undefined
                    ? "demo"
                    : this.props.app.account!.name;

                this.props.updateProject(optimistic);

                if (!this.props.demo) {
                  API_UPDATE_PROJECT_DESCRIPTION(
                    this.props.entity.workspaceId,
                    this.props.entity.id,
                    values.description
                  ).then((response) => {
                    if (response.ok) {
                      response.json().then((data: IProject) => {
                        this.props.updateProject(data);
                      });
                    } else {
                      alert("Something went wrong when updating description.");
                    }
                  });
                }

                break;
              }

              case "milestone": {
                const optimistic = this.props.entity;
                optimistic.description = values.description;
                optimistic.lastModified = new Date().toISOString();
                optimistic.lastModifiedByName =
                  this.props.app.account === undefined
                    ? "demo"
                    : this.props.app.account!.name;

                this.props.updateMilestone(optimistic);
                if (!this.props.demo) {
                  API_UPDATE_MILESTONE_DESCRIPTION(
                    this.props.entity.workspaceId,
                    this.props.entity.id,
                    values.description
                  ).then((response) => {
                    if (response.ok) {
                      response.json().then((data: IMilestone) => {
                        this.props.updateMilestone(data);
                      });
                    } else {
                      alert("Something went wrong when updating description.");
                    }
                  });
                }

                break;
              }

              case "subworkflow": {
                const optimistic = this.props.entity;
                optimistic.description = values.description;
                optimistic.lastModified = new Date().toISOString();
                optimistic.lastModifiedByName =
                  this.props.app.account === undefined
                    ? "demo"
                    : this.props.app.account!.name;

                this.props.updateSubWorkflow(optimistic);

                if (!this.props.demo) {
                  API_UPDATE_SUBWORKFLOW_DESCRIPTION(
                    this.props.entity.workspaceId,
                    this.props.entity.id,
                    values.description
                  ).then((response) => {
                    if (response.ok) {
                      response.json().then((data: ISubWorkflow) => {
                        this.props.updateSubWorkflow(data);
                      });
                    } else {
                      alert("Something went wrong when updating description.");
                    }
                  });
                }

                break;
              }

              case "workflow": {
                const optimistic = this.props.entity;
                optimistic.description = values.description;
                optimistic.lastModified = new Date().toISOString();
                optimistic.lastModifiedByName =
                  this.props.app.account === undefined
                    ? "demo"
                    : this.props.app.account!.name;

                this.props.updateWorkflow(optimistic);

                if (!this.props.demo) {
                  API_UPDATE_WORKFLOW_DESCRIPTION(
                    this.props.entity.workspaceId,
                    this.props.entity.id,
                    values.description
                  ).then((response) => {
                    if (response.ok) {
                      response.json().then((data: IWorkflow) => {
                        this.props.updateWorkflow(data);
                      });
                    } else {
                      alert("Something went wrong when updating description.");
                    }
                  });
                }

                break;
              }

              case "feature": {
                const optimistic = this.props.entity;
                optimistic.description = values.description;
                optimistic.lastModified = new Date().toISOString();
                optimistic.lastModifiedByName =
                  this.props.app.account === undefined
                    ? "demo"
                    : this.props.app.account!.name;

                this.props.updateFeature(optimistic);

                if (!this.props.demo) {
                  API_UPDATE_FEATURE_DESCRIPTION(
                    this.props.entity.workspaceId,
                    this.props.entity.id,
                    values.description
                  ).then((response) => {
                    if (response.ok) {
                      response.json().then((data: IFeature) => {
                        this.props.updateFeature(data);
                      });
                    } else {
                      alert("Something went wrong when updating description.");
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
          }}
        >
          {(formikBag: FormikProps<{ description: string }>) => {
            this.submitForm = formikBag.submitForm;

            return (
              <Form>
                {formikBag.status && formikBag.status.msg && (
                  <div>{formikBag.status.msg}</div>
                )}

                {this.state.edit ? (
                  <Field name="description">
                    {({ form }: FieldProps<{ description: string }>) => (
                      <div className="mt-1 flex flex-col ">
                        <div>
                          <textarea
                            rows={20}
                            value={form.values.description}
                            onChange={form.handleChange}
                            placeholder="Description"
                            id="description"
                            className="w-full rounded  border p-2  	"
                          />
                        </div>
                        <span className="p-1 text-xs">
                          The description supports formatting through{" "}
                          <a
                            rel="noopener noreferrer"
                            target="_blank"
                            className="link"
                            href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
                          >
                            Markdown
                          </a>
                          .
                        </span>
                        <div className="p-1 text-xs font-bold text-red-500">
                          {form.touched.description &&
                            form.errors.description &&
                            form.errors.description.toString()}
                        </div>
                      </div>
                    )}
                  </Field>
                ) : (
                  <div className=" mt-2 ml-2 border border-white  ">
                    <div>
                      {this.props.entity.description.length === 0 ? (
                        <div>
                          <em>No description.</em>
                        </div>
                      ) : (
                        <div>
                          <div className="markdown-body overflow-auto text-left">
                            <ReactMarkdown linkTarget="_blank">
                              {this.props.entity.description}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                      <div className="mt-4">
                        {!(this.props.viewOnly || closed) && (
                          <Button
                            title="Edit description"
                            icon="edit"
                            handleOnClick={() => this.setState({ edit: true })}
                          />
                        )}
                      </div>
                    </div>
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
)(onClickOutside(EntityDetailsDescription));
