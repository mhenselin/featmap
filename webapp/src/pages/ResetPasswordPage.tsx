import React, { Component } from "react";
import type { RouteComponentProps } from "react-router";
import * as Yup from "yup";
import {
  Formik,
  FormikHelpers as FormikActions,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from "formik";
import { API_PASSWORD_RESET } from "../api";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { Button } from "../components/elements";

const Schema = Yup.object().shape({
  email: Yup.string().email("Email invalid.").required("Email required."),
});

type PropsFromState = {};
type RouterProps = {} & RouteComponentProps<{}>;
type PropsFromDispatch = {};
type SelfProps = {};
type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  email: string;
  showSent: boolean;
};

class ResetPasswordPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showSent: false, email: "" };
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    const email = values.email as string;
    if (email) this.setState({ email: email });
  }

  render() {
    return this.state.showSent ? (
      <div className="w-full justify-center p-4">
        <em>
          An email has been sent with further instructions on how to reset your
          password.{" "}
        </em>{" "}
        <br />
        <br />
        Back to{" "}
        <Link className="link" to="/">
          Featmap
        </Link>{" "}
      </div>
    ) : (
      <div className="flex w-full  flex-col  items-center justify-center p-2 ">
        <div className="flex  w-full  max-w-xl flex-col   items-center  p-3  ">
          <div className="flex  flex-col items-baseline p-2">
            <div className="p-1 ">
              <h1 className={"text-3xl font-medium"}>Reset password</h1>
            </div>
          </div>
          <div className="flex  flex-col items-baseline p-2 text-center">
            <div className="p-1 ">
              Enter your <b>email</b> below.
              <br /> An email with instructions on how to reset your password
              will be sent.{" "}
            </div>
          </div>

          <div>
            <Formik
              initialValues={{ email: this.state.email }}
              enableReinitialize={true}
              validationSchema={Schema}
              onSubmit={(
                values: { email: string },
                actions: FormikActions<{ email: string }>
              ) => {
                API_PASSWORD_RESET(values.email).then((response) => {
                  this.setState({ showSent: true });
                });

                actions.setSubmitting(false);
              }}
            >
              {(formikBag: FormikProps<{ email: string }>) => (
                <Form>
                  {formikBag.status && formikBag.status.msg && (
                    <div>{formikBag.status.msg}</div>
                  )}
                  <Field name="email">
                    {({ form }: FieldProps<{ email: string }>) => (
                      <div className="flex flex-row items-baseline">
                        <div className="flex w-full flex-col">
                          <div>
                            <input
                              name="email"
                              type="email"
                              value={form.values.email}
                              onChange={form.handleChange}
                              placeholder="email"
                              className="w-64 rounded border p-2 text-lg 	"
                            />
                          </div>
                          <div className="p-1 text-xs font-bold text-red-500">
                            {form.touched.email &&
                              form.errors.email &&
                              form.errors.email.toString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                  <div className="flex   flex-row items-baseline justify-center">
                    <Button submit primary title="Reset password" />
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
