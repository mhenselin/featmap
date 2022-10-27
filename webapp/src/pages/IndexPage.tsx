import { useEffect, useState } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { API_FETCH_APP, API_FETCH_APP_RESP } from "../api";
import { ApplicationDataProvider } from "../components/ApplicationContext";
import { Error } from "../components/Error";
import { Loading } from "../components/Loading";
import { OneColumnLayout } from "../components/OneColumnLayout";
import { Roles, SubscriptionLevels } from "../core/misc";
import { receiveAppAction } from "../store/application/actions";
import { Application } from "../store/application/types";
import AccountPage from "./AccountPage";
import NotFound from "./NotFound";
import { WorkspacePage } from "./WorkspacePage";
import { Workspaces } from "./Workspaces";

export const Internal = () => {
  const [applicationData, setApplicationData] = useState<Application>({
    memberships: [],
    messages: [],
    subscriptions: [],
    workspaces: [],
  });
  const [isLoading, setLoadingState] = useState(true);
  const [apiErrorMessage, setApiErrorMessage] = useState<null | string>(null);
  const { push } = useHistory();

  useEffect(() => {
    API_FETCH_APP()
      .then((response) => {
        if (response.ok) {
          response.json().then((data: API_FETCH_APP_RESP) => {
            setApplicationData(data);
            receiveAppAction(data);
            setLoadingState(false);
          });
        } else {
          push("/account/login");
        }
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "production") {
          setApiErrorMessage(error.toString());
        } else {
          const data = {
            account: {
              createdAt: String(new Date()),
              email: "",
              emailConfirmationPending: true,
              emailConfirmationSentTo: "",
              emailConfirmed: false,
              id: "1",
              name: "Eric",
            },
            memberships: [
              {
                id: "string",
                workspaceId: "string",
                accountId: "string",
                level: Roles.OWNER,
                name: "string",
                email: "string",
                createdAt: String(new Date()),
              },
            ],
            messages: [],
            subscriptions: [
              {
                id: "string",
                workspaceId: "string",
                level: SubscriptionLevels.TRIAL,
                numberOfEditors: 1,
                fromDate: "string",
                expirationDate: new Date("2022-10-30").toString(),
                createdByName: "string",
                createdAt: "string",
                lastModified: "string",
                lastModifiedByName: "string",
                externalStatus: "trialing",
                externalPlanId: "string",
              },
            ],
            workspaces: [
              {
                id: "string",
                name: "fakeboard",
                createdAt: String(new Date()),
                allowExternalSharing: false,
                euVat: "string",
                externalBillingEmail: "string",
                status: "string",
              },
            ],
          };
          setApplicationData(data);
          receiveAppAction(data);
        }
        setLoadingState(false);
      });
  }, []);

  if (isLoading) {
    return (
      <OneColumnLayout>
        <Loading />
      </OneColumnLayout>
    );
  }

  if (apiErrorMessage) {
    <OneColumnLayout>
      <Error message={apiErrorMessage} />
    </OneColumnLayout>;
  }

  if (!applicationData.account) {
    return <Redirect to="/account/login" />;
  }

  return (
    <ApplicationDataProvider value={applicationData}>
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <Redirect
              to={
                applicationData.workspaces.length === 1
                  ? applicationData.workspaces[0].name
                  : "/account/workspaces"
              }
            />
          )}
        />
        <Route exact path={"/account/workspaces"} component={Workspaces} />
        <Route exact path={"/account/settings"} component={AccountPage} />
        <Route path={"/account/"} component={NotFound} />
        <Route path={"/:workspaceName"} component={WorkspacePage} />
        <Route path={"/"} component={NotFound} />
      </Switch>
    </ApplicationDataProvider>
  );
};
