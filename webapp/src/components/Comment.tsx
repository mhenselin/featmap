import type { FieldProps, FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import { Component } from "react";
import ReactMarkdown from "react-markdown";
import * as Yup from "yup";
import { Membership } from "../store/application/types";
import { IFeatureComment } from "../store/featurecomments/types";
import ContextMenu from "./ContextMenu";
import { Button } from "./elements";
import { TimeAgo } from "./TimeAgo";

type Props = {
  comment: IFeatureComment;
  member?: Membership;
  viewOnly: boolean;
  deleteComment: (id: string) => void;
  editComment: (comment: IFeatureComment, post: string) => void;
};

type State = {
  editing: boolean;
  post: string;
};

class Comment extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editing: false,
      post: props.comment.post,
    };
  }

  submitForm!: FormikProps<{ comment: string }>["submitForm"];

  render() {
    const owner = this.props.member?.id === this.props.comment.memberId;

    return (
      <div>
        <div className="flex flex-row items-center">
          <div className="grow text-xs ">
            <span className="font-medium">
              {this.props.comment.createdByName}
            </span>{" "}
            <TimeAgo date={this.props.comment.createdAt} />
          </div>
          <div className="text-xs ">
            {this.props.comment.createdAt ===
            this.props.comment.lastModified ? null : (
              <span className="italic">
                Edited <TimeAgo date={this.props.comment.lastModified} />{" "}
              </span>
            )}
          </div>

          {!this.props.viewOnly && owner ? (
            <div>
              <ContextMenu icon="more_horiz">
                <div className="absolute top-0 right-0  z-20 mt-8 min-w-full rounded bg-white text-xs shadow-md">
                  <ul className="">
                    <li>
                      <Button
                        noborder
                        title="Edit"
                        icon="edit"
                        handleOnClick={() => this.setState({ editing: true })}
                      />
                    </li>
                    <li>
                      <Button
                        noborder
                        title="Delete"
                        icon="delete"
                        warning
                        handleOnClick={() =>
                          this.props.deleteComment(this.props.comment.id)
                        }
                      />
                    </li>
                  </ul>
                </div>
              </ContextMenu>
            </div>
          ) : null}
        </div>

        <div>
          <span className="text-xs  "></span>
        </div>

        {this.state.editing ? (
          <Formik
            initialValues={{ comment: this.props.comment.post }}
            validationSchema={Yup.object().shape({
              comment: Yup.string()
                .min(1, "Minimum 1 character.")
                .max(10000, "Maximum 10000 characters."),
            })}
            onSubmit={(values: { comment: string }) => {
              this.props.editComment(this.props.comment, values.comment);
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
                    {({ form }: FieldProps<{ comment: string }>) => (
                      <div className="mt-2 flex flex-col  ">
                        <div>
                          <textarea
                            rows={5}
                            onChange={form.handleChange}
                            name="comment"
                            value={form.values.comment}
                            id="comment"
                            className="w-full rounded  border p-3 "
                          />
                        </div>
                        <div className=" text-xs font-bold text-red-500">
                          {form.touched.comment &&
                            form.errors.comment &&
                            form.errors.comment.toString()}
                        </div>
                        <div className="flex justify-end">
                          <div className="mr-2">
                            <Button primary submit title="Save" />{" "}
                          </div>
                          <div>
                            <Button
                              handleOnClick={() =>
                                this.setState({ editing: false })
                              }
                              title="Cancel"
                            />{" "}
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
                </Form>
              );
            }}
          </Formik>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown linkTarget="_blank">
              {this.props.comment.post}
            </ReactMarkdown>
          </div>
        )}
      </div>
    );
  }
}

export default Comment;
