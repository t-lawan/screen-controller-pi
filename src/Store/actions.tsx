import { IVideo } from '../Interfaces/IVideo';
import { IScreen } from '../Interfaces/IScreen';
export const SET_VIDEOS = 'SET_VIDEOS';
export const SET_SCREENS = 'SET_SCREENS';
export const HAS_LOADED = 'HAS_LOADED';
export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const SEND_MESSAGE = 'SEND_MESSAGE'
export const SEND_MESSAGE_COMPLETE = 'SEND_MESSAGE_COMPLETE'


export const hasLoaded = () => {
    return {
        type: HAS_LOADED
    }
}

export const setVideos = (videos: IVideo[]) => {
    return {
        type: SET_VIDEOS,
        videos: videos
    }
}

export const setScreens = (screens: IScreen[]) => {
    return {
        type: SET_SCREENS,
        screens: screens
    }
}

export const sendMessage = (message: string) => {
    return  {
        type: SEND_MESSAGE,
        ws_message: message,
        ws_message_sent: true

    }
}
export const sendMessageComplete = () => {
    return  {
        type: SEND_MESSAGE_COMPLETE,
        ws_message: '',
        ws_message_sent: false
    }
}