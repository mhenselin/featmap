import type { FormikHelpers as FormikActions, FormikProps } from "formik";
import { Form, Formik } from "formik";
import { Component } from "react";
import type { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { API_ACCEPT_INVITE, API_GET_INVITE } from "../api";
import { Button } from "../components/elements";
import { memberLevelToTitle } from "../core/misc";
import { IInvite } from "../store/application/types";

type PropsFromState = Record<string, never>;
type RouterProps = RouteComponentProps<{
  code: string;
}>;
type PropsFromDispatch = Record<string, never>;
type SelfProps = Record<string, never>;
type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  invite?: IInvite;
  notFound: boolean;
  success: boolean;
};

class AcceptInvitePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      invite: undefined,
      notFound: false,
      success: false,
    };
  }

  componentDidMount() {
    API_GET_INVITE(this.props.match.params.code).then((response) => {
      if (response.ok) {
        response.json().then((data: IInvite) => {
          this.setState({ invite: data });
        });
      } else {
        this.setState({ notFound: true });
      }
    });
  }

  render() {
    if (this.state.notFound) {
      return (
        <div className="p-2">
          {" "}
          Invitation not found. Back to{" "}
          <Link className="link" to="/">
            Featmap
          </Link>
          .{" "}
        </div>
      );
    }

    if (this.state.success) {
      return (
        <div className="p-2">
          {" "}
          You are now a member of <b> {this.state.invite?.workspaceName}</b>!
          Back to{" "}
          <Link className="link" to="/">
            Featmap
          </Link>
          .{" "}
        </div>
      );
    }

    if (this.state.invite) {
      return (
        <div className="flex w-full  flex-col  items-center justify-center p-2 ">
          <div className="flex  w-full  max-w-xl flex-col   items-center  p-3  ">
            <div className="flex  flex-col items-baseline p-2">
              <div className="p-1 ">
                <h1 className={"text-3xl font-medium"}>
                  Invitation to join workspace
                </h1>
              </div>
            </div>
            <p>
              The workspace name is <b>{this.state.invite?.workspaceName}</b>{" "}
              and you will join as{" "}
              <b>{memberLevelToTitle(this.state.invite?.level)}</b>.
            </p>

            <div>
              <Formik
                initialValues={{}}
                onSubmit={(
                  _,
                  actions: FormikActions<Record<string, never>>
                ) => {
                  actions.setStatus("");
                  API_ACCEPT_INVITE(this.props.match.params.code).then(
                    (response) => {
                      if (response.ok) {
                        this.setState({ success: true });
                      } else {
                        response.json().then((data: { message: string }) => {
                          actions.setStatus(data.message);
                        });
                      }
                    }
                  );

                  actions.setSubmitting(false);
                }}
              >
                {(formikBag: FormikProps<Record<string, never>>) => (
                  <Form>
                    <div className="p-2 font-bold  text-red-500">
                      {formikBag.status}
                    </div>
                    <div className="flex  w-full justify-center text-lg ">
                      <div>
                        <Button title="Accept invite" primary submit />
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="flex  flex-col p-2 ">
              <div className="p-1 text-center">
                Not a member?{" "}
                <Link target="_blank" className="link" to="/account/signup">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div>Loading</div>;
    }
  }
}

export default AcceptInvitePage;
