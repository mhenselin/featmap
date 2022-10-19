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
import { API_SIGN_UP as SignUpApi, API_SIGN_UP_REQ } from "../api";
import { Button } from "../components/elements";

const SignupSchema = Yup.object().shape({
  workspaceName: Yup.string()
    .matches(/^[a-z0-9]+$/, "Lowercase alphanumerics only. Spaces not allowed.")
    .min(2, "Minimum 2 characters.")
    .max(200, "Maximum 200 characters.")
    .required("Required."),
  name: Yup.string()
    .min(1, "Minimum 1 characters.")
    .max(200, "Maximum 200 characters.")
    .required("Required."),

  email: Yup.string().email("Invalid email adress.").required("Required."),
  password: Yup.string()
    .min(6, "Minimum 6 characters.")
    .max(200, "Maximum 200 characters.")
    .required("Required."),
});

type PropsFromState = Record<string, never>;
type RouterProps = RouteComponentProps;
type PropsFromDispatch = Record<string, never>;
type SelfProps = Record<string, never>;
type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;
class SignUp extends Component<Props> {
  render() {
    const { history } = this.props;
    return (
      <div className="flex w-full  flex-col  items-center justify-center p-2 ">
        <div className="flex  w-full  max-w-xl flex-col   items-center  p-3  ">
          <div className="flex  flex-col items-baseline p-2">
            <div className="p-1 ">
              <h1 className={"text-3xl font-medium"}>
                Create a Featmap account
              </h1>
            </div>
          </div>
          <div className="flex  flex-col items-baseline p-2">
            <div className="p-1 ">
              Enter the name of your <b>workspace</b>, <b>work email adress</b>{" "}
              and <b>password</b>.
            </div>
          </div>

          <div className="flex max-w-xs">
            <Formik
              initialValues={{
                workspaceName: "",
                name: "",
                email: "",
                password: "",
              }}
              validationSchema={SignupSchema}
              onSubmit={(
                values: API_SIGN_UP_REQ,
                actions: FormikActions<API_SIGN_UP_REQ>
              ) => {
                SignUpApi(values).then((response) => {
                  if (response.ok) {
                    response.json().then(() => {
                      history.push("/");
                    });
                  } else {
                    response.json().then((data) => {
                      switch (data.message) {
                        case "email_invalid": {
                          actions.setFieldError("email", "Email is invalid.");
                          break;
                        }
                        case "workspace_invalid": {
                          actions.setFieldError(
                            "workspaceName",
                            "Workspace is invalid."
                          );
                          break;
                        }
                        case "name_invalid": {
                          actions.setFieldError("name", "Name is invalid.");
                          break;
                        }
                        case "password_invalid": {
                          actions.setFieldError(
                            "password",
                            "Password is invalid."
                          );
                          break;
                        }
                        case "email_taken": {
                          actions.setFieldError(
                            "email",
                            "Email is already registered."
                          );
                          break;
                        }
                        case "workspace_taken": {
                          actions.setFieldError(
                            "workspaceName",
                            "Workspace name is already registrered."
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
              {(formikBag: FormikProps<API_SIGN_UP_REQ>) => (
                <Form>
                  {formikBag.status && formikBag.status.msg && (
                    <div>{formikBag.status.msg}</div>
                  )}
                  <Field name="workspaceName">
                    {({ form }: FieldProps<API_SIGN_UP_REQ>) => (
                      <div className="flex flex-col    items-baseline sm:flex-row">
                        <div className=" flex w-full flex-col">
                          <div>
                            <input
                              type="text"
                              value={form.values.workspace}
                              onChange={form.handleChange}
                              placeholder="workspace name"
                              id="workspaceName"
                              className="w-full rounded border p-2 text-lg	"
                            />
                          </div>
                          <div className="m-1 text-xs font-bold text-red-500">
                            {form.touched.workspaceName &&
                              form.errors.workspaceName &&
                              form.errors.workspaceName.toString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                  <Field name="name">
                    {({ form }: FieldProps<API_SIGN_UP_REQ>) => (
                      <div className="flex  flex-row items-baseline">
                        <div className=" flex w-full flex-col">
                          <div>
                            <input
                              type="text"
                              value={form.values.name}
                              onChange={form.handleChange}
                              placeholder="Name, e.g. John Smith"
                              id="name"
                              className=" w-full rounded border p-2  text-lg	"
                            />
                          </div>
                          <div className="m-1 text-xs font-bold text-red-500">
                            {form.touched.name &&
                              form.errors.name &&
                              form.errors.name.toString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                  <Field name="email">
                    {({ form }: FieldProps<API_SIGN_UP_REQ>) => (
                      <div className="flex  flex-row items-baseline">
                        <div className="flex w-full flex-col">
                          <div>
                            <input
                              type="text"
                              value={form.values.email}
                              onChange={form.handleChange}
                              placeholder="Work email"
                              id="email"
                              className="w-full rounded border p-2 text-lg	"
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
                    {({ form }: FieldProps<API_SIGN_UP_REQ>) => (
                      <div className="flex flex-row items-baseline">
                        <div className="flex w-full flex-col">
                          <div>
                            <input
                              type="password"
                              value={form.values.password}
                              onChange={form.handleChange}
                              placeholder="Password"
                              id="password"
                              className="w-full rounded border p-2 text-lg	"
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
                  <div className="flex justify-center">
                    <Button submit primary title="Create account" />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className="flex  flex-col p-2 ">
            <div className="p-1 text-center">
              Already have an account?{" "}
              <Link className="link" to="/account/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
