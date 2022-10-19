import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import * as Yup from "yup";
import {
  Formik,
  FormikHelpers as FormikActions,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from "formik";
import { API_NEW_PASSWORD_REQ, API_SET_PASSWORD } from "../api";
import { Link } from "react-router-dom";
import { Button } from "../components/elements";

const Schema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password minimum 6 characters.")
    .max(200, "Password maximum 200 characters.")
    .required("Password required."),
});

type PropsFromState = {};
type RouterProps = {} & RouteComponentProps<{
  key: string;
}>;
type PropsFromDispatch = {};
type SelfProps = {};
type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  showDone: boolean;
};

class ResetPasswordPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showDone: false };
  }

  render() {
    return this.state.showDone ? (
      <div className="p-2">
        <em>The password has been changed.</em> <br />
        <br />
        Back to{" "}
        <Link className="link" to="/">
          Featmap
        </Link>{" "}
      </div>
    ) : (
      <div className="flex w-full  flex-col  items-center justify-center p-2 ">
        <div className="flex  w-full  max-w-2xl flex-col   items-center  p-3  ">
          <div className="flex  flex-col items-baseline p-2">
            <div className="p-1 ">
              <h1 className={"text-3xl font-medium"}>Reset password</h1>
            </div>
          </div>
          <div className="flex  flex-col items-baseline p-2">
            <div className="p-1 ">
              Enter your <b>new password</b> below.
            </div>
          </div>

          <div>
            <Formik
              initialValues={{ password: "", key: this.props.match.params.key }}
              validationSchema={Schema}
              onSubmit={(
                values: API_NEW_PASSWORD_REQ,
                actions: FormikActions<API_NEW_PASSWORD_REQ>
              ) => {
                API_SET_PASSWORD(values).then((response) => {
                  if (response.ok) {
                    this.setState({ showDone: true });
                  } else {
                    response.json().then((data) => {
                      switch (data.message) {
                        case "password_invalid": {
                          actions.setFieldError(
                            "password",
                            "Password is invalid."
                          );
                          break;
                        }
                        default: {
                          break;
                        }
                      }
                    });
                  }
                });

                actions.setSubmitting(false);
              }}
            >
              {(formikBag: FormikProps<API_NEW_PASSWORD_REQ>) => (
                <Form>
                  {formikBag.status && formikBag.status.msg && (
                    <div>{formikBag.status.msg}</div>
                  )}
                  <Field name="password">
                    {({ field, form }: FieldProps<API_NEW_PASSWORD_REQ>) => (
                      <div className="flex flex-row items-baseline">
                        <div className="flex w-full flex-col">
                          <div>
                            <input
                              type="password"
                              value={form.values.password}
                              onChange={form.handleChange}
                              placeholder="password"
                              id="password"
                              className="w-64 rounded border p-2 text-lg 	"
                            />
                          </div>
                          <div className="p-1 text-xs font-bold text-red-500">
                            {form.touched.password &&
                              form.errors.password &&
                              form.errors.password.toString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                  <div className="flex   flex-row justify-center">
                    <Button submit primary title="Change password" />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPasswordPage;
