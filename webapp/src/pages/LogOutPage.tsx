import { Component } from "react";
import type { RouteComponentProps } from "react-router";
import { API_LOG_OUT } from "../api";
import { resetAppAction } from "../store/application/actions";

import { connect } from "react-redux";

const mapDispatchToProps = {
  resetApp: resetAppAction,
};

type PropsFromState = Record<string, never>;
type RouterProps = RouteComponentProps;
type PropsFromDispatch = {
  resetApp: typeof resetAppAction;
};
type SelfProps = Record<string, never>;
type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;
class LogoutPage extends Component<Props> {
  componentDidMount() {
    API_LOG_OUT().then((resp) => {
      if (resp.ok) {
        this.props.resetApp();
        this.props.history.push("/");
      }
    });
  }

  render() {
    return <div />;
  }
}

export default connect(null, mapDispatchToProps)(LogoutPage);
