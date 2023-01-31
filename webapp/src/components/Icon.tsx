export type IconType =
  | "add"
  | "category"
  | "check_circle_outline"
  | "chevron_right"
  | "download"
  | "email"
  | "error_outline"
  | "logout"
  | "person"
  | "schema"
  | "settings"
  | "toggle_off"
  | "toggle_on"
  | "vpn_key"
  | "workspaces";
type IconProps = { type: IconType; className?: string };
export const Icon: React.FunctionComponent<Readonly<IconProps>> = (props) => {
  const { className, type } = props;
  return (
    <span
      aria-hidden="true"
      className={`material-icons ${className} ${
        type === "toggle_on" ? "text-green-500" : ""
      }`}
    >
      {type}
    </span>
  );
};
