import { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { API_LOG_OUT } from "../api";
import { Loading } from "../components/Loading";
import { OneColumnLayout } from "../components/OneColumnLayout";
import { resetAppAction } from "../store/application/actions";

const mapDispatchToProps = {
  resetApp: resetAppAction,
};

type PropsFromDispatch = {
  resetApp: typeof resetAppAction;
};
type SelfProps = Record<string, never>;
type Props = PropsFromDispatch & SelfProps;

export const Logout: React.FunctionComponent<Readonly<Props>> = (props) => {
  const { push } = useHistory();

  useEffect(() => {
    API_LOG_OUT().then((resp) => {
      if (resp.ok) {
        props.resetApp();
      }
      push("/");
    });
  }, []);

  return (
    <OneColumnLayout>
      <Loading />
    </OneColumnLayout>
  );
};

export default connect(null, mapDispatchToProps)(Logout);
