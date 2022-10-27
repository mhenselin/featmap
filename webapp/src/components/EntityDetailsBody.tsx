import type { FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import { Component, createRef } from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import {
  API_CHANGE_FEATURE_COLOR,
  API_CHANGE_FEATURE_ESTIMATE,
  API_CHANGE_MILESTONE_COLOR,
  API_CHANGE_SUBWORKFLOW_COLOR,
  API_CHANGE_WORKFLOW_COLOR,
  API_CLOSE_FEATURE,
  API_CLOSE_MILESTONE,
  API_CLOSE_SUBWORKFLOW,
  API_CLOSE_WORKFLOW,
  API_DELETE_FEATURE,
  API_DELETE_MILESTONE,
  API_DELETE_PROJECT,
  API_DELETE_SUBWORKFLOW,
  API_DELETE_WORKFLOW,
  API_OPEN_FEATURE,
  API_OPEN_MILESTONE,
  API_OPEN_SUBWORKFLOW,
  API_OPEN_WORKFLOW,
} from "../api";
import { EntityTypes } from "../core/card";
import {
  Color,
  Colors,
  colorToBackgroundColorClass,
  colorToBorderColorClass,
} from "../core/misc";
import { AppState } from "../store";
import { application } from "../store/application/selectors";
import { Application } from "../store/application/types";
import { IFeatureComment } from "../store/featurecomments/types";
import {
  createFeatureAction,
  deleteAllFeaturesByMilestoneAction,
  deleteAllFeaturesBySubWorkflowAction,
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
import {
  getSubWorkflowByWorkflow,
  subWorkflows,
} from "../store/subworkflows/selectors";
import { ISubWorkflow } from "../store/subworkflows/types";
import {
  createWorkflowAction,
  deleteWorkflowAction,
  updateWorkflowAction,
} from "../store/workflows/actions";
import { IWorkflow } from "../store/workflows/types";
import { CardStatus } from "./Card";
import ContextMenu from "./ContextMenu";
import { Button } from "./elements";
import EntityDetailsAnnotations from "./EntityDetailsAnnotations";
import CardDetailsComments from "./EntityDetailsComments";
import CardDetailsDescription from "./EntityDetailsDescription";
import CardDetailsTitle from "./EntityDetailsTitle";
import { TimeAgo } from "./TimeAgo";

const mapStateToProps = (state: AppState) => ({
  application: application(state),
  subWorkflows: subWorkflows(state),
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
  deleteAllFeaturesByMilestone: deleteAllFeaturesByMilestoneAction,
  deleteAllFeaturesBySubWorkflow: deleteAllFeaturesBySubWorkflowAction,
  updateProject: updateProjectAction,
  createProject: createProjectAction,
  deleteProject: deleteProjectAction,
};

type PropsFromState = {
  application: Application;
  subWorkflows: ISubWorkflow[];
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
  deleteAllFeaturesByMilestone: typeof deleteAllFeaturesByMilestoneAction;
  deleteAllFeaturesBySubWorkflow: typeof deleteAllFeaturesBySubWorkflowAction;
  updateProject: typeof updateProjectAction;
  createProject: typeof createProjectAction;
  deleteProject: typeof deleteProjectAction;
};

type SelfProps = {
  entity: EntityTypes;
  comments: IFeatureComment[];
  url: string;
  close: () => void;
  viewOnly: boolean;
  demo: boolean;
};

type Props = PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  copySuccess: boolean;
  editTitle: boolean;
  editAnnotations: boolean;
};

class EntityDetailsBody extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editTitle: false,
      copySuccess: false,
      editAnnotations: false,
    };
  }

  urlRef = createRef<HTMLInputElement>();

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

  handleDelete = () => {
    const card = this.props.entity;

    switch (card.kind) {
      case "project": {
        if (
          !window.confirm(
            "Deleting the project will delete all the contents of the project. Do you want to proceed?"
          )
        ) {
          return;
        }

        this.props.deleteProject(card.id);
        if (!this.props.demo) {
          API_DELETE_PROJECT(card.workspaceId, card.id).then((response) => {
            if (response.ok) {
            } else {
              alert("Something went wrong.");
            }
          });
        }

        break;
      }

      case "milestone": {
        this.props.deleteMilestone(card.id);
        this.props.deleteAllFeaturesByMilestone(card.id);

        if (!this.props.demo) {
          API_DELETE_MILESTONE(card.workspaceId, card.id).then((response) => {
            if (response.ok) {
            } else {
              alert("Something went wrong.");
            }
          });
        }
        break;
      }

      case "subworkflow": {
        this.props.deleteSubWorkflow(card.id);
        this.props.deleteAllFeaturesBySubWorkflow(card.id);

        if (!this.props.demo) {
          API_DELETE_SUBWORKFLOW(card.workspaceId, card.id).then((response) => {
            if (response.ok) {
            } else {
              alert("Something went wrong.");
            }
          });
        }
        break;
      }

      case "workflow": {
        this.props.deleteWorkflow(card.id);

        getSubWorkflowByWorkflow(this.props.subWorkflows, card.id).forEach(
          (x) => this.props.deleteAllFeaturesBySubWorkflow(x.id)
        );

        if (!this.props.demo) {
          API_DELETE_WORKFLOW(card.workspaceId, card.id).then((response) => {
            if (response.ok) {
            } else {
              alert("Something went wrong.");
            }
          });
        }
        break;
      }

      case "feature": {
        this.props.deleteFeature(card.id);
        if (!this.props.demo) {
          API_DELETE_FEATURE(card.workspaceId, card.id).then((response) => {
            if (response.ok) {
            } else {
              alert("Something went wrong.");
            }
          });
        }
        break;
      }

      default:
        break;
    }
    this.props.close();
  };

  handleClose = () => {
    const card = this.props.entity;

    switch (card.kind) {
      case "feature": {
        this.props.updateFeature({
          ...card,
          status: CardStatus.CLOSED,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_CLOSE_FEATURE(card.workspaceId, card.id).then((response) => {
            if (response.ok) {
              response.json().then((data: IFeature) => {
                this.props.updateFeature(data);
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
          status: CardStatus.CLOSED,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_CLOSE_MILESTONE(card.workspaceId, card.id).then((response) => {
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

      case "subworkflow": {
        this.props.updateSubWorkflow({
          ...card,
          status: CardStatus.CLOSED,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_CLOSE_SUBWORKFLOW(card.workspaceId, card.id).then((response) => {
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

      case "workflow": {
        this.props.updateWorkflow({
          ...card,
          status: CardStatus.CLOSED,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_CLOSE_WORKFLOW(card.workspaceId, card.id).then((response) => {
            if (response.ok) {
              response.json().then((data: IFeature) => {
                this.props.updateFeature(data);
              });
            } else {
              alert("Something went wrong.");
            }
          });
        }
        break;
      }

      default:
        break;
    }

    this.props.close();
  };

  handleOpen = () => {
    const card = this.props.entity;

    switch (card.kind) {
      case "feature": {
        this.props.updateFeature({
          ...card,
          status: CardStatus.OPEN,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_OPEN_FEATURE(card.workspaceId, card.id).then((response) => {
            if (response.ok) {
              response.json().then((data: IFeature) => {
                this.props.updateFeature(data);
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
          status: CardStatus.OPEN,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_OPEN_MILESTONE(card.workspaceId, card.id).then((response) => {
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

      case "subworkflow": {
        this.props.updateSubWorkflow({
          ...card,
          status: CardStatus.OPEN,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_OPEN_SUBWORKFLOW(card.workspaceId, card.id).then((response) => {
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

      case "workflow": {
        this.props.updateWorkflow({
          ...card,
          status: CardStatus.OPEN,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_OPEN_WORKFLOW(card.workspaceId, card.id).then((response) => {
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

      default:
        break;
    }
  };

  handleChangeColor = (color: Color) => {
    const card = this.props.entity;

    switch (card.kind) {
      case "feature": {
        this.props.updateFeature({
          ...card,
          color: color,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_CHANGE_FEATURE_COLOR(card.workspaceId, card.id, color).then(
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

      case "milestone": {
        this.props.updateMilestone({
          ...card,
          color: color,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_CHANGE_MILESTONE_COLOR(card.workspaceId, card.id, color).then(
            (response) => {
              if (response.ok) {
                response.json().then((data: IMilestone) => {
                  this.props.updateMilestone(data);
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
          color: color,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_CHANGE_WORKFLOW_COLOR(card.workspaceId, card.id, color).then(
            (response) => {
              if (response.ok) {
                response.json().then((data: IWorkflow) => {
                  this.props.updateWorkflow(data);
                });
              } else {
                alert("Something went wrong.");
              }
            }
          );
        }
        break;
      }

      case "subworkflow": {
        this.props.updateSubWorkflow({
          ...card,
          color: color,
          lastModified: new Date().toISOString(),
          lastModifiedByName:
            this.props.application.account === undefined
              ? "demo"
              : this.props.application.account.name,
        });
        if (!this.props.demo) {
          API_CHANGE_SUBWORKFLOW_COLOR(card.workspaceId, card.id, color).then(
            (response) => {
              if (response.ok) {
                response.json().then((data: ISubWorkflow) => {
                  this.props.updateSubWorkflow(data);
                });
              } else {
                alert("Something went wrong.");
              }
            }
          );
        }
        break;
      }

      default:
        break;
    }
  };

  render() {
    let open = true;
    switch (this.props.entity.kind) {
      case "milestone":
      case "subworkflow":
      case "workflow":
      case "feature":
        open = this.props.entity.status === CardStatus.OPEN;
        break;
      default:
    }

    const A = () => {
      switch (this.props.entity.kind) {
        case "workflow":
        case "subworkflow":
        case "milestone":
        case "feature": {
          const color = this.props.entity.color;
          return (
            <div className="mt-3 flex flex-col text-xs ">
              <div className=" mb-1 font-bold">Color</div>
              <div className="flex grow items-center">
                <div className="flex flex-row">
                  {Colors.map((x) => {
                    return [
                      <div key={x} className="mr-1 flex  flex-col">
                        <button
                          onClick={() => this.handleChangeColor(x)}
                          title={x}
                          className={
                            "flex h-4 w-4 border " +
                            colorToBackgroundColorClass(x) +
                            " " +
                            colorToBorderColorClass(x)
                          }
                        />
                        <div className="flex justify-center">
                          {color === x ? <div>●</div> : null}
                        </div>
                      </div>,
                    ];
                  })}{" "}
                </div>
              </div>
            </div>
          );
        }
        default:
          return null;
      }
    };

    const B = () => {
      switch (this.props.entity.kind) {
        case "feature": {
          const fea: IFeature = this.props.entity;
          return (
            <div className="mt-1 flex flex-col text-xs  ">
              <div className=" mb-1 font-bold">Size</div>
              <div className="flex grow items-center">
                <Formik
                  initialValues={{
                    estimate: this.props.entity.estimate,
                  }}
                  validationSchema={Yup.object().shape({
                    estimate: Yup.number()
                      .integer("Must be an integer.")
                      .max(999, "Max 999.")
                      .min(0, "Must be positive."),
                  })}
                  onSubmit={(values: { estimate: number }) => {
                    const est = values.estimate ? values.estimate : 0;

                    this.props.updateFeature({
                      ...fea,
                      estimate: est,
                      lastModified: new Date().toISOString(),
                      lastModifiedByName:
                        this.props.application.account === undefined
                          ? "demo"
                          : this.props.application.account.name,
                    });

                    if (!this.props.demo) {
                      API_CHANGE_FEATURE_ESTIMATE(
                        this.props.entity.workspaceId,
                        this.props.entity.id,
                        est
                      ).then((response) => {
                        if (response.ok) {
                          response.json().then((data: IFeature) => {
                            this.props.updateFeature(data);
                          });
                        } else {
                          alert("Something went wrong.");
                        }
                      });
                    }
                  }}
                >
                  {(formikBag: FormikProps<{ estimate: number }>) => (
                    <Form>
                      <Field
                        name="estimate"
                        component="input"
                        type="number"
                        min="0"
                        max="999"
                        className="mr-2 w-16 rounded border p-2"
                        onBlur={() => formikBag.submitForm()}
                      />

                      {formikBag.touched.estimate &&
                        formikBag.errors.estimate && (
                          <div className="text-xs font-bold text-red-500">
                            {formikBag.errors.estimate}
                          </div>
                        )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          );
        }
        default:
          return null;
      }
    };

    const C = () => {
      switch (this.props.entity.kind) {
        case "milestone":
        case "subworkflow":
        case "workflow":
        case "feature":
          if (this.props.entity.status === "OPEN") {
            return (
              <Button
                secondary
                icon="check_circle_outline"
                iconColor="text-red-500"
                title="Mark card as Closed"
                handleOnClick={this.handleClose}
              />
            );
          }
          if (this.props.entity.status === "CLOSED") {
            return (
              <Button
                secondary
                title="Reopen card"
                handleOnClick={this.handleOpen}
              />
            );
          }

          return null;

        default:
          return null;
      }
    };

    return (
      <div className="flex flex-col">
        <div
          className={
            "flex h-4 w-full " +
            (this.props.entity.kind === "project"
              ? ""
              : colorToBackgroundColorClass(this.props.entity.color))
          }
        />
        <div className={"flex h-full w-full flex-row overflow-auto bg-white "}>
          <div className="flex w-full flex-col p-2  ">
            <EntityDetailsAnnotations
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              viewOnly={this.props.viewOnly}
              open={open}
              card={this.props.entity}
              demo={this.props.demo}
              edit={false}
              close={() => alert("close")}
            />
            <CardDetailsTitle
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              demo={this.props.demo}
              viewOnly={this.props.viewOnly}
              card={this.props.entity}
              app={this.props.application}
              url={this.props.url}
              close={this.props.close}
            />
            <CardDetailsDescription
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              demo={this.props.demo}
              viewOnly={this.props.viewOnly}
              entity={this.props.entity}
              app={this.props.application}
              url={this.props.url}
              close={this.props.close}
            />

            {this.props.entity.kind === "feature" ? (
              <CardDetailsComments
                demo={this.props.demo}
                viewOnly={this.props.viewOnly}
                entity={this.props.entity}
                app={this.props.application}
                comments={this.props.comments}
                open={open}
              />
            ) : null}
          </div>
          <div className="flex w-64 flex-col bg-gray-100 p-2">
            <div className="flex items-center justify-end">
              {!this.props.viewOnly ? (
                <ContextMenu icon="more_horiz">
                  <div className="absolute top-0 right-0  mt-8 min-w-full rounded bg-white text-xs shadow-md">
                    <ul className="">
                      <li>
                        <Button
                          noborder
                          title="Delete"
                          icon="delete"
                          warning
                          handleOnClick={this.handleDelete}
                        />
                      </li>
                    </ul>
                  </div>
                </ContextMenu>
              ) : null}
              <div>
                <button onClick={() => this.props.close()}>
                  {" "}
                  <i className="material-icons ">clear</i>
                </button>
              </div>
            </div>
            <div className="flex flex-col text-xs">
              <div className=" mb-1 font-bold">Permalink</div>
              <div className="flex grow items-center">
                <div className="flex grow ">
                  <input
                    onClick={() => this.urlRef.current!.select()}
                    ref={this.urlRef}
                    readOnly
                    className="mr-1 w-full  border p-1"
                    value={
                      window.location.protocol +
                      "//" +
                      window.location.host +
                      this.props.url
                    }
                  />
                </div>
                <div>
                  {document.queryCommandSupported("copy") && (
                    <button
                      onClick={() =>
                        this.copyToClipboard(
                          window.location.protocol +
                            "//" +
                            window.location.host +
                            this.props.url
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

            {!this.props.viewOnly && open ? <div>{A()}</div> : null}

            {!this.props.viewOnly && open ? <div>{B()}</div> : null}

            <div className="mt-3 flex flex-col text-xs ">
              <div className=" mb-1 font-bold">Created</div>
              <div className="flex grow items-center">
                <span className="font-medium">
                  <TimeAgo date={this.props.entity.createdAt} /> by{" "}
                  {this.props.entity.createdByName}
                </span>
              </div>
            </div>
            <div className="mt-3 flex flex-col text-xs ">
              <div className=" mb-1 font-bold">Last modified</div>
              <div className="flex grow items-center  ">
                <span className="font-medium">
                  <TimeAgo date={this.props.entity.lastModified} /> by{" "}
                  {this.props.entity.lastModifiedByName}
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-col text-xs ">
              <div className="flex grow items-center  ">
                {!this.props.viewOnly ? <div>{C()}</div> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityDetailsBody);
