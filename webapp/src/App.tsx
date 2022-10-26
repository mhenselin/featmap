import { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import { MessageTray } from "./components/MessageTray";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import ExternalLinkPage from "./pages/ExternalLinkPage";
import IndexPage from "./pages/IndexPage";
import { Login } from "./pages/Login";
import LogoutPage from "./pages/LogOutPage";
import { Reset } from "./pages/Reset";
import { ResetWithKey } from "./pages/ResetWithKey";
import { SignUp } from "./pages/SignUpPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { AppState } from "./store";
import { application } from "./store/application/selectors";
import { IApplication } from "./store/application/types";

const mapStateToProps = (state: AppState) => ({
  application: application(state),
});

type Props = {
  application: IApplication;
};

class App extends Component<Props, Record<string, never>> {
  render() {
    return (
      <div id="main">
        <Switch>
          <Route path="/link/:key" component={ExternalLinkPage} />
          <Route path="/account/logout" component={LogoutPage} />
          <Route path="/account/signup" component={SignUp} />
          <Route path="/account/login" component={Login} />
          <Route exact path="/account/reset" component={Reset} />
          <Route path="/account/reset/:key" component={ResetWithKey} />
          <Route
            path="/account/invitation/:code"
            component={AcceptInvitePage}
          />
          <Route path={"/account/verify/:key"} component={VerifyEmailPage} />
          <Route path="/" component={IndexPage} />
        </Switch>
        <MessageTray />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(App);
