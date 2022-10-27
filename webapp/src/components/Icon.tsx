export type IconType =
  | "add"
  | "category"
  | "check_circle_outline"
  | "chevron_right"
  | "email"
  | "error_outline"
  | "logout"
  | "person"
  | "schema"
  | "settings"
  | "vpn_key"
  | "workspaces";
type IconProps = { type: IconType; className?: string };
export const Icon: React.FunctionComponent<Readonly<IconProps>> = (props) => {
  const { className, type } = props;
  return (
    <span aria-hidden="true" className={`material-icons ${className}`}>
      {type}
    </span>
  );
};
