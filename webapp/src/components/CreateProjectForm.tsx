import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { API_CREATE_PROJECT } from "../api";
import { getWorkspaceByName } from "../store/application/selectors";
import { Project } from "../store/projects/types";
import { useApplicationData } from "./ApplicationContext";
import { Button } from "./Button";
import { Error } from "./Error";
import { ProjectTitleField } from "./FormElements/ProjectTitleField";
import { Headline } from "./Headline";
import { useProjectsData } from "./ProjectsContext";
import { useWorkspaceName } from "./WorkspaceContext";

export const CreateProjectForm = () => {
  const [apiErrorMessage, setApiErrorMessage] = useState<null | string>(null);
  const workspaceName = useWorkspaceName();
  const applicationData = useApplicationData();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const { setProjects } = useProjectsData();

  return (
    <div>
      <Headline level={2}>Create project</Headline>
      <form
        onSubmit={handleSubmit(({ title }) => {
          const projectId = uuid();

          const workspaceId = getWorkspaceByName(
            applicationData,
            workspaceName
          )?.id;

          if (!workspaceId) {
            // todo error handling
            return;
          }

          return API_CREATE_PROJECT(workspaceId, projectId, title)
            .then((response) => {
              if (response.ok) {
                response
                  .json()
                  .then((data: Project) => {
                    setProjects((prevState) => [...prevState, data]);
                    reset();
                  })
                  .catch((error) => {
                    setApiErrorMessage(error.toString());
                  });
              } else {
                response.json().then((data) => {
                  switch (data.message) {
                    case "title_invalid": {
                      setApiErrorMessage(
                        "The project title seems to be invalid."
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
              if (process.env.NODE_ENV === "development") {
                const proj = {
                  kind: "project" as const,
                  annotations: "string",
                  createdAt: new Date().toString(),
                  createdBy: "string",
                  createdByName: "Eric",
                  description: "description",
                  externalLink: "",
                  id: projectId,
                  lastModified: new Date().toString(),
                  lastModifiedByName: "Eric",
                  title,
                  workspaceId,
                };
                console.log("create on catch");
                setProjects((prevState) => [...prevState, proj]);
              }
              setApiErrorMessage(error.toString());
            });
        })}
        className="mt-4 flex flex-col gap-4"
      >
        <ProjectTitleField register={register} errors={errors} />
        <Error message={apiErrorMessage} />
        <Button isLoading={isSubmitting} type="submit">
          Create Project
        </Button>
      </form>
    </div>
  );
};
