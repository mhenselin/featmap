import { Link } from "react-router-dom";
import { IAccount } from "../store/application/types";
import ContextMenu from "./ContextMenu";

type HeaderProps = {
  account: IAccount;
  workspaceName?: string;
};

export const Header: React.FunctionComponent<HeaderProps> = (props) => {
  return (
    <header
      style={{ background: "#2280a5" }}
      className="flex items-center gap-4 px-4 text-lg text-white"
    >
      <Link to="/" className="mr-12">
        <strong>Featmap</strong>
      </Link>

      {props.workspaceName && (
        <Link to={"/" + props.workspaceName}>Projects</Link>
      )}

      <div className="flex grow justify-end">
        <div className="flex items-center rounded p-1 ">
          <ContextMenu icon="account_circle">
            <div className="absolute top-0 right-0 mt-8 min-w-full rounded bg-white text-sm shadow-md">
              <ul className="">
                {props.workspaceName && (
                  <>
                    <li className="block whitespace-nowrap px-4 py-2 text-gray-600">
                      Current workspace:{" "}
                      <b>
                        <Link to={"/" + props.workspaceName}>
                          {props.workspaceName}
                        </Link>{" "}
                      </b>{" "}
                      <Link
                        className="shrink-0 rounded bg-gray-300 p-1 text-xs  font-bold"
                        to="/account/workspaces"
                      >
                        Change{" "}
                      </Link>
                    </li>
                    <li className="block whitespace-nowrap px-4 py-2 text-black hover:bg-gray-200 ">
                      <Link to={"/" + props.workspaceName + "/settings"}>
                        Workspace settings
                      </Link>
                    </li>
                  </>
                )}

                <li className="block whitespace-nowrap border-b px-4 py-2 text-black">
                  <Link to={"/account/workspaces"}>My workspaces</Link>
                </li>

                <li className="block whitespace-nowrap px-4 py-2 text-gray-600">
                  Logged in as <em>{props.account.email}</em>
                </li>

                <li>
                  <Link
                    className="block whitespace-nowrap px-4 py-2 text-black hover:bg-gray-200"
                    to="/account/settings"
                  >
                    Account settings
                  </Link>
                </li>
                <li>
                  <Link
                    className="block whitespace-nowrap px-4 py-2 text-black hover:bg-gray-200"
                    to="/account/logout"
                  >
                    Log out
                  </Link>
                </li>
              </ul>
            </div>
          </ContextMenu>
        </div>
      </div>
    </header>
  );
};
