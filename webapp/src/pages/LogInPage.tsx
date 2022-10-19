import type {
  FieldProps,
  FormikHelpers as FormikActions,
  FormikProps,
} from "formik";
import { Field, Form, Formik } from "formik";
import { Component } from "react";
import type { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { API_LOG_IN as LoginApi, API_LOG_IN_REQ } from "../api";
import { Button } from "../components/elements";

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Email invalid.").required("Email required."),
  password: Yup.string()
    .min(6, "Password minimum 6 characters.")
    .max(200, "Password maximum 200 characters.")
    .required("Password required."),
});

type PropsFromState = Record<string, never>;
type RouterProps = RouteComponentProps;
type PropsFromDispatch = Record<string, never>;
type SelfProps = Record<string, never>;
type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;
class LogIn extends Component<Props> {
  render() {
    const { history } = this.props;
    return (
      <div className="flex w-full  flex-col  items-center justify-center p-2 ">
        <div className="flex  w-full  max-w-xl flex-col   items-center  p-3  ">
          <div className="flex  flex-col items-baseline p-2">
            <div className="p-1 ">
              <h1 className={"text-3xl font-medium"}>Log in to Featmap</h1>
            </div>
          </div>
          <div className="flex  flex-col items-baseline p-2">
            <div className="p-1 ">
              Enter your <b>email adress</b> and <b>password</b>.
            </div>
          </div>

          <div>
            <Formik
              initialValues={{ email: "", password: "" }}
              initialStatus=""
              validationSchema={SignupSchema}
              onSubmit={(
                values: API_LOG_IN_REQ,
                actions: FormikActions<API_LOG_IN_REQ>
              ) => {
                actions.setStatus("");
                LoginApi(values).then((response) => {
                  if (response.ok) {
                    response.json().then(() => {
                      history.push("/");
                    });
                  } else {
                    actions.setStatus("Email or password is incorrect.");
                  }
                });

                actions.setSubmitting(false);
              }}
            >
              {(formikBag: FormikProps<API_LOG_IN_REQ>) => (
                <Form>
                  <div className="p-1 text-xs font-bold text-red-500">
                    {formikBag.status}
                  </div>

                  <Field name="email">
                    {({ form }: FieldProps<API_LOG_IN_REQ>) => (
                      <div className="flex  flex-row items-baseline">
                        <div className="flex w-full flex-col">
                          <div>
                            <input
                              type="text"
                              placeholder="Email"
                              value={form.values.email}
                              onChange={form.handleChange}
                              id="email"
                              className="w-64 rounded border p-2 text-lg	"
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

                  <Field name="password">
                    {({ form }: FieldProps<API_LOG_IN_REQ>) => (
                      <div className="flex flex-row items-baseline">
                        <div className="flex w-full flex-col">
                          <div>
                            <input
                              type="password"
                              value={form.values.password}
                              onChange={form.handleChange}
                              placeholder="Password"
                              id="password"
                              className="w-64 rounded border p-2 text-lg	"
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
                  <div className="flex flex-row  items-baseline justify-center">
                    <div className="  justify-center">
                      <Button primary submit title="Log in" />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className="flex  flex-col p-2 ">
            <div className="p-1 text-center">
              Not a member?{" "}
              <Link className="link" to="/account/signup">
                Create an account
              </Link>
            </div>
            <div className="p-1 text-center ">
              Forgotten your password?{" "}
              <Link className="link" to="/account/reset">
                Reset password{" "}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LogIn;
