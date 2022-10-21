type IconProps = {
  type: "email" | "vpn_key" | "error_outline" | "check_circle_outline";
};
export const Icon: React.FunctionComponent<Readonly<IconProps>> = (props) => {
  return <span className="material-icons">{props.type}</span>;
};
