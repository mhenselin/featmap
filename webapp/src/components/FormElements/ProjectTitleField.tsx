import { Input } from "../Input";
import type { FormFieldComponent } from "./types";

export const ProjectTitleField: FormFieldComponent = (props) => {
  const { errors, register } = props;

  return (
    <Input
      icon="schema"
      label="Project Title"
      {...register("title", {
        required: "Porject Title is a required field.",
        maxLength: {
          value: 200,
          message:
            "Your porject title exceeds the maximum length of 200 characters. Please shorten the project title.",
        },
      })}
      placeholder="Neti Pot Manufacturer"
      error={errors.name}
    />
  );
};
