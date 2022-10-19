import { FunctionComponent, PropsWithChildren } from "react";

export const OldButton: FunctionComponent<{ title: string }> = (props) => (
  <div className="shrink-0 whitespace-nowrap rounded  bg-gray-200  p-2  text-xs font-bold uppercase ">
    {props.title}
  </div>
);

export const Button: FunctionComponent<{
  iconColor?: string;
  title?: string;
  small?: boolean;
  button?: boolean;
  secondary?: boolean;
  icon?: string;
  handleOnClick?: () => void;
  warning?: boolean;
  primary?: boolean;
  submit?: boolean;
  noborder?: boolean;
}> = (props) => (
  <button
    type={props.submit ? "submit" : "button"}
    onClick={props.handleOnClick}
  >
    <div
      className={
        " flex shrink-0 items-center    whitespace-nowrap font-medium " +
        (props.small ? " p-1 " : " p-2 ") +
        (!props.noborder && " border ") +
        (!props.primary && " text-black  ") +
        (props.primary && " border-green-400 bg-green-400  text-white ") +
        (props.secondary && " border-gray-200  bg-gray-200 ") +
        (props.warning && " border-red-500 font-semibold text-red-500")
      }
    >
      {props.icon && (
        <div className="flex">
          <i
            style={{ fontSize: "18px" }}
            className={
              "material-icons " + (props.iconColor ? props.iconColor : "")
            }
          >
            {" "}
            {props.icon}
          </i>
        </div>
      )}
      <div className="ml-1 flex ">{props.title}</div>
    </div>
  </button>
);

export const DarkButton: FunctionComponent<
  PropsWithChildren<{
    submit?: boolean;
    primary?: boolean;
    handleOnClick?: () => void;
  }>
> = (props) => (
  <button
    type={props.submit ? "submit" : "button"}
    className={
      "whitespace-nowrap rounded p-1 px-2 text-xs  font-medium uppercase  leading-6 " +
      (props.primary ? " bg-green-500 " : " bg-gray-900")
    }
    onClick={props.handleOnClick}
  >
    {props.children}
  </button>
);

export const CardLayout: FunctionComponent<
  PropsWithChildren<{ title?: string }>
> = (props) => {
  return (
    <div className="m-2 max-w-2xl rounded bg-white p-3 shadow">
      {props.title && <h4>{props.title}</h4>}
      <div className="pt-1 text-sm">{props.children}</div>
    </div>
  );
};
