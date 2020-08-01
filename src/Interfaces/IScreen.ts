import { EScreenType } from '../Enums/EScreenType';
export interface IScreen {
    id?: string; 
    local_ip_address: string;
    raspberry_pi_id: number;
    number_of_screens: number;
    video_file_playlist: string[];
    screen_type: EScreenType;
}