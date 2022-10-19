import React, { Component } from "react";
import type { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

type PropsFromState = {};
type RouterProps = {} & RouteComponentProps<{}>;
type PropsFromDispatch = {};
type SelfProps = {};
type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;

type State = {};

class SuccessPage extends Component<Props, State> {
  render() {
    return (
      <div className="flex w-full  flex-col  items-center justify-center p-2 ">
        <div className="flex  w-full  max-w-xl flex-col   items-center  p-3 ">
          <div className="flex  flex-col items-baseline p-2">
            <div className="p-1 ">
              <h2>
                <i className="material-icons text-3xl text-green-500">check</i>{" "}
                Plan change successful!
              </h2>
            </div>
            <div className="p-1 ">
              Back to{" "}
              <Link className="link" to="/">
                Featmap
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SuccessPage;
