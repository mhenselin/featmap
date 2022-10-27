import { Input } from "../Input";
import type { FormFieldComponent } from "./types";

export const WorkspaceNameField: FormFieldComponent = (props) => {
  const { errors, register } = props;

  return (
    <Input
      icon="workspaces"
      label="Workspace Name"
      {...register("workspaceName", {
        required: "Workspace Name is a required field.",
        pattern: {
          value: /^[a-z0-9]+$/,
          message:
            "The workspace name must only consist of alphanumeric lowercase characters. Alos spaces are not allowed.",
        },
        maxLength: {
          value: 200,
          message:
            "Your workspace name exceeds the maximum length of 200 characters. Please shorten your workspace name.",
        },
      })}
      placeholder="workspace"
      error={errors.workspaceName}
    />
  );
};
