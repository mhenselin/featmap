import { Link } from "react-router-dom";
import { IconLink } from "./IconLink";

export type HeaderProps = {
  workspaceName?: string;
};

export const Header: React.FunctionComponent<Readonly<HeaderProps>> = (
  props
) => {
  const { workspaceName } = props;

  return (
    <header className="flex items-center justify-between bg-indigo-700 p-2 text-white md:px-4 md:py-2 lg:px-6">
      <Link to="/" className="focus-inverted flex items-center gap-2 p-2">
        <img
          width="32"
          height="32"
          src="/apple-touch-icon.png"
          alt=""
          className="block"
        />
        <span className="sr-only sm:not-sr-only">Featmap</span>
      </Link>

      {workspaceName && (
        <>
          <span className="flex gap-2">
            <IconLink
              label="Projects"
              to={`/${workspaceName}`}
              type="category"
            />
            <IconLink
              label="Settings"
              to={`/${workspaceName}/settings`}
              type="settings"
            />
            <IconLink
              label="Spaces"
              to="/account/workspaces"
              type="workspaces"
            />
            <IconLink label="Account" to="/account/settings" type="person" />
          </span>

          <IconLink label="Logout" to="/account/logout" type="logout" />
        </>
      )}
    </header>
  );
};
