import { Component } from "react";
import { connect } from "react-redux";
import type { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import CreateWorkspaceModal from "../components/CreateWorkspaceModal";
import { Button, CardLayout } from "../components/elements";
import Header from "../components/Header";
import { TimeAgo } from "../components/TimeAgo";
import { AppState } from "../store";

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
  state: state,
});

type PropsFromState = {
  state: AppState;
};
type RouterProps = {} & RouteComponentProps<{}>;
type PropsFromDispatch = {};
type OwnProps = {};
type Props = RouterProps & PropsFromState & PropsFromDispatch & OwnProps;

type State = {
  showCreate: boolean;
};

class WorkspacesPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showCreate: false,
    };
  }

  render() {
    const { application } = this.props.state.application;

    return (
      <div>
        <Header account={application.account!} />

        {this.state.showCreate ? (
          <CreateWorkspaceModal
            close={() => this.setState({ showCreate: false })}
          />
        ) : null}

        <div>
          <div className="mb-2 flex flex-row items-center p-2">
            <div>
              <h3>Workspaces</h3>
            </div>
            <div className="ml-2">
              {" "}
              <Button
                title="New workspace"
                primary
                icon="add"
                handleOnClick={() => {
                  this.setState({ showCreate: true });
                }}
              />
            </div>
          </div>

          <CardLayout>
            <div className="">
              {application.workspaces && application.workspaces.length > 0 ? (
                <div className="flex max-w-lg flex-col  ">
                  <div className="p-2  ">
                    {application.workspaces.length} workspace(s)
                  </div>

                  <div>
                    {application.workspaces.map((x) => (
                      <div className="  p-2" key={x.id}>
                        <div className="mb-1">
                          <p>
                            <b>
                              <Link className="" to={"/" + x.name}>
                                {x.name}{" "}
                              </Link>
                            </b>
                          </p>
                          <p className="text-xs">
                            Created <TimeAgo date={x.createdAt} />.{" "}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                "No workspaces"
              )}
            </div>
          </CardLayout>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspacesPage);
