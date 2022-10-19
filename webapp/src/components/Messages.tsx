import { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../store";
import { application } from "../store/application/selectors";
import { IApplication } from "../store/application/types";

const mapStateToProps = (state: AppState) => ({
  application: application(state),
});

const mapDispatchToProps = {};

type PropsFromState = {
  application: IApplication;
};

type PropsFromDispatch = Record<string, never>;
type SelfProps = Record<string, never>;
type Props = PropsFromState & PropsFromDispatch & SelfProps;

type State = Record<string, never>;

class Messages extends Component<Props, State> {
  render() {
    if (this.props.application.messages.length > 0) {
      return (
        <div className="fixed top-0 left-0  z-0 flex  w-full justify-center p-5">
          <div className="flex flex-col bg-gray-200 ">
            {this.props.application.messages.map((x) => (
              <div className="flex flex-row   items-center  p-1 " key={x.id}>
                {x.type === "success" && (
                  <div className="mr-1">
                    <i className="material-icons text-green-500">done</i>{" "}
                  </div>
                )}
                {x.type === "fail" && (
                  <div className="mr-1">
                    <i className="material-icons text-red-500">error</i>{" "}
                  </div>
                )}
                <div className="flex  grow">{x.message} </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else return null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
