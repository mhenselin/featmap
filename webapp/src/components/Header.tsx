import { Component } from "react";
import { Link } from "react-router-dom";
import { IAccount } from "../store/application/types";
import ContextMenu from "./ContextMenu";

type Props = {
  account: IAccount;
  workspaceName?: string;
};

class Header extends Component<Props> {
  render() {
    return (
      <header className="bg-gray-200">
        <div className="flex items-center p-1 ">
          <div className="m-1 flex   w-24 text-lg ">
            <b>
              <Link to="/">Featmap</Link>
            </b>
          </div>
          {this.props.workspaceName ? (
            <div className="text-sm ">
              <Link to={"/" + this.props.workspaceName}>Projects</Link>
            </div>
          ) : null}

          <div className="flex grow justify-end   ">
            <div className="flex items-center  rounded p-1 ">
              <ContextMenu icon="account_circle">
                <div className="absolute top-0 right-0 mt-8 min-w-full rounded bg-white text-sm shadow-md">
                  <ul className="">
                    {this.props.workspaceName ? (
                      <li className="block whitespace-nowrap px-4 py-2 text-gray-600">
                        Current workspace:{" "}
                        <b>
                          <Link to={"/" + this.props.workspaceName}>
                            {this.props.workspaceName}
                          </Link>{" "}
                        </b>{" "}
                        <Link
                          className="shrink-0 rounded bg-gray-300 p-1 text-xs  font-bold"
                          to="/account/workspaces"
                        >
                          Change{" "}
                        </Link>
                      </li>
                    ) : null}
                    {this.props.workspaceName ? (
                      <li className="block whitespace-nowrap px-4 py-2 text-black hover:bg-gray-200 ">
                        <Link to={"/" + this.props.workspaceName + "/settings"}>
                          Workspace settings
                        </Link>
                      </li>
                    ) : null}
                    <li className="block whitespace-nowrap px-4 py-2 text-black ">
                      <Link to={"/account/workspaces"}>My workspaces</Link>
                    </li>
                    <li className="block whitespace-nowrap text-black ">
                      <hr className="border-b" />
                    </li>
                    <li className="block whitespace-nowrap px-4 py-2 text-gray-600">
                      Logged in as <em>{this.props.account.email}</em>
                    </li>

                    <li>
                      <Link
                        className="block whitespace-nowrap px-4 py-2 text-black hover:bg-gray-200"
                        to="/account/settings"
                      >
                        Account settings
                      </Link>{" "}
                    </li>
                    <li>
                      <Link
                        className="block whitespace-nowrap px-4 py-2 text-black hover:bg-gray-200"
                        to="/account/logout"
                      >
                        Log out
                      </Link>{" "}
                    </li>
                  </ul>
                </div>
              </ContextMenu>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
