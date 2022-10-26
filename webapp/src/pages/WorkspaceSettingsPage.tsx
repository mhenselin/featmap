import type { FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import { Component, Dispatch, FunctionComponent, useState } from "react";
import { connect } from "react-redux";
import type { RouteComponentProps } from "react-router";
import * as Yup from "yup";
import {
  API_CHANGE_GENERAL_INFORMATION,
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
import { MessageType } from "../components/Message";
import { TimeAgo } from "../components/TimeAgo";
import {
  isEditor,
  memberLevelToTitle,
  subIsInactive,
  subscriptionLevelToText,
} from "../core/misc";
import { AllActions, AppState } from "../store";
import { newMessage, receiveAppAction } from "../store/application/actions";
import {
  application,
  getMembership,
  getSubscription,
  getWorkspaceByName,
} from "../store/application/selectors";
import { IApplication, IInvite, IMembership } from "../store/application/types";

const mapStateToProps = (state: AppState) => ({
  application: application(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AllActions>) => ({
  newMessage: newMessage(dispatch),
  receiveApp: receiveAppAction,
});

type PropsFromState = {
  application: IApplication;
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
  myMembership?: IMembership;
  members: IMembership[];
  invites: IInvite[];
  showMemberDetails: boolean;
  memberId: string;
  reallySureWarning: boolean;
  allowExternalSharing: boolean;
  euVat: string;
  externalBillingEmail: string;
  loading: boolean;
};

class WorkspaceSettingsPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      members: [],
      invites: [],
      showMemberDetails: false,
      memberId: "",
      reallySureWarning: false,
      allowExternalSharing: false,
      euVat: "",
      externalBillingEmail: "",
      loading: true,
    };
  }

  componentDidMount() {
    this.loadMembers();
    this.loadInvites();

    const ws = getWorkspaceByName(
      this.props.application,
      this.props.match.params.workspaceName
    )!;
    this.setState({ allowExternalSharing: ws.allowExternalSharing });
    this.setState({ euVat: ws.euVat });
    this.setState({ externalBillingEmail: ws.externalBillingEmail });
    this.setState({ loading: false });
  }

  loadInvites() {
    const ws = getWorkspaceByName(
      this.props.application,
      this.props.match.params.workspaceName
    )!;
    API_GET_INVITES(ws.id).then((response) => {
      if (response.ok) {
        response.json().then((data: IInvite[]) => {
          this.setState({ invites: data });
        });
      }
    });
  }

  loadMembers() {
    const ws = getWorkspaceByName(
      this.props.application,
      this.props.match.params.workspaceName
    )!;

    API_GET_MEMBERS(ws.id).then((response) => {
      if (response.ok) {
        response.json().then((data: IMembership[]) => {
          this.setState({ members: data });
        });
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <div>Loading</div>;
    } else {
      const ws = getWorkspaceByName(
        this.props.application,
        this.props.match.params.workspaceName
      )!;
      const m = getMembership(this.props.application, ws.id);
      const s = getSubscription(this.props.application, ws.id);
      const hosted = this.props.application.mode === "hosted";
      const hasExpired = subIsInactive(s);
      type changeRoleForm = { level: string };
      type inviteForm = { email: string; level: string };

      type orgInfoForm = { euVat: string; externalBillingEmail: string };

      const MemberBox: FunctionComponent<{ member: IMembership }> = (props) => {
        const [show, setShow] = useState(false);

        const isMyself =
          props.member.accountId === this.props.application.account!.id;
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
                  {!hasExpired && (
                    <Formik
                      initialValues={{ level: props.member.level }}
                      validationSchema={Yup.object().shape({
                        level: Yup.string().required("Required."),
                      })}
                      onSubmit={(values: changeRoleForm) => {
                        API_UPDATE_MEMBER_LEVEL(
                          ws.id,
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
                            <Button
                              secondary
                              small
                              submit
                              title="Change role"
                            />
                          </div>
                        </Form>
                      )}
                    ></Formik>
                  )}
                </div>

                <div className="mt-3 ml-3 flex  text-xs">
                  <Formik
                    initialValues={{ level: props.member.level }}
                    validationSchema={Yup.object().shape({
                      level: Yup.string().required("Required."),
                    })}
                    onSubmit={() => {
                      API_DELETE_MEMBER(ws.id, props.member.id).then(
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
          <h3 className="p-2"> Workspace settings</h3>

          <CardLayout title="My membership">
            <p className="text-sm">
              {" "}
              {memberLevelToTitle(m.level)}. Joined{" "}
              <TimeAgo date={m.createdAt} />.
            </p>
            {m.level !== "OWNER" ? ( // Owners are not allowed to leave their own workspace
              <div>
                <Formik
                  initialValues={{ email: "", level: 10 }}
                  onSubmit={() => {
                    API_LEAVE(ws.id).then((response) => {
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
                  }}
                >
                  <Form>
                    <p className="text-xs">
                      <Button small warning submit title="Leave workspace" />
                    </p>
                  </Form>
                </Formik>
              </div>
            ) : null}
          </CardLayout>

          {m.level === "OWNER" && hosted ? (
            <CardLayout title="Plan">
              <div className="flex flex-col">
                <div>
                  <div className="flex flex-row p-2">
                    <div className="w-48 font-medium">Plan</div>{" "}
                    <div>{subscriptionLevelToText(s.level)}</div>
                  </div>

                  <div className="flex flex-row p-2">
                    <div className="w-48 font-medium">Status</div>
                    <div>
                      {(() => {
                        switch (s.externalStatus) {
                          case "incomplete":
                            return "Inactive (please pay initial payment)";
                          case "incomplete_expired":
                            return "Inactive (initial payment not received)";
                          case "active":
                            return "Active (subscribed to a paid monthly plan)";
                          case "trialing":
                            return subIsInactive(s)
                              ? "Inactive (trial ended)"
                              : "Active (trial)";
                          case "past_due":
                            return "Inactive (payment is past due)";
                          case "canceled":
                            return "Inactive (canceled by user or  due to unpaid invoice)";
                          default:
                            return null;
                        }
                      })()}
                    </div>
                  </div>
                  {!subIsInactive(s) ? (
                    <div>
                      <div className="flex flex-row p-2">
                        <div className="w-48  font-medium">
                          Number of members
                        </div>{" "}
                        <div>{s.numberOfEditors}</div>
                      </div>
                      <div className="flex flex-row p-2">
                        <div className="w-48 font-medium">Start time </div>{" "}
                        <div>
                          {new Date(s.fromDate).toLocaleString([], {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div className="flex flex-row p-2">
                        <div className="w-48 font-medium">Expiration time </div>{" "}
                        <div>
                          {new Date(s.expirationDate).toLocaleString([], {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="mt-5 mb-2 ">
                  <Button
                    primary
                    handleOnClick={() =>
                      this.props.history.push("/" + ws.name + "/subscription")
                    }
                    title={"Change plan - THIS WAS DROPPED"}
                  ></Button>
                </div>
              </div>
            </CardLayout>
          ) : null}

          {m.level === "OWNER" && hosted ? (
            <CardLayout title="Billing information">
              <Formik
                initialValues={{
                  euVat: this.state.euVat,
                  externalBillingEmail: this.state.externalBillingEmail,
                }}
                validationSchema={Yup.object().shape({
                  externalBillingEmail: Yup.string()
                    .email("Invalid email address")
                    .required("Required."),
                })}
                onSubmit={(values: orgInfoForm) => {
                  API_CHANGE_GENERAL_INFORMATION(
                    ws.id,
                    values.euVat,
                    values.externalBillingEmail
                  ).then((response) => {
                    if (response.ok) {
                      this.props.newMessage(
                        MessageType.SUCCESS,
                        "settings changed"
                      );
                      this.setState({
                        euVat: values.euVat,
                        externalBillingEmail: values.externalBillingEmail,
                      });
                    } else {
                      response.json().then((data: { message: string }) => {
                        this.props.newMessage(
                          MessageType.FAILURE,
                          data.message
                        );
                      });
                    }
                  });
                }}
              >
                {(formikBag: FormikProps<orgInfoForm>) => (
                  <Form>
                    <div className="flex flex-col">
                      <div className="flex flex-row p-2">
                        <div className="w-48 font-medium">EU VAT</div>
                        <div>
                          <Field
                            name="euVat"
                            component="input"
                            className="mr-2 rounded border p-2"
                          />
                        </div>
                      </div>
                      <div className="flex flex-row p-2">
                        <div className="w-48 font-medium">
                          Billing e-mail address
                        </div>
                        <div>
                          <Field
                            name="externalBillingEmail"
                            component="input"
                            className="mr-2 rounded border p-2"
                            placeholder="Email address"
                          />
                          {formikBag.touched.externalBillingEmail &&
                            formikBag.errors.externalBillingEmail && (
                              <div className="text-xs font-bold text-red-500">
                                {formikBag.errors.externalBillingEmail}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs">
                      <Button secondary submit title="Save" />
                    </span>
                  </Form>
                )}
              </Formik>
            </CardLayout>
          ) : null}

          {/* {(m.level === "ADMIN" || m.level === "OWNER") && s.level === SubscriptionLevels.PRO ?
                    <CardLayout title="Private link">
                        {
                            (() => {

                                const submit = () => {

                                    API_CHANGE_ALLOW_EXTERNAL_SHARING(ws.id, !this.state.allowExternalSharing)
                                        .then((response) => {
                                            if (response.ok) {
                                                this.setState({ allowExternalSharing: !this.state.allowExternalSharing })

                                                this.props.newMessage(MessageType.SUCCESS, "setting changed")
                                            }
                                            else MessageType.SUCCESS().then((data: {message:string}) => {
                                                    this.props.newMessage(MessageType.FAILURE, data.message)
                                                })
                                            }
                                        }
                                        )
                                }

                                return (
                                    <div >
                                        <p><input onChange={submit} checked={this.state.allowExternalSharing} type="checkbox" /> Projects can be shared with people who are not members of the workspace (view only).</p>
                                    </div>
                                )
                            })()

                        }
                    </CardLayout>
                    :
                    null
                } */}

          {m.level === "ADMIN" || m.level === "OWNER" ? (
            <CardLayout title="Workspace invites">
              {
                <div>
                  {!hasExpired && (
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
                          API_CREATE_INVITE(
                            ws.id,
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
                                <Button
                                  submit
                                  secondary
                                  title="Send invitation"
                                />
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  )}

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
                                    API_DELETE_INVITE(ws.id, x.id).then(
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
                              {!hasExpired && (
                                <div className="ml-1">
                                  <Formik
                                    initialValues={{}}
                                    onSubmit={() => {
                                      API_RESEND_INVITE(ws.id, x.id).then(
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
                              )}
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

          {m.level === "ADMIN" || m.level === "OWNER" ? ( // Admin or higher}
            <CardLayout title="Members">
              {
                <div>
                  <div className="mt-2 flex  max-w-2xl flex-col   text-sm ">
                    <div className="p-2  ">
                      {this.state.members.length} member(s),{" "}
                      {
                        this.state.members.filter((x) => isEditor(x.level))
                          .length
                      }{" "}
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

          {m.level === "OWNER" ? ( // Admin or higher
            <CardLayout title="Delete workspace">
              <div>
                <p>
                  All projects in this workspace will be deleted permanently.
                  You need to cancel any active plan before the workspace can be
                  deleted.{" "}
                </p>

                <Formik
                  initialValues={{}}
                  onSubmit={() => {
                    API_DELETE_WORKSPACE(ws.id).then((response) => {
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
                          <Button
                            submit
                            warning
                            title="Yes, I am really sure!"
                          />
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
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceSettingsPage);
