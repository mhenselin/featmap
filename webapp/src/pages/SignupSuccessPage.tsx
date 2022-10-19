import React, { Component } from "react";
import type { RouteComponentProps } from "react-router";
import { Button } from "../components/elements";

type PropsFromState = {};
type RouterProps = {} & RouteComponentProps<{}>;
type PropsFromDispatch = {};
type SelfProps = {};
type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;

type State = {};

class SignupSuccessPage extends Component<Props, State> {
  render() {
    const { history } = this.props;
    return (
      <div className="flex w-full  flex-col  items-center justify-center p-2 ">
        <div className="flex  w-full  max-w-xl flex-col   items-center  p-3 ">
          <div className="flex  flex-col items-baseline p-2">
            <div className="p-1 text-2xl font-bold ">Welcome to Featmap!</div>
            <div className="p-1 text-center ">
              {" "}
              <Button
                title="Get started"
                primary
                handleOnClick={() => history.push("/")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupSuccessPage;
