import { Component } from "react";
import { connect } from "react-redux";
import type { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import CreateProjectModal from "../components/CreateProjectModal";
import { Button, CardLayout } from "../components/elements";
import { TimeAgo } from "../components/TimeAgo";
import { isEditor, subIsInactive } from "../core/misc";
import { AppState } from "../store";
import {
  application,
  getMembership,
  getSubscription,
  getWorkspaceByName,
} from "../store/application/selectors";
import { IApplication } from "../store/application/types";
import { projects } from "../store/projects/selectors";
import { IProject } from "../store/projects/types";

const mapStateToProps = (state: AppState) => ({
  application: application(state),
  projects: projects(state),
});

const mapDispatchToProps = {};

type PropsFromState = {
  application: IApplication;
  projects: IProject[];
};
type RouterProps = RouteComponentProps<{
  workspaceName: string;
}>;
type PropsFromDispatch = Record<string, never>;
type SelfProps = Record<string, never>;
type Props = RouterProps & PropsFromState & PropsFromDispatch & SelfProps;

type State = {
  show: boolean;
  showAddProjectModal: boolean;
};

class WorkspacePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      show: false,
      showAddProjectModal: false,
    };
  }

  openProjectModal = () => {
    this.setState(() => ({
      showAddProjectModal: true,
    }));
  };

  closeProjectModal = () => {
    this.setState(() => ({
      showAddProjectModal: false,
    }));
  };

  render() {
    const { workspaceName } = this.props.match.params;

    const ws = getWorkspaceByName(
      this.props.application,
      this.props.match.params.workspaceName
    )!;
    const member = getMembership(this.props.application, ws.id);
    const s = getSubscription(this.props.application, ws.id);

    const viewOnly = !isEditor(member.level) || subIsInactive(s);

    return (
      <div>
        {this.state.showAddProjectModal ? (
          <CreateProjectModal
            workspaceName={workspaceName}
            close={this.closeProjectModal}
          />
        ) : null}

        <div className="  ">
          <div className="mb-2 flex flex-row items-center p-2">
            <div>
              <h3>Projects</h3>
            </div>
            {!viewOnly && (
              <div className="ml-2">
                {" "}
                <Button
                  title="New project"
                  primary
                  icon="add"
                  handleOnClick={() => this.openProjectModal()}
                />
              </div>
            )}
          </div>
          <div></div>
          <CardLayout>
            <div>
              {this.props.projects.length > 0 ? (
                <div className="flex max-w-lg  flex-col  ">
                  <div className="p-2  ">
                    {this.props.projects.length} project(s)
                  </div>

                  <div>
                    {this.props.projects.map((x) => (
                      <div className=" p-2" key={x.id}>
                        <div className="mb-1">
                          <b>
                            <Link
                              className=""
                              to={
                                this.props.location.pathname +
                                "/projects/" +
                                x.id
                              }
                            >
                              {x.title}{" "}
                            </Link>
                          </b>
                        </div>
                        <div className="text-xs">
                          Created <TimeAgo date={x.createdAt} /> by{" "}
                          {x.createdByName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                "No projects"
              )}
            </div>
          </CardLayout>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspacePage);
