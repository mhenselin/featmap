import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { API_LOG_IN as LoginApi } from "../api";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Error } from "../components/Error";
import { Headline } from "../components/Headline";
import { Icon } from "../components/Icon";
import { Input } from "../components/Input";
import { OneColumnLayout } from "../components/OneColumnLayout";

export const Login: React.FunctionComponent = () => {
  const { push } = useHistory();
  const [apiErrorMessage, setApiErrorMessage] = useState<null | string>(null);
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
        <Headline level={1}>Log in to your account</Headline>
        <form
          onSubmit={handleSubmit(({ email, password }) => {
            return LoginApi({ email, password })
              .then((response) => {
                if (response.ok) {
                  response.json().then(() => {
                    push("/");
                  });
                } else {
                  setApiErrorMessage(
                    "The login data you provided does not seem to be correct."
                  );
                }
              })
              .catch((error) => {
                setApiErrorMessage(error.toString());
              });
          })}
          className="mt-4 flex flex-col gap-4"
        >
          <Input
            icon={<Icon type="email" />}
            label="Email address"
            {...register("email", {
              required: "Email Address is a required field.",
            })}
            placeholder="you@website.com"
            error={errors.email}
          />
          <Input
            icon={<Icon type="vpn_key" />}
            label="Password"
            {...register("password", {
              required: "Password is a required field.",
              minLength: {
                value: 6,
                message: "Your password must at least consist of 6 characters.",
              },
              maxLength: {
                value: 200,
                message:
                  "Your password exceeds the maximum length of 200 characters. Please shorten your password.",
              },
            })}
            type="password"
            error={errors.password}
          />
          <Error message={apiErrorMessage} />
          <Button isLoading={isSubmitting} type="submit">
            Log in
          </Button>
        </form>
        <div className="mt-4 flex justify-between">
          <Link className="link focus" to="/account/reset">
            Reset your password
          </Link>
          <Link className="link focus" to="/account/signup">
            Create a new account
          </Link>
        </div>
      </Container>
    </OneColumnLayout>
  );
};
