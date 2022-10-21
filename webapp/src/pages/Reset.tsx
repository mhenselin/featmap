import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { API_PASSWORD_RESET } from "../api";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Error } from "../components/Error";
import { Headline } from "../components/Headline";
import { Icon } from "../components/Icon";
import { Input } from "../components/Input";
import { OneColumnLayout } from "../components/OneColumnLayout";
import { Success } from "../components/Success";

export const Reset: React.FunctionComponent = () => {
  const [apiErrorMessage, setApiErrorMessage] = useState<null | string>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm();

  const emailSent = isSubmitted && !errors.email;

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
        <Headline level={1}>Reset your password</Headline>
        <p className="mt-4">
          Enter your <b>email</b> below. An email with instructions on how to
          reset your password will be sent.
        </p>
        <form
          onSubmit={handleSubmit(({ email }) => {
            return API_PASSWORD_RESET(email).catch((error) => {
              setApiErrorMessage(error.toString());
            });
          })}
          className="mt-4 flex flex-col gap-4"
        >
          <Input
            icon={<Icon type="email" />}
            label="Email address"
            {...register("email", { required: true })}
            placeholder="you@website.com"
            error={errors.email}
          />
          <Error message={apiErrorMessage} />
          <Success
            message={
              emailSent
                ? "An email has been sent with further instructions on how to reset your password."
                : ""
            }
          />
          <Button isLoading={isSubmitting} disabled={emailSent} type="submit">
            Reset password
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
