import React, { Component } from "react";
import type { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

type PropsFromState = {};
type RouterProps = {} & RouteComponentProps<{}>;
type PropsFromDispatch = {};
type SelfProps = {};
type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  sent: boolean;
};

class CancelPage extends Component<Props, State> {
  render() {
    return (
      <div className="flex w-full  flex-col  items-center justify-center p-2 ">
        <div className="flex  w-full  max-w-xl flex-col   items-center  p-3   ">
          <div className="flex  flex-col items-baseline p-2">
            <div className="p-1 ">
              {" "}
              <h2>
                {" "}
                <i className="material-icons text-red text-3xl">error</i>{" "}
                Something went wrong
              </h2>
            </div>
            <div className="p-1 ">
              Please try again or contact{" "}
              <Link className="link" to="/contact">
                support
              </Link>
              .
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

export default CancelPage;
