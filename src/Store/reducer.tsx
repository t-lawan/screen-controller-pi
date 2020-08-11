import { IVideo } from "../Interfaces/IVideo";
import { IScreen } from "../Interfaces/IScreen";
import { AnyAction } from "redux";
import { OPEN_MODAL, CLOSE_MODAL, SET_VIDEOS, SET_SCREENS, SEND_MESSAGE, SEND_MESSAGE_COMPLETE } from './actions';
export interface IState {
  screens: IScreen[];
  videos: IVideo[];
  modal_open: boolean;
  modal_component: any;
  hasLoaded: false;
  ws_message: string;
  ws_message_sent: boolean;
}

const initalState: IState = {
  screens: [],
  videos: [],
  modal_open: false,
  modal_component: null,
  hasLoaded: false,
  ws_message: "",
  ws_message_sent: false
};

export const reducer = (state: IState = initalState, action: AnyAction) => {
  switch (action.type) {
    case SET_SCREENS:
      return {
        ...state,
        screens: action.screens
      };
    case SET_VIDEOS:
      return {
        ...state,
        videos: action.videos
      };
    case OPEN_MODAL:
      return {
        ...state,
        modal_open: true,
        modal_component: action.component
      };
    case CLOSE_MODAL:
      return {
        ...state,
        modal_open: false
      };
    case SEND_MESSAGE:
      return {
        ...state,
        ws_message: action.ws_message,
        ws_message_sent: action.ws_message_sent
      };
    case SEND_MESSAGE_COMPLETE:
      return {
        ...state,
        ws_message: action.ws_message,
        ws_message_sent: action.ws_message_sent
      };
    default:
      return state;
  }
};
