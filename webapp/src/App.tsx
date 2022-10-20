import { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import { MessageTray } from "./components/MessageTray";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import CancelPage from "./pages/CancelPage";
import ContactPage from "./pages/ContactPage";
import ExternalLinkPage from "./pages/ExternalLinkPage";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LogInPage";
import LogoutPage from "./pages/LogOutPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetPasswordWithKeyPage from "./pages/ResetPasswordWithKeyPage";
import SignUpPage from "./pages/SignUpPage";
import SignupSuccessPage from "./pages/SignupSuccessPage";
import SuccessPage from "./pages/SuccessPage";
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
          <Route path="/account/success" component={SuccessPage} />
          <Route path="/account/signupsuccess" component={SignupSuccessPage} />
          <Route path="/account/cancel" component={CancelPage} />
          <Route path="/account/contact" component={ContactPage} />
          <Route path="/account/logout" component={LogoutPage} />
          <Route path="/account/signup" component={SignUpPage} />
          <Route path="/account/login" component={LoginPage} />
          <Route path="/account/reset" component={ResetPasswordPage} />
          <Route
            path="/account/reset/:key"
            component={ResetPasswordWithKeyPage}
          />
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
