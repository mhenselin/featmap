import React, { Component, Dispatch } from "react";
import { connect } from "react-redux";
import { AppState, AllActions } from "../store";
import {
  application,
  getWorkspaceByName,
} from "../store/application/selectors";
import { createProjectAction } from "../store/projects/actions";
import { IProject } from "../store/projects/types";
import {
  Formik,
  FormikHelpers as FormikActions,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from "formik";
import { API_CREATE_PROJECT } from "../api";
import { v4 as uuid } from "uuid";
import * as Yup from "yup";
import { IApplication } from "../store/application/types";
import { Button } from "./elements";

const mapStateToProps = (state: AppState) => ({
  application: application(state),
});

const mapDispatchToProps = {
  createProject: createProjectAction,
};

type PropsFromState = {
  application: IApplication;
};

type PropsFromDispatch = {
  createProject: typeof createProjectAction;
};
type SelfProps = {
  workspaceName: string;
  close: () => void;
};
type Props = PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  show: boolean;
};

const Schema = Yup.object().shape({
  title: Yup.string()
    .min(1, "Project minimum 1 characters.")
    .max(200, "Project  maximum 200 characters.")
    .required("Title required."),
});

export const submit = (dispatch: Dispatch<AllActions>) => {
  return (workspaceId: string, title: string) => {
    const projectId = uuid();

    return API_CREATE_PROJECT(workspaceId, projectId, title).then(
      (response) => {
        if (response.ok) {
          response.json().then((data: IProject) => {
            dispatch(createProjectAction(data));
          });
        }
      }
    );
  };
};

type formValues = {
  title: string;
};

class CreateProjectModal extends Component<Props, State> {
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
            initialValues={{ title: "" }}
            validationSchema={Schema}
            onSubmit={(
              values: formValues,
              actions: FormikActions<formValues>
            ) => {
              const projectId = uuid();

              const workspaceId = getWorkspaceByName(
                this.props.application,
                this.props.workspaceName
              )!.id;

              API_CREATE_PROJECT(workspaceId, projectId, values.title).then(
                (response) => {
                  if (response.ok) {
                    response.json().then((data: IProject) => {
                      this.props.createProject(data);
                      this.props.close();
                    });
                  } else {
                    response.json().then((data) => {
                      switch (data.message) {
                        case "title_invalid": {
                          actions.setFieldError("title", "Title is invalid.");
                          break;
                        }
                        default: {
                          break;
                        }
                      }
                    });
                  }
                }
              );

              actions.setSubmitting(false);
            }}
          >
            {(formikBag: FormikProps<formValues>) => (
              <Form>
                {formikBag.status && formikBag.status.msg && (
                  <div>{formikBag.status.msg}</div>
                )}

                <div className="flex flex-col ">
                  <div className="mb-2"> Create project </div>

                  <div>
                    <Field name="title">
                      {({ form }: FieldProps<formValues>) => (
                        <div className="flex flex-col">
                          <div>
                            <input
                              autoFocus
                              type="text"
                              value={form.values.title}
                              onChange={form.handleChange}
                              placeholder="Title"
                              id="title"
                              className="w-full rounded border p-2	"
                            />
                          </div>
                          <div className="p-1 text-xs font-bold text-red-500">
                            {form.touched.title &&
                              form.errors.title &&
                              form.errors.title.toString()}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateProjectModal);
