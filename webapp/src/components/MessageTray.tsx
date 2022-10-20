import { connect } from "react-redux";
import { AppState } from "../store";
import { application } from "../store/application/selectors";
import { IApplication } from "../store/application/types";
import { Message } from "./Message";

type MessageTrayProps = {
  application: IApplication;
};

const UnconnectedMessageTray: React.FunctionComponent<MessageTrayProps> = (
  props
) => {
  const { application } = props;

  if (application.messages.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 z-0 flex w-full justify-center p-5">
      <div className="flex flex-col bg-gray-200">
        {application.messages.map(({ type, message, id }) => (
          <Message key={id} type={type} message={message} />
        ))}
      </div>
    </div>
  );
};

export const MessageTray = connect((state: AppState) => ({
  application: application(state),
}))(UnconnectedMessageTray);
