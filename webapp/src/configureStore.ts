import { createStore } from "redux";
import { reducer } from "./store";

export default function configureStore(initialState?: any) {
  return createStore(reducer(), initialState);
}
