import { Icon } from "./Icon";

type ErrorProps = { message?: null | string };

export const Error: React.FunctionComponent<Readonly<ErrorProps>> = (props) => {
  const { message } = props;

  if (!message) return null;

  return (
    <div
      className="flex items-center gap-2 rounded border border-red-500 bg-red-50 p-2 leading-5"
      role="alert"
    >
      <span className="flex items-center text-red-600">
        <Icon type="error_outline" />
      </span>
      <div>{message}</div>
    </div>
  );
};
