import { Component } from "react";
import onClickOutside from "react-onclickoutside";
import { connect } from "react-redux";
import { EntityTypes } from "../core/card";
import { IFeatureComment } from "../store/featurecomments/types";
import EntityDetailsBody from "./EntityDetailsBody";

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type PropsFromState = Record<string, never>;

type PropsFromDispatch = Record<string, unknown>;

type SelfProps = {
  entity: EntityTypes;
  comments: IFeatureComment[];
  url: string;
  close: () => void;
  viewOnly: boolean;
  demo: boolean;
};

type Props = PropsFromState & PropsFromDispatch & SelfProps;

type State = Record<string, never>;

class EntityDetailsModal extends Component<Props, State> {
  keydownHandler = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      this.props.close();
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.keydownHandler, false);
  }

  render() {
    const Body = class Body extends Component<{
      comments: IFeatureComment[];
      demo: boolean;
      viewOnly: boolean;
      url: string;
      card: EntityTypes;
      close: () => void;
    }> {
      handleClickOutside = () => {
        this.props.close();
      };

      render() {
        return (
          <div className=" fm-max-dialog  w-full   max-w-5xl  overflow-y-auto ">
            <EntityDetailsBody
              demo={this.props.demo}
              viewOnly={this.props.viewOnly}
              url={this.props.url}
              comments={this.props.comments}
              entity={this.props.card}
              close={this.props.close}
            />
          </div>
        );
      }
    };

    const DialogWithClickOutside = onClickOutside(Body);

    return (
      <div
        style={{ background: " rgba(0,0,0,.75)" }}
        className="fixed top-0 left-0 z-0 flex h-full w-full  items-start bg-gray-100  p-5 text-sm"
      >
        <DialogWithClickOutside
          demo={this.props.demo}
          comments={this.props.comments}
          viewOnly={this.props.viewOnly}
          url={this.props.url}
          card={this.props.entity}
          close={this.props.close}
        />
      </div>
    );
  }
}

export default connect<State, unknown, SelfProps>(
  mapStateToProps,
  mapDispatchToProps
)(EntityDetailsModal);
