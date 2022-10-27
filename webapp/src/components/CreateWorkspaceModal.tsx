import type {
  FieldProps,
  FormikHelpers as FormikActions,
  FormikProps,
} from "formik";
import { Field, Form, Formik } from "formik";
import { Component, Dispatch } from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import { API_CREATE_WORKSPACE } from "../api";
import { AllActions, AppState } from "../store";
import { application } from "../store/application/selectors";
import { Application } from "../store/application/types";
import { Button } from "./elements";

import { getApp, newMessage } from "../store/application/actions";

const mapDispatchToProps = (dispatch: Dispatch<AllActions>) => ({
  getApp: getApp(dispatch),
  newMessage: newMessage(dispatch),
});

const mapStateToProps = (state: AppState) => ({
  application: application(state),
});

type PropsFromState = {
  application: Application;
};

type PropsFromDispatch = {
  getApp: ReturnType<typeof getApp>;
  newMessage: ReturnType<typeof newMessage>;
};

type SelfProps = {
  close: () => void;
};
type Props = PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  show: boolean;
};

const Schema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[a-z0-9]+$/, "Lowercase alphanumerics only. Spaces not allowed.")
    .min(2, "Minimum 2 characters.")
    .max(200, "Maximum 200 characters.")
    .required("Required."),
});

type formValues = {
  name: string;
};

class CreateWorkspaceModal extends Component<Props, State> {
  keydownHandler = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      this.props.close();
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.keydownHandler, false);
  }

  render() {
    const bg = {
      background: " rgba(0,0,0,.75)",
    };

    return (
      <div
        style={bg}
        className="fixed top-0 left-0 z-0 flex h-full w-full items-center justify-center bg-gray-100 p-1 text-sm"
      >
        <div className="w-full max-w-xs bg-white  p-3">
          <Formik
            initialValues={{ name: "" }}
            validationSchema={Schema}
            onSubmit={(
              values: formValues,
              actions: FormikActions<formValues>
            ) => {
              API_CREATE_WORKSPACE(values.name).then((response) => {
                if (response.ok) {
                  response.json().then(() => {
                    this.props.getApp();
                    this.props.close();
                  });
                } else {
                  response.json().then((data) => {
                    switch (data.message) {
                      case "name_invalid": {
                        actions.setFieldError("name", "Name is invalid.");
                        break;
                      }
                      case "workspace_taken": {
                        actions.setFieldError(
                          "name",
                          "The name is already taken."
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
            {(formikBag: FormikProps<formValues>) => (
              <Form>
                {formikBag.status && formikBag.status.msg && (
                  <div>{formikBag.status.msg}</div>
                )}

                <div className="flex flex-col ">
                  <div className="mb-2"> Create workspace </div>

                  <div>
                    <Field name="name">
                      {({ form }: FieldProps<formValues>) => (
                        <div className="flex flex-col">
                          <div className="flex flex-row items-center">
                            <div className="w-full">
                              <input
                                type="text"
                                value={form.values.name}
                                onChange={form.handleChange}
                                placeholder="Name"
                                id="name"
                                className="w-full rounded border p-2	"
                              />
                            </div>
                          </div>
                          <div className="p-1 text-xs font-bold text-red-500">
                            {form.touched.name &&
                              form.errors.name &&
                              form.errors.name.toString()}
                          </div>
                        </div>
                      )}
                    </Field>
                  </div>
                  <div className="flex justify-end">
                    <div className="flex flex-row">
                      <div className="mr-1">
                        <Button submit title="Create" primary />
                      </div>
                      <div>
                        <Button
                          title="Cancel"
                          handleOnClick={this.props.close}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWorkspaceModal);
