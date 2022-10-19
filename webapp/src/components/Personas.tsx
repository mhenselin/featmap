import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../store";
import { application } from "../store/application/selectors";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  ErrorMessage,
} from "formik";
import {
  API_UPDATE_PERSONA,
  API_DELTE_PERSONA,
  API_CREATE_PERSONA,
} from "../api";
import * as Yup from "yup";
import { IApplication } from "../store/application/types";
import OnClickOut from "react-onclickoutside";
import { DarkButton, Button } from "./elements";
import { personaBarState } from "../core/misc";
import { IPersona } from "../store/personas/types";
import { avatar, AvatarName } from "../avatars";
import ReactMarkdown from "react-markdown";
import { getPersona } from "../store/personas/selectors";
import {
  updatePersonaAction,
  deletePersonaAction,
  createPersonaAction,
} from "../store/personas/actions";
import { createWorkflowPersonaAction } from "../store/workflowpersonas/actions";
import ContextMenu from "./ContextMenu";
import { v4 as uuid } from "uuid";
import { IWorkflowPersona } from "../store/workflowpersonas/types";

export enum Types {
  MILESTONE = "MILESTONE",
  WORKFLOW = "WORKFLOW",
  SUBWORKFLOW = "SUBWORKFLOW",
  FEATURE = "FEATURE",
}

export type newMilestone = {
  type: Types.MILESTONE;
  payload: {};
};
export type newWorkflow = {
  type: Types.WORKFLOW;
  payload: {};
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
  updatePersona: updatePersonaAction,
  deletePersona: deletePersonaAction,
  createPersona: createPersonaAction,
  createWorkflowPersona: createWorkflowPersonaAction,
};

type PropsFromState = {
  application: IApplication;
};

type PropsFromDispatch = {
  updatePersona: typeof updatePersonaAction;
  deletePersona: typeof deletePersonaAction;
  createPersona: typeof createPersonaAction;
  createWorkflowPersona: typeof createWorkflowPersonaAction;
};
type SelfProps = {
  personas: IPersona[];
  workspaceId: string;
  projectId: string;
  close: () => void;
  demo: boolean;
  pageState: personaBarState;
  setPageState: (s: personaBarState) => void;
  viewOnly: boolean;
};
type Props = PropsFromState & PropsFromDispatch & SelfProps;

type State = {};

class Personas extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  keydownHandler = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      this.props.close();
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.keydownHandler, false);
  }

  handleDeletePersona(personaId: string) {
    this.props.setPageState({ page: "all" });
    this.props.deletePersona(personaId);

    if (!this.props.demo) {
      API_DELTE_PERSONA(this.props.workspaceId, personaId).then((response) => {
        if (response.ok) {
        } else {
          alert("something went wrong when deleting persona");
        }
      });
    }
  }

  render() {
    const parentProps = this.props;

    const parent = this;

    const Dialog = class Dialog extends Component<{ close: () => void }> {
      handleClickOutside = () => {
        this.props.close();
      };

      render() {
        return (
          <div className="w-100 flex h-screen  w-full flex-col bg-gray-900 p-3 text-white  shadow-xl  ">
            <div className="mb-2 flex w-full">
              <div className="grow text-xl ">Personas</div>
              <div>
                <button onClick={() => this.props.close()}>
                  {" "}
                  <i className="material-icons ">clear</i>
                </button>
              </div>
            </div>
            <div className="overflow-y-auto">
              {(() => {
                switch (parent.props.pageState.page) {
                  case "all":
                    return (
                      <div>
                        {(!parent.props.viewOnly || parent.props.demo) && (
                          <div className="mb-2 font-medium underline">
                            <DarkButton
                              primary
                              handleOnClick={() =>
                                parent.props.setPageState({
                                  page: "create",
                                  workflowId: "",
                                  workflowTitle: "",
                                })
                              }
                            >
                              Create new
                            </DarkButton>
                          </div>
                        )}

                        {parentProps.personas.map((p, key) => {
                          return (
                            <div key={key}>
                              <div
                                className="mb-2 flex bg-gray-800 p-2"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  parent.props.setPageState({
                                    page: "persona",
                                    personaId: p.id,
                                    edit: false,
                                  })
                                }
                              >
                                <div className="mr-6">{avatar(p.avatar)}</div>

                                <div className="flex flex-col">
                                  <div className=" font-medium "> {p.name}</div>
                                  <div className="italic "> {p.role}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  case "persona":
                    const p = getPersona(
                      parentProps.personas,
                      parent.props.pageState.personaId
                    );

                    type form = {
                      avatar: AvatarName;
                      name: string;
                      role: string;
                      description: string;
                    };

                    return (
                      <div className=" w-full max-w-lg">
                        {parent.props.pageState.edit ? (
                          <Formik
                            initialValues={{
                              avatar: p.avatar,
                              name: p.name,
                              role: p.role,
                              description: p.description,
                            }}
                            validationSchema={Yup.object().shape({
                              avatar: Yup.string().required("Required."),
                              name: Yup.string()
                                .min(1, "Minimum 1 characters.")
                                .max(200, "Maximum 200 characters.")
                                .required("Required."),
                              role: Yup.string().max(
                                200,
                                "Maximum 200 characters."
                              ),
                              description: Yup.string().max(
                                10000,
                                "Maximum 10000 characters."
                              ),
                            })}
                            onSubmit={(
                              values: form,
                              actions: FormikHelpers<form>
                            ) => {
                              const opt: IPersona = {
                                workspaceId: parent.props.workspaceId,
                                projectId: parent.props.projectId,
                                id: p.id,
                                name: values.name,
                                role: values.role,
                                avatar: values.avatar,
                                description: values.description,
                                createdAt: new Date().toISOString(),
                              };

                              parent.props.updatePersona(opt); //optimistic

                              if (!parent.props.demo) {
                                API_UPDATE_PERSONA(
                                  parent.props.workspaceId,
                                  p.id,
                                  values.avatar,
                                  values.name,
                                  values.role,
                                  values.description
                                ).then((response) => {
                                  if (response.ok) {
                                  } else {
                                    alert(
                                      "something went wrong when editing persona"
                                    );
                                  }
                                });
                              }

                              parent.props.setPageState({
                                page: "persona",
                                personaId: p.id,
                                edit: false,
                              });

                              actions.setSubmitting(false);
                            }}
                            component={(formikBag: FormikProps<form>) => (
                              <Form className="p-1">
                                {formikBag.status && formikBag.status.msg && (
                                  <div>{formikBag.status.msg}</div>
                                )}

                                <div className="flex flex-col    items-baseline sm:flex-row">
                                  <div className=" flex flex-col ">
                                    <div className="flex flex-wrap">
                                      {[
                                        "avatar00",
                                        "avatar01",
                                        "avatar02",
                                        "avatar03",
                                        "avatar04",
                                        "avatar05",
                                        "avatar06",
                                        "avatar07",
                                        "avatar08",
                                      ].map((a, key) => (
                                        <div
                                          key={key}
                                          className={
                                            "mr-2 mb-2 rounded border border-gray-800 p-2 " +
                                            (formikBag.values.avatar === a
                                              ? "bg-gray-200"
                                              : "bg-gray-700")
                                          }
                                        >
                                          <button
                                            type="button"
                                            onClick={() => {
                                              formikBag.setFieldTouched(
                                                "avatar",
                                                true
                                              );
                                              formikBag.setFieldValue(
                                                "avatar",
                                                a
                                              );
                                            }}
                                          >
                                            {avatar(a)}
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <Field name="avatar" className="invisible" />

                                <div className="flex  flex-row items-baseline">
                                  <div className=" flex w-full flex-col">
                                    <div className="font-medium text-gray-300">
                                      Name
                                    </div>
                                    <div>
                                      <Field
                                        autoFocus
                                        name="name"
                                        className="w-full rounded  border border-gray-500 bg-gray-900 p-1 	"
                                        placeholder="E.g. John Smith"
                                      />
                                      <div className="m-1 text-xs font-bold text-red-500">
                                        <ErrorMessage name="name" />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex  flex-row items-baseline">
                                  <div className=" flex w-full flex-col">
                                    <div className="font-medium text-gray-300">
                                      Role
                                    </div>
                                    <div>
                                      <Field
                                        name="role"
                                        className="w-full rounded  border border-gray-500 bg-gray-900 p-1 	"
                                        placeholder="E.g. shopper, influencer, CEO, admin..."
                                      />
                                      <div className="m-1 text-xs font-bold text-red-500">
                                        <ErrorMessage name="role" />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex  flex-row items-baseline">
                                  <div className=" flex w-full flex-col">
                                    <div className="font-medium text-gray-300">
                                      Description
                                    </div>
                                    <div>
                                      <Field
                                        rows={15}
                                        as="textarea"
                                        name="description"
                                        className="w-full rounded  border border-gray-500 bg-gray-900 p-1 	"
                                        placeholder="Describe behaviors, needs and goals..."
                                      />
                                      <div className="m-1 text-xs font-bold text-red-500">
                                        <ErrorMessage name="description" />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex justify-end  ">
                                  <DarkButton
                                    handleOnClick={() =>
                                      parent.props.setPageState({
                                        page: "persona",
                                        personaId: p.id,
                                        edit: false,
                                      })
                                    }
                                  >
                                    Cancel
                                  </DarkButton>
                                  <div className="ml-2"></div>
                                  <DarkButton primary submit>
                                    Save
                                  </DarkButton>
                                </div>
                              </Form>
                            )}
                          />
                        ) : (
                          <div>
                            <div className="mb-2 font-medium underline">
                              <DarkButton
                                handleOnClick={() =>
                                  parent.props.setPageState({ page: "all" })
                                }
                              >
                                All personas
                              </DarkButton>
                            </div>
                            <div className="mb-2 flex">
                              <div className="flex grow  bg-gray-800 p-2">
                                <div className="mr-6 flex shrink-0 items-start justify-items-start">
                                  {avatar(p.avatar)}
                                </div>

                                <div className="flex flex-col">
                                  <div className=" text-xl "> {p.name}</div>
                                  <div className="italic "> {p.role}</div>

                                  <div className="mt-2">
                                    <div className="markdown-body  text-white">
                                      <ReactMarkdown
                                        children={p.description}
                                        linkTarget="_blank"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-800">
                                {(!parent.props.viewOnly ||
                                  parent.props.demo) && (
                                  <ContextMenu icon="more_horiz">
                                    <div className="absolute top-0 right-0  mt-8 min-w-full rounded bg-white text-xs shadow-md">
                                      <ul className="list-reset">
                                        <li>
                                          <Button
                                            noborder
                                            title="Delete"
                                            icon="delete"
                                            warning
                                            handleOnClick={() =>
                                              parent.handleDeletePersona(p.id)
                                            }
                                          />
                                        </li>
                                      </ul>
                                    </div>
                                  </ContextMenu>
                                )}
                              </div>
                            </div>

                            {(!parent.props.viewOnly || parent.props.demo) && (
                              <div>
                                <DarkButton
                                  primary
                                  handleOnClick={() =>
                                    parent.props.setPageState({
                                      page: "persona",
                                      personaId: p.id,
                                      edit: true,
                                    })
                                  }
                                >
                                  {" "}
                                  <i
                                    style={{ fontSize: "18px" }}
                                    className="material-icons align-middle"
                                  >
                                    {" "}
                                    edit
                                  </i>{" "}
                                  Edit persona{" "}
                                </DarkButton>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  case "create":
                    const workflowId = parent.props.pageState.workflowId;

                    return (
                      <div>
                        <h1>
                          Create new persona{" "}
                          {parent.props.pageState.workflowId !== "" ? (
                            <span>
                              and add to goal{" "}
                              <b>{parent.props.pageState.workflowTitle}</b>
                            </span>
                          ) : (
                            ""
                          )}
                        </h1>

                        <Formik
                          initialValues={{
                            avatar: "avatar00",
                            name: "",
                            role: "",
                            description: "",
                          }}
                          validationSchema={Yup.object().shape({
                            avatar: Yup.string().required("Required."),
                            name: Yup.string()
                              .min(1, "Minimum 1 characters.")
                              .max(200, "Maximum 200 characters.")
                              .required("Required."),
                            role: Yup.string().max(
                              200,
                              "Maximum 200 characters."
                            ),
                            description: Yup.string().max(
                              10000,
                              "Maximum 10000 characters."
                            ),
                          })}
                          onSubmit={(
                            values: form,
                            actions: FormikHelpers<form>
                          ) => {
                            const optimisticPersona: IPersona = {
                              workspaceId: parent.props.workspaceId,
                              projectId: parent.props.projectId,
                              id: uuid(),
                              name: values.name,
                              role: values.role,
                              avatar: values.avatar,
                              description: values.description,
                              createdAt: new Date().toISOString(),
                            };

                            parent.props.createPersona(optimisticPersona); //optimistic

                            const workflowPersonaId = uuid();

                            if (!parent.props.demo) {
                              API_CREATE_PERSONA(
                                optimisticPersona.workspaceId,
                                optimisticPersona.projectId,
                                optimisticPersona.id,
                                optimisticPersona.avatar,
                                optimisticPersona.name,
                                optimisticPersona.role,
                                optimisticPersona.description,
                                workflowId,
                                workflowPersonaId
                              ).then((response) => {
                                if (!response.ok) {
                                  alert(
                                    "something went wrong when creating persona"
                                  );
                                }
                              });
                            }

                            if (workflowId !== "") {
                              const optimisticWorkflowPersona: IWorkflowPersona =
                                {
                                  id: workflowPersonaId,
                                  personaId: optimisticPersona.id,
                                  projectId: optimisticPersona.projectId,
                                  workflowId: workflowId,
                                  workspaceId: parent.props.workspaceId,
                                };

                              parent.props.createWorkflowPersona(
                                optimisticWorkflowPersona
                              );
                            }

                            parent.props.setPageState({ page: "all" });

                            actions.setSubmitting(false);
                          }}
                        >
                          {(formikBag: FormikProps<form>) => (
                            <Form className="p-1">
                              {formikBag.status && formikBag.status.msg && (
                                <div>{formikBag.status.msg}</div>
                              )}

                              <div className="flex flex-col    items-baseline sm:flex-row">
                                <div className=" flex flex-col ">
                                  <div className="flex flex-wrap">
                                    {[
                                      "avatar00",
                                      "avatar01",
                                      "avatar02",
                                      "avatar03",
                                      "avatar04",
                                      "avatar05",
                                      "avatar06",
                                      "avatar07",
                                      "avatar08",
                                    ].map((a, key) => (
                                      <div
                                        key={key}
                                        className={
                                          "mr-2 mb-2 rounded border border-gray-800 p-2 " +
                                          (formikBag.values.avatar === a
                                            ? "bg-gray-200"
                                            : "bg-gray-700")
                                        }
                                      >
                                        <button
                                          type="button"
                                          onClick={() => {
                                            formikBag.setFieldTouched(
                                              "avatar",
                                              true
                                            );
                                            formikBag.setFieldValue(
                                              "avatar",
                                              a
                                            );
                                          }}
                                        >
                                          {avatar(a)}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <Field name="avatar" className="invisible" />

                              <div className="flex  flex-row items-baseline">
                                <div className=" flex w-full flex-col">
                                  <div className="font-medium text-gray-300">
                                    Name
                                  </div>
                                  <div>
                                    <Field
                                      autoFocus
                                      name="name"
                                      className="w-full rounded  border border-gray-500 bg-gray-900 p-1 	"
                                      placeholder="E.g. John Smith"
                                    />
                                    <div className="m-1 text-xs font-bold text-red-500">
                                      <ErrorMessage name="name" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex  flex-row items-baseline">
                                <div className=" flex w-full flex-col">
                                  <div className="font-medium text-gray-300">
                                    Role
                                  </div>
                                  <div>
                                    <Field
                                      name="role"
                                      className="w-full rounded  border border-gray-500 bg-gray-900 p-1 	"
                                      placeholder="E.g. shopper, influencer, CEO, admin..."
                                    />
                                    <div className="m-1 text-xs font-bold text-red-500">
                                      <ErrorMessage name="role" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex  flex-row items-baseline">
                                <div className=" flex w-full flex-col">
                                  <div className="font-medium text-gray-300">
                                    Description
                                  </div>
                                  <div>
                                    <Field
                                      rows={15}
                                      as="textarea"
                                      name="description"
                                      className="w-full rounded  border border-gray-500 bg-gray-900 p-1 	"
                                      placeholder="Describe behaviors, needs and goals."
                                    />
                                    <div className="m-1 text-xs font-bold text-red-500">
                                      <ErrorMessage name="description" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end  ">
                                <DarkButton
                                  handleOnClick={() =>
                                    parent.props.setPageState({ page: "all" })
                                  }
                                >
                                  Cancel
                                </DarkButton>
                                <div className="ml-2"></div>
                                <DarkButton primary submit>
                                  CREATE
                                </DarkButton>
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </div>
                    );

                  default:
                    break;
                }
              })()}
            </div>
          </div>
        );
      }
    };

    const DialogWithClickOutside = OnClickOut(Dialog);

    return (
      <div className=" fixed right-0 top-0 z-10  flex  w-full max-w-xl   text-sm">
        <DialogWithClickOutside close={this.props.close} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Personas);
