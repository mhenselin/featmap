import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useRouteMatch } from "react-router-dom";
import { API_SET_PASSWORD } from "../api";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Error } from "../components/Error";
import { PasswordField } from "../components/FormElements/PasswordField";
import { Headline } from "../components/Headline";
import { OneColumnLayout } from "../components/OneColumnLayout";
import { Success } from "../components/Success";

export const ResetWithKey: React.FunctionComponent = () => {
  const [apiErrorMessage, setApiErrorMessage] = useState<null | string>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const { params } = useRouteMatch<{ key: string }>();
  const passwordChanged =
    isSubmitSuccessful && !errors.password && !apiErrorMessage;

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
        <Headline level={1}>Set your new password</Headline>
        <p className="mt-4">
          Enter your <b>new password</b> below.
        </p>
        <form
          onSubmit={handleSubmit(({ password }) => {
            return API_SET_PASSWORD({ key: params.key, password })
              .then((response) => {
                if (!response.ok) {
                  response.json().then((data) => {
                    if (data.message === "password_invalid") {
                      setApiErrorMessage(
                        "You tried to use an invalid password."
                      );
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
          <PasswordField register={register} errors={errors} />
          <Error message={apiErrorMessage} />
          <Success
            message={
              passwordChanged
                ? "Your password was changed succesfully. Go on and log in!"
                : ""
            }
          />
          <Button
            isLoading={isSubmitting}
            disabled={passwordChanged}
            type="submit"
          >
            Change password
          </Button>
        </form>
        <div className="mt-4 flex justify-between">
          <Link className="link focus" to="/account/login">
            Log in
          </Link>
          <Link className="link focus" to="/account/signup">
            Create a new account
          </Link>
        </div>
      </Container>
    </OneColumnLayout>
  );
};
