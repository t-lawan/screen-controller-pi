import { EVideoType } from '../Enums/EVideoType';
import { EScreenType } from '../Enums/EScreenType';
import { EWSMessageType } from '../Enums/EWSMessageType';
import { EWSClientType } from '../Enums/EWSClientType';
export interface IAddVideoRequestBody {
    title: string;
    uri: string;
    video_type: EVideoType
}

export interface IAddScreenRequestBody {
    local_ip_address: string;
    raspberry_pi_id: number;
    number_of_screens: number;
    video_file_playlist: string[];
    screen_type: EScreenType;
}

export interface IUpdateVideoRequestBody {
    id: string;
    title: string;
    uri: string;
    video_type: EVideoType
}

export interface IUpdateScreenRequestBody {
    id: string; 
    local_ip_address: string;
    raspberry_pi_id: number;
    number_of_screens: number;
    video_file_playlist: string[];
    screen_type: EScreenType;
}

export interface IWebsocketMessage {
    message: EWSMessageType;
    client_type: EWSClientType;
    raspberry_pi_id?: number;
    payload?: any;
}