import { Component } from "react";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
} from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";
import {
  API_CREATE_WORKFLOWPERSONA,
  API_DELETE_WORKFLOWPERSONA,
  API_MOVE_FEATURE,
  API_MOVE_MILESTONE,
  API_MOVE_SUBWORKFLOW,
  API_MOVE_WORKFLOW,
} from "../api";
import { avatar, AvatarName } from "../avatars";
import { personaBarState } from "../core/misc";
import { AppState } from "../store";
import { application } from "../store/application/selectors";
import { IApplication } from "../store/application/types";
import { filterFeatureCommentsOnFeature } from "../store/featurecomments/selectors";
import { IFeatureComment } from "../store/featurecomments/types";
import {
  moveFeatureAction,
  updateFeatureAction,
} from "../store/features/actions";
import {
  filterFeaturesOnMilestone,
  filterFeaturesOnMilestoneAndSubWorkflow,
  filterFeaturesOnSubWorkflow,
} from "../store/features/selectors";
import { IFeature } from "../store/features/types";
import {
  moveMilestoneAction,
  updateMilestoneAction,
} from "../store/milestones/actions";
import {
  filterClosedMilestones,
  filterOpenMilestones,
} from "../store/milestones/selectors";
import { IMilestone } from "../store/milestones/types";
import {
  getPersona,
  removeSpecificPersonas,
  sortPersonas,
} from "../store/personas/selectors";
import { IPersona } from "../store/personas/types";
import {
  moveSubWorkflowAction,
  updateSubWorkflowAction,
} from "../store/subworkflows/actions";
import {
  filterClosedSubWorkflows,
  filterOutClosedSubWorkflows,
  getSubWorkflowByWorkflow,
} from "../store/subworkflows/selectors";
import { ISubWorkflow } from "../store/subworkflows/types";
import {
  createWorkflowPersonaAction,
  deleteWorkflowPersonaAction,
} from "../store/workflowpersonas/actions";
import { filterWorkflowPersonasOnWorkflow } from "../store/workflowpersonas/selectors";
import { IWorkflowPersona } from "../store/workflowpersonas/types";
import {
  moveWorkflowAction,
  updateWorkflowAction,
} from "../store/workflows/actions";
import {
  filterClosedWorkflows,
  filterOutClosedWorkflows,
} from "../store/workflows/selectors";
import { IWorkflow } from "../store/workflows/types";
import Card from "./Card";
import ContextMenu from "./ContextMenu";
import CreateCardModal, { Types } from "./CreateCardModal";
import { Button } from "./elements";
import EmptyCard from "./EmptyCard";
import NewCard from "./NewCard";
import NewDimCard from "./NewDimCard";
import Personas from "./Personas";

type SelfProps = {
  projectId: string;
  workspaceId: string;
  milestones: IMilestone[];
  subWorkflows: ISubWorkflow[];
  workflows: IWorkflow[];
  features: IFeature[];
  comments: IFeatureComment[];
  personas: IPersona[];
  workflowPersonas: IWorkflowPersona[];
  url: string;
  viewOnly: boolean;
  showClosed: boolean;
  demo: boolean;
  showPersonas: boolean;
  closePersonas: () => void;
  openPersonas: () => void;
};

type PropsFromState = {
  application: IApplication;
};

type PropsFromDispatch = {
  moveFeature: typeof moveFeatureAction;
  moveMilestone: typeof moveMilestoneAction;
  updateMilestone: typeof updateMilestoneAction;
  moveSubWorkflow: typeof moveSubWorkflowAction;
  updateSubWorkflow: typeof updateSubWorkflowAction;
  moveWorkflow: typeof moveWorkflowAction;
  updateWorkflow: typeof updateWorkflowAction;
  deleteWorkflowPersona: typeof deleteWorkflowPersonaAction;
  createWorkflowPersona: typeof createWorkflowPersonaAction;
};

type State = {
  showCreateFeatureModal: boolean;
  createFeatureModalMilestoneId: string;
  createFeatureModalSubWorkflowId: string;
  showCreateMilestoneModal: boolean;
  showCreateWorkflowModal: boolean;
  showCreateSubWorkflowModal: boolean;
  createSubWorkflowWorkflowId: string;
  showClosedMilestones: boolean;
  personaBarState: personaBarState;
};

const mapStateToProps = (state: AppState) => ({
  application: application(state),
});

const mapDispatchToProps = {
  moveFeature: moveFeatureAction,
  updateMilestone: updateMilestoneAction,
  moveMilestone: moveMilestoneAction,
  moveSubWorkflow: moveSubWorkflowAction,
  updateSubWorkflow: updateSubWorkflowAction,
  moveWorkflow: moveWorkflowAction,
  updateWorkflow: updateWorkflowAction,
  deleteWorkflowPersona: deleteWorkflowPersonaAction,
  createWorkflowPersona: createWorkflowPersonaAction,
};

type Props = PropsFromState & PropsFromDispatch & SelfProps;

class Board extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showCreateFeatureModal: false,
      createFeatureModalMilestoneId: "",
      createFeatureModalSubWorkflowId: "",
      showCreateMilestoneModal: false,
      showCreateWorkflowModal: false,
      showCreateSubWorkflowModal: false,
      createSubWorkflowWorkflowId: "",
      showClosedMilestones: false,
      personaBarState: { page: "all" },
    };
  }

  onDragEnd = (result: DropResult): void => {
    const { draggableId, type, destination } = result;

    const t = new Date().toISOString();
    const by =
      this.props.application.account === undefined
        ? "demo"
        : this.props.application.account!.name;
    if (!destination) {
      return;
    }

    switch (type) {
      case "FEATURE": {
        const { rid, wid } =
          this.getMilestoneAndSubWorkflowFromFeatureDroppableId(
            destination.droppableId
          );

        const fid = this.getFeatureFromDraggableId(draggableId);

        this.props.moveFeature({
          id: fid,
          toMilestoneId: rid,
          toSubWorkflowId: wid,
          index: destination.index,
          ts: t,
          by: by,
        }); // optimisic move

        if (this.props.demo) {
          return;
        }
        API_MOVE_FEATURE(
          this.props.workspaceId,
          fid,
          wid,
          rid,
          destination.index
        ).then((response) => {
          if (response.ok) {
            response.json().then((data: IFeature) => {
              updateFeatureAction(data);
            });
          } else {
            alert("Something went wrong when moving feature.");
          }
        });
        break;
      }

      case "MILESTONE": {
        // A milestone move is also triggered when a feature is moved, we need to ignore it. This is due to an issue with the drag-and-drop framework.
        if (!this.isMilestoneDraggable(draggableId)) {
          return;
        }
        const milestoneId = this.getMilestoneFromDraggableId(draggableId);
        this.props.moveMilestone({
          id: milestoneId,
          index: destination.index,
          ts: t,
          by: by,
        }); // optimisic move

        if (this.props.demo) {
          return;
        }
        API_MOVE_MILESTONE(
          this.props.workspaceId,
          milestoneId,
          destination.index
        ).then((response) => {
          if (response.ok) {
            response.json().then((data: IMilestone) => {
              updateMilestoneAction(data);
            });
          } else {
            alert("Something went wrong when moving milestone.");
          }
        });
        break;
      }

      case "WORKFLOW": {
        const wid = this.getWorkflowFromDraggableId(draggableId);
        this.props.moveWorkflow({
          id: wid,
          index: destination.index,
          ts: t,
          by: by,
        }); // optimisic move

        if (this.props.demo) {
          return;
        }
        API_MOVE_WORKFLOW(this.props.workspaceId, wid, destination.index).then(
          (response) => {
            if (response.ok) {
              response.json().then((data: IWorkflow) => {
                updateWorkflowAction(data);
              });
            } else {
              alert("Something went wrong when moving card.");
            }
          }
        );

        break;
      }

      case "SUBWORKFLOW": {
        const swid = this.getSubWorkflowFromDraggableId(draggableId);
        const wid = this.getWorkflowFromDroppableId(destination.droppableId);
        this.props.moveSubWorkflow({
          id: swid,
          toWorkflowId: wid,
          index: destination.index,
          ts: t,
          by: by,
        }); // optimisic move

        if (this.props.demo) {
          return;
        }
        API_MOVE_SUBWORKFLOW(
          this.props.workspaceId,
          swid,
          wid,
          destination.index
        ).then((response) => {
          if (response.ok) {
            response.json().then((data: ISubWorkflow) => {
              updateSubWorkflowAction(data);
            });
          } else {
            alert("Something went wrong when moving card.");
          }
        });

        break;
      }

      default:
    }

    this.setState({ showClosedMilestones: false });
  };

  getListStyle = (isDraggingOver: boolean): {} => ({
    background: isDraggingOver ? "#DAE1E7" : "",
  });

  getItemStyle = (isDragging: boolean, draggableStyle: any): {} => ({
    background: isDragging ? "#51D88A" : "",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  getMilestoneAndSubWorkflowFromFeatureDroppableId = (
    id: string
  ): { rid: string; wid: string } => {
    const res = id.split("*");
    return { rid: res[1], wid: res[2] };
  };

  getFeatureFromDraggableId = (id: string): string => {
    const res = id.split("*", 2);
    return res[1];
  };

  isMilestoneDraggable = (id: string): boolean => {
    const res = id.split("*");
    return res[0] === "m";
  };

  getMilestoneFromDraggableId = (id: string): string => {
    const res = id.split("*", 2);
    return res[1];
  };

  getSubWorkflowFromDraggableId = (id: string): string => {
    const res = id.split("*", 2);
    return res[1];
  };

  getWorkflowFromDraggableId = (id: string): string => {
    const res = id.split("*", 2);
    return res[1];
  };

  getWorkflowFromDroppableId = (id: string): string => {
    const res = id.split("*");
    return res[1];
  };

  handleDeleteWorkflowPersona = (
    _workspaceId: string,
    workflowPersonaId: string
  ) => {
    this.props.deleteWorkflowPersona(workflowPersonaId); // optimistic

    if (this.props.demo) {
      return;
    }
    API_DELETE_WORKFLOWPERSONA(this.props.workspaceId, workflowPersonaId).then(
      (response) => {
        if (!response.ok) {
          alert("Something went wrong when removing persona from goal.");
        }
      }
    );
  };

  handleCreateWorkflowPersona = (
    workspaceId: string,
    projectId: string,
    workflowId: string,
    personaId: string
  ) => {
    const id = uuid();

    const wp: IWorkflowPersona = {
      id,
      personaId,
      projectId,
      workflowId,
      workspaceId,
    };

    this.props.createWorkflowPersona(wp); // optimistic

    if (this.props.demo) {
      return;
    }
    API_CREATE_WORKFLOWPERSONA(
      this.props.workspaceId,
      id,
      workflowId,
      personaId
    ).then((response) => {
      if (!response.ok) {
        alert("Something went wrong when adding the persona to the goal.");
      }
    });
  };

  render() {
    const { projectId, features, workflows, milestones, subWorkflows } =
      this.props;

    const isEmpty = workflows.length === 0 && milestones.length === 0;

    const viewOnly = this.props.viewOnly && !this.props.demo;

    const PersonaTag = ({
      name,
      role,
      avatarname,
      wsid,
      id,
      handleOpen,
      handleRemove,
      viewOnly,
      demo,
    }: {
      name: string;
      role: string;
      avatarname: AvatarName;
      wsid: string;
      id: string;
      handleOpen: () => void;
      handleRemove: (wsid: string, id: string) => void;
      viewOnly: boolean;
      demo: boolean;
    }) => (
      <div>
        <div
          style={{ fontSize: ".70rem" }}
          className="mb-1 inline-block w-32 items-center  whitespace-nowrap   rounded bg-gray-100  p-1 text-xs  "
        >
          <div className="flex items-center">
            <div className="flex shrink-0">
              <button onClick={() => handleOpen()}>{avatar(avatarname)}</button>{" "}
            </div>

            <div className="flex grow flex-col overflow-hidden">
              <div className="ml-2    overflow-hidden">
                <button className="font-medium" onClick={() => handleOpen()}>
                  {name}
                </button>
              </div>
              <div className="ml-2 overflow-hidden   italic">{role}</div>
            </div>

            {(!viewOnly || demo) && (
              <div>
                {
                  <button onClick={() => handleRemove(wsid, id)}>
                    <i
                      style={{ fontSize: "14px" }}
                      className="material-icons ml-1 align-middle text-gray-700"
                    >
                      clear
                    </i>
                  </button>
                }
              </div>
            )}
          </div>
        </div>
      </div>
    );

    // const avatar01 = require("../avatars/avatar01.svg") as string;

    return (
      <div className="z-0   ">
        <DragDropContext
          onDragStart={() => this.setState({ showClosedMilestones: true })}
          onDragEnd={this.onDragEnd}
        >
          <div>
            {this.state.showCreateMilestoneModal ? (
              <CreateCardModal
                demo={this.props.demo}
                action={{ type: Types.MILESTONE, payload: {} }}
                workspaceId={this.props.workspaceId}
                projectId={projectId}
                close={() => this.setState({ showCreateMilestoneModal: false })}
              />
            ) : null}
            {this.state.showCreateWorkflowModal ? (
              <CreateCardModal
                demo={this.props.demo}
                action={{ type: Types.WORKFLOW, payload: {} }}
                workspaceId={this.props.workspaceId}
                projectId={projectId}
                close={() => this.setState({ showCreateWorkflowModal: false })}
              />
            ) : null}
            {this.state.showCreateSubWorkflowModal ? (
              <CreateCardModal
                demo={this.props.demo}
                action={{
                  type: Types.SUBWORKFLOW,
                  payload: {
                    workflowId: this.state.createSubWorkflowWorkflowId,
                  },
                }}
                workspaceId={this.props.workspaceId}
                projectId={projectId}
                close={() =>
                  this.setState({ showCreateSubWorkflowModal: false })
                }
              />
            ) : null}
            {this.state.showCreateFeatureModal ? (
              <CreateCardModal
                demo={this.props.demo}
                action={{
                  type: Types.FEATURE,
                  payload: {
                    subWorkflowId: this.state.createFeatureModalSubWorkflowId,
                    milestoneId: this.state.createFeatureModalMilestoneId,
                  },
                }}
                workspaceId={this.props.workspaceId}
                projectId={projectId}
                close={() => this.setState({ showCreateFeatureModal: false })}
              />
            ) : null}
            {this.props.showPersonas ? (
              <Personas
                viewOnly={this.props.viewOnly}
                pageState={this.state.personaBarState}
                setPageState={(state: personaBarState) =>
                  this.setState({ personaBarState: state })
                }
                personas={this.props.personas}
                demo={this.props.demo}
                workspaceId={this.props.workspaceId}
                projectId={projectId}
                close={() => {
                  this.setState({ personaBarState: { page: "all" } });
                  this.props.closePersonas();
                }}
              />
            ) : null}
            {isEmpty ? (
              viewOnly ? (
                <div className={"p-2"}>This story map is empty.</div>
              ) : (
                <div className={"p-2"}>
                  <p>
                    <Button
                      primary
                      title="Add goal"
                      icon="add"
                      noborder
                      handleOnClick={() =>
                        this.setState({ showCreateWorkflowModal: true })
                      }
                    />
                  </p>
                  <p>
                    This board is empty, please start by adding a{" "}
                    <b>user goal</b>. If you are new to user story mapping, have
                    a look at{" "}
                    <em>
                      <a
                        className="link"
                        target={"_blank"}
                        rel="noopener noreferrer"
                        href={"http://www.featmap.com/storymapping"}
                      >
                        An introduction to story mapping
                      </a>
                    </em>{" "}
                    or an{" "}
                    <a
                      className="link"
                      rel="noopener noreferrer"
                      target={"_blank"}
                      href={
                        "https://app.featmap.com/link/e31ddff9-7138-4db7-b340-af0c2217b417?demo=1"
                      }
                    >
                      example story map
                    </a>
                    .
                  </p>
                </div>
              )
            ) : (
              <div>
                <Droppable
                  droppableId={"w"}
                  type="WORKFLOW"
                  direction="horizontal"
                >
                  {(
                    providedDroppable: DroppableProvided,
                    snapshotDroppable: DroppableStateSnapshot
                  ) => {
                    let ww = workflows;
                    if (!this.props.showClosed) {
                      ww = filterOutClosedWorkflows(ww);
                    }

                    return (
                      <div className="flex">
                        <div
                          className="flex    border-b-2    "
                          ref={providedDroppable.innerRef}
                          {...providedDroppable.droppableProps}
                          style={this.getListStyle(
                            snapshotDroppable.isDraggingOver
                          )}
                        >
                          <div className="flex w-full flex-row">
                            <div className=" p-1 pr-2">
                              <EmptyCard />
                            </div>

                            {ww.map((w, index) => {
                              let ss = getSubWorkflowByWorkflow(
                                subWorkflows,
                                w.id
                              );
                              const estimate = ss
                                .flatMap((s) =>
                                  filterFeaturesOnSubWorkflow(features, s.id)
                                )
                                .map((x) => x.estimate)
                                .reduce((p, c) => p + c, 0);

                              if (!this.props.showClosed) {
                                ss = filterOutClosedSubWorkflows(ss);
                              }

                              return [
                                <Draggable
                                  isDragDisabled={viewOnly}
                                  key={w.id}
                                  draggableId={"w*" + w.id}
                                  index={index}
                                >
                                  {(
                                    providedDraggable: DraggableProvided,
                                    snapshotDraggable: DraggableStateSnapshot
                                  ) => (
                                    <div
                                      key={w.id}
                                      className="bug flex p-1   "
                                      ref={providedDraggable.innerRef}
                                      {...providedDraggable.draggableProps}
                                      {...providedDraggable.dragHandleProps}
                                      style={this.getItemStyle(
                                        snapshotDraggable.isDragging,
                                        providedDraggable.draggableProps.style
                                      )}
                                    >
                                      <div className="flex flex-col  ">
                                        <div className="flex grow"></div>
                                        <div className="flex flex-col p-1 ">
                                          {filterWorkflowPersonasOnWorkflow(
                                            this.props.workflowPersonas,
                                            w.id
                                          ).map((wp, key) => {
                                            const p = getPersona(
                                              this.props.personas,
                                              wp.personaId
                                            );
                                            if (p === null || p === undefined) {
                                              return null;
                                            }
                                            return (
                                              <div key={key}>
                                                {PersonaTag({
                                                  name: p.name,
                                                  role: p.role,
                                                  avatarname: p.avatar,
                                                  wsid: this.props.workspaceId,
                                                  id: wp.id,
                                                  handleOpen: () => {
                                                    this.props.openPersonas();
                                                    this.setState({
                                                      personaBarState: {
                                                        page: "persona",
                                                        edit: false,
                                                        personaId: p.id,
                                                      },
                                                    });
                                                  },
                                                  handleRemove:
                                                    this
                                                      .handleDeleteWorkflowPersona,
                                                  viewOnly: this.props.viewOnly,
                                                  demo: this.props.demo,
                                                })}
                                              </div>
                                            );
                                          })}

                                          {(!this.props.viewOnly ||
                                            this.props.demo) && (
                                            <ContextMenu
                                              smallIcon
                                              text="Persona"
                                              icon="add"
                                            >
                                              <div className="absolute top-0 left-0  mt-8 w-full max-w-xs rounded  bg-white  text-xs shadow-md">
                                                <ul className="list-reset p-3">
                                                  {sortPersonas(
                                                    removeSpecificPersonas(
                                                      this.props.personas,
                                                      filterWorkflowPersonasOnWorkflow(
                                                        this.props
                                                          .workflowPersonas,
                                                        w.id
                                                      ).map((x) => x.personaId)
                                                    )
                                                  ).map((p, key) => (
                                                    <li key={key}>
                                                      <button
                                                        className="w-full"
                                                        onClick={() =>
                                                          this.handleCreateWorkflowPersona(
                                                            this.props
                                                              .workspaceId,
                                                            this.props
                                                              .projectId,
                                                            w.id,
                                                            p.id
                                                          )
                                                        }
                                                      >
                                                        <div className="flex w-full p-1">
                                                          <>
                                                            {avatar(p.avatar)}
                                                            <span className="mr-2 overflow-hidden whitespace-nowrap font-medium ">
                                                              {p.name}{" "}
                                                            </span>
                                                          </>
                                                        </div>
                                                      </button>
                                                    </li>
                                                  ))}
                                                  <li>
                                                    <div className="p-1">
                                                      <button
                                                        onClick={() => {
                                                          this.setState({
                                                            personaBarState: {
                                                              page: "create",
                                                              workflowId: w.id,
                                                              workflowTitle:
                                                                w.title,
                                                            },
                                                          });
                                                          this.props.openPersonas();
                                                        }}
                                                      >
                                                        <span className="font-medium">
                                                          Create new...
                                                        </span>{" "}
                                                      </button>
                                                    </div>
                                                  </li>
                                                </ul>
                                              </div>
                                            </ContextMenu>
                                          )}
                                        </div>
                                        <div className="m-1  flex ">
                                          <Card
                                            estimate={estimate}
                                            annotations={w.annotations}
                                            status={w.status}
                                            color={w.color}
                                            title={w.title}
                                            link={this.props.url + "/w/" + w.id}
                                          />
                                        </div>
                                        <div className="fm-paren flex flex-row ">
                                          <Droppable
                                            key={"w" + w.id}
                                            droppableId={"sw*" + w.id}
                                            type="SUBWORKFLOW"
                                            direction="horizontal"
                                          >
                                            {(
                                              providedDroppable: DroppableProvided,
                                              snapshotDroppable: DroppableStateSnapshot
                                            ) => {
                                              return (
                                                <div
                                                  className="showhim flex flex-row "
                                                  ref={
                                                    providedDroppable.innerRef
                                                  }
                                                  {...providedDroppable.droppableProps}
                                                  style={this.getListStyle(
                                                    snapshotDroppable.isDraggingOver
                                                  )}
                                                >
                                                  {ss.length === 0 ? (
                                                    <div className="p-1 text-xs">
                                                      {viewOnly ? (
                                                        <EmptyCard />
                                                      ) : (
                                                        <NewCard>
                                                          <Button
                                                            title="Add activity"
                                                            icon="add"
                                                            noborder
                                                            handleOnClick={() =>
                                                              this.setState({
                                                                showCreateSubWorkflowModal:
                                                                  true,
                                                                createSubWorkflowWorkflowId:
                                                                  w.id,
                                                              })
                                                            }
                                                          />
                                                        </NewCard>
                                                      )}
                                                    </div>
                                                  ) : null}

                                                  {ss.map((sw, index) => {
                                                    const estimate =
                                                      filterFeaturesOnSubWorkflow(
                                                        features,
                                                        sw.id
                                                      )
                                                        .map((x) => x.estimate)
                                                        .reduce(
                                                          (p, c) => p + c,
                                                          0
                                                        );
                                                    return [
                                                      <Draggable
                                                        isDragDisabled={
                                                          viewOnly
                                                        }
                                                        key={sw.id}
                                                        draggableId={
                                                          "sw*" + sw.id
                                                        }
                                                        index={index}
                                                      >
                                                        {(
                                                          providedDraggable: DraggableProvided,
                                                          snapshotDraggable: DraggableStateSnapshot
                                                        ) => (
                                                          <div>
                                                            <div
                                                              className="bug flex p-1 "
                                                              ref={
                                                                providedDraggable.innerRef
                                                              }
                                                              {...providedDraggable.draggableProps}
                                                              {...providedDraggable.dragHandleProps}
                                                              style={this.getItemStyle(
                                                                snapshotDraggable.isDragging,
                                                                providedDraggable
                                                                  .draggableProps
                                                                  .style
                                                              )}
                                                            >
                                                              <div className="flex  w-full">
                                                                <Card
                                                                  estimate={
                                                                    estimate
                                                                  }
                                                                  annotations={
                                                                    sw.annotations
                                                                  }
                                                                  status={
                                                                    sw.status
                                                                  }
                                                                  color={
                                                                    sw.color
                                                                  }
                                                                  title={
                                                                    sw.title
                                                                  }
                                                                  link={
                                                                    this.props
                                                                      .url +
                                                                    "/sw/" +
                                                                    sw.id
                                                                  }
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                        )}
                                                      </Draggable>,
                                                    ];
                                                  })}

                                                  {this.props.viewOnly &&
                                                  !this.props.demo ? (
                                                    <div className="flex-no-shrink mt-1 flex h-24  w-2 justify-center"></div>
                                                  ) : (
                                                    <div className="flex-no-shrink mt-1 flex h-24  w-2 justify-center">
                                                      <div className="showme flex text-xl font-bold">
                                                        <button
                                                          className=" text-gray-500 hover:text-gray-800"
                                                          onClick={() =>
                                                            this.setState({
                                                              showCreateSubWorkflowModal:
                                                                true,
                                                              createSubWorkflowWorkflowId:
                                                                w.id,
                                                            })
                                                          }
                                                        >
                                                          +
                                                        </button>
                                                      </div>
                                                    </div>
                                                  )}
                                                  {
                                                    providedDroppable.placeholder
                                                  }
                                                </div>
                                              );
                                            }}
                                          </Droppable>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>,
                              ];
                            })}
                            {providedDroppable.placeholder}

                            <div className="flex flex-col p-2 text-xs">
                              <div className="flex grow"></div>
                              <div>
                                {!viewOnly && (
                                  <NewCard>
                                    <Button
                                      title="Add goal"
                                      icon="add"
                                      noborder
                                      handleOnClick={() =>
                                        this.setState({
                                          showCreateWorkflowModal: true,
                                        })
                                      }
                                    />
                                  </NewCard>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Droppable>

                <Droppable droppableId={"dm"} type="MILESTONE">
                  {(
                    providedDroppable: DroppableProvided,
                    snapshotDroppable: DroppableStateSnapshot
                  ) => {
                    return (
                      <div className="flex">
                        <div
                          className="flex flex-col "
                          ref={providedDroppable.innerRef}
                          {...providedDroppable.droppableProps}
                          style={this.getListStyle(
                            snapshotDroppable.isDraggingOver
                          )}
                        >
                          {(!this.props.showClosed
                            ? filterOpenMilestones(milestones)
                            : milestones
                          ).map((m, index) => {
                            let ww = workflows;
                            if (!this.props.showClosed) {
                              ww = filterOutClosedWorkflows(ww);
                            }
                            return [
                              <Draggable
                                isDragDisabled={viewOnly}
                                key={m.id}
                                draggableId={"m*" + m.id}
                                index={index}
                              >
                                {(
                                  providedDraggable: DraggableProvided,
                                  snapshotDraggable: DraggableStateSnapshot
                                ) => (
                                  <div
                                    key={m.id}
                                    className={"bug flex p-1   "}
                                    ref={providedDraggable.innerRef}
                                    {...providedDraggable.draggableProps}
                                    {...providedDraggable.dragHandleProps}
                                    style={this.getItemStyle(
                                      snapshotDraggable.isDragging,
                                      providedDraggable.draggableProps.style
                                    )}
                                  >
                                    <div
                                      className={
                                        "flex   border-b  border-dashed pb-1  "
                                      }
                                    >
                                      <div className={"flex  w-full  "}>
                                        <div className="p-1">
                                          {(() => {
                                            const f = filterFeaturesOnMilestone(
                                              features,
                                              m.id
                                            );
                                            const fEstimate = f
                                              .map((x) => x.estimate)
                                              .reduce((p, c) => p + c, 0);

                                            return (
                                              <Card
                                                estimate={fEstimate}
                                                annotations={m.annotations}
                                                nbrOfItems={f.length}
                                                color={m.color}
                                                status={m.status}
                                                title={m.title}
                                                link={
                                                  this.props.url + "/m/" + m.id
                                                }
                                              />
                                            );
                                          })()}
                                        </div>

                                        {ww.map((w, index) => {
                                          let ss = getSubWorkflowByWorkflow(
                                            subWorkflows,
                                            w.id
                                          );
                                          if (!this.props.showClosed) {
                                            ss =
                                              filterOutClosedSubWorkflows(ss);
                                          }

                                          return [
                                            <div
                                              className={
                                                index === 0
                                                  ? "flex flex-row px-1"
                                                  : "flex flex-row pl-3 pr-1"
                                              }
                                              key={w.id}
                                            >
                                              {ss.length === 0 ? (
                                                <div className="p-1">
                                                  <EmptyCard />
                                                </div>
                                              ) : null}

                                              {ss.map((sw) => {
                                                const ff =
                                                  filterFeaturesOnMilestoneAndSubWorkflow(
                                                    features,
                                                    m.id,
                                                    sw.id
                                                  );
                                                return [
                                                  <Droppable
                                                    key={sw.id}
                                                    droppableId={
                                                      "df*" + m.id + "*" + sw.id
                                                    }
                                                    type="FEATURE"
                                                  >
                                                    {(
                                                      providedDroppable: DroppableProvided,
                                                      snapshotDroppable: DroppableStateSnapshot
                                                    ) => (
                                                      <div
                                                        className="fm-paren showhim flex flex-col "
                                                        ref={
                                                          providedDroppable.innerRef
                                                        }
                                                        {...providedDroppable.droppableProps}
                                                        style={this.getListStyle(
                                                          snapshotDroppable.isDraggingOver
                                                        )}
                                                      >
                                                        {ff.map((f, index) => {
                                                          return [
                                                            <Draggable
                                                              isDragDisabled={
                                                                viewOnly
                                                              }
                                                              key={f.id}
                                                              draggableId={
                                                                "f*" + f.id
                                                              }
                                                              index={index}
                                                            >
                                                              {(
                                                                providedDraggable: DraggableProvided,
                                                                snapshotDraggable: DraggableStateSnapshot
                                                              ) => (
                                                                <div>
                                                                  <div
                                                                    className="p-1"
                                                                    ref={
                                                                      providedDraggable.innerRef
                                                                    }
                                                                    {...providedDraggable.draggableProps}
                                                                    {...providedDraggable.dragHandleProps}
                                                                    style={this.getItemStyle(
                                                                      snapshotDraggable.isDragging,
                                                                      providedDraggable
                                                                        .draggableProps
                                                                        .style
                                                                    )}
                                                                  >
                                                                    <Card
                                                                      estimate={
                                                                        f.estimate
                                                                      }
                                                                      annotations={
                                                                        f.annotations
                                                                      }
                                                                      nbrOfComments={
                                                                        filterFeatureCommentsOnFeature(
                                                                          this
                                                                            .props
                                                                            .comments,
                                                                          f.id
                                                                        ).length
                                                                      }
                                                                      color={
                                                                        f.color
                                                                      }
                                                                      status={
                                                                        f.status
                                                                      }
                                                                      title={
                                                                        f.title
                                                                      }
                                                                      link={
                                                                        this
                                                                          .props
                                                                          .url +
                                                                        "/f/" +
                                                                        f.id
                                                                      }
                                                                      bottomLink={
                                                                        index ===
                                                                          ff.length -
                                                                            1 &&
                                                                        !viewOnly
                                                                          ? () =>
                                                                              this.setState(
                                                                                {
                                                                                  showCreateFeatureModal:
                                                                                    true,
                                                                                  createFeatureModalMilestoneId:
                                                                                    m.id,
                                                                                  createFeatureModalSubWorkflowId:
                                                                                    sw.id,
                                                                                }
                                                                              )
                                                                          : undefined
                                                                      }
                                                                    />
                                                                  </div>
                                                                </div>
                                                              )}
                                                            </Draggable>,
                                                          ];
                                                        })}
                                                        {
                                                          providedDroppable.placeholder
                                                        }

                                                        {ff.length === 0 ? (
                                                          <div className="flex  p-1 text-xs">
                                                            {!viewOnly ? (
                                                              <NewDimCard>
                                                                <button
                                                                  className=" text-2xl text-gray-400 hover:text-gray-800"
                                                                  onClick={() =>
                                                                    this.setState(
                                                                      {
                                                                        showCreateFeatureModal:
                                                                          true,
                                                                        createFeatureModalMilestoneId:
                                                                          m.id,
                                                                        createFeatureModalSubWorkflowId:
                                                                          sw.id,
                                                                      }
                                                                    )
                                                                  }
                                                                >
                                                                  +
                                                                </button>
                                                              </NewDimCard>
                                                            ) : (
                                                              <EmptyCard />
                                                            )}
                                                          </div>
                                                        ) : null}
                                                      </div>
                                                    )}
                                                  </Droppable>,
                                                ];
                                              })}
                                            </div>,
                                          ];
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>,
                            ];
                          })}
                          {providedDroppable.placeholder}
                          <div className="flex flex-col  p-2  text-xs ">
                            <div>
                              {!viewOnly && (
                                <NewCard>
                                  <Button
                                    title="Add release"
                                    icon="add"
                                    noborder
                                    handleOnClick={() =>
                                      this.setState({
                                        showCreateMilestoneModal: true,
                                      })
                                    }
                                  />
                                </NewCard>
                              )}
                            </div>

                            {!this.props.showClosed && (
                              <div className="mt-2 italic">
                                {(() => {
                                  const nbrOfClosedMilestones =
                                    filterClosedMilestones(milestones).length;
                                  const nbrOfClosedWorkflows =
                                    filterClosedWorkflows(workflows).length;
                                  const nbrOfClosedSubWorkflows =
                                    filterClosedSubWorkflows(
                                      subWorkflows
                                    ).length;

                                  if (
                                    nbrOfClosedMilestones > 0 ||
                                    nbrOfClosedWorkflows > 0 ||
                                    nbrOfClosedSubWorkflows > 0
                                  ) {
                                    return "Closed cards not shown: ";
                                  }
                                  return null;
                                })()}

                                {(() => {
                                  const nbrOfClosedMilestones =
                                    filterClosedMilestones(milestones).length;

                                  if (nbrOfClosedMilestones === 1) {
                                    return (
                                      <span>
                                        {" "}
                                        <b>
                                          {" "}
                                          {nbrOfClosedMilestones}
                                        </b> release{" "}
                                      </span>
                                    );
                                  }
                                  if (nbrOfClosedMilestones > 1) {
                                    return (
                                      <span>
                                        {" "}
                                        <b>
                                          {" "}
                                          {nbrOfClosedMilestones}
                                        </b> releases{" "}
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}

                                {(() => {
                                  const nbrOfClosedWorkflows =
                                    filterClosedWorkflows(workflows).length;

                                  if (nbrOfClosedWorkflows === 1) {
                                    return (
                                      <span>
                                        {" "}
                                        <b> {nbrOfClosedWorkflows}</b> goal
                                      </span>
                                    );
                                  }
                                  if (nbrOfClosedWorkflows > 1) {
                                    return (
                                      <span>
                                        {" "}
                                        <b>
                                          {" "}
                                          {nbrOfClosedWorkflows}
                                        </b> goals{" "}
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}

                                {(() => {
                                  const nbrOfClosedSubWorkflows =
                                    filterClosedSubWorkflows(
                                      subWorkflows
                                    ).length;

                                  if (nbrOfClosedSubWorkflows === 1) {
                                    return (
                                      <span>
                                        {" "}
                                        <b> {nbrOfClosedSubWorkflows}</b>{" "}
                                        activity
                                      </span>
                                    );
                                  }
                                  if (nbrOfClosedSubWorkflows > 1) {
                                    return (
                                      <span>
                                        {" "}
                                        <b> {nbrOfClosedSubWorkflows}</b>{" "}
                                        activities{" "}
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            )}
          </div>
        </DragDropContext>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
