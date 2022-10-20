export enum MessageType {
  SUCCESS = "success",
  FAILURE = "fail",
}

export type MessageEntity = {
  id: string;
  type: MessageType;
  message: string;
};

type MessageProps = Omit<MessageEntity, "id">;

export const Message: React.FunctionComponent<Readonly<MessageProps>> = (
  props
) => {
  const { message, type } = props;
  return (
    <div className="flex flex-row items-center p-1">
      {type === MessageType.SUCCESS && (
        <div className="mr-1">
          <i className="material-icons text-green-500">done</i>
        </div>
      )}
      {type === MessageType.FAILURE && (
        <div className="mr-1">
          <i className="material-icons text-red-500">error</i>
        </div>
      )}
      <div className="flex grow">{message} </div>
    </div>
  );
};
