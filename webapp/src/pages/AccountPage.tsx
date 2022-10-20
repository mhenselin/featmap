import type {
  FieldProps,
  FormikHelpers as FormikActions,
  FormikProps,
} from "formik";
import { Field, Form, Formik } from "formik";
import { Component, Dispatch } from "react";
import { connect } from "react-redux";
import type { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import {
  API_CHANGE_EMAIL,
  API_CHANGE_EMAIL_REQ,
  API_CHANGE_NAME,
  API_CHANGE_NAME_REQ,
  API_DELETE_ACCOUNT,
  API_RESEND_EMAIL,
} from "../api";
import { Button, CardLayout } from "../components/elements";
import Header from "../components/Header";
import { AllActions, AppState } from "../store";
import { newMessage } from "../store/application/actions";

const mapDispatchToProps = (dispatch: Dispatch<AllActions>) => ({
  newMessage: newMessage(dispatch),
});

const mapStateToProps = (state: AppState) => ({
  state: state,
});

type PropsFromState = {
  state: AppState;
};
type RouterProps = RouteComponentProps;
type PropsFromDispatch = {
  newMessage: ReturnType<typeof newMessage>;
};
type OwnProps = Record<string, never>;
type Props = RouterProps & PropsFromState & PropsFromDispatch & OwnProps;

type State = {
  reallySureWarning: boolean;
};

class WorkspacesPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { reallySureWarning: false };
  }

  render() {
    return (
      <div>
        <Header account={this.props.state.application.application.account!} />
        <div>
          <h3 className="p-2">Account settings</h3>

          {this.props.state.application.application.account!
            .emailConfirmationPending && (
            <CardLayout title="">
              <span className="text-xl text-red-500">⬤</span>{" "}
              <em>Email adress verfication missing</em>
              <hr />
              <p>
                {" "}
                A mail has been sent to{" "}
                <i>
                  {
                    this.props.state.application.application.account!
                      .emailConfirmationSentTo
                  }
                </i>
                , but we have not yet received verfication.{" "}
              </p>
              <hr />
              <Formik
                initialValues={{}}
                initialStatus=""
                onSubmit={(
                  _,
                  actions: FormikActions<Record<string, never>>
                ) => {
                  actions.setStatus("");
                  API_RESEND_EMAIL().then((response) => {
                    if (response.ok) {
                      actions.setStatus("Mail sent.");
                    } else {
                      actions.setStatus("Something went wrong.");
                    }
                  });

                  actions.setSubmitting(false);
                }}
              >
                {(formikBag: FormikProps<Record<string, never>>) => (
                  <Form>
                    <Field name="email">
                      {() => (
                        <div>
                          <div className="flex  flex-row items-baseline">
                            <div className=" w-full text-xs">
                              <Button submit secondary title="Resend email" />
                            </div>
                          </div>
                          <div className="p-1 text-xs font-bold">
                            {formikBag.status}
                          </div>
                        </div>
                      )}
                    </Field>
                  </Form>
                )}
              </Formik>
            </CardLayout>
          )}

          <CardLayout title="Email adress">
            <p>
              Your email adress is{" "}
              {this.props.state.application.application.account!.email}
            </p>

            {this.props.state.application.application.account!
              .emailConfirmed ? (
              <p>
                <span className="text-xl text-green-500 ">⬤</span> The email
                adress is verified..{" "}
              </p>
            ) : (
              <p>
                <span className="text-xl text-red-500">⬤</span>{" "}
                <em>The email adress is not verified.</em>{" "}
              </p>
            )}

            <hr />
            <div className="flex flex-row items-baseline">
              <Formik
                initialValues={{ email: "" }}
                initialStatus=""
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email("Invalid email adress.")
                    .required("Required."),
                })}
                onSubmit={(
                  values: API_CHANGE_EMAIL_REQ,
                  actions: FormikActions<API_CHANGE_EMAIL_REQ>
                ) => {
                  actions.setStatus("");
                  API_CHANGE_EMAIL(values).then((response) => {
                    if (response.ok) {
                      actions.setStatus(
                        "An email has been sent to your new email with instructions."
                      );
                    } else {
                      actions.setStatus("Something went wrong.");
                    }
                  });

                  actions.setSubmitting(false);
                }}
              >
                {(formikBag: FormikProps<API_CHANGE_EMAIL_REQ>) => (
                  <Form>
                    <Field name="email">
                      {({ form }: FieldProps<API_CHANGE_EMAIL_REQ>) => (
                        <div className=" ">
                          <div className="flex  flex-row items-baseline">
                            <div className="mr-1 flex w-full flex-col">
                              <div>
                                <input
                                  type="text"
                                  value={form.values.email}
                                  onChange={form.handleChange}
                                  placeholder="email"
                                  id="email"
                                  className="rounded border p-1  	"
                                />
                              </div>
                            </div>
                            <span className="text-xs">
                              <Button
                                submit
                                title="Change email"
                                secondary
                                small
                              />
                            </span>
                          </div>
                          <div className="p-1 text-xs font-bold text-red-500">
                            {form.touched.email &&
                              form.errors.email &&
                              form.errors.email.toString()}
                          </div>

                          <div className="p-1 text-xs font-bold">
                            {formikBag.status}
                          </div>
                        </div>
                      )}
                    </Field>
                  </Form>
                )}
              </Formik>
            </div>
          </CardLayout>

          <CardLayout title="Name">
            <p>
              Your name is{" "}
              {this.props.state.application.application.account!.name}.{" "}
            </p>

            <hr />
            <div className="flex flex-row items-baseline">
              <Formik
                initialValues={{
                  name: this.props.state.application.application.account!.name,
                }}
                initialStatus=""
                validationSchema={Yup.object().shape({
                  name: Yup.string()
                    .min(1, "Minimum 1 characters.")
                    .max(200, "Maximum 200 characters.")
                    .required("Required."),
                })}
                onSubmit={(
                  values: API_CHANGE_NAME_REQ,
                  actions: FormikActions<API_CHANGE_NAME_REQ>
                ) => {
                  actions.setStatus("");
                  API_CHANGE_NAME(values).then((response) => {
                    if (response.ok) {
                      actions.setStatus(
                        "Names is changed. Refresh your browser for it to take effect."
                      );
                    } else {
                      actions.setStatus("Something went wrong.");
                    }
                  });

                  actions.setSubmitting(false);
                }}
              >
                {(formikBag: FormikProps<API_CHANGE_NAME_REQ>) => (
                  <Form>
                    <Field name="name">
                      {({ form }: FieldProps<API_CHANGE_NAME_REQ>) => (
                        <div className=" ">
                          <div className="flex  flex-row items-center">
                            <div className="mr-1 flex w-full flex-col">
                              <div>
                                <input
                                  type="text"
                                  value={form.values.name}
                                  onChange={form.handleChange}
                                  placeholder="name"
                                  id="name"
                                  className="rounded border p-1 	"
                                />
                              </div>
                            </div>
                            <div className=" w-full text-xs">
                              <Button
                                submit
                                title="Change name"
                                secondary
                                small
                              />
                            </div>
                          </div>
                          <div className="p-1 text-xs font-bold text-red-500">
                            {form.touched.name &&
                              form.errors.name &&
                              form.errors.name.toString()}
                          </div>

                          <div className="p-1 text-xs font-bold">
                            {formikBag.status}
                          </div>
                        </div>
                      )}
                    </Field>
                  </Form>
                )}
              </Formik>
            </div>
          </CardLayout>

          <CardLayout title="Password">
            <p>
              To change your password, initiate a{" "}
              <Link
                className="link"
                to={
                  "/account/reset?email=" +
                  this.props.state.application.application.account!.email
                }
              >
                password reset
              </Link>
              .
            </p>
          </CardLayout>

          <CardLayout title="Delete account">
            <p>
              By deleting your account, all your workspace memberships will be
              permanently deleted.
            </p>
            <Formik
              initialValues={{}}
              onSubmit={() => {
                API_DELETE_ACCOUNT().then((response) => {
                  if (response.ok) {
                    window.location.href = "/";
                  } else {
                    response.json().then((data: { message: string }) => {
                      // noinspection JSIgnoredPromiseFromCall
                      this.props.newMessage("fail", data.message);
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
                      title="Delete account"
                    />{" "}
                    {this.state.reallySureWarning && (
                      <Button submit warning title="Yes, I am really sure!" />
                    )}{" "}
                  </p>
                </Form>
              )}
            </Formik>
          </CardLayout>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspacesPage);
