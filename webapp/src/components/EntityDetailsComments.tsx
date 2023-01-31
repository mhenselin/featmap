import { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../store";

import type { FieldProps, FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import {
  API_CREATE_FEATURE_COMMENT,
  API_DELETE_FEATURE_COMMENT,
  API_UPDATE_FEATURE_COMMENT_POST,
} from "../api";
import {
  createFeatureCommentAction,
  deleteFeatureCommentAction,
  updateFeatureCommentAction,
} from "../store/featurecomments/actions";

import { v4 as uuid } from "uuid";
import * as Yup from "yup";
import { EntityTypes } from "../core/card";
import { application, getMembership } from "../store/application/selectors";
import { Application } from "../store/application/types";
import { IFeatureComment } from "../store/featurecomments/types";
import Comment from "./Comment";
import { Button } from "./elements";

const mapStateToProps = (state: AppState) => ({
  application: application(state),
});

const mapDispatchToProps = {
  createFeatureComment: createFeatureCommentAction,
  deleteFeatureComment: deleteFeatureCommentAction,
  updateFeatureComment: updateFeatureCommentAction,
};

type PropsFromState = {
  application: Application;
};

type PropsFromDispatch = {
  createFeatureComment: typeof createFeatureCommentAction;
  updateFeatureComment: typeof updateFeatureCommentAction;
  deleteFeatureComment: typeof deleteFeatureCommentAction;
};
type SelfProps = {
  entity?: EntityTypes;
  comments: IFeatureComment[];
  app: Application;
  viewOnly: boolean;
  open: boolean;
};
type Props = PropsFromState & PropsFromDispatch & SelfProps;

type State = Record<string, never>;

class EntityDetailsComments extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  submitForm!: FormikProps<{ comment: string }>["submitForm"];

  deleteComment = (id: string) => {
    this.props.deleteFeatureComment(id); // optimistic

    if (this.props.entity?.workspaceId) {
      API_DELETE_FEATURE_COMMENT(this.props.entity.workspaceId, id).then(
        (response) => {
          if (response.ok) {
            this.props.deleteFeatureComment(id);
          } else {
            alert("Something went wrong when deleting comment.");
          }
        }
      );
    }
  };

  editComment = (comment: IFeatureComment, post: string) => {
    const optimistic = comment;
    optimistic.post = post;
    optimistic.lastModified = new Date().toISOString();
    this.props.updateFeatureComment(optimistic);

    if (this.props.entity?.workspaceId) {
      API_UPDATE_FEATURE_COMMENT_POST(
        this.props.entity.workspaceId,
        comment.id,
        post
      ).then((response) => {
        if (response.ok) {
          response.json().then((data: IFeatureComment) => {
            this.props.updateFeatureComment(data);
          });
        } else {
          alert("Something went wrong when editing a comment.");
        }
      });
    }
  };

  render() {
    const member = getMembership(
      this.props.app,
      this.props.entity?.workspaceId
    );

    return (
      <div className=" mb-4 w-full self-start ">
        <div className=" mt-2 ml-2 border border-white  ">
          <div className="text-sm font-medium text-gray-600">
            DISCUSSION{" "}
            {this.props.comments.length === 0
              ? ""
              : "(" + this.props.comments.length + ")"}
          </div>

          {!this.props.viewOnly ? (
            <Formik
              initialValues={{ comment: "" }}
              validationSchema={Yup.object().shape({
                comment: Yup.string()
                  .required("Please write a comment.")
                  .max(10000, "Maximum 10000 characters."),
              })}
              onSubmit={(values: { comment: string }) => {
                const id = uuid();
                const t = new Date().toISOString();
                const by = this.props.app.account?.name ?? "";

                const optimistic: IFeatureComment = {
                  kind: "featureComment",
                  id: id,
                  workspaceId: this.props.entity?.workspaceId ?? "",
                  featureId: this.props.entity?.id ?? "",
                  projectId: "",
                  createdAt: t,
                  createdByName: by,
                  lastModified: t,
                  post: values.comment,
                  memberId: member?.id ?? "",
                };

                this.props.createFeatureComment(optimistic);

                API_CREATE_FEATURE_COMMENT(
                  optimistic.workspaceId,
                  optimistic.featureId,
                  optimistic.id,
                  optimistic.post
                ).then((response) => {
                  if (response.ok) {
                    response.json().then((data: IFeatureComment) => {
                      this.props.updateFeatureComment(data);
                    });
                  } else {
                    alert("Something went wrong when posting a comment.");
                  }
                });

                // actions.setSubmitting(false)
              }}
            >
              {(formikBag: FormikProps<{ comment: string }>) => {
                this.submitForm = formikBag.submitForm;

                return (
                  <Form>
                    {formikBag.status && formikBag.status.msg && (
                      <div>{formikBag.status.msg}</div>
                    )}

                    <Field name="comment">
                      {({ form }: FieldProps<{ description: string }>) => (
                        <div className="mt-2 flex flex-col  ">
                          <div>
                            <textarea
                              rows={2}
                              value={form.values.description}
                              onChange={form.handleChange}
                              placeholder="Write a comment... "
                              id="comment"
                              className="w-full rounded  border p-3  	"
                            />
                          </div>
                          <div className="p-1 text-xs font-bold text-red-500">
                            {form.touched.comment &&
                              form.errors.comment &&
                              form.errors.comment.toString()}
                          </div>
                          <div className="flex justify-end">
                            <div>
                              <Button submit title="Post comment" />{" "}
                            </div>
                          </div>
                        </div>
                      )}
                    </Field>
                  </Form>
                );
              }}
            </Formik>
          ) : null}

          <div>
            {this.props.comments.length === 0 ? (
              <div>No comments.</div>
            ) : (
              <div>
                {this.props.comments.map((comment) => {
                  return (
                    <div className=" mt-4  bg-white" key={comment.id}>
                      <Comment
                        viewOnly={this.props.viewOnly}
                        comment={comment}
                        member={member}
                        deleteComment={this.deleteComment}
                        editComment={this.editComment}
                      />

                      {/* <div className="flex flex-row items-center">
                                                    <div className="flex-grow text-xs  "><span className="font-medium">{comment.createdByName}</span> wrote <TimeAgo date={comment.createdAt} /> </div>

                                                    {member.id === comment.memberId ?
                                                        <div>
                                                            <ContextMenu icon="more_horiz">
                                                                <div className="rounded bg-white shadow-md  absolute mt-8 top-0 right-0 min-w-full text-xs" >
                                                                    <ul className="">
                                                                        <li><Button noborder title="Edit" icon="edit" handleOnClick={() => this.deleteComment(comment.id)} /></li>
                                                                        <li><Button noborder title="Delete" icon="delete" warning handleOnClick={() => this.deleteComment(comment.id)} /></li>
                                                                    </ul>
                                                                </div>
                                                            </ContextMenu>
                                                        </div>
                                                        :
                                                        null}

                                                </div>
                                                <div><span className="text-xs  "></span></div>

                                                <div className="markdown-body">
                                                    <ReactMarkdown source={comment.post} linkTarget="_blank" />
                                                </div> */}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityDetailsComments);
