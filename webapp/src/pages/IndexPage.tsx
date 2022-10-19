import { Component } from "react";
import { connect } from "react-redux";
import type { RouteComponentProps } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import { API_FETCH_APP, API_FETCH_APP_RESP } from "../api";
import Footer from "../components/Footer";
import { AppState } from "../store";
import { receiveAppAction } from "../store/application/actions";
import { IApplication } from "../store/application/types";
import AccountPage from "./AccountPage";
import NotFound from "./NotFound";
import WorkspacePage from "./WorkspacePage";
import WorkspacesPage from "./WorkspacesPage";

const mapDispatchToProps = {
  applicationReceived: receiveAppAction,
};

const mapStateToProps = (state: AppState) => ({
  application: state.application.application,
});

type PropsFromState = {
  application: IApplication;
};
type RouterProps = RouteComponentProps;
type PropsFromDispatch = {
  applicationReceived: typeof receiveAppAction;
};
type SelfProps = Record<string, never>;
type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  loading: boolean;
};

class Index extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    API_FETCH_APP().then((response) => {
      if (response.ok) {
        response.json().then((data: API_FETCH_APP_RESP) => {
          this.props.applicationReceived(data);
          this.setState({ loading: false });
        });
      } else {
        this.props.history.push("/account/login");
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <div className="p-2">Loading data...</div>;
    } else if (this.props.application.account) {
      return (
        <div>
          <Switch>
            <Route
              exact
              path={this.props.match.path + ""}
              render={() => {
                const app = this.props.application;

                if (app.workspaces && app.workspaces.length === 1) {
                  return <Redirect to={app.workspaces[0].name} />;
                }
                return (
                  <Redirect to={this.props.match.path + "account/workspaces"} />
                );
              }}
            />
            <Route
              exact
              path={this.props.match.path + "account/workspaces"}
              component={WorkspacesPage}
            />
            <Route
              exact
              path={this.props.match.path + "account/settings"}
              component={AccountPage}
            />
            <Route
              path={this.props.match.path + "account/"}
              component={NotFound}
            />
            <Route
              path={this.props.match.path + ":workspaceName"}
              component={WorkspacePage}
            />
            <Route path={this.props.match.path} component={NotFound} />
          </Switch>
          <Footer />
        </div>
      );
    } else {
      return <Redirect to="/account/login" />;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
