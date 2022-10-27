import type { LinkProps } from "react-router-dom";
import { Link } from "react-router-dom";
import type { IconType } from "./Icon";
import { Icon } from "./Icon";

type IconLinkProps = {
  to: LinkProps["to"];
  type: IconType;
  label: string;
};

export const IconLink: React.FunctionComponent<Readonly<IconLinkProps>> = (
  props
) => {
  const { to, type, label } = props;

  const activeStyles =
    to === location.pathname ? "bg-indigo-500" : "hover:bg-indigo-600";

  return (
    <Link
      to={to}
      className={`focus-inverted flex flex-col items-center gap-1 px-1.5 py-1 text-center  active:bg-indigo-500 ${activeStyles}`}
    >
      <Icon type={type} />
      <span className="text-xs leading-none text-white">{label}</span>
    </Link>
  );
};
