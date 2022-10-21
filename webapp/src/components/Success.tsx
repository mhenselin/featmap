import { Icon } from "./Icon";

type ErrorProps = { message?: null | string };

export const Success: React.FunctionComponent<Readonly<ErrorProps>> = (
  props
) => {
  const { message } = props;

  if (!message) return null;

  return (
    <div
      className="flex items-center gap-2 rounded border border-green-500 bg-green-50 p-2 leading-5"
      role="alert"
    >
      <span className="flex items-center text-green-600">
        <Icon type="check_circle_outline" />
      </span>
      <div>{message}</div>
    </div>
  );
};
