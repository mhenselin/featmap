import { action } from "typesafe-actions";
import { API_FETCH_APP, API_FETCH_APP_RESP } from "../../api";
import { Dispatch } from "react";
import { AllActions } from "..";
import { v4 as uuid } from "uuid";
import type { MessageEntity, MessageType } from "../../components/Message";

export enum AppActions {
  LOAD_APPLICATION = "LOAD_APPLICATION",
  RESET_APPLICATION = "RESET_APPLICATION",
  CREATE_MESSAGE = "CREATE_MESSAGE",
  DELETE_MESSAGE = "DELETE_MESSAGE",
}

export type receiveApp = {
  type: AppActions.LOAD_APPLICATION;
  payload: API_FETCH_APP_RESP;
};
export type resetApp = {
  type: AppActions.RESET_APPLICATION;
  payload: Record<string, never>;
};
export type createMessage = {
  type: AppActions.CREATE_MESSAGE;
  payload: MessageEntity;
};
export type deleteMessage = {
  type: AppActions.DELETE_MESSAGE;
  payload: string;
};

export const receiveAppAction = (s: API_FETCH_APP_RESP) => {
  return action(AppActions.LOAD_APPLICATION, s);
};

export const resetAppAction = () => action(AppActions.RESET_APPLICATION);
const createMessageAction = (m: MessageEntity) =>
  action(AppActions.CREATE_MESSAGE, m);
const deleteMessageAction = (id: string) =>
  action(AppActions.DELETE_MESSAGE, id);

export type Actions = receiveApp | resetApp | createMessage | deleteMessage;

export const newMessage =
  (dispatch: Dispatch<AllActions>) =>
  async (type: MessageType, message: string) => {
    const id = uuid();

    dispatch(createMessageAction({ id, type, message }));

    const del = new Promise(() => {
      setTimeout(() => {
        dispatch(deleteMessageAction(id));
      }, 4000);
    });

    del.then();
  };
