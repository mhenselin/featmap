import type { FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import { Component, Dispatch, FunctionComponent, useState } from "react";
import { connect } from "react-redux";
import type { RouteComponentProps } from "react-router";
import * as Yup from "yup";
import {
  API_CHANGE_ALLOW_EXTERNAL_SHARING,
  API_CREATE_INVITE,
  API_DELETE_INVITE,
  API_DELETE_MEMBER,
  API_DELETE_WORKSPACE,
  API_GET_INVITES,
  API_GET_MEMBERS,
  API_LEAVE,
  API_RESEND_INVITE,
  API_UPDATE_MEMBER_LEVEL,
} from "../api";
import { Button, CardLayout } from "../components/elements";
import { Headline } from "../components/Headline";
import { Loading } from "../components/Loading";
import { MessageType } from "../components/Message";
import { TimeAgo } from "../components/TimeAgo";
import { isEditor, memberLevelToTitle } from "../core/misc";
import { AllActions, AppState } from "../store";
import { newMessage, receiveAppAction } from "../store/application/actions";
import {
  application,
  getMembership,
  getWorkspaceByName,
} from "../store/application/selectors";
import {
  Application,
  IInvite,
  Membership,
  Workspace,
} from "../store/application/types";

const mapStateToProps = (state: AppState) => ({
  application: application(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AllActions>) => ({
  newMessage: newMessage(dispatch),
  receiveApp: receiveAppAction,
});

type PropsFromState = {
  application: Application;
};
type RouterProps = RouteComponentProps<{
  workspaceName: string;
}>;
type PropsFromDispatch = {
  newMessage: ReturnType<typeof newMessage>;
  receiveApp: typeof receiveAppAction;
};
type SelfProps = Record<string, never>;
type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  members: Membership[];
  invites: IInvite[];
  reallySureWarning: boolean;
  allowExternalSharing: boolean;
  loading: boolean;
};

class WorkspaceSettingsPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      members: [],
      invites: [],
      reallySureWarning: false,
      allowExternalSharing: false,
      loading: true,
    };

    this.ws = getWorkspaceByName(
      props.application,
      props.match.params.workspaceName
    );
  }

  private ws: Workspace | undefined;

  componentDidMount() {
    this.loadMembers();
    this.loadInvites();

    if (this.ws?.allowExternalSharing) {
      this.setState({ allowExternalSharing: this.ws.allowExternalSharing });
    }
    this.setState({ loading: false });
  }

  loadInvites() {
    if (this.ws?.id) {
      API_GET_INVITES(this.ws.id).then((response) => {
        if (response.ok) {
          response.json().then((data: IInvite[]) => {
            this.setState({ invites: data });
          });
        }
      });
    }
  }

  loadMembers() {
    if (this.ws?.id) {
      API_GET_MEMBERS(this.ws.id).then((response) => {
        if (response.ok) {
          response.json().then((data: Membership[]) => {
            this.setState({ members: data });
          });
        }
      });
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    const m = getMembership(this.props.application, this.ws?.id);
    type changeRoleForm = { level: string };
    type inviteForm = { email: string; level: string };

    const MemberBox: FunctionComponent<{ member: Membership }> = (props) => {
      const [show, setShow] = useState(false);

      const isMyself =
        props.member.accountId === this.props.application.account?.id;
      return (
        <div>
          <div className="flex flex-row  ">
            <div className="flex grow flex-col">
              <div className="">
                {props.member.name} ({props.member.email}){" "}
                {isMyself && (
                  <span className="bg-gray-200 p-1 text-xs font-bold text-black ">
                    THIS IS YOU
                  </span>
                )}{" "}
              </div>
              <div className="mt-1 text-xs">
                {" "}
                {memberLevelToTitle(props.member.level)}. Joined{" "}
                <TimeAgo date={props.member.createdAt} />.
              </div>
            </div>

            {!isMyself && (
              <div className="">
                <button onClick={() => setShow(!show)}>
                  {" "}
                  <i className="material-icons">expand_more</i>
                </button>{" "}
              </div>
            )}
          </div>

          {!isMyself && show && (
            <div className="flex flex-row ">
              <div className="mt-3 grow text-xs">
                <Formik
                  initialValues={{ level: props.member.level }}
                  validationSchema={Yup.object().shape({
                    level: Yup.string().required("Required."),
                  })}
                  onSubmit={(values: changeRoleForm) => {
                    if (this.ws?.id) {
                      API_UPDATE_MEMBER_LEVEL(
                        this.ws.id,
                        props.member.id,
                        values.level
                      ).then((response) => {
                        response.json().then((data: { message: string }) => {
                          if (response.ok) {
                            this.loadMembers();
                            this.props.newMessage(
                              MessageType.SUCCESS,
                              "role changed"
                            );
                          } else {
                            this.props.newMessage(
                              MessageType.FAILURE,
                              data.message
                            );
                          }
                        });
                      });
                    }
                  }}
                  component={({ status }) => (
                    <Form>
                      {status && status.msg && <div>{status.msg}</div>}

                      <div>
                        <Field
                          name="level"
                          component="select"
                          className="mr-2 rounded border p-1"
                        >
                          <option value="VIEWER">
                            {memberLevelToTitle("VIEWER")}
                          </option>
                          <option value="EDITOR">
                            {memberLevelToTitle("EDITOR")}
                          </option>
                          <option value="ADMIN">
                            {memberLevelToTitle("ADMIN")}
                          </option>
                          <option value="OWNER">
                            {memberLevelToTitle("OWNER")}
                          </option>
                        </Field>
                        <Button secondary small submit title="Change role" />
                      </div>
                    </Form>
                  )}
                ></Formik>
              </div>

              <div className="mt-3 ml-3 flex  text-xs">
                <Formik
                  initialValues={{ level: props.member.level }}
                  validationSchema={Yup.object().shape({
                    level: Yup.string().required("Required."),
                  })}
                  onSubmit={() => {
                    if (this.ws?.id) {
                      API_DELETE_MEMBER(this.ws.id, props.member.id).then(
                        (response) => {
                          if (response.ok) {
                            this.loadMembers();
                            this.props.newMessage(
                              MessageType.SUCCESS,
                              "membership removed"
                            );
                          } else {
                            response
                              .json()
                              .then((data: { message: string }) => {
                                this.props.newMessage(
                                  MessageType.FAILURE,
                                  data.message
                                );
                              });
                          }
                        }
                      );
                    }
                  }}
                  component={({ status }) => (
                    <Form>
                      {status && status.msg && <div>{status.msg}</div>}
                      <div>
                        <Button warning submit small title="Delete" />
                      </div>
                    </Form>
                  )}
                ></Formik>
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <div>
        <Headline level={1}>Workspace settings</Headline>

        <CardLayout title="My membership">
          {memberLevelToTitle(m?.level)}. Joined <TimeAgo date={m?.createdAt} />
          .
          {m?.level !== "OWNER" && ( // Owners are not allowed to leave their own workspace
            <div>
              <Formik
                initialValues={{ email: "", level: 10 }}
                onSubmit={() => {
                  if (this.ws?.id) {
                    API_LEAVE(this.ws.id).then((response) => {
                      if (response.ok) {
                        this.props.newMessage(
                          MessageType.SUCCESS,
                          "left workspace"
                        );
                        window.location.href = "/";
                      } else {
                        response.json().then((data: { message: string }) => {
                          this.props.newMessage(
                            MessageType.FAILURE,
                            data.message
                          );
                        });
                      }
                    });
                  }
                }}
              >
                <Form>
                  <p className="text-xs">
                    <Button small warning submit title="Leave workspace" />
                  </p>
                </Form>
              </Formik>
            </div>
          )}
        </CardLayout>

        <CardLayout title="Private link (WIP ?)">
          {(() => {
            const submit = () => {
              if (this.ws?.id) {
                API_CHANGE_ALLOW_EXTERNAL_SHARING(
                  this.ws.id,
                  !this.state.allowExternalSharing
                ).then((response) => {
                  if (response.ok) {
                    this.setState({
                      allowExternalSharing: !this.state.allowExternalSharing,
                    });

                    this.props.newMessage(
                      MessageType.SUCCESS,
                      "setting changed"
                    );
                  }
                });
              }
            };

            return (
              <div>
                <p>
                  <input
                    onChange={submit}
                    checked={this.state.allowExternalSharing}
                    type="checkbox"
                  />{" "}
                  Projects can be shared with people who are not members of the
                  workspace (view only).
                </p>
              </div>
            );
          })()}
        </CardLayout>

        {m?.level === "ADMIN" || m?.level === "OWNER" ? (
          <CardLayout title="Workspace invites">
            {
              <div>
                <div className="">
                  <Formik
                    initialValues={{ email: "", level: "VIEWER" }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string()
                        .email("Invalid.")
                        .required("Required."),
                      level: Yup.string().required("Required."),
                    })}
                    onSubmit={(values: inviteForm) => {
                      if (this.ws?.id) {
                        API_CREATE_INVITE(
                          this.ws.id,
                          values.email,
                          values.level
                        ).then((response) => {
                          if (response.ok) {
                            this.loadInvites();
                            this.props.newMessage(
                              MessageType.SUCCESS,
                              "invite sent"
                            );
                          } else {
                            response
                              .json()
                              .then((data: { message: string }) => {
                                this.props.newMessage(
                                  MessageType.FAILURE,
                                  data.message
                                );
                              });
                          }
                        });
                      }
                    }}
                  >
                    {(formikBag: FormikProps<inviteForm>) => (
                      <Form>
                        {formikBag.status && formikBag.status.msg && (
                          <div>{formikBag.status.msg}</div>
                        )}

                        <div className="flex flex-col ">
                          <div className="m-1 flex flex-col">
                            <Field
                              name="email"
                              component="input"
                              className="w-64 rounded border  p-2  "
                              placeholder="email"
                            ></Field>
                            {formikBag.touched.email &&
                              formikBag.errors.email && (
                                <div className="text-xs font-bold text-red-500">
                                  {formikBag.errors.email}
                                </div>
                              )}
                          </div>

                          <div className="m-1 flex flex-col">
                            <Field
                              name="level"
                              component="select"
                              className="w-64 rounded border  bg-white  p-2  "
                            >
                              <option value="VIEWER">
                                {memberLevelToTitle("VIEWER")}
                              </option>
                              <option value="EDITOR">
                                {memberLevelToTitle("EDITOR")}
                              </option>
                              <option value="ADMIN">
                                {memberLevelToTitle("ADMIN")}
                              </option>
                              <option value="OWNER">
                                {memberLevelToTitle("OWNER")}
                              </option>
                            </Field>
                          </div>
                          <div className="m-1 text-xs">
                            <Button submit secondary title="Send invitation" />
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>

                <div className="mt-2">
                  <div className="flex max-w-2xl  flex-col  ">
                    <div className="p-3 text-sm ">
                      {this.state.invites.length} pending invite(s)
                    </div>
                    <div className=" p-1  ">
                      {this.state.invites.map((x) => (
                        <div className=" w-full p-2" key={x.id}>
                          <p>{x.email}</p>
                          <p className="">
                            Invited as <b>{memberLevelToTitle(x.level)}</b> by{" "}
                            {x.createdByName} <TimeAgo date={x.createdAt} />.{" "}
                          </p>
                          <div className="mt-1 flex  flex-row">
                            <div>
                              <Formik
                                initialValues={{ email: "", level: 10 }}
                                onSubmit={() => {
                                  if (this.ws?.id) {
                                    API_DELETE_INVITE(this.ws.id, x.id).then(
                                      (response) => {
                                        if (response.ok) {
                                          this.loadInvites();
                                          this.props.newMessage(
                                            MessageType.SUCCESS,
                                            "invite canceled"
                                          );
                                        } else {
                                          response
                                            .json()
                                            .then(
                                              (data: { message: string }) => {
                                                this.props.newMessage(
                                                  MessageType.FAILURE,
                                                  data.message
                                                );
                                              }
                                            );
                                        }
                                      }
                                    );
                                  }
                                }}
                                component={() => (
                                  <Form>
                                    <span className="text-xs">
                                      <Button
                                        small
                                        secondary
                                        submit
                                        title="Cancel invite"
                                      />
                                    </span>
                                  </Form>
                                )}
                              ></Formik>
                            </div>
                            <div className="ml-1">
                              <Formik
                                initialValues={{}}
                                onSubmit={() => {
                                  if (this.ws?.id) {
                                    API_RESEND_INVITE(this.ws.id, x.id).then(
                                      (response) => {
                                        if (response.ok) {
                                          this.loadInvites();
                                          this.props.newMessage(
                                            MessageType.SUCCESS,
                                            "invite resent"
                                          );
                                        } else {
                                          response
                                            .json()
                                            .then(
                                              (data: { message: string }) => {
                                                this.props.newMessage(
                                                  MessageType.FAILURE,
                                                  data.message
                                                );
                                              }
                                            );
                                        }
                                      }
                                    );
                                  }
                                }}
                              >
                                {() => (
                                  <Form>
                                    <span className="text-xs">
                                      <Button
                                        small
                                        secondary
                                        submit
                                        title="Resend invite"
                                      />
                                    </span>
                                  </Form>
                                )}
                              </Formik>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            }
          </CardLayout>
        ) : null}

        {m?.level === "ADMIN" || m?.level === "OWNER" ? ( // Admin or higher}
          <CardLayout title="Members">
            {
              <div>
                <div className="mt-2 flex  max-w-2xl flex-col   text-sm ">
                  <div className="p-2  ">
                    {this.state.members.length} member(s),{" "}
                    {this.state.members.filter((x) => isEditor(x.level)).length}{" "}
                    editor(s)
                  </div>
                  <div className=" text-sm   ">
                    {this.state.members.map((x) => (
                      <div className=" w-full p-2" key={x.id}>
                        <MemberBox member={x} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          </CardLayout>
        ) : null}

        {m?.level === "OWNER" ? ( // Admin or higher
          <CardLayout title="Delete workspace">
            <div>
              <p>
                All projects in this workspace will be deleted permanently. You
                need to cancel any active plan before the workspace can be
                deleted.{" "}
              </p>

              <Formik
                initialValues={{}}
                onSubmit={() => {
                  if (this.ws?.id) {
                    API_DELETE_WORKSPACE(this.ws.id).then((response) => {
                      if (response.ok) {
                        this.props.newMessage(
                          MessageType.SUCCESS,
                          "workspace deleted"
                        );
                        window.location.href = "/";
                      } else {
                        response.json().then((data: { message: string }) => {
                          this.props.newMessage(
                            MessageType.FAILURE,
                            data.message
                          );
                        });
                      }
                    });
                  }
                }}
              >
                {() => (
                  <Form>
                    <p className="text-xs">
                      <Button
                        secondary
                        button
                        handleOnClick={() =>
                          this.setState({ reallySureWarning: true })
                        }
                        title="Delete workspace"
                      />{" "}
                      {this.state.reallySureWarning && (
                        <Button submit warning title="Yes, I am really sure!" />
                      )}{" "}
                    </p>
                  </Form>
                )}
              </Formik>
            </div>
          </CardLayout>
        ) : null}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceSettingsPage);
