import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { API_SIGN_UP } from "../api";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Error } from "../components/Error";
import { EmailField } from "../components/FormElements/EmailField";
import { NameField } from "../components/FormElements/NameField";
import { PasswordField } from "../components/FormElements/PasswordField";
import { WorkspaceNameField } from "../components/FormElements/WorkspaceNameField";
import { Headline } from "../components/Headline";
import { OneColumnLayout } from "../components/OneColumnLayout";

export const SignUp: React.FunctionComponent = () => {
  const [apiErrorMessage, setApiErrorMessage] = useState<null | string>(null);
  const { push } = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <OneColumnLayout>
      <Container small className="rounded bg-white shadow-lg">
        <img
          className="mx-auto mb-4"
          width="64"
          height="64"
          src="/apple-touch-icon.png"
          alt=""
        />
        <Headline level={1}>Create a Featmap account</Headline>
        <form
          onSubmit={handleSubmit(({ email, name, workspaceName, password }) => {
            return API_SIGN_UP({ email, name, workspaceName, password })
              .then((response) => {
                if (response.ok) {
                  response.json().then(() => {
                    push("/");
                  });
                } else {
                  response
                    .json()
                    .then((data) => {
                      switch (data.message) {
                        case "email_invalid": {
                          setApiErrorMessage("Email is invalid.");
                          break;
                        }
                        case "workspace_invalid": {
                          setApiErrorMessage("Workspace is invalid.");
                          break;
                        }
                        case "name_invalid": {
                          setApiErrorMessage("Name is invalid.");
                          break;
                        }
                        case "password_invalid": {
                          setApiErrorMessage("Password is invalid.");
                          break;
                        }
                        case "email_taken": {
                          setApiErrorMessage("Email is already registered.");
                          break;
                        }
                        case "workspace_taken": {
                          setApiErrorMessage(
                            "Workspace name is already registrered."
                          );
                          break;
                        }
                        default: {
                          setApiErrorMessage("An unknown error occured.");
                          break;
                        }
                      }
                    })
                    .catch((error) => {
                      setApiErrorMessage(error.toString());
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
          <NameField register={register} errors={errors} />
          <EmailField register={register} errors={errors} />
          <PasswordField register={register} errors={errors} />
          <Error message={apiErrorMessage} />
          <Button isLoading={isSubmitting} type="submit">
            Create account
          </Button>
        </form>
        <div className="mt-4 flex justify-between">
          <Link className="link focus" to="/account/login">
            Log in
          </Link>
          <Link className="link focus" to="/account/reset">
            Reset your password
          </Link>
        </div>
      </Container>
    </OneColumnLayout>
  );
};
