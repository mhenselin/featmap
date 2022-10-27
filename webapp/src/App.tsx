import { Route, Switch } from "react-router-dom";
import { MessageTray } from "./components/MessageTray";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import ExternalLinkPage from "./pages/ExternalLinkPage";
import { Internal } from "./pages/IndexPage";
import { Login } from "./pages/Login";
import LogoutPage from "./pages/LogOutPage";
import { Reset } from "./pages/Reset";
import { ResetWithKey } from "./pages/ResetWithKey";
import { SignUp } from "./pages/SignUpPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

import "./App.css";

export const App = () => {
  return (
    <>
      <Switch>
        <Route path="/link/:key" component={ExternalLinkPage} />
        <Route path="/account/logout" component={LogoutPage} />
        <Route path="/account/signup" component={SignUp} />
        <Route path="/account/login" component={Login} />
        <Route path="/account/invitation/:code" component={AcceptInvitePage} />
        <Route path="/account/verify/:key" component={VerifyEmailPage} />
        <Route exact path="/account/reset" component={Reset} />
        <Route path="/account/reset/:key" component={ResetWithKey} />
        <Route path="/" component={Internal} />
      </Switch>
      <MessageTray />
    </>
  );
};
