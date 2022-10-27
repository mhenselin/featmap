import { useState } from "react";
import { useForm } from "react-hook-form";
import { API_CREATE_WORKSPACE } from "../api";
import { createProjectAction } from "../store/projects/actions";
import { Project } from "../store/projects/types";
import { Button } from "./Button";
import { Error } from "./Error";
import { WorkspaceNameField } from "./FormElements/WorkspaceNameField";
import { Headline } from "./Headline";

export const CreateWorkspaceForm = () => {
  const [apiErrorMessage, setApiErrorMessage] = useState<null | string>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  return (
    <div>
      <Headline level={2}>Create project</Headline>
      <form
        onSubmit={handleSubmit(({ workspaceName }) => {
          return API_CREATE_WORKSPACE(workspaceName)
            .then((response) => {
              if (response.ok) {
                response
                  .json()
                  .then((data: Project) => {
                    createProjectAction(data);
                    reset();
                  })
                  .catch((error) => {
                    setApiErrorMessage(error.toString());
                  });
              } else {
                response.json().then((data) => {
                  switch (data.message) {
                    case "name_invalid": {
                      setApiErrorMessage(
                        "This workspace name seems to be invalid."
                      );
                      break;
                    }
                    case "workspace_taken": {
                      setApiErrorMessage(
                        "This workspace name is already in use."
                      );
                      break;
                    }
                    default: {
                      setApiErrorMessage(
                        "An unknown error occured while creating your new project."
                      );
                      break;
                    }
                  }
                });
              }
            })
            .catch((error) => {
              setApiErrorMessage(error.toString());
            });
        })}
        className="mt-4 flex flex-col gap-4"
      >
        <WorkspaceNameField register={register} errors={errors} />
        <Error message={apiErrorMessage} />
        <Button isLoading={isSubmitting} type="submit">
          Create Workspace
        </Button>
      </form>
    </div>
  );
};
